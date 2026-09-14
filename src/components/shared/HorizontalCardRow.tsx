import { ReactNode } from "react";

export default function HorizontalCardRow({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-2 scrollbar-thin">
      <div className="flex snap-x snap-mandatory gap-5">{children}</div>
    </div>
  );
}

export function CarouselCard({ children }: { children: ReactNode }) {
  return <div className="w-72 shrink-0 snap-start sm:w-80">{children}</div>;
}
