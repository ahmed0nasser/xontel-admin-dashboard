import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { subscribeToFeedback } from "../../services/firebase";
import { type Feedback } from "../../types";

const windowWidthBreakpoint = 1024;

const ScorePieChart: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < windowWidthBreakpoint
  );

  useEffect(() => {
    const unsubscribe = subscribeToFeedback(setFeedback);
    return () => unsubscribe();
  }, []);

  // Update responsiveness on resize
  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < windowWidthBreakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: isMobile ? "horizontal" : "vertical",
      bottom: isMobile ? 10 : "center",
      left: isMobile ? "center" : "right",
      itemGap: 8,
    },
    series: [
      {
        name: "Feedback Score",
        type: "pie",
        radius: isMobile ? "55%" : "45%",
        center: isMobile ? ["50%", "55%"] : ["38%", "50%"],
        data: chartData.map((item) => ({
          ...item,
          itemStyle: {
            color: colorMap[parseInt(item.name)],
          },
        })),
        label: {
          show: !isMobile, // hide labels on small screens for clarity
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{
          height: isMobile ? "360px" : "400px",
          width: "100%",
        }}
      />
    </div>
  );
};

export default ScorePieChart;
