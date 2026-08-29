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
          ? "border-orange-700 bg-orange-700 text-white"
          : "border-stone-200 cursor-pointer bg-white text-stone-600 hover:border-orange-300 hover:text-orange-700")
      }
    >
      {label}
    </button>
  );
}
