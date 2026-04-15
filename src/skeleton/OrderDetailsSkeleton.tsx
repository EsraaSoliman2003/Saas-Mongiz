import React from 'react'

export default function OrderDetailsSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
        </div>
    )
}
