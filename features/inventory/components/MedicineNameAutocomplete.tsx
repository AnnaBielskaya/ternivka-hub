"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type MedicineSuggestion = {
  id: string;
  name: string;
  dosage: string | null;
  volume: string | null;
  medicine_form: {
    id: string;
    name: string;
  } | null;
};

type MedicineNameAutocompleteProps = {
  value: string;
  onChange: (
    value: string,
  ) => void;
  disabled?: boolean;
};

const MedicineNameAutocomplete = ({
  value,
  onChange,
  disabled = false,
}: MedicineNameAutocompleteProps) => {
  const [
    suggestions,
    setSuggestions,
  ] = useState<MedicineSuggestion[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = value.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(
      async () => {
        setIsLoading(true);

        try {
          const response =
            await fetch(
              `/api/medicines/search?q=${encodeURIComponent(
                query,
              )}`,
            );

          if (!response.ok) {
            throw new Error(
              "Search failed",
            );
          }

          const data =
            (await response.json()) as MedicineSuggestion[];

          setSuggestions(data);
          setIsOpen(data.length > 0);
        } catch (error) {
          console.error(
            error,
          );

          setSuggestions([]);
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      },
      250,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleSelect = (
    medicine: MedicineSuggestion,
  ) => {
    onChange(medicine.name);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <input
        id="name"
        name="name"
        type="text"
        required
        value={value}
        disabled={disabled}
        autoComplete="off"
        placeholder="Наприклад, Парацетамол"
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
        onChange={(event) => {
          onChange(
            event.target.value,
          );
          setIsOpen(true);
        }}
        onFocus={() => {
          if (
            suggestions.length > 0
          ) {
            setIsOpen(true);
          }
        }}
      />

      {isLoading &&
        value.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-400 shadow-lg">
            Пошук...
          </div>
        )}

      {!isLoading &&
        isOpen &&
        suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.map(
              (medicine) => (
                <button
                  key={medicine.id}
                  type="button"
                  className="w-full cursor-pointer px-4 py-3 text-left transition hover:bg-gray-50"
                  onMouseDown={(
                    event,
                  ) => {
                    event.preventDefault();
                    handleSelect(
                      medicine,
                    );
                  }}
                >
                  <span className="block text-sm font-medium text-gray-900">
                    {medicine.name}
                  </span>

                  <span className="mt-0.5 block text-xs text-gray-500">
                    {[
                      medicine
                        .medicine_form
                        ?.name,
                      medicine.dosage,
                      medicine.volume,
                    ]
                      .filter(Boolean)
                      .join(
                        " · ",
                      )}
                  </span>
                </button>
              ),
            )}
          </div>
        )}
    </div>
  );
};

export default MedicineNameAutocomplete;