"use client";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Verdict skeleton */}
      <div className="rounded-xl p-5 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="skeleton w-6 h-6 rounded" />
          <div className="skeleton w-40 h-5" />
          <div className="skeleton w-20 h-5 rounded" />
        </div>
        <div className="skeleton w-full h-4 mt-3" />
        <div className="skeleton w-3/4 h-4 mt-2" />
      </div>

      {/* Summary skeleton */}
      <div className="border border-gray-200 rounded-xl p-5">
        <div className="skeleton w-40 h-4 mb-4" />
        <div className="skeleton w-full h-4 mb-2" />
        <div className="skeleton w-3/4 h-4 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
      </div>

      {/* Clause skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-8 h-4 rounded" />
            <div className="skeleton w-16 h-5 rounded" />
            <div className="skeleton w-24 h-4" />
            <div className="flex-1" />
            <div className="skeleton w-4 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
