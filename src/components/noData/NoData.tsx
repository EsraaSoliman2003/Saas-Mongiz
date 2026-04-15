import React from "react";
import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";

interface NoDataProps {
    messageKey?: string;
    suggestionKey?: string;
    icon?: React.ReactNode;
}

const NoData: React.FC<NoDataProps> = ({
    messageKey = "NoDataMessage",
    suggestionKey = "NoDataSuggestion",
    icon = <Inbox size={64} className="text-gray-400" />,
}) => {
    const t = useTranslations();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {t(messageKey)}
            </h3>
            <p className="text-sm text-gray-500">{t(suggestionKey)}</p>
        </div>
    );
};

export default NoData;
