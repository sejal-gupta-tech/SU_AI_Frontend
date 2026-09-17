"use client";

const objectives = [
  ["product_promotion", "Product Promotion"],
  ["sales", "Sales"],
  ["awareness", "Awareness"],
  ["engagement", "Engagement"],
  ["lead_generation", "Lead Generation"],
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ObjectiveSelector({
  value,
  onChange,
}: Props) {

  return (
    <div>

      <h3 className="mb-3 font-semibold">
        Objective
      </h3>

      <div className="grid gap-3">

        {objectives.map(([id, label]) => (

          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-xl border p-3 text-left ${
              value === id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
          >
            {label}
          </button>

        ))}

      </div>

    </div>
  );
}
