"use client";

interface Product {
  id: string;
  name: string;
  image_url?: string;
}

interface ProductSelectorProps {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
}

export default function ProductSelector({
  products,
  value,
  onChange,
}: ProductSelectorProps) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => {

        const selected = value === product.id;

        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onChange(product.id)}
            className={`
              rounded-xl border p-4 text-left
              transition
              ${
                selected
                  ? "border-black ring-2 ring-black/10"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg mb-3"
              />
            )}

            <p className="font-medium">
              {product.name}
            </p>

          </button>
        );
      })}
    </div>
  );
}
