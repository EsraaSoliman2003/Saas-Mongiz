import React from 'react'

export default function OrdersSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between animate-pulse"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                </div>
            ))}
        </div>
    )
}
