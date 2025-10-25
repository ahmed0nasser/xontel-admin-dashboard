import React from 'react';
import FeedbackTable from '../components/ui/FeedbackTable';
import ScorePieChart from '../components/charts/ScorePieChart';
import { feedbackData } from '../data/feedback';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 bg-soft-gray">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex flex-col items-center w-full">
        <div className="w-full mb-8">
          <ScorePieChart />
        </div>
        <div className="w-full">
          <FeedbackTable feedbacks={feedbackData}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
