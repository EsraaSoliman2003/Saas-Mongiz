import { useTranslations } from 'next-intl';
import React from 'react'

type Props = {}

export default function ToggleSwitch({
    enabled,
    setEnabled,
}: {
    enabled: boolean;
    setEnabled: (val: boolean) => void;
}) {
    const t = useTranslations();
    return (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`
                w-12 h-7 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer
                ${enabled ? "bg-green-500" : "bg-gray-300"}
            `}
        >
            <div
                className={`
                    w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300
                    ${enabled ? t("dir") === "rtl" ? "-translate-x-5" : "translate-x-5" : "translate-x-0"}
                `}
            />
        </button>
    );
}
