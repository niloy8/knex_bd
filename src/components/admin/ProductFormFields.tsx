import { FileText, Tag, X, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SubCategory {
    id: string;
    name: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    subCategories?: SubCategory[];
}

interface Brand {
    id: string;
    name: string;
}

interface Product {
    id?: string;
    title?: string;
    price?: number;
    originalPrice?: number;
    categoryId?: string;
    subCategoryId?: string;
    brandId?: string;
    sku?: string;
    rating?: number;
    totalReviews?: number;
    image?: string;
    features?: string[];
    inStock?: boolean;
    stockQuantity?: number;
}

interface ProductFormFieldsProps {
    product: Product;
    setProduct: (product: Product) => void;
    description: string;
    setDescription: (desc: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    categories?: Category[];
    brands?: Brand[];
    onCategoriesChange?: () => void;
    onBrandsChange?: () => void;
}

export default function ProductFormFields({
    product,
    setProduct,
    description,
    setDescription,
    tags,
    setTags,
    categories = [],
    brands = [],
    onCategoriesChange,
    onBrandsChange,
}: ProductFormFieldsProps) {
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [showNewSubcategory, setShowNewSubcategory] = useState(false);
    const [showNewBrand, setShowNewBrand] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const [newBrandName, setNewBrandName] = useState("");
    const [saving, setSaving] = useState(false);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newCategoryName.trim(),
                    slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-')
                }),
            });
            if (res.ok) {
                const newCat = await res.json();
                setProduct({ ...product, categoryId: newCat.id, subCategoryId: "" });
                setNewCategoryName("");
                setShowNewCategory(false);
                onCategoriesChange?.();
            }
        } catch (error) {
            console.error("Error adding category:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategoryName.trim() || !product.categoryId) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories/${product.categoryId}/subcategory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newSubcategoryName.trim(), slug: newSubcategoryName.trim().toLowerCase().replace(/\s+/g, '-') }),
            });
            if (res.ok) {
                const newSub = await res.json();
                setProduct({ ...product, subCategoryId: newSub.id });
                setNewSubcategoryName("");
                setShowNewSubcategory(false);
                onCategoriesChange?.();
            }
        } catch (error) {
            console.error("Error adding subcategory:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddBrand = async () => {
        if (!newBrandName.trim()) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/brands`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newBrandName.trim() }),
            });
            if (res.ok) {
                const newBrand = await res.json();
                setProduct({ ...product, brandId: newBrand.id });
                setNewBrandName("");
                setShowNewBrand(false);
                onBrandsChange?.();
            }
        } catch (error) {
            console.error("Error adding brand:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category? This will fail if it has subcategories or products.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                if (product.categoryId === categoryId) {
                    setProduct({ ...product, categoryId: "", subCategoryId: "" });
                }
                onCategoriesChange?.();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleDeleteSubcategory = async (subId: string) => {
        if (!confirm("Are you sure you want to delete this subcategory? This will fail if it has products.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories/${product.categoryId}/subcategory/${subId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                if (product.subCategoryId === subId) {
                    setProduct({ ...product, subCategoryId: "" });
                }
                onCategoriesChange?.();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete subcategory");
            }
        } catch (error) {
            console.error("Error deleting subcategory:", error);
        }
    };

    const handleDeleteBrand = async (brandId: string) => {
        if (!confirm("Are you sure you want to delete this brand? This will fail if it has products.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/brands/${brandId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                if (product.brandId === brandId) {
                    setProduct({ ...product, brandId: "" });
                }
                onBrandsChange?.();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete brand");
            }
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    const selectedCategory = categories.find(c => String(c.id) === String(product.categoryId));
    const subCategories = selectedCategory?.subCategories || [];

    console.log("Selected category:", selectedCategory);
    console.log("SubCategories:", subCategories);

    return (
        <>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                <input
                    type="text"
                    value={product.title}
                    onChange={(e) => setProduct({ ...product, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter product title"
                />
            </div>

            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Product Description
                </label>
                <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter detailed product description..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Tk)</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Tk)</label>
                <input
                    type="number"
                    value={product.originalPrice}
                    onChange={(e) => setProduct({ ...product, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                {!showNewCategory ? (
                    <div className="flex gap-2">
                        <select
                            value={product.categoryId || ""}
                            onChange={(e) => {
                                console.log("Category selected:", e.target.value);
                                setProduct({ ...product, categoryId: e.target.value, subCategoryId: "" });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowNewCategory(true)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            title="Add new category"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.categoryId && (
                            <button
                                type="button"
                                onClick={() => handleDeleteCategory(product.categoryId!)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                title="Delete selected category"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter new category"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={saving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {saving ? "..." : "Add"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewCategory(false);
                                setNewCategoryName("");
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                {!showNewSubcategory ? (
                    <div className="flex gap-2">
                        <select
                            value={product.subCategoryId || ""}
                            onChange={(e) => setProduct({ ...product, subCategoryId: e.target.value })}
                            disabled={!product.categoryId}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                        >
                            <option value="">Select subcategory</option>
                            {subCategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowNewSubcategory(true)}
                            disabled={!product.categoryId}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add new subcategory"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.subCategoryId && (
                            <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(product.subCategoryId!)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                title="Delete selected subcategory"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="Enter new subcategory"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleAddSubcategory}
                            disabled={saving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {saving ? "..." : "Add"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewSubcategory(false);
                                setNewSubcategoryName("");
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                {!showNewBrand ? (
                    <div className="flex gap-2">
                        <select
                            value={product.brandId || ""}
                            onChange={(e) => setProduct({ ...product, brandId: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowNewBrand(true)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            title="Add new brand"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.brandId && (
                            <button
                                type="button"
                                onClick={() => handleDeleteBrand(product.brandId!)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                title="Delete selected brand"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder="Enter new brand"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddBrand()}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleAddBrand}
                            disabled={saving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {saving ? "..." : "Add"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewBrand(false);
                                setNewBrandName("");
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                    type="text"
                    value={product.sku || "Auto-generated on save"}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="SKU is automatically generated"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                    type="number"
                    value={product.stockQuantity || 0}
                    onChange={(e) => setProduct({ ...product, stockQuantity: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={product.rating || 0}
                    onChange={(e) => setProduct({ ...product, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                </label>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {tag}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setTags(tags.filter((_, i) => i !== idx))} />
                            </span>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                                setTags([...tags, input.value.trim()]);
                                input.value = '';
                            }
                        }
                    }}
                />
            </div>
        </>
    );
}
