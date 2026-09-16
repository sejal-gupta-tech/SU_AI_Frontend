"use client";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PlatformSelector({
  value,
  onChange,
}: Props) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      {platforms.map((platform) => (

        <button
          key={platform.id}
          type="button"
          onClick={() => onChange(platform.id)}
          className={`
            rounded-xl border px-4 py-3
            ${
              value === platform.id
                ? "border-black bg-black text-white"
                : "border-gray-200"
            }
          `}
        >
          {platform.name}
        </button>

      ))}

    </div>
  );
}
