import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'lg:ml-[90px]' : 'lg:ml-[290px]'
      }`}>
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setMobileOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
        />

        <main className="flex-1 p-4 md:p-6 mx-auto w-full max-w-(--breakpoint-2xl)">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
