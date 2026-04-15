import { facebook, linked, twitter, Mail } from "@/assets";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const TopBar = () => {
  const t = useTranslations();

  return (
    <div className="border-b border-white/10 bg-dark">
      <div className="flex justify-between items-center py-2 text-sm text-white">
        <div className="flex items-center gap-6">
          <Link href="/faq" className="hover:text-(--main-color) duration-100">
            {t("FAQ")}
          </Link>
          <Link href="/contact" className="hover:text-(--main-color) duration-100">
            {t("Contact")}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a href="mailto:esraasoliman386@gmail.com">
            <Image src={Mail} alt="mail" width={16} height={16} className="cursor-pointer" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image src={facebook} alt="facebook" width={16} height={16} className="cursor-pointer" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src={linked} alt="linkedin" width={16} height={16} className="cursor-pointer" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image src={twitter} alt="twitter" width={16} height={16} className="cursor-pointer" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
