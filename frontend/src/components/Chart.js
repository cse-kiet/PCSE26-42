
import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../styles/chart.css";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

export default function Chart() {
  // Heart Rate 
  const heartRateData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Heart Rate (bpm)",
        data: [75, 82, 90, 88, 76, 95, 85], // dummy data
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
      },
    ],
  };

  // 2️⃣ Sleep Hours (Bar Chart)
  const sleepData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sleep Hours",
        data: [6, 7, 5, 8, 6, 7.5, 6.5],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  //  Daily Mood Trend (Line Chart)
  const moodTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood Level (1-10)",
        data: [6, 5, 7, 8, 6, 7, 9],
        borderColor: "rgba(255,206,86,1)",
        backgroundColor: "rgba(255,206,86,0.2)",
        tension: 0.3
      },
    ],
  };

  // 4️ Emotion Distribution (Pie Chart)
  const emotionData = {
    labels: ["Happy", "Anxious", "Sad", "Stressed"],
    datasets: [
      {
        label: "Emotions",
        data: [40, 25, 20, 15], // dummy %
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="wearable-container">
      <h2>Physical and Emotional health trends</h2>
      <div className="charts-grid">
            <div className="chart-box">
                <Line data={heartRateData} options={{ responsive: true, plugins: { title: { display: true, text: "Heart Rate Trends" } },maintainAspectRatio:false }} />
            </div>
            <div className="chart-box">
                <Bar data={sleepData} options={{ responsive: true, plugins: { title: { display: true, text: "Sleep Hours" } },maintainAspectRatio:false }} />
            </div>
           <div className="chart-box">
                <Line data={moodTrendData} options={{ responsive: true, plugins: { title: { display: true, text: "Mood Trends" } },maintainAspectRatio:false }} />
            </div>
            <div className="chart-box">
                <Pie data={emotionData} options={{ responsive: true, plugins: { title: { display: true, text: "Emotion Distribution" } },maintainAspectRatio:false }} />
            </div>
        </div>
      </div> 
  );
}

