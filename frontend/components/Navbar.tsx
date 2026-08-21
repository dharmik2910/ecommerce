'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  IconArmchair,
  IconLayoutGrid,
  IconTable,
  IconShoppingBag,
  IconPackage,
  IconClipboardList,
  IconShoppingCart,
  IconLogout,
  IconLogin,
  IconMenu2,
  IconX,
  IconShieldCheck,
  IconChevronRight,
} from '@tabler/icons-react';
import { toast } from 'sonner';

function NavbarContent() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('categorySlug');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on page route or query change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    toast.info('Logged out successfully');
  };

  const isAllProductsActive = pathname === '/products' && !categorySlug;
  const isTablesActive = pathname === '/products' && categorySlug === 'tables';
  const isBasketsActive = pathname === '/products' && categorySlug === 'baskets';
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-walnut-200/80 bg-linen-50 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 py-3">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-display text-xl sm:text-2xl tracking-tight text-walnut-950 group shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-walnut-900 text-white shadow-2xs group-hover:bg-walnut-800 transition">
            <IconArmchair size={20} stroke={1.5} className="sm:hidden" />
            <IconArmchair size={22} stroke={1.5} className="hidden sm:block" />
          </div>
          <span className="font-bold">Hearthwood</span>
        </Link>

        {/* DESKTOP & TABLET NAV LINKS */}
        <nav className="hidden items-center md:gap-1 lg:gap-2 text-xs lg:text-sm font-medium text-walnut-700 md:flex">
          <Link
            href="/products"
            className={`flex items-center gap-1.5 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 transition ${isAllProductsActive
                ? 'bg-walnut-900 text-white font-semibold shadow-2xs'
                : 'hover:bg-walnut-100/70 hover:text-walnut-950'
              }`}
          >
            <IconLayoutGrid size={16} stroke={1.5} />
            <span>All Products</span>
          </Link>

          <Link
            href="/products?categorySlug=tables"
            className={`flex items-center gap-1.5 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 transition ${isTablesActive
                ? 'bg-walnut-900 text-white font-semibold shadow-2xs'
                : 'hover:bg-walnut-100/70 hover:text-walnut-950'
              }`}
          >
            <IconTable size={16} stroke={1.5} />
            <span>Tables</span>
          </Link>

          <Link
            href="/products?categorySlug=baskets"
            className={`flex items-center gap-1.5 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 transition ${isBasketsActive
                ? 'bg-walnut-900 text-white font-semibold shadow-2xs'
                : 'hover:bg-walnut-100/70 hover:text-walnut-950'
              }`}
          >
            <IconShoppingBag size={16} stroke={1.5} />
            <span>Baskets</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              href="/admin/products"
              className={`flex items-center gap-1.5 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 transition ${pathname.startsWith('/admin')
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300/70 shadow-2xs'
                  : 'text-amber-800 hover:bg-amber-50'
                }`}
            >
              <IconShieldCheck size={16} stroke={1.5} />
              <span><span className="hidden lg:inline">Admin </span>Panel</span>
            </Link>
          )}
        </nav>

        {/* RIGHT CONTROLS & ACTIONS */}
        <div className="flex items-center gap-2 md:gap-1.5 lg:gap-3 text-xs lg:text-sm">

          {/* CART BUTTON */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-lg border border-walnut-200 bg-white px-2.5 lg:px-3 py-1.5 font-medium text-walnut-800 shadow-2xs hover:bg-walnut-50 transition shrink-0"
          >
            <IconShoppingCart size={18} stroke={1.5} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-walnut-900 px-1 text-[11px] font-bold text-white shadow-2xs">
                {itemCount}
              </span>
            )}
          </Link>

          {/* DESKTOP & TABLET USER ACTIONS */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            {user ? (
              <>
                <Link
                  href="/orders"
                  className={`flex items-center gap-1.5 rounded-lg px-2 lg:px-3 py-1.5 font-medium transition ${isActive('/orders')
                      ? 'bg-walnut-900 text-white font-semibold'
                      : 'text-walnut-700 hover:bg-walnut-100/70'
                    }`}
                >
                  <IconPackage size={17} stroke={1.5} />
                  <span>Orders</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-walnut-200 bg-white px-2.5 lg:px-3 py-1.5 font-medium text-walnut-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                >
                  <IconLogout size={17} stroke={1.5} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg bg-walnut-900 px-3 lg:px-4 py-1.5 font-semibold text-white shadow-2xs hover:bg-walnut-800 transition"
              >
                <IconLogin size={17} stroke={1.5} />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-walnut-300 bg-white text-walnut-900 shadow-2xs hover:bg-walnut-50 transition md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* SOLID OPAQUE MOBILE DRAWER OVERLAY WITH BACKDROP */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-50 flex flex-col bg-black/40 backdrop-blur-xs md:hidden animate-fadeIn">
          <div className="w-full bg-linen-50 border-b border-walnut-200 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col p-4 sm:p-5 space-y-3">

              {/* USER PROFILE CARD */}
              {user ? (
                <div className="rounded-xl border border-walnut-200 bg-white p-4 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-walnut-500">Logged in as</p>
                    <p className="text-sm font-bold text-walnut-950 mt-0.5">{user.name || user.email}</p>
                  </div>
                  {user.role === 'admin' ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-300 uppercase">
                      Admin
                    </span>
                  ) : (
                    <span className="rounded-full bg-linen-100 px-3 py-1 text-[11px] font-bold text-walnut-800 border border-linen-200 uppercase">
                      Customer
                    </span>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-walnut-200 bg-white p-4 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-walnut-950">Welcome to Hearthwood</p>
                    <p className="text-xs text-walnut-500">Sign in to manage orders & account</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg bg-walnut-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs"
                  >
                    Sign in
                  </Link>
                </div>
              )}

              {/* ADMIN NAVIGATION LINKS */}
              {user?.role === 'admin' && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 px-1">Admin Dashboard</p>

                  <Link
                    href="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200/90 p-3.5 text-sm font-bold text-amber-950 shadow-2xs hover:bg-amber-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/70 text-amber-900">
                        <IconPackage size={18} />
                      </div>
                      <span>Manage Products</span>
                    </div>
                    <IconChevronRight size={18} className="text-amber-700" />
                  </Link>

                  <Link
                    href="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200/90 p-3.5 text-sm font-bold text-amber-950 shadow-2xs hover:bg-amber-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/70 text-amber-900">
                        <IconClipboardList size={18} />
                      </div>
                      <span>Manage Orders</span>
                    </div>
                    <IconChevronRight size={18} className="text-amber-700" />
                  </Link>
                </div>
              )}

              {/* STORE NAVIGATION LINKS */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-walnut-500 px-1">Store Navigation</p>

                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-sm font-bold shadow-2xs transition ${
                    isAllProductsActive
                      ? 'border-walnut-900 bg-walnut-900 text-white'
                      : 'border-walnut-200/70 bg-white text-walnut-950 hover:bg-walnut-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isAllProductsActive ? 'bg-walnut-800 text-white' : 'bg-linen-100 text-walnut-800'}`}>
                      <IconLayoutGrid size={18} />
                    </div>
                    <span>All Products</span>
                  </div>
                  <IconChevronRight size={18} className={isAllProductsActive ? 'text-white' : 'text-walnut-400'} />
                </Link>

                <Link
                  href="/products?categorySlug=tables"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-sm font-bold shadow-2xs transition ${
                    isTablesActive
                      ? 'border-walnut-900 bg-walnut-900 text-white'
                      : 'border-walnut-200/70 bg-white text-walnut-950 hover:bg-walnut-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isTablesActive ? 'bg-walnut-800 text-white' : 'bg-linen-100 text-walnut-800'}`}>
                      <IconTable size={18} />
                    </div>
                    <span>Tables Collection</span>
                  </div>
                  <IconChevronRight size={18} className={isTablesActive ? 'text-white' : 'text-walnut-400'} />
                </Link>

                <Link
                  href="/products?categorySlug=baskets"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-sm font-bold shadow-2xs transition ${
                    isBasketsActive
                      ? 'border-walnut-900 bg-walnut-900 text-white'
                      : 'border-walnut-200/70 bg-white text-walnut-950 hover:bg-walnut-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isBasketsActive ? 'bg-walnut-800 text-white' : 'bg-linen-100 text-walnut-800'}`}>
                      <IconShoppingBag size={18} />
                    </div>
                    <span>Baskets Collection</span>
                  </div>
                  <IconChevronRight size={18} className={isBasketsActive ? 'text-white' : 'text-walnut-400'} />
                </Link>

                {user && (
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-walnut-200/70 bg-white p-3.5 text-sm font-bold text-walnut-950 shadow-2xs hover:bg-walnut-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linen-100 text-walnut-800">
                        <IconPackage size={18} />
                      </div>
                      <span>My Customer Orders</span>
                    </div>
                    <IconChevronRight size={18} className="text-walnut-400" />
                  </Link>
                )}
              </div>

              {/* LOG OUT BUTTON */}
              {user && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-700 shadow-2xs hover:bg-rose-100 transition"
                  >
                    <IconLogout size={19} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 border-b border-walnut-200/80 bg-linen-50 shadow-xs h-[61px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-walnut-950">
            <div className="h-8 w-8 rounded-xl bg-walnut-900" />
            <span>Hearthwood</span>
          </div>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
