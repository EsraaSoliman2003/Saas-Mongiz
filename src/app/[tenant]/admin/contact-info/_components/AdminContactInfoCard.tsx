"use client";

import Image from "next/image";
import Link from "next/link";
import { pen } from "@/assets";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { useAppDispatch } from "@/rtk/hooks";
import { deleteContactInfo } from "@/rtk/slices/contactInfo/contactInfoSlice";
import { useTranslations } from "next-intl";

interface Props {
  id: number;
  location: string;
  phoneNumber: string;
  email: string;
}

const AdminContactInfoCard: React.FC<Props> = ({
  id,
  location,
  phoneNumber,
  email,
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const handleDelete = (id: number) => {
    toast(
      t("Are you sure you want to delete this contact info?"),
      {
        action: {
          label: t("Delete"),
          onClick: async () => {
            try {
              await dispatch(deleteContactInfo({ id })).unwrap();
              toast.success(t("Deleted successfully"));
            } catch {
              toast.error(t("Failed to delete"));
            }
          },
        },
      }
    );
  };

  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-200 p-5 flex flex-col gap-3">
      {/* البيانات */}
      <div className="flex flex-col gap-1">
        <p>
          <strong>{t("Location")}: </strong> {location}
        </p>
        <p>
          <strong>{t("Phone Number")}: </strong> {phoneNumber}
        </p>
        <p>
          <strong>{t("Email")}: </strong> {email}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-3">
        {/* Edit */}
        <Link
          href={`/admin/contact-info/${id}/edit`}
          className="relative w-5 h-5 block"
        >
          <Image src={pen} alt="edit" fill sizes="20px" />
        </Link>

        {/* Delete */}
        <button
          onClick={() => handleDelete(id)}
          className="text-red-500 hover:text-red-600 transition"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminContactInfoCard;
