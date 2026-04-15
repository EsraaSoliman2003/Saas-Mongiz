import React from 'react'

export default function FAQSkeleton() {
    return (
        <div className="py-16 px-4 sm:py-10 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16">

                {/* Title Skeleton */}
                <div className="md:w-1/3">
                    <div className="h-8 w-40 bg-gray-200 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                    </div>
                </div>

                {/* FAQ Skeleton List */}
                <div className="md:w-2/3 space-y-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="border border-gray-100 rounded-3xl px-6 sm:px-8 py-4 bg-gray-50 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center">

                                {/* Question line */}
                                <div className="h-4 sm:h-5 w-3/4 bg-gray-200 rounded-md relative overflow-hidden">
                                    <div className="absolute inset-0 shimmer" />
                                </div>

                                {/* Icon circle */}
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 rounded-full relative overflow-hidden">
                                    <div className="absolute inset-0 shimmer" />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
