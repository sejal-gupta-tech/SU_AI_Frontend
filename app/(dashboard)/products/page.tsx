"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Search, Plus, Edit, Trash2, X, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProducts, createProduct, deleteProduct } from "@/services/product.service";
import { Product, ProductCreate } from "@/types/product";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Add-form state
  const [newProduct, setNewProduct] = useState<ProductCreate>({
    name: "", price: 0, stock: 0, sizes: [], colors: [], description: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      setProducts((current) =>
        current.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) return;
    try {
      setSaving(true);
      const created = await createProduct(newProduct);
      setProducts((prev) => [created, ...prev]);
      setIsAddingProduct(false);
      setNewProduct({ name: "", price: 0, stock: 0, sizes: [], colors: [], description: "" });
    } catch (error) {
      console.error("Failed to create product", error);
    } finally {
      setSaving(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", cls: "bg-red-500/10 text-red-600 dark:text-red-400" };
    if (stock <= 5)  return { label: "Low Stock",     cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
    return                 { label: "In Stock",       cls: "bg-green-500/10 text-green-600 dark:text-green-400" };
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAddingProduct) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary-600" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Product</h1>
          </div>
          <Button variant="ghost" onClick={() => setIsAddingProduct(false)}>
            <X className="h-5 w-5 mr-2" /> Cancel
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" placeholder="e.g. Silk Saree" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" placeholder="1999" value={newProduct.price || ""} onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale_price">Sale Price (₹)</Label>
                <Input id="sale_price" type="number" placeholder="1599" value={newProduct.sale_price || ""} onChange={(e) => setNewProduct((p) => ({ ...p, sale_price: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input id="stock" type="number" placeholder="50" value={newProduct.stock || ""} onChange={(e) => setNewProduct((p) => ({ ...p, stock: Number(e.target.value) }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea
                id="desc"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="Describe your product..."
                value={newProduct.description || ""}
                onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
              <Button onClick={handleSaveProduct} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary-600" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
        </div>
        <Button onClick={() => setIsAddingProduct(true)} className="bg-primary-600 hover:bg-primary-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      <p className="text-muted-foreground">Manage your product catalogue. AI uses this data to create posts and ads.</p>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Sale Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-3 opacity-20" />
                    {searchQuery ? "No products match your search." : "No products yet. Add your first product to get started."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div>{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">₹{product.price}</td>
                      <td className="px-6 py-4 text-muted-foreground">{product.sale_price ? `₹${product.sale_price}` : "—"}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" asChild>
                          <Link href={`/content?productId=${product.id}`} title="Generate AI Content">
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
