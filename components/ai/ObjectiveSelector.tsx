"use client";

const objectives = [
  {
    id: "product_promotion",
    name: "Product Promotion",
  },
  {
    id: "sale",
    name: "Sale",
  },
  {
    id: "launch",
    name: "Product Launch",
  },
  {
    id: "festival",
    name: "Festival",
  },
  {
    id: "awareness",
    name: "Brand Awareness",
  },
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

      {objectives.map((objective) => (

        <button
          key={objective.id}
          type="button"
          onClick={() => onChange(objective.id)}
          className={`
            rounded-xl border p-4 text-left
            ${
              value === objective.id
                ? "border-black bg-black text-white"
                : "border-gray-200"
            }
          `}
        >
          {objective.name}
        </button>

      ))}

    </div>
  );
}
