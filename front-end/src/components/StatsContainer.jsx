import StatItem from "./StatItem";
import { Briefcase, CalendarCheck, Ban } from "lucide-react";

export default function StatsContainer({ defaultStats }) {
  const stats = [
    {
      title: "pending applications",
      count: defaultStats?.pending || 0,
      icon: <Briefcase />,
      color: "#f59e0b", // yellow-500
      bcg: "#fef3c7", // yellow-100
    },
    {
      title: "interviews scheduled",
      count: defaultStats?.interview || 0,
      icon: <CalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "jobs declined",
      count: defaultStats?.declined || 0,
      icon: <Ban />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />;
      })}
    </div>
  );
}
