"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface TypeItem {
  id: number;
  type: string | null;
}

interface Props {
  types: TypeItem[];
  value?: number;
  onChange: (id: number) => void;
}

const ProductTypes = ({ types, value, onChange }: Props) => {
  const t = useTranslations();
  useEffect(() => {
    if (value == null && types.length > 0) {
      onChange(types[0].id);
    }
  }, [value, types, onChange]);

  if (!types?.length) return null;

  return (
    <div>
      <span className="text-sm font-medium text-gray-700">{t("Type")}</span>
      <div className="flex items-center flex-wrap gap-2 mt-2">
        {types.map((item, idx) => {
          const label = item.type ?? `Option ${idx + 1}`;
          const selected = value === item.id;

          return (
            <button
              type="button"
              key={item.id}
              className={`
                rounded-lg py-1.5 px-3 text-xs font-medium transition-all
                ${
                  selected
                    ? "bg-green-50 border border-green-700 text-green-700"
                    : "border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }
              `}
              onClick={() => onChange(item.id)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTypes;