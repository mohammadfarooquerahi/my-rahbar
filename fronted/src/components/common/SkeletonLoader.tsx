import React from 'react';

/**
 * Simple skeleton loader used while data is being fetched.
 * rows – number of placeholder rows
 * columns – number of placeholder columns per row
 */
export const SkeletonLoader = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex space-x-2">
        {Array.from({ length: columns }).map((_, c) => (
          <div
            key={c}
            className="h-4 bg-gray-200 rounded w-1/4"
          />
        ))}
      </div>
    ))}
  </div>
);
