import React from 'react';

export default function AdminSkeleton() {
  return (
    <div className="animate-fadeIn w-full space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3 mb-10">
        <div className="h-10 bg-charcoal/5 rounded-lg w-1/3 animate-pulse"></div>
        <div className="h-4 bg-charcoal/5 rounded-lg w-1/2 animate-pulse"></div>
      </div>
      
      {/* Grid or Table Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border border-charcoal/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-charcoal/5 rounded-xl animate-pulse shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-charcoal/5 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-3 bg-charcoal/5 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="h-16 bg-charcoal/5 rounded-lg w-full animate-pulse mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
