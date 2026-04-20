import React from 'react'
import LogoCard from './_components/LogoCard'
import SectionHeader from '../_components/SectionHeader'
import { useTranslations } from 'next-intl';

export default function page() {
    const t = useTranslations();
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <SectionHeader title={t("Logo")} />
            <LogoCard />
        </div>
    )
}
