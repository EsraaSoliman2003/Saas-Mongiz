"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/rtk/store";
import { setField } from "@/rtk/slices/ui/ProductSlice";
import { useTranslations } from "next-intl";
import AttributeCard from "./_components/AttributeCard";
import ColorSelector from "./_components/ColorSelector";
import AttributeInput from "./_components/AttributeInput";
import AdditionalData from "./AdditionalData";
import VariantsTable from "./VariantsTable";
import Keywords from "./Keywords";

const ATTRIBUTE_TYPES = [
  { type: 1, label: "colors" },
  { type: 2, label: "volume" },
  { type: 3, label: "size" },
  { type: 4, label: "shape" },
  { type: 5, label: "weight" },
  { type: 6, label: "memory" },
];

const typeToKeyMap: Record<number, string> = {
  1: "الألوان",
  2: "السعة",
  3: "الحجم",
  4: "الشكل",
  5: "الوزن",
  6: "الذاكرة",
};

export default function Attributes() {
  const dispatch = useDispatch();
  const additionalData = useSelector(
    (state: RootState) => state.productDraft.additionalData
  );

  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  const getValues = (type: number) =>
    additionalData.find((x) => x.type === type)?.values || [];

  const updateValues = (type: number, values: string[]) => {
    const updated = additionalData.filter((x) => x.type !== type);
    updated.push({
      id: Date.now(),
      type,
      key: typeToKeyMap[type],
      values,
    });
    dispatch(setField({ key: "additionalData", value: updated }));
  };

  const handleAdd = (type: number) => {
    const val = inputs[type]?.trim();
    if (!val) return;
    const values = [...getValues(type), val];
    updateValues(type, values);
    setInputs((prev) => ({ ...prev, [type]: "" }));
  };

  const handleRemove = (type: number, idx: number) => {
    const values = getValues(type).filter((_, i) => i !== idx);
    updateValues(type, values);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: number) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd(type);
    }
  };

  return (
    <>
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ATTRIBUTE_TYPES.map(({ type, label }) => (
            <AttributeCard key={type} title={label}>
              {type === 1 ? (
                <ColorSelector
                  values={getValues(type)}
                  onChange={(vals) => updateValues(type, vals)}
                />
              ) : (
                <AttributeInput
                  type={type}
                  values={getValues(type)}
                  inputValue={inputs[type] || ""}
                  setInputValue={(val) =>
                    setInputs((prev) => ({ ...prev, [type]: val }))
                  }
                  handleAdd={handleAdd}
                  handleRemove={handleRemove}
                  handleKeyDown={handleKeyDown}
                />
              )}
            </AttributeCard>
          ))}
        </div>
      </section>
      <VariantsTable />
      <AdditionalData />
      <Keywords />
    </>
  );
}