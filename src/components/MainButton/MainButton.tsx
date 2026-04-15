import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  text: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon?: ReactNode;
  href?: string;
};

export default function MainButton({
  text,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  icon,
  href,
}: Props) {
  const isDisabled = disabled || loading;

  const content = (
    <span className="flex items-center justify-center gap-2">
      <span>{text}</span>
      {icon && <span className="flex items-center">{icon}</span>}
    </span>
  );

  const baseClasses = `
    px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition
    ${isDisabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed!"
      : "bg-main text-white hover:opacity-90 cursor-pointer"
    }
    ${className}
  `;

  if (href && !isDisabled) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={baseClasses}>
      {loading ? <span className="animate-pulse">{text}</span> : content}
    </button>
  );
}