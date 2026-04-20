"use client";

import { CloseIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: { id: number, name: string };
  loading?: boolean;
  onSave: (payload: { name: string }) => void;
}

const SubCategoryModal: React.FC<Props> = ({
  open,
  onClose,
  mode,
  data,
  loading = false,
  onSave,
}) => {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && data) {
      setName(data.name || "");
    } else {
      setName("");
    }
    setError("");
  }, [mode, data, open]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setError(t("This field is required"));
      return;
    }
    setError("");
    onSave({ name });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-[90%] max-w-md p-5 relative min-h-[150px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {mode === "add" ? t("Add Sub Category") : t("Edit Sub Category")}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <CloseIcon size={"25"} />
          </button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name")}
          disabled={loading} // <-- disable while loading
          className={`w-full border rounded-md px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--main-color) transition ${error && !name ? "border-red-500" : "border-gray-200"
            } ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading} // optionally disable Cancel too
            className={`px-3 py-1.5 rounded-md bg-gray-200 text-sm hover:bg-gray-300 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-1.5 rounded-md bg-main text-white text-sm hover:opacity-90 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;