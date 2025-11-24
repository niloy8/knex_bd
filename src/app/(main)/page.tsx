import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Banner from "@/components/Banner";
import SectionHeader from "@/components/SectionHeader";

export default function HomePage() {
    const banners = [
        { title: "Office Chairs", subtitle: "Green Soul, Cell Bell & more", price: "From Tk 2,999", bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600", image: "🪑" },
        { title: "Gaming Laptops", subtitle: "ASUS, MSI & more", price: "From Tk 49,999", bgColor: "bg-gradient-to-r from-purple-600 to-pink-600", image: "💻" },
        { title: "Smart Watches", subtitle: "Apple, Samsung & more", price: "From Tk 1,999", bgColor: "bg-gradient-to-r from-green-600 to-teal-600", image: "⌚" },
    ];

    const categories = [
        { name: "Fashion", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Faison-removebg-preview.png", href: "/category/mobiles" },
        { name: "Beauty", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Beauty-2-1-removebg-preview-1.png", href: "/category/fashion" },
        { name: "Mobiles", icon: "https://knex.com.bd/wp-content/uploads/2025/11/mobiles-2-removebg-preview.png", href: "/category/electronics" },
        { name: "Smart Gadget", icon: "https://knex.com.bd/wp-content/uploads/2025/11/smart-gadget-removebg-preview.png", href: "/category/home" },
        { name: "Electronics", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Home-2-removebg-preview.png", href: "/category/appliances" },
        { name: "Home & Furniture", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png", href: "/category/beauty" },
        { name: "Stone", icon: "https://knex.com.bd/wp-content/uploads/2025/11/ChatGPT-Image-Nov-2-2025-02_17_01-PM-removebg-preview.png", href: "/flights", badge: "NEW" },

    ]; const fashionDeals = [
        { title: "Sports Shoes", price: "Min. 70% Off", image: "👟", href: "/products?category=sports-shoes" },
        { title: "Slippers", price: "Min. 70% Off", image: "🩴", href: "/products?category=slippers" },
        { title: "Smart Watch", price: "From Tk 999", image: "⌚", href: "/products?category=smart-watch" },
        { title: "Backpacks", price: "Min. 60% Off", image: "🎒", href: "/products?category=backpacks" },
    ];

    const topDeals = [
        { title: "Projectors", price: "From Tk 6990", image: "📽️", href: "/products?category=projectors" },
        { title: "Speakers", price: "From Tk 499", image: "🔊", href: "/products?category=speakers" },
        { title: "Gaming Monitor", price: "From Tk 6599", image: "🖥️", href: "/products?category=gaming-monitor" },
        { title: "Gaming Chair", price: "From Tk 8279", image: "🪑", href: "/products?category=gaming-chair" },
    ];

    const saleDeals = [
        { title: "Winter Accessories", price: "Min. 50% Off", image: "🧤", href: "/products?category=winter" },
        { title: "Dry Fruits", price: "Min. 50% Off", image: "🥜", href: "/products?category=dry-fruits" },
        { title: "Baby Care", price: "Up to 40% Off", image: "🍼", href: "/products?category=baby-care" },
        { title: "Bike Lights", price: "From Tk 299", image: "💡", href: "/products?category=bike-lights" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Categories */}
            <section className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-3">
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.name} {...category} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Banner */}
                <Banner banners={banners} autoSlide={true} interval={5000} />                {/* Fashion Top Deals */}
                <section>
                    <SectionHeader title="Fashion's Top Deals" href="/deals/fashion" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {fashionDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>

                {/* Top Deals */}
                <section>
                    <SectionHeader title="Top Deals" href="/deals" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {topDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>

                {/* Top picks of the sale */}
                <section>
                    <SectionHeader title="Top picks of the sale" href="/sale" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {saleDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>

                {/* Flight Bookings Banner */}
                <Banner banners={[{ title: "Flight bookings", subtitle: "Lowest fares guaranteed", price: "From Tk 1,499*", bgColor: "bg-gradient-to-r from-orange-500 to-yellow-500", image: "✈️" }]} autoSlide={false} />


            </div>
        </div>
    );
}