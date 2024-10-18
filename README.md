

## MySQL Database Setup

### 1. Create a MySQL Database

Ensure you have MySQL installed and running. Then, log in to your MySQL server as the root user:

```bash
mysql -u root -p
```

Create the database `textual_tonic_db`:

```sql
CREATE DATABASE textual_tonic_db;
```

### 2. Run the SQL Script

Once the database is created, run your `v1.sql` file to set up the necessary tables.

If you're inside the MySQL prompt, use the following command:

```bash
source path/to/v1.sql;
```

Make sure to replace `path/to/v1.sql` with the actual path to your SQL script.

Or simply copy paste and run the script in your database query console.

### 3. Update `app.py` for Database Configuration

In your `app.py` file, update the MySQL database configuration to match the following:

```python
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345',
    'database': 'textual_tonic_db'
}
```

This will connect your Flask app to the `textual_tonic_db` MySQL database.

That's it! You are ready to start your full-stack application.


---


# Full Stack App Setup Guide

## Backend (Flask App)

### 1. Create a Python Virtual Environment

In the root of your project (where your Python files are located), create a virtual environment. If you don't have `venv` installed, you can install it via `pip`.

**Command to create a virtual environment:**

```bash
python3 -m venv ven1
```

This creates a virtual environment named `ven1` in your project root (which you may want to ignore in Git).

### 2. Install Dependencies

Based on your project, install the following Python libraries:

- Flask
- TextBlob
- mysql-connector-python
- Werkzeug
- nltk
- textstat

**Command to install dependencies:**

```bash
pip install Flask TextBlob mysql-connector-python Werkzeug nltk textstat
```

### 3. Run Your Flask App

To test if everything is working, try running your Flask app:

```bash
python app.py
```

Make sure your Flask app has the correct entry point to run:

```python
if __name__ == "__main__":
    app.run(debug=True)
```

---

## Frontend (Next.js App)

### 1. Navigate to the frontend folder

Change into the `textual-tonic` folder (the frontend folder):

```bash
cd textual-tonic
```

### 2. Install Node.js dependencies

Install the required packages:

```bash
npm install
```

### 3. Run the development server

After installing dependencies, run the development server with:

```bash
npm run dev
```

You can view the app in your browser at `http://localhost:3000`.

---
