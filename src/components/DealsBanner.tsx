import { deals } from "@/data/products";
import { useState, useEffect } from "react";

const TWO_HOURS_S = 2 * 60 * 60;

const formatCountdown = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const DealsBanner = () => {
  const [timeLeft, setTimeLeft] = useState(TWO_HOURS_S);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const doubled = [...deals, ...deals];

  return (
    <div className="deals-banner py-2 overflow-hidden group">
      <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
        {doubled.map((deal, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            {deal.text}
            {deal.code === "FLASH" && (
              <span className="ml-2 font-mono text-xs tracking-tight opacity-90">
                {timeLeft > 0 ? formatCountdown(timeLeft) : "ENDED"}
              </span>
            )}
            {deal.code && (
              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-primary-foreground/20 font-semibold">
                {deal.code}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DealsBanner;
