import React from "react";
import FeedbackTable from "../features/feedback-table";
import ScorePieChart from "../components/charts/ScorePieChart";
import FeedbackSummary from "../components/ui/FeedbackSummary";

const Dashboard: React.FC = () => {
  return (
    <div className="px-12">
      <div className="flex flex-col lg:flex-row justify-center items-center w-full gap-8">
        <div className="w-full lg:w-1/3">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <FeedbackSummary />
        </div>
        <div className="mt-10 w-full lg:w-2/3">
          <ScorePieChart />
        </div>
      </div>
      <div className="w-full">
        <FeedbackTable />
      </div>
    </div>
  );
};

export default Dashboard;
