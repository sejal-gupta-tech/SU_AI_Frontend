"use client";

const styles = [
  {
    id: "studio",
    label: "Studio",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
  },
  {
    id: "model",
    label: "Model",
  },
  {
    id: "festival",
    label: "Festival",
  },
  {
    id: "marketplace",
    label: "Marketplace",
  },
];

interface Props {
  value: string;
  onChange: (value: any) => void;
}

export default function StyleSelector({
  value,
  onChange,
}: Props) {

  return (
    <div>

      <h3 className="mb-3 font-semibold">
        Choose Style
      </h3>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

        {styles.map((style) => (

          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={`rounded-xl border p-4 ${
              value === style.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
          >
            {style.label}
          </button>

        ))}

      </div>

    </div>
  );
}
