import Link from "next/link";
import { Pizza, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-red-600 text-white p-2 rounded-xl">
                <Pizza className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Pizza<span className="text-red-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Discover top local pizzerias, customize your cravings, and get piping-hot, artisan pizzas delivered straight to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-orange-400 transition-colors">
                  Browse Pizza Menu
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-orange-400 transition-colors">
                  Partner as a Vendor
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-orange-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>1204 Gulshan Avenue, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <span>+880 1700-123456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links (Including New X Logo) */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Follow Our Oven
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Stay updated on weekend pizza deals and new local kitchens.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-red-600 text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-red-600 text-white transition-colors"
              >
                {/* Official New X Logo SVG */}
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-orange-600 text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PizzaHub Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Crafted for Pizza Lovers & Local Kitchens.</p>
        </div>
      </div>
    </footer>
  );
}