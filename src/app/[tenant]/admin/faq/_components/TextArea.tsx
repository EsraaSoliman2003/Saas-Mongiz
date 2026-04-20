import React from "react";

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm desc-color">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="px-3 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#00000010] bg-white resize-none"
      />
    </div>
  );
}
