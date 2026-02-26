import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Wallet } from "lucide-react";
import { getStaff, calculateSalary } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function SalaryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const staffList = getStaff();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const salaries = staffList.map(s => calculateSalary(s.id, year, month)).filter(Boolean);

  const totalPayout = salaries.reduce((sum, s) => sum + (s?.totalSalary || 0), 0);

  if (staffList.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Salary Report</h1>
          <p className="page-subtitle">Generate monthly salary based on attendance</p>
        </div>
        <div className="stat-card text-center py-16">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-heading font-semibold mb-1">No Staff Members</h3>
          <p className="text-sm text-muted-foreground">Add staff and mark attendance to generate salary</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Salary Report</h1>
        <p className="page-subtitle">Monthly salary calculated from attendance records</p>
      </div>

      {/* Month navigation */}
      <div className="stat-card mb-6">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-heading font-semibold">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total payout */}
      <div className="stat-card mb-6 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Monthly Payout</p>
            <p className="text-3xl font-heading font-bold mt-1">₹{totalPayout.toLocaleString()}</p>
          </div>
          <Wallet className="w-10 h-10 opacity-40" />
        </div>
      </div>

      {/* Salary cards */}
      <div className="space-y-3">
        {salaries.map(s => {
          if (!s) return null;
          return (
            <div key={s.staff.id} className="stat-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">{s.staff.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{s.staff.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.staff.role || 'Staff'} • ₹{s.perDaySalary}/day</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading font-bold text-primary">₹{s.totalSalary.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Net Salary</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{s.presentDays}</p>
                  <p className="text-[11px] text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">{s.halfDays}</p>
                  <p className="text-[11px] text-muted-foreground">Half Day</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-destructive">{s.absentDays}</p>
                  <p className="text-[11px] text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-info">{s.leaveDays}</p>
                  <p className="text-[11px] text-muted-foreground">Leave</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
