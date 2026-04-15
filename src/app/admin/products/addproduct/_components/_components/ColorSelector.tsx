import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ColorSelector({
  values,
  onChange,
}: {
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const addColor = (val: string = "#000000") => {
    onChange([...values, val]);
  };

  const updateColor = (i: number, val: string) => {
    const updated = [...values];
    updated[i] = val;
    onChange(updated);
  };

  const removeColor = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const t = useTranslations();

  return (
    <div className="space-y-3">
      {values.map((color, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
        >
          {/* Color picker */}
          <input
            type="color"
            value={color}
            onChange={(e) => updateColor(i, e.target.value)}
            className="w-12 h-12 cursor-pointer border-0 bg-transparent"
          />

          {/* Manual Hex Input */}
          <input
            type="text"
            value={color}
            onChange={(e) => updateColor(i, e.target.value)}
            placeholder="#FFFFFF"
            className="flex-1 py-2 px-4 border border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"

          />

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeColor(i)}
            className="text-gray-400 hover:text-red-500 text-4xl p-2 transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => addColor()}
          className="py-2 px-6 font-semibold text-white bg-main transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t("addProduct.types.add")}
        </button>
      </div>
    </div>
  );
}