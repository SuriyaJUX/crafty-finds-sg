import { deals } from "@/data/products";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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
    <div className="deals-banner py-4 overflow-hidden group relative min-h-[56px]">
      <div className="flex items-center">
        {/* Scrolling deals */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {doubled.map((deal, i) => (
              <span key={i} className="mx-8 text-base font-semibold">
                {deal.text}
                {deal.code === "FLASH" && (
                  <span className="ml-2 font-mono text-sm tracking-tight opacity-90">
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

        {/* View all deals CTA */}
        <Link
          to="/promotions"
          className="hidden sm:flex items-center gap-1 px-4 py-1.5 mr-4 rounded-full text-sm font-semibold bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors shrink-0"
        >
          View all deals
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default DealsBanner;
