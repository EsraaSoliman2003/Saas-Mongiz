import React from 'react'

export default function ProductDetailsSkelton() {
    return (
        <div className="container animate-pulse space-y-6 py-10">
            {/* Top Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mt-8">
                <div className="flex gap-6 mb-4">
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-48 bg-gray-200 rounded"></div>
            </div>

            {/* Featured Products Skeleton */}
            <div className="mt-12 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, idx) => (
                        <div key={idx} className="h-48 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
