type SortingOption<TKey extends string> = {
  key: TKey;
  label: string;
};

type SortingBoxProps<TKey extends string> = {
  option: SortingOption<TKey>;
  isActive: boolean;
  sortDirection: "asc" | "desc";
  onSortChange: (key: TKey) => void;
};

const SortingBox = <TKey extends string>({
  option,
  isActive,
  sortDirection,
  onSortChange,
}: SortingBoxProps<TKey>) => {
  return (
    <button
      type="button"
      onClick={() => onSortChange(option.key)}
      className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition ${
        isActive
          ? "border-gray-300 bg-gray-100 text-gray-900"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span>{option.label}</span>

      {isActive && (
        <span className="text-xs text-gray-500">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
};

export default SortingBox;
