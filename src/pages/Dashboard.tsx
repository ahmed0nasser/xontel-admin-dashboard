import React from "react";
import FeedbackTable from "../features/feedback-table";
import ScorePieChart from "../components/charts/ScorePieChart";
import FeedbackSummary from "../components/ui/FeedbackSummary";

const Dashboard: React.FC = () => {
  return (
    <div className="md:px-4 lg:px-8">
      <div className="px-4 flex flex-col xl:flex-row justify-center w-full lg:gap-8">
        <div className="mt-10 md:mt-12 lg:mt-24 w-full xl:w-1/3">
          <h2 className="lg:text-lg font-bold mb-4">Summary</h2>
          <FeedbackSummary />
        </div>
        <div className="mt-10 md:mt-12 lg:mt-24 w-full xl:w-2/3">
          <h2 className="lg:text-lg font-bold -mb-20 ">
            KPI Score Distribution
          </h2>
          <ScorePieChart />
        </div>
      </div>
      <div className="-mt-4 md:mt-4 lg:mt-0 w-full">
        <FeedbackTable />
      </div>
    </div>
  );
};

export default Dashboard;
