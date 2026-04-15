import { useTranslations } from "next-intl";

export default function AttributeCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations('addProduct.attributes');

  return (
    <div className="border border-gray-200 p-6 bg-white">
      <h4 className="text-lg font-bold mb-4 text-main">{t(title)}</h4>
      {children}
    </div>
  );
}