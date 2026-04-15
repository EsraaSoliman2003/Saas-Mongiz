"use client";

import MainButton from "@/components/MainButton/MainButton";
import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  link?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  link,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-6 py-4 transition duration-300">
      
      {/* Title Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 relative inline-block">
          {title}
          <span className="block w-10 h-0.75 bg-main rounded-full mt-2"></span>
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Button Section */}
      {buttonText && (
        <MainButton
          text={`+ ${buttonText}`}
          className="w-auto"
          onClick={onButtonClick}
          href={link}
        />
      )}
    </div>
  );
}