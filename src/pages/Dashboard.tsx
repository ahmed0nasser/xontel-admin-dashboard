import React from "react";
import FeedbackTable from "../features/feedback-table";
import ScorePieChart from "../components/charts/ScorePieChart";
import { feedbackData } from "../data/feedback";
import FeedbackSummary from "../components/ui/FeedbackSummary";

const Dashboard: React.FC = () => {
  return (
    <div className="px-8 py-2 ">
      <div className="flex flex-col lg:flex-row items-center w-full gap-8 mb-8">
        <div className="mt-10 w-full lg:w-1/2">
          <h2 className="pl-8 text-lg font-bold -mb-24">
            KPI Score Distribution
          </h2>
          <ScorePieChart />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
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
