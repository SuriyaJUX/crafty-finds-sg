import { deals } from "@/data/products";

const DealsBanner = () => {
  const doubled = [...deals, ...deals];

  return (
    <div className="deals-banner py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((deal, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            {deal.text}
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
