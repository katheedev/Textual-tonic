from flask import Flask, request, jsonify, session
from textblob import TextBlob
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import textstat

import nltk
nltk.download('punkt_tab')
  
app = Flask(__name__)
app.secret_key = '12345649845634'  # Necessary for session management

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345',
    'database': 'textual_tonic_db'
}

# Function to connect to the MySQL database
def connect_db():
    return mysql.connector.connect(**db_config)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Please log in first.'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Route to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password']
    
    hashed_password = generate_password_hash(password)
    
    # Store user data in MySQL
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'User registered successfully!'}), 201

# Route to log in a user
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']
    
    # Fetch user from database
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user['password'], password):
        # Set session for the user
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'message': 'Login successful!'})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# Route to log out a user
@app.route('/logout')
def logout_user():
    session.clear()  # Clear the session
    return jsonify({'message': 'You have been logged out.'})
    

# Route for basic sentiment analysis
@app.route('/analyze-basic', methods=['POST'])
def analyze_basic():
    text = request.form['text']
    
    if not text:
        return jsonify({'error': 'No text provided.'}), 400
    
    # Perform sentiment analysis using TextBlob
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Categorize sentiment
    if polarity > 0:
        sentiment = 'Positive'
    elif polarity < 0:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    # Store the result in the database
    user_id = session.get('user_id')  # Fetch user_id from session
    if user_id:  # Only store if the user is logged in
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO sentiment_analysis_results (user_id, text, polarity, subjectivity, sentiment, created_at) VALUES (%s, %s, %s, %s, %s, NOW())",
            (user_id, text, polarity, subjectivity, sentiment)
        )
        conn.commit()
        cursor.close()
        conn.close()

    return jsonify({
        'text': text,
        'polarity': polarity,
        'subjectivity': subjectivity,
        'sentiment': sentiment
    })

# Route for advanced sentiment analysis (requires login)
@app.route('/analyze-advanced', methods=['POST'])
@login_required
def analyze_advanced():
    text = request.form['text']
    
    if not text:
        return jsonify({'error': 'No text provided.'}), 400
    
    # Perform sentiment analysis using TextBlob
    blob = TextBlob(text)
    sentences = blob.sentences

    # Initialize counters
    total_sentences = len(sentences)
    total_words = len(blob.words)
    positive_sentences = 0
    negative_sentences = 0
    neutral_sentences = 0
    
    # Analyze sentence-level sentiment
    sentence_sentiments = []
    for sentence in sentences:
        sentence_polarity = sentence.sentiment.polarity
        sentence_subjectivity = sentence.sentiment.subjectivity
        sentence_sentiments.append({
            'sentence': str(sentence),
            'polarity': sentence_polarity,
            'subjectivity': sentence_subjectivity
        })

        if sentence_polarity > 0:
            positive_sentences += 1
        elif sentence_polarity < 0:
            negative_sentences += 1
        else:
            neutral_sentences += 1

    # Calculate percentage of sentiments
    positive_percentage = (positive_sentences / total_sentences) * 100 if total_sentences else 0
    negative_percentage = (negative_sentences / total_sentences) * 100 if total_sentences else 0
    neutral_percentage = (neutral_sentences / total_sentences) * 100 if total_sentences else 0

    # Readability metrics using textstat
    average_sentence_length = textstat.avg_sentence_length(text)
    percentage_complex_words = textstat.long_word_count(text)
    fog_index = textstat.gunning_fog(text)

    # Returns the reading time of the given text.
    reading_time = textstat.reading_time(text, ms_per_char=100)

    # Store the result in the database
    user_id = session.get('user_id')  # Fetch user_id from session
    if user_id:  # Only store if the user is logged in
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO sentiment_analysis_results (user_id, text, polarity, subjectivity, sentiment, created_at) VALUES (%s, %s, %s, %s, %s, NOW())",
            (user_id, text, blob.sentiment.polarity, blob.sentiment.subjectivity, 'Advanced')
        )
        conn.commit()
        cursor.close()
        conn.close()

    return jsonify({
        'text': text,
        'polarity': blob.sentiment.polarity,
        'subjectivity': blob.sentiment.subjectivity,
        'total_words': total_words,
        'total_sentences': total_sentences,
        'positive_sentences': positive_sentences,
        'negative_sentences': negative_sentences,
        'neutral_sentences': neutral_sentences,
        'positive_percentage': positive_percentage,
        'negative_percentage': negative_percentage,
        'neutral_percentage': neutral_percentage,
        'sentence_sentiments': sentence_sentiments,
        'average_sentence_length': average_sentence_length,
        'percentage_complex_words': percentage_complex_words,
        'fog_index': fog_index,
        'reading_time': reading_time
    })

# Route to retrieve search history for a logged-in user
@app.route('/history', methods=['GET'])
@login_required
def get_history():
    user_id = session['user_id']
    
    # Fetch sentiment analysis results for the user from the database
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT text, polarity, subjectivity, sentiment, created_at FROM sentiment_analysis_results WHERE user_id = %s", (user_id,))
    history = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True)
