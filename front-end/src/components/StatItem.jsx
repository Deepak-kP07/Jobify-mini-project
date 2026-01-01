export default function StatItem({ count, title, icon, color, bcg }) {
  return (
    <div
      className={`bg-white p-8 rounded-md border-b-4 shadow-sm`}
      style={{ borderBottomColor: color }}
    >
      <header className="flex items-center justify-between">
        <span className="text-5xl font-bold block" style={{ color: color }}>
          {count}
        </span>
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center text-2xl`}
          style={{ background: bcg, color: color }}
        >
          {icon}
        </div>
      </header>
      <h5 className="capitalize text-lg text-gray-500 text-left mt-4 tracking-wide">
        {title}
      </h5>
    </div>
  );
}
