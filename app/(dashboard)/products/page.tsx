"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Search, Plus, Edit, Trash2, X, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock Product Data
const initialProducts = [
  { id: "1", name: "Floral Summer Dress", price: 1299, stock: 15, status: "In Stock", category: "Dresses" },
  { id: "2", name: "Cotton Blend Kurta", price: 899, stock: 2, status: "Low Stock", category: "Ethnic" },
  { id: "3", name: "Denim Jacket", price: 2499, stock: 0, status: "Out of Stock", category: "Outerwear" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="e.g. Silk Saree" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="1999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" placeholder="50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Ethnic Wear" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea 
                id="desc" 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="Describe your product..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setIsAddingProduct(false)}>Save Product</Button>
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
        <Button onClick={() => setIsAddingProduct(true)}>
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
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-3 opacity-20" />
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 font-medium">₹{product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                          product.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}`
                      }>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50" asChild>
                        <Link href={`/content?productId=${product.id}`} title="Generate AI Content">
                          <Sparkles className="h-4 w-4 text-indigo-500" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
