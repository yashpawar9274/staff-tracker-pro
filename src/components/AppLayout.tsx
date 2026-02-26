import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, Wallet, Menu, X, Download, Upload, ArrowLeft, MoreVertical } from "lucide-react";
import { useState, useRef } from "react";
import { exportBackup, importBackup } from "@/lib/backup";
import { toast } from "sonner";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/staff", icon: Users, label: "Staff" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/salary", icon: Wallet, label: "Salary" },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/staff": "Staff",
  "/attendance": "Attendance",
  "/salary": "Salary",
};

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "YP Attendance";

  const handleExport = () => {
    exportBackup();
    toast.success("Backup downloaded");
    setMenuOpen(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importBackup(file);
      toast.success(`Restored ${result.staff} staff & ${result.attendance} records`);
      window.location.reload();
    } catch {
      toast.error("Invalid backup file");
    }
    e.target.value = '';
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="hidden md:flex fixed z-50 top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <img src="/logo.png" alt="YP Attendance" className="w-9 h-9 rounded-lg" />
          <div>
            <h1 className="font-heading text-base font-bold">YP Attendance</h1>
            <p className="text-xs text-sidebar-foreground/60">Staff Manager</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
          <button onClick={handleExport} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full">
            <Download className="w-4 h-4" /> Export Backup
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full">
            <Upload className="w-4 h-4" /> Import Backup
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        <div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">© 2026 Yash Pawar</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Android-style Top App Bar (mobile only) */}
        <div className="md:hidden sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="YP Attendance" className="w-7 h-7 rounded-md" />
              <span className="font-heading font-bold text-lg">{currentTitle}</span>
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 bg-card text-card-foreground rounded-lg shadow-xl border min-w-48 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={handleExport} className="flex items-center gap-3 px-4 py-3 text-sm w-full hover:bg-muted active:bg-muted/80 transition-colors">
                      <Download className="w-4 h-4 text-muted-foreground" /> Export Backup
                    </button>
                    <button onClick={() => { fileRef.current?.click(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm w-full hover:bg-muted active:bg-muted/80 transition-colors">
                      <Upload className="w-4 h-4 text-muted-foreground" /> Import Backup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block p-4 md:p-8 max-w-6xl w-full">
          <Outlet />
        </div>

        {/* Mobile content */}
        <div className="md:hidden flex-1 p-4">
          <Outlet />
        </div>

        {/* Android Bottom Navigation Bar (mobile only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200 min-w-[64px] ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`flex items-center justify-center w-16 h-8 rounded-full transition-all duration-200 ${
                      isActive ? 'bg-primary/12' : ''
                    }`}>
                      <item.icon className={`w-5 h-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                    </div>
                    <span className={`text-[11px] font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          {/* Safe area for phones with gesture bar */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </main>

      <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
    </div>
  );
}
