import React from 'react'
import TopBar from './TopBar'
import MiddleBar from './MiddleBar'
import BottomBar from './BottomBar'

export default function NavBar({ locale }: { locale: string }) {
    return (
        <>
            <header className="hidden md:block sticky top-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <MiddleBar locale={locale} />
                </div>
            </header>
        </>
    )
}