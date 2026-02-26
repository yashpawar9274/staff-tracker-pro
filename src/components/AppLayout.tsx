import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, Wallet, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
{ to: "/", icon: LayoutDashboard, label: "Dashboard" },
{ to: "/staff", icon: Users, label: "Staff" },
{ to: "/attendance", icon: CalendarCheck, label: "Attendance" },
{ to: "/salary", icon: Wallet, label: "Salary" }];


export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen &&
      <div className="fixed inset-0 z-40 bg-foreground/30 md:hidden" onClick={() => setMobileOpen(false)} />
      }

      {/* Sidebar */}
      <aside className={`fixed z-50 top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg">A</div>
          <div>
            <h1 className="font-heading text-base font-bold">AttendEase</h1>
            <p className="text-xs text-sidebar-foreground/60">Staff Manager</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive ?
            'bg-sidebar-accent text-sidebar-primary' :
            'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`

            }>

              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )}
        </nav>
        <div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">© 2026 Yash Pawar

        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b bg-card">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold">YP.Attendace</span>
        </div>
        <div className="p-4 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>);

}