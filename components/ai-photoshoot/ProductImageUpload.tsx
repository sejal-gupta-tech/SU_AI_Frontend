"use client";

interface Props {
  image: string | null;
  onChange: (file: File) => void;
}

export default function ProductImageUpload({
  image,
  onChange,
}: Props) {

  return (
    <div className="rounded-xl border border-dashed p-8 text-center">

      {image ? (
        <img
          src={image}
          alt="Product"
          className="mx-auto max-h-64 rounded-lg object-contain"
        />
      ) : (
        <>
          <div className="text-lg font-semibold">
            Upload Product Image
          </div>

          <p className="mt-2 text-sm text-gray-500">
            JPG, PNG or WEBP
          </p>
        </>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="mt-5"
        onChange={(event) => {

          const file = event.target.files?.[0];

          if (file) {
            onChange(file);
          }

        }}
      />

    </div>
  );
}
