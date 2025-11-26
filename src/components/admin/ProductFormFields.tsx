import { FileText, Tag, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface Product {
    id?: string;
    title?: string;
    price?: number;
    originalPrice?: number;
    category?: string;
    brand?: string;
    sku?: string;
    rating?: number;
    totalReviews?: number;
    image?: string;
    features?: string[];
    assured?: boolean;
}

interface ProductFormFieldsProps {
    product: Product;
    setProduct: (product: Product) => void;
    description: string;
    setDescription: (desc: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
}

export default function ProductFormFields({ product, setProduct, description, setDescription, tags, setTags }: ProductFormFieldsProps) {
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
                <input
                    type="text"
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                    type="text"
                    value={product.sku || ""}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
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
