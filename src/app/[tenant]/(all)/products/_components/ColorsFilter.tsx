"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function ColorsFilter() {
    const t = useTranslations();

    const colors = [
        { name: "أحمر", value: "#ef4444" },
        { name: "أزرق", value: "#3b82f6" },
        { name: "أخضر", value: "#22c55e" },
        { name: "أسود", value: "#000000" },
        { name: "أبيض", value: "#ffffff" },
        { name: "برتقالي", value: "#f97316" },
        { name: "بنفسجي", value: "#8b5cf6" },
        { name: "رمادي", value: "#9ca3af" },
        { name: "وردي", value: "#ec4899" },
    ];

    const [activeColor, setActiveColor] = useState<string | null>(null);

    return (
        <div>
            <h2 className="font-bold text-xl mb-3">{t("Colors")}</h2>

            <div className="grid grid-cols-6 gap-3">
                {colors.map((color) => {
                    const isActive = activeColor === color.value;

                    return (
                        <button
                            key={color.value}
                            onClick={() => setActiveColor(color.value)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border
                            ${isActive ? "scale-110" : "border-gray-200 hover:scale-105"}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        >
                            {isActive && (
                                <span className="text-white text-xs font-bold">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
