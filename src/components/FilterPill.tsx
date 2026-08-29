export default function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition " +
        (active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-brand-300 hover:text-brand-700")
      }
    >
      {label}
    </button>
  );
}
