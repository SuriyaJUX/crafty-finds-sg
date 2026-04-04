import { useIsMobile } from "@/hooks/use-mobile";
import ColorWheelFilter, { COLOR_MAP } from "@/components/ColorWheelFilter";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const ALL_COLORS = [
  ...Object.keys(COLOR_MAP),
  "multicolor",
] as const;

interface ColorFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

const ChipRow = ({
  selectedColor,
  onColorSelect,
}: {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}) => (
  <div className="flex flex-wrap gap-2 mt-4">
    {ALL_COLORS.map((c) => {
      const isSelected = selectedColor === c;
      const hex =
        c === "multicolor"
          ? undefined
          : COLOR_MAP[c]?.hex;
      const label =
        c === "multicolor" ? "Multicolor" : COLOR_MAP[c]?.label ?? c;

      return (
        <button
          key={c}
          onClick={() => onColorSelect(isSelected ? null : c)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            isSelected
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full border border-border/40 shrink-0"
            style={{
              background: hex
                ? hex
                : "conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)",
            }}
          />
          {label}
        </button>
      );
    })}
    {selectedColor && (
      <button
        onClick={() => onColorSelect(null)}
        className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 transition-colors"
      >
        Clear filter
      </button>
    )}
  </div>
);

const ColorFilterDrawer = ({
  open,
  onClose,
  selectedColor,
  onColorSelect,
}: ColorFilterDrawerProps) => {
  const isMobile = useIsMobile();

  const handleSelect = (color: string | null) => {
    onColorSelect(color);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="text-left px-0 pt-4 pb-2">
            <DrawerTitle className="font-serif text-xl">Filter by colour</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col items-center">
            <ColorWheelFilter
              selectedColor={selectedColor}
              onColorSelect={handleSelect}
            />
            <ChipRow selectedColor={selectedColor} onColorSelect={handleSelect} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className="overflow-hidden transition-all duration-250 ease-in-out"
      style={{ maxHeight: open ? "700px" : "0px" }}
    >
      <div className="border border-border rounded-xl bg-card p-6 mb-4">
        <h3 className="font-serif text-lg mb-4">Filter by colour</h3>
        <div className="flex flex-col items-center">
          <ColorWheelFilter
            selectedColor={selectedColor}
            onColorSelect={handleSelect}
          />
          <ChipRow selectedColor={selectedColor} onColorSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
};

export default ColorFilterDrawer;
