import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-xs">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-lg font-bold text-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 text-white">
                <Store className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>ShopHub</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Neighborhood storefronts, independent makers, and everyday local
              essentials delivered right to your door.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Categories
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  <Link to="/shops?category=Grocery" className="hover:text-emerald-800">
                    Grocery
                  </Link>
                </li>
                <li>
                  <Link to="/shops?category=Fashion" className="hover:text-emerald-800">
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link to="/shops?category=Electronics" className="hover:text-emerald-800">
                    Electronics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                More Shops
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  <Link to="/shops?category=Home" className="hover:text-emerald-800">
                    Home & Living
                  </Link>
                </li>
                <li>
                  <Link to="/shops?category=Beauty" className="hover:text-emerald-800">
                    Beauty
                  </Link>
                </li>
                <li>
                  <Link to="/shops?category=Books" className="hover:text-emerald-800">
                    Books
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Account
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  <Link to="/orders" className="hover:text-emerald-800">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-emerald-800">
                    Saved Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-emerald-800">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-zinc-100 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ShopHub Local Marketplace. All rights reserved.</p>
          <p>Prices shown in Indian Rupees (₹)</p>
        </div>
      </div>
    </footer>
  );
}
