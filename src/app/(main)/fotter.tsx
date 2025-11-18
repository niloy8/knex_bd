import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">ABOUT</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                            <li><Link href="/press" className="hover:text-white">Press</Link></li>
                            <li><Link href="/corporate" className="hover:text-white">Corporate Information</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">HELP</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/payments" className="hover:text-white">Payments</Link></li>
                            <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
                            <li><Link href="/returns" className="hover:text-white">Returns & Refunds</Link></li>
                            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Policy */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">POLICY</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
                            <li><Link href="/security" className="hover:text-white">Security</Link></li>
                            <li><Link href="/sitemap" className="hover:text-white">Sitemap</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">SOCIAL</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white">Facebook</Link></li>
                            <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-white">Instagram</Link></li>
                            <li><Link href="#" className="hover:text-white">YouTube</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="text-2xl font-bold text-white">KNEX<span className="text-sm">.BD</span></span>
                    </div>
                    <div className="text-gray-400">
                        © 2025 KNEX.BD. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
