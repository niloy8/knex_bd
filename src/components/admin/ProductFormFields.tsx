import { FileText, Tag, X, Plus, Trash2, Upload, Loader2, Search } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { useState } from "react";
import SearchableSelect from "./SearchableSelect";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SubSubCategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    subSubCategories?: SubSubCategory[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
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
    subSubCategoryId?: string;
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
    const [showNewSubSubcategory, setShowNewSubSubcategory] = useState(false);
    const [showNewBrand, setShowNewBrand] = useState(false);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState("");
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const [newSubcategoryImage, setNewSubcategoryImage] = useState("");
    const [newSubSubcategoryName, setNewSubSubcategoryName] = useState("");
    const [newSubSubcategoryImage, setNewSubSubcategoryImage] = useState("");
    const [newBrandName, setNewBrandName] = useState("");

    const [saving, setSaving] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
    const [isEditingSubSubcategory, setIsEditingSubSubcategory] = useState(false);

    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch(`${API_URL}/upload/single`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            } else {
                const error = await res.json();
                alert(error.error || "Failed to upload image");
                return null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
            return null;
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const url = isEditingCategory && product.categoryId
                ? `${API_URL}/categories/${product.categoryId}`
                : `${API_URL}/categories`;
            const method = isEditingCategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newCategoryName.trim(),
                    slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                    image: newCategoryIcon.trim() || null,
                    icon: newCategoryIcon.trim() || null
                }),
            });
            if (res.ok) {
                const updatedCat = await res.json();
                if (!isEditingCategory) {
                    setProduct({ ...product, categoryId: String(updatedCat.id), subCategoryId: "", subSubCategoryId: "" });
                }
                alert(isEditingCategory ? "Category updated successfully!" : "Category added successfully!");
                setNewCategoryName("");
                setNewCategoryIcon("");
                setShowNewCategory(false);
                setIsEditingCategory(false);
                onCategoriesChange?.();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save category");
            }
        } catch (error) {
            console.error("Error saving category:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleEditCategory = () => {
        const cat = categories.find(c => String(c.id) === String(product.categoryId));
        if (cat) {
            setNewCategoryName(cat.name);
            let img = (cat as any).image || (cat as any).icon || "";
            if (img.startsWith('/uploads')) {
                const baseUrl = API_URL.replace('/api', '');
                img = `${baseUrl}${img}`;
            }
            setNewCategoryIcon(img);
            setIsEditingCategory(true);
            setShowNewCategory(true);
        }
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategoryName.trim() || !product.categoryId) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const url = isEditingSubcategory && product.subCategoryId
                ? `${API_URL}/categories/${product.categoryId}/subcategory/${product.subCategoryId}`
                : `${API_URL}/categories/${product.categoryId}/subcategory`;
            const method = isEditingSubcategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newSubcategoryName.trim(),
                    slug: newSubcategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                    image: newSubcategoryImage.trim() || null
                }),
            });
            if (res.ok) {
                const updatedSub = await res.json();
                if (!isEditingSubcategory) {
                    setProduct({ ...product, subCategoryId: String(updatedSub.id), subSubCategoryId: "" });
                }
                alert(isEditingSubcategory ? "Subcategory updated successfully!" : "Subcategory added successfully!");
                setNewSubcategoryName("");
                setNewSubcategoryImage("");
                setShowNewSubcategory(false);
                setIsEditingSubcategory(false);
                onCategoriesChange?.();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save subcategory");
            }
        } catch (error) {
            console.error("Error saving subcategory:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSubSubcategory = async () => {
        if (!newSubSubcategoryName.trim() || !product.subCategoryId) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const url = isEditingSubSubcategory && product.subSubCategoryId
                ? `${API_URL}/categories/${product.categoryId}/subcategory/${product.subCategoryId}/subsubcategory/${product.subSubCategoryId}`
                : `${API_URL}/categories/${product.categoryId}/subcategory/${product.subCategoryId}/subsubcategory`;
            const method = isEditingSubSubcategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newSubSubcategoryName.trim(),
                    slug: newSubSubcategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                    image: newSubSubcategoryImage.trim() || null
                }),
            });
            if (res.ok) {
                const updatedSubSub = await res.json();
                if (!isEditingSubSubcategory) {
                    setProduct({ ...product, subSubCategoryId: String(updatedSubSub.id) });
                }
                alert(isEditingSubSubcategory ? "Sub-subcategory updated successfully!" : "Sub-subcategory added successfully!");
                setNewSubSubcategoryName("");
                setNewSubSubcategoryImage("");
                setShowNewSubSubcategory(false);
                setIsEditingSubSubcategory(false);
                onCategoriesChange?.();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save sub-subcategory");
            }
        } catch (error) {
            console.error("Error saving sub-subcategory:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleEditSubSubcategory = () => {
        const subSub = selectedSubCategory?.subSubCategories?.find(s => String(s.id) === String(product.subSubCategoryId));
        if (subSub) {
            setNewSubSubcategoryName(subSub.name);
            let img = subSub.image || "";
            if (img.startsWith('/uploads')) {
                const baseUrl = API_URL.replace('/api', '');
                img = `${baseUrl}${img}`;
            }
            setNewSubSubcategoryImage(img);
            setIsEditingSubSubcategory(true);
            setShowNewSubSubcategory(true);
        }
    };

    const handleEditSubcategory = () => {
        const sub = (selectedCategory?.subCategories as any)?.find((s: any) => String(s.id) === String(product.subCategoryId));
        if (sub) {
            setNewSubcategoryName(sub.name);
            let img = sub.image || "";
            if (img.startsWith('/uploads')) {
                const baseUrl = API_URL.replace('/api', '');
                img = `${baseUrl}${img}`;
            }
            setNewSubcategoryImage(img);
            setIsEditingSubcategory(true);
            setShowNewSubcategory(true);
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
                    setProduct({ ...product, categoryId: "", subCategoryId: "", subSubCategoryId: "" });
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
        if (!confirm("Are you sure you want to delete this subcategory? This will fail if it has sub-subcategories or products.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories/${product.categoryId}/subcategory/${subId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                if (product.subCategoryId === subId) {
                    setProduct({ ...product, subCategoryId: "", subSubCategoryId: "" });
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

    const handleDeleteSubSubcategory = async (subSubId: string) => {
        if (!confirm("Are you sure you want to delete this sub-subcategory? This will fail if it has products.")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/categories/${product.categoryId}/subcategory/${product.subCategoryId}/subsubcategory/${subSubId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                if (product.subSubCategoryId === subSubId) {
                    setProduct({ ...product, subSubCategoryId: "" });
                }
                onCategoriesChange?.();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete sub-subcategory");
            }
        } catch (error) {
            console.error("Error deleting sub-subcategory:", error);
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
    const selectedSubCategory = subCategories.find(s => String(s.id) === String(product.subCategoryId));
    const subSubCategories = selectedSubCategory?.subSubCategories || [];

    console.log("Selected category:", selectedCategory);
    console.log("SubCategories:", subCategories);
    console.log("SubSubCategories:", subSubCategories);

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
                        <SearchableSelect
                            options={categories.map(cat => ({ id: String(cat.id), name: cat.name }))}
                            value={product.categoryId || ""}
                            onChange={(val) => {
                                console.log("Category selected:", val);
                                setProduct({ ...product, categoryId: val, subCategoryId: "", subSubCategoryId: "" });
                            }}
                            placeholder="Select category"
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditingCategory(false);
                                setShowNewCategory(true);
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            title="Add new category"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.categoryId && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEditCategory}
                                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    title="Edit selected category"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(product.categoryId!)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    title="Delete selected category"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategoryIcon}
                                onChange={(e) => setNewCategoryIcon(e.target.value)}
                                placeholder="Enter image URL or upload"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center justify-center">
                                <Upload className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadImage(file);
                                            if (url) setNewCategoryIcon(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isEditingCategory ? "Update" : "Add")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewCategory(false);
                                    setNewCategoryName("");
                                    setNewCategoryIcon("");
                                }}
                                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                {!showNewSubcategory ? (
                    <div className="flex gap-2">
                        <SearchableSelect
                            options={subCategories.map(sub => ({ id: String(sub.id), name: sub.name }))}
                            value={product.subCategoryId || ""}
                            onChange={(val) => setProduct({ ...product, subCategoryId: val, subSubCategoryId: "" })}
                            placeholder="Select subcategory"
                            disabled={!product.categoryId}
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditingSubcategory(false);
                                setShowNewSubcategory(true);
                            }}
                            disabled={!product.categoryId}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add new subcategory"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.subCategoryId && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEditSubcategory}
                                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    title="Edit selected subcategory"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubcategory(product.subCategoryId!)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    title="Delete selected subcategory"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="Enter subcategory name"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSubcategoryImage}
                                onChange={(e) => setNewSubcategoryImage(e.target.value)}
                                placeholder="Enter image URL or upload"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center justify-center">
                                <Upload className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadImage(file);
                                            if (url) setNewSubcategoryImage(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddSubcategory}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isEditingSubcategory ? "Update" : "Add")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewSubcategory(false);
                                    setNewSubcategoryName("");
                                    setNewSubcategoryImage("");
                                }}
                                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Subcategory</label>
                {!showNewSubSubcategory ? (
                    <div className="flex gap-2">
                        <SearchableSelect
                            options={subSubCategories.map(sub => ({ id: String(sub.id), name: sub.name }))}
                            value={product.subSubCategoryId || ""}
                            onChange={(val) => setProduct({ ...product, subSubCategoryId: val })}
                            placeholder="Select sub-subcategory"
                            disabled={!product.subCategoryId}
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditingSubSubcategory(false);
                                setShowNewSubSubcategory(true);
                            }}
                            disabled={!product.subCategoryId}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add new sub-subcategory"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {product.subSubCategoryId && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEditSubSubcategory}
                                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    title="Edit selected sub-subcategory"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubSubcategory(product.subSubCategoryId!)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    title="Delete selected sub-subcategory"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newSubSubcategoryName}
                            onChange={(e) => setNewSubSubcategoryName(e.target.value)}
                            placeholder="Enter sub-subcategory name"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSubSubcategoryImage}
                                onChange={(e) => setNewSubSubcategoryImage(e.target.value)}
                                placeholder="Enter image URL or upload"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center justify-center">
                                <Upload className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await uploadImage(file);
                                            if (url) setNewSubSubcategoryImage(url);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddSubSubcategory}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isEditingSubSubcategory ? "Update" : "Add")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewSubSubcategory(false);
                                    setNewSubSubcategoryName("");
                                    setNewSubSubcategoryImage("");
                                }}
                                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                {!showNewBrand ? (
                    <div className="flex gap-2">
                        <SearchableSelect
                            options={brands.map(brand => ({ id: String(brand.id), name: brand.name }))}
                            value={product.brandId || ""}
                            onChange={(val) => setProduct({ ...product, brandId: val })}
                            placeholder="Select brand"
                            className="flex-1"
                        />
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
