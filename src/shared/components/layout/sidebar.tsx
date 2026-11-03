'use client';

import { LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { navigation } from '@/config/navigation';
import { usePermission } from '@/features/auth/hooks/use-permission';
import { Link, usePathname } from '@/i18n/navigation';
import { useUIStore } from '@/store/ui-store';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const isMobileSidebarOpen = useUIStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebar = useUIStore((state) => state.setMobileSidebar);

  const { canAccess } = usePermission();

  const renderNavigation = () =>
    navigation.map((item) => {
      if (!canAccess(item.permission)) {
        return null;
      }

      const Icon = item.icon;

      const isActive =
        pathname === item.href ||
        (item.href !== '/' && pathname.startsWith(`${item.href}/`));

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileSidebar(false)}
          aria-current={isActive ? 'page' : undefined}
          className={`
            group relative flex min-h-10 items-center gap-3
            rounded-md px-3 text-[13px] font-medium
            transition-colors duration-150
            ${
              isActive
                ? 'bg-[#3B4D45] text-white before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-e-full before:bg-emerald-400'
                : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
            }
          `}
        >
          <Icon
            className={`
              size-[17px] shrink-0 transition-colors
              ${
                isActive
                  ? 'text-emerald-300'
                  : 'text-slate-400 group-hover:text-slate-200'
              }
            `}
          />

          <span className="truncate">{t(item.labelKey)}</span>
        </Link>
      );
    });

  const sidebarContent = (
    <>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.08] px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
          <LayoutDashboard className="size-[17px]" />
        </div>

        <h2 className="truncate text-sm font-semibold tracking-tight text-white">
          Dashboard UI
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        {renderNavigation()}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={
          isSidebarOpen
            ? 'hidden h-svh w-[248px] shrink-0 flex-col bg-[#27332F] text-slate-100 md:sticky md:top-0 md:flex'
            : 'hidden'
        }
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/45 backdrop-blur-[1px] md:hidden"
          />

          <aside className="fixed inset-y-0 start-0 z-50 flex h-svh w-[min(18rem,85vw)] flex-col bg-[#27332F] text-slate-100 shadow-xl md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
