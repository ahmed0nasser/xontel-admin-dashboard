import React from "react";
import FeedbackTable from "../features/feedback-table";
import ScorePieChart from "../components/charts/ScorePieChart";
import { feedbackData } from "../data/feedback";
import FeedbackSummary from "../components/ui/FeedbackSummary";

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 bg-soft-gray">
      <div className="flex flex-col lg:flex-row items-center w-full gap-8 mb-8">
        <div className="w-full lg:w-1/2">
          <ScorePieChart />
        </div>
        <div className="w-full lg:w-1/2">
          <FeedbackSummary />
        </div>
      </div>
      <div className="w-full">
        <FeedbackTable feedbacks={feedbackData} />
      </div>
    </div>
  );
};

export default Dashboard;
