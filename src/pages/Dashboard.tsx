import { Users, CalendarCheck, Wallet, TrendingUp } from "lucide-react";
import { getStaff, getAttendance } from "@/lib/store";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const staff = getStaff();
  const attendance = getAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter(r => r.date === today);
  const presentToday = todayRecords.filter(r => r.status === 'present' || r.status === 'half-day').length;

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthRecords = attendance.filter(r => r.date.startsWith(monthPrefix));
  const totalPresent = monthRecords.filter(r => r.status === 'present').length;
  const totalHalf = monthRecords.filter(r => r.status === 'half-day').length;

  const stats = [
    { label: "Total Staff", value: staff.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Present Today", value: presentToday, icon: CalendarCheck, color: "bg-success/10 text-success" },
    { label: "This Month Present", value: totalPresent + totalHalf, icon: TrendingUp, color: "bg-info/10 text-info" },
    { label: "Avg Daily Salary", value: staff.length ? `₹${Math.round(staff.reduce((a, s) => a + s.perDaySalary, 0) / staff.length)}` : '₹0', icon: Wallet, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your staff attendance and salary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-heading">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/staff" className="stat-card group cursor-pointer border-dashed hover:border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Manage Staff</p>
              <p className="text-xs text-muted-foreground">Add or edit staff profiles</p>
            </div>
          </div>
        </Link>
        <Link to="/attendance" className="stat-card group cursor-pointer border-dashed hover:border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Mark Attendance</p>
              <p className="text-xs text-muted-foreground">Record daily attendance</p>
            </div>
          </div>
        </Link>
        <Link to="/salary" className="stat-card group cursor-pointer border-dashed hover:border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">View Salary</p>
              <p className="text-xs text-muted-foreground">Generate salary reports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent staff */}
      {staff.length > 0 && (
        <div className="stat-card">
          <h2 className="font-heading font-semibold mb-4">Staff Directory</h2>
          <div className="space-y-3">
            {staff.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <span className="text-sm font-semibold text-primary">₹{s.perDaySalary}/day</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {staff.length === 0 && (
        <div className="stat-card text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-heading font-semibold mb-1">No Staff Added Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start by adding your staff members</p>
          <Link to="/staff" className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Add Staff
          </Link>
        </div>
      )}
    </div>
  );
}
