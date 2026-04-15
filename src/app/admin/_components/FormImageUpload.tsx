"use client";

import Image from "next/image";
import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { FiUpload, FiX } from "react-icons/fi";

interface FormImageUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  previewUrl?: string | null;
  error?: string;
  onClear?: () => void;
  showClearButton?: boolean;
  square?: boolean; // makes the upload area square
}

const FormImageUpload = forwardRef<HTMLInputElement, FormImageUploadProps>(
  (
    {
      previewUrl,
      error,
      className = "",
      disabled,
      onChange,
      onClear,
      showClearButton = true,
      square = false,
      ...rest
    },
    ref
  ) => {
    const t = useTranslations();
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (ref && typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          inputRef.current;
      }
    }, [ref]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLocalPreview(URL.createObjectURL(file));
      }
      if (onChange) onChange(e);
    };

    const handleDivClick = () => {
      if (!disabled && inputRef.current) inputRef.current.click();
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      if (onClear) onClear();
    };

    useEffect(() => {
      // Reset local preview when prop changes
      setLocalPreview(null);
    }, [previewUrl]);

    const currentPreview = localPreview || previewUrl;

    // Base container classes
    const containerClasses = `
      relative rounded-lg border-2 border-dashed transition-all duration-200
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-(--main-color) hover:bg-(--main-color)/10"}
      ${error ? "border-red-300 bg-red-50" : "border-gray-300"}
      ${square ? "aspect-square w-full" : "w-full"}
      ${className}
    `;

    return (
      <div className="w-full mb-5 space-y-2">
        {/* Empty state */}
        {!currentPreview ? (
          <div
            onClick={handleDivClick}
            className={`${containerClasses} flex flex-col items-center justify-center p-8`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={handleFileChange}
              className="hidden"
              {...rest}
            />
            <FiUpload className="text-3xl text-gray-500 mb-3" />
            <p className="text-sm font-medium text-gray-700">
              {t("Upload image")}
            </p>
          </div>
        ) : (
          /* Preview state */
          <div className={`${containerClasses} overflow-hidden p-0`}>
            <div
              onClick={handleDivClick}
              className="relative w-full h-full group"
            >
              <Image
                src={currentPreview}
                alt="preview"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 300px"
              />

              {/* HUD elements */}
              {showClearButton && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg transition-colors z-10"
                >
                  <FiX size={16} />
                </button>
              )}

              <div className="absolute bottom-2 left-2 bg-gray-800/75 text-white text-xs px-2 py-1 rounded">
                {t("Uploaded")}
              </div>

              {/* Hidden input */}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={handleFileChange}
                className="hidden"
                {...rest}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

FormImageUpload.displayName = "FormImageUpload";
export default FormImageUpload;