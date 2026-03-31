import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";

const COLOR_MAP: Record<string, { hex: string; label: string }> = {
  black: { hex: "#1a1a1a", label: "Black" },
  white: { hex: "#f5f5f5", label: "White" },
  grey: { hex: "#9e9e9e", label: "Grey" },
  red: { hex: "#e53935", label: "Red" },
  orange: { hex: "#C4714F", label: "Orange" },
  yellow: { hex: "#fdd835", label: "Yellow" },
  green: { hex: "#43a047", label: "Green" },
  blue: { hex: "#1e88e5", label: "Blue" },
  purple: { hex: "#8e24aa", label: "Purple" },
  pink: { hex: "#e91e8c", label: "Pink" },
  brown: { hex: "#6d4c41", label: "Brown" },
  gold: { hex: "#f9a825", label: "Gold" },
  silver: { hex: "#90a4ae", label: "Silver" },
};

const OUTER_COLORS = Object.keys(COLOR_MAP); // 13 segments

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  const o1 = polarToCartesian(cx, cy, outerR, startAngle);
  const o2 = polarToCartesian(cx, cy, outerR, endAngle);
  const i1 = polarToCartesian(cx, cy, innerR, endAngle);
  const i2 = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

interface ColorWheelFilterProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

const ColorWheelFilter = ({
  selectedColor,
  onColorSelect,
}: ColorWheelFilterProps) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 240 : 280;
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 280;
  const outerR = 130 * scale;
  const innerR = 72 * scale;
  const multiR = 26 * scale;

  const segmentAngle = 360 / OUTER_COLORS.length;
  const gapDeg = 1; // half-gap per side

  const segments = useMemo(
    () =>
      OUTER_COLORS.map((color, i) => {
        const startAngle = i * segmentAngle + gapDeg;
        const endAngle = (i + 1) * segmentAngle - gapDeg;
        return {
          color,
          ...COLOR_MAP[color],
          d: arcPath(cx, cy, outerR, innerR, startAngle, endAngle),
        };
      }),
    [cx, cy, outerR, innerR, segmentAngle]
  );

  const handleClick = (color: string) => {
    onColorSelect(selectedColor === color ? null : color);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <TooltipProvider delayDuration={200}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="cursor-pointer"
        >
          {segments.map((seg) => {
            const isSelected = selectedColor === seg.color;
            return (
              <Tooltip key={seg.color}>
                <TooltipTrigger asChild>
                  <path
                    d={seg.d}
                    fill={seg.hex}
                    stroke={isSelected ? "#ffffff" : "hsl(var(--background))"}
                    strokeWidth={isSelected ? 3 : 2}
                    onClick={() => handleClick(seg.color)}
                    style={{
                      transform: isSelected
                        ? `scale(1.08)`
                        : "scale(1)",
                      transformOrigin: `${cx}px ${cy}px`,
                      transition: "transform 150ms ease-out",
                    }}
                    className="hover:opacity-90"
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {seg.label}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Multicolor centre */}
          <Tooltip>
            <TooltipTrigger asChild>
              <circle
                cx={cx}
                cy={cy}
                r={multiR}
                fill="url(#multiGradient)"
                stroke={
                  selectedColor === "multicolor"
                    ? "#ffffff"
                    : "hsl(var(--background))"
                }
                strokeWidth={selectedColor === "multicolor" ? 3 : 2}
                onClick={() => handleClick("multicolor")}
                style={{
                  transform:
                    selectedColor === "multicolor" ? "scale(1.08)" : "scale(1)",
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: "transform 150ms ease-out",
                }}
                className="hover:opacity-90 cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Multicolor
            </TooltipContent>
          </Tooltip>

          <defs>
            <radialGradient id="multiGradient">
              <stop offset="0%" stopColor="#fdd835" />
              <stop offset="25%" stopColor="#e53935" />
              <stop offset="50%" stopColor="#1e88e5" />
              <stop offset="75%" stopColor="#43a047" />
              <stop offset="100%" stopColor="#8e24aa" />
            </radialGradient>
          </defs>
        </svg>
      </TooltipProvider>

      {/* Selected colour pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm">
        {selectedColor ? (
          <>
            <span
              className="w-3 h-3 rounded-full border border-border/50 shrink-0"
              style={{
                background:
                  selectedColor === "multicolor"
                    ? "conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)"
                    : COLOR_MAP[selectedColor]?.hex,
              }}
            />
            <span className="text-primary font-medium">
              Showing:{" "}
              {selectedColor === "multicolor"
                ? "Multicolor"
                : COLOR_MAP[selectedColor]?.label}
            </span>
            <button
              onClick={() => onColorSelect(null)}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <span className="text-muted-foreground">Filter by colour</span>
        )}
      </div>
    </div>
  );
};

export default ColorWheelFilter;
export { COLOR_MAP };
