import React from "react";
import ReactECharts from "echarts-for-react";
import { feedbackData } from "../../data/feedback";

const ScorePieChart: React.FC = () => {
  const scoreCounts = feedbackData.reduce((acc, feedback) => {
    acc[feedback.score] = (acc[feedback.score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.keys(scoreCounts).map((score) => ({
    name: `${score} star${+score > 1 ? "s" : ""}`,
    value: scoreCounts[parseInt(score)],
  }));

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      left: "center",
      bottom: "0",
    },
    series: [
      {
        name: "Feedback Score",
        type: "pie",
        radius: "40%",
        center: ["50%", "40%"],
        data: chartData,
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

  return <ReactECharts option={option} />;
};

export default ScorePieChart;
