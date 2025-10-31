interface DateBadgeProps {
  date: string;
}

export default function DateBadge({ date }: DateBadgeProps) {
  return (
    <div className="self-center bg-gray-100 py-1 px-4 rounded-full my-4 border border-gray-200">
      <span className="text-sm text-gray-500 font-semibold">{date}</span>
    </div>
  );
}
