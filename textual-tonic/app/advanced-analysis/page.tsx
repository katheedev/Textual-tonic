"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaClock, FaFileAlt, FaAlignLeft } from "react-icons/fa"; // Importing Clock Icon

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
type SentenceSentiment = {
  polarity: number;
  subjectivity: number;
  sentence: string;
};

type ResultType = {
  average_sentence_length: number;
  fog_index: number;
  negative_percentage: number;
  negative_sentences: number;
  neutral_percentage: number;
  neutral_sentences: number;
  percentage_complex_words: number;
  polarity: number;
  positive_percentage: number;
  positive_sentences: number;
  reading_time: number;
  sentence_sentiments: SentenceSentiment[];
  subjectivity: number;
  text: string;
  total_sentences: number;
  total_words: number;
};

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const handleAnalysis = async () => {
    const response = await fetch("api/analyze-advanced", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `text=${encodeURIComponent(text)}`,
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Advanced Sentiment Analysis</h2>
      <Textarea
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <Button onClick={handleAnalysis}>Analyze</Button>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Flexbox layout for two charts per row */}
            <div className="flex flex-wrap justify-between gap-4">
              {/* Overall Sentiment Bar Chart */}
              <div className="flex-1 min-w-[300px] max-w-[600px]">
                <h3 className="font-semibold">Overall Sentiment</h3>
                <Bar
                  data={{
                    labels: ["Polarity", "Subjectivity"],
                    datasets: [
                      {
                        label: "Sentiment Metrics",
                        data: [result.polarity, result.subjectivity],
                        backgroundColor: [
                          result.polarity <= 0 ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                          result.polarity <= 0 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                      },
                    },
                    maintainAspectRatio: true,
                  }}
                  height={350} // Increased height
                  width={400}
                />
              </div>

              {/* Sentence Breakdown Pie Chart */}
              <div className="flex-1 min-w-[300px] max-w-[500px]">
                <h3 className="font-semibold">Sentence Breakdown</h3>
                <Pie
                  data={{
                    labels: [
                      "Positive Sentences",
                      "Negative Sentences",
                      "Neutral Sentences",
                    ],
                    datasets: [
                      {
                        label: "Sentence Breakdown",
                        data: [
                          result.positive_percentage,
                          result.negative_percentage,
                          result.neutral_percentage,
                        ],
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                        ],
                        borderColor: [
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 99, 132, 1)",
                          "rgba(255, 206, 86, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </div>{" "}
            {/* End of flexbox row */}
            {/* Second Row of Charts */}
            <div className="flex flex-wrap justify-between gap-4 mt-8 pt-8">
              {/* Horizontal Bar Chart for Readability Metrics */}
              <div className="flex-1 min-w-[350px] max-w-[500px]">
                <h3 className="font-semibold">Readability Metrics</h3>
                <Bar
                  data={{
                    labels: [
                      "Average Sentence Length",
                      "Complex Words %",
                      "FOG Index",
                    ],
                    datasets: [
                      {
                        label: "Value",
                        data: [
                          result.average_sentence_length,      
                          result.percentage_complex_words,    
                          result.fog_index,                    
                        ],
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.5)", 
                          "rgba(255, 206, 86, 0.5)",
                          "rgba(255, 99, 132, 0.5)", 
                        ],
                        borderColor: [
                          "rgba(54, 162, 235, 1)",   
                          "rgba(255, 206, 86, 1)",    
                          "rgba(255, 99, 132, 1)", 
                        ],
                        borderWidth: 1,
                      },                      
                    ],
                  }}
                  options={{
                    indexAxis: "y", // This makes the chart horizontal
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `${context.dataset.label}: ${context.raw}`,
                        },
                      },
                    },
                    maintainAspectRatio: true,
                  }}
                  height={300}
                  width={400} // Adjust height to fit horizontal layout
                />
              {/* Estimated Reading Time with Clock Icon */}
              <div className="flex items-center space-x-2 mt-2 mb-2 p-2">
                  <FaClock size={24} />
                  <div className="flex-1">
                    <h3 className="font-semibold">Estimated Reading Time</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${(result.reading_time / 120) * 100}%` }} // Assuming max reading time is 2 minutes for progress bar visualization
                      />
                    </div>
                    <p>{result.reading_time} seconds</p>
                  </div>
                </div>
                {/* Display Total Words and Total Sentences */}
                <div className="flex items-center space-x-4 mt-2 mb-2 p-2">
                <div className="flex items-center space-x-2">
                    <FaFileAlt size={24} />
                    <p className="text-lg font-medium">
                      Total Words: {result.total_words}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaAlignLeft size={24} />
                    <p className="text-lg font-medium">
                      Total Sentences: {result.total_sentences}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentence-Level Sentiment Analysis */}
              {/* Line Graph for Sentence Polarity with Red for Negative Values */}
              <div className="flex-1 min-w-[350px] max-w-[500px]">
                <h3 className="font-semibold">Sentence Polarity Over Text</h3>
                <Line
                  data={{
                    labels: result.sentence_sentiments.map(
                      (_, index) => `Sent. ${index + 1}`
                    ),
                    datasets: [
                      {
                        label: "Polarity",
                        data: result.sentence_sentiments.map(
                          (sentiment) => sentiment.polarity
                        ),
                        fill: false,
                        borderColor: "rgba(75, 192, 192, 1)", // Default color
                        segment: {
                          borderColor: (ctx) =>
                            (ctx.p0.parsed.y >= 0 && ctx.p1.parsed.y <= 0) ||
                            (ctx.p0.parsed.y <= 0 && ctx.p1.parsed.y <= 0)
                              ? "rgba(255, 99, 132, 1)"
                              : "rgba(75, 192, 192, 1)",
                        },
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: -1,
                        max: 1,
                        title: {
                          display: true,
                          text: "Polarity",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Sentence Index",
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const sentence =
                              result.sentence_sentiments[context.dataIndex]
                                .sentence;
                            return `Sentence: "${sentence}"`;
                          },
                        },
                      },
                    },
                    maintainAspectRatio: true,
                  }}
                  height={300}
                />
              </div>

              {/* Line Graph for Sentence Subjectivity */}
              <div className="flex-1 min-w-[350px] max-w-[500px]">
                <h3 className="font-semibold">
                  Sentence Subjectivity Over Text
                </h3>
                <Line
                  data={{
                    labels: result.sentence_sentiments.map(
                      (_, index) => `Sent. ${index + 1}`
                    ),
                    datasets: [
                      {
                        label: "Subjectivity",
                        data: result.sentence_sentiments.map(
                          (sentiment) => sentiment.subjectivity
                        ),
                        fill: false,
                        borderColor: "rgba(153, 102, 255, 1)",
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        min: 0,
                        max: 1,
                        title: {
                          display: true,
                          text: "Subjectivity",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Sentence Index",
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const sentence =
                              result.sentence_sentiments[context.dataIndex]
                                .sentence;
                            return `Sentence: "${sentence}"`;
                          },
                        },
                      },
                    },
                    maintainAspectRatio: true,
                  }}
                  height={300}
                />
              </div>
            </div>{" "}
            {/* End of second flexbox row */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
