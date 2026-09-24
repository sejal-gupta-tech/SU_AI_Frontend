"use client";

import { useState, useEffect, useRef } from "react";
import { FashionService } from "@/services/fashion.service";
import { FashionProduct } from "@/types/fashion.types";
import { toast } from "react-toastify";
import { Loader2, Plus, Trash2, Upload, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FashionProductsPage() {
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", category: "tshirt", gender: "unisex", color: "", image_url: "", description: ""
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await FashionService.getProducts();
      setProducts(data);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await FashionService.uploadProductImage(file);
      setForm(prev => ({ ...prev, image_url: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Failed to upload image"); }
    finally { setUploading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return toast.error("Please upload a product image first");
    setSaving(true);
    try {
      await FashionService.createProduct(form as any);
      toast.success("Product created!");
      setShowForm(false);
      setForm({ name: "", category: "tshirt", gender: "unisex", color: "", image_url: "", description: "" });
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create product");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await FashionService.deleteProduct(id);
      toast.success("Deleted");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-purple" /> Fashion Products
          </h1>
          <p className="text-text-muted mt-1">Manage your clothing products for AI photoshoots and virtual try-ons.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-5">Add New Fashion Product</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${form.image_url ? "border-brand-purple bg-brand-purple/5" : "border-border hover:border-brand-purple"}`}
            >
              <input type="file" className="hidden" ref={fileRef} accept="image/*" onChange={handleImageUpload} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2"><Loader2 className="w-7 h-7 animate-spin text-brand-purple" /><p className="text-text-muted text-sm">Uploading...</p></div>
              ) : form.image_url ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-border">
                    <Image src={form.image_url} alt="Product" fill className="object-cover" unoptimized />
                  </div>
                  <p className="text-xs text-brand-purple">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-text-muted" />
                  <p className="text-white text-sm font-medium">Click to upload product image</p>
                  <p className="text-text-muted text-xs">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-text-muted">Product Name *</label>
                <input required className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none" placeholder="e.g. Classic Black T-Shirt" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-text-muted">Color *</label>
                <input required className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none" placeholder="e.g. Black, Red, Navy Blue" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-text-muted">Category *</label>
                <select required className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {["tshirt","shirt","dress","hoodie","jacket","top","other"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-text-muted">Gender *</label>
                <select required className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  {["male","female","unisex"].map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-text-muted">Description (optional)</label>
              <textarea className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white focus:border-brand-purple outline-none resize-none h-20" placeholder="Brief product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-elevated border border-border text-text-muted hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-purple" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-white font-medium mb-1">No fashion products yet</p>
          <p className="text-text-muted text-sm mb-4">Add your first clothing product to start generating AI photoshoots.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-brand-purple text-white rounded-lg text-sm hover:bg-brand-purple/90 transition-colors">
            Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-surface border border-border rounded-xl overflow-hidden group relative">
              <div className="aspect-[3/4] relative bg-black/20">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted"><Package className="w-8 h-8" /></div>
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{p.name}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted capitalize">{p.category}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted capitalize">{p.gender}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-muted">{p.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="flex gap-3 pt-2">
          <Link href="/fashion-ai/photoshoot" className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-sm font-medium text-center transition-colors">
            Generate AI Photoshoot
          </Link>
          <Link href="/fashion-ai/virtual-try-on" className="flex-1 py-3 border border-brand-purple text-brand-purple hover:bg-brand-purple/10 rounded-lg text-sm font-medium text-center transition-colors">
            Virtual Try-On
          </Link>
        </div>
      )}
    </div>
  );
}