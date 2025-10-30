import React from "react";

interface UnreadBadgeProps {
  count: number;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count > 9 ? "9+" : count}
    </div>
  );
};

export default UnreadBadge;
