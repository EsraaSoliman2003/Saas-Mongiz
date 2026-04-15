import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AttributeInput({
  type,
  values,
  inputValue,
  setInputValue,
  handleAdd,
  handleRemove,
  handleKeyDown,
}: {
  type: number;
  values: string[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleAdd: (type: number) => void;
  handleRemove: (type: number, idx: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, type: number) => void;
}) {
  const t = useTranslations();

  return (
    <div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {values.map((val, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-gray-50 text-sm text-gray-700"
          >
            {val}
            <button
              type="button"
              onClick={() => handleRemove(type, idx)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, type)}
          placeholder={t("addNew")}
          className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
        />
        <button
          type="button"
          onClick={() => handleAdd(type)}
          disabled={!inputValue.trim()}
          className="py-2 px-6 font-semibold text-white bg-main transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t("addProduct.types.add")}
        </button>
      </div>
    </div>
  );
}