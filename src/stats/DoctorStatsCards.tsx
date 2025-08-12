import React from "react";

const DoctorStatsCards = ({
  icon,
  count,
  text,
  color,
}: {
  icon: any;
  count: number;
  text: string;
  color: string;
}) => {
  return (
    <div
      className={`min-w-[200px] bg-background border dark:border-gray-700/80 border-slate-300  p-4 rounded-2xl`}
    >
      <div
        className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}
      >
        {React.cloneElement(icon, { className: "text-white w-5 h-5" })}
      </div>
      <h1 className="font-unbounded font-semibold text-xl mt-3">{count}</h1>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};
export default DoctorStatsCards;
