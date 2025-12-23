"use client";

import Link from "next/link";
import { Bell, Search, ChevronRight } from "lucide-react";

interface HeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function Header({ title, description, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    {item.href ? (
                      <Link href={item.href} className="text-gray-500 hover:text-gray-700">{item.label}</Link>
                    ) : (
                      <span className="text-gray-800 font-medium">{item.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {!breadcrumbs && title && (
              <div>
                <h1 className="text-xl font-display font-semibold text-gray-800">{title}</h1>
                {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100"><Search className="w-5 h-5 text-gray-500" /></button>
            <button className="relative p-2 rounded-xl hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-zencall-coral-400 rounded-full" />
            </button>
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
