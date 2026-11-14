import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  ShoppingBag,
  Store,
  User as UserIcon,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/shops?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shops');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
      isActive
        ? 'border-emerald-700 text-emerald-800'
        : 'border-transparent text-zinc-600 hover:text-zinc-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <Store className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>ShopHub</span>
        </Link>

        {/* Zone 2: Nav Links & Desktop Search */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shops" className={navLinkClass}>
              Shops
            </NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>
              Wishlist
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="relative hidden w-full max-w-xs lg:block"
          >
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shops or products..."
              aria-label="Search shops or products"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-emerald-700 focus:bg-white focus:outline-none"
            />
          </form>
        </div>

        {/* Zone 3: Cart & User Actions */}
        <div className="flex items-center gap-2 shrink-0 sm:gap-3">
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${totalItems} items`}
            className="relative flex min-h-[40px] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span className="tabular-nums rounded-md bg-emerald-700 px-1.5 py-0.5 text-xs font-semibold text-white">
              {totalItems}
            </span>
          </Link>

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/orders"
                className="flex min-h-[40px] items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200 whitespace-nowrap shrink-0"
              >
                <UserIcon className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                <span className="max-w-[110px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0 sm:inline-flex"
            >
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} role="search" className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shops or products..."
              aria-label="Search shops or products"
              className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-700 focus:bg-white focus:outline-none"
            />
          </form>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Home
            </Link>
            <Link
              to="/shops"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Shops Directory
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            >
              My Orders
            </Link>
          </nav>

          <div className="mt-3 border-t border-zinc-200 pt-3">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-zinc-900">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="min-h-[44px] rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Sign In / Create Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
