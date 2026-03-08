import { Suspense } from "react";
import SearchContent from "./_SearchContent";

export const metadata = { title: "Temukan Anime | Soraku Stream" };

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="skeleton h-7 w-48 rounded mb-6" />
          <div className="flex gap-2 mb-6">
            <div className="skeleton h-8 w-32 rounded" />
            <div className="skeleton h-8 w-36 rounded" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton rounded-lg" />
                <div className="mt-1.5 space-y-1">
                  <div className="skeleton h-3 w-4/5 rounded" />
                  <div className="skeleton h-2.5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
