import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { subscribeToFeedback } from "../../services/firebase";
import { type Feedback } from "../../types";

const ScorePieChart: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToFeedback(setFeedback);
    return () => unsubscribe();
  }, []);

  const scoreCounts = feedback.reduce((acc, feedback) => {
    acc[feedback.score] = (acc[feedback.score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.keys(scoreCounts).map((score) => ({
    name: `${score} star${+score > 1 ? "s" : ""}`,
    value: scoreCounts[parseInt(score)],
  }));

  // Define colors based on star rating
  const colorMap: Record<number, string> = {
    1: "#e74c3c", // red
    2: "#e67e22", // orange
    3: "#f1c40f", // yellow
    4: "#2ecc71", // light green
    5: "#27ae60", // dark green
  };

  const option = {
    title: {
      text: "KPI Score Distribution",
      top: 100,
      left: 20,
      textStyle: {
        color: "black",
        fontFamily: "TikTok Sans",
        fontSize: "1.125rem",
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 300,
      top: "center",
      itemGap: 8,
    },
    series: [
      {
        name: "Feedback Score",
        type: "pie",
        radius: "45%",
        center: ["38%", "50%"],
        data: chartData.map((item) => ({
          ...item,
          itemStyle: { color: colorMap[parseInt(item.name)] },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default ScorePieChart;
