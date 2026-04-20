"use client";

import React, { forwardRef } from "react";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      required,
      disabled,
      error,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border
            text-gray-900 text-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-(--main-color) focus:border-oraring-(--main-color)
            disabled:bg-gray-100 disabled:text-gray-400
            ${error ? "border-red-500" : "border-gray-300"}
            transition
            ${className || ""}
          `}
          {...rest}
        />

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;