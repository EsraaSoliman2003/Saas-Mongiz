import { Mail, Facebook, Linkedin, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const SocialLinks = () => {
  const t = useTranslations();

  const icons = [
    { Icon: Mail, href: "mailto:esraasoliman386@gmail.com" },
    { Icon: Facebook, href: "https://facebook.com" },
    { Icon: Linkedin, href: "https://linkedin.com" },
    { Icon: Twitter, href: "https://twitter.com" },
  ];

  return (
    <div className="p-4">
      <h3 className="font-semibold text-black mb-3 text-sm tracking-wide">
        {t("FollowUs")}
      </h3>

      <div className="flex items-center gap-3">
        {icons.map(({ Icon, href }, index) => (
          <Link
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-gray-100
                       text-dark/70 cursor-pointer
                       hover:bg-main/10 hover:text-main
                       transition-all duration-150 ease-out"
          >
            <Icon size={16} />
          </Link>
        ))}
      </div>
    </div>
  );
};
