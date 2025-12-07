import React, { useEffect, useState } from "react";

export default function RobotBadge({
  images = [],
  title = "Study Bot",
  subtitle = "Always ready to help!",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // har 3 second me change
    return () => clearInterval(id);
  }, [images]);

  if (!images || images.length === 0) return null;

  const current = images[index];

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl px-3 py-2 shadow border border-slate-800">
      <img
        src={current}
        alt="AI assistant"
        className="w-10 h-10 md:w-12 md:h-12 object-contain"
      />
      <div className="text-[11px] md:text-xs text-slate-300">
        <p className="font-semibold text-sky-300">{title}</p>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
