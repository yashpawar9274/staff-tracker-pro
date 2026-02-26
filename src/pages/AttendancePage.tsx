import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check, X, Clock, Palmtree } from "lucide-react";
import { getStaff, getAttendance, setAttendanceRecord, type Staff, type AttendanceRecord } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_CONFIG = {
  present: { label: "P", color: "bg-success text-success-foreground", icon: Check },
  absent: { label: "A", color: "bg-destructive text-destructive-foreground", icon: X },
  "half-day": { label: "H", color: "bg-warning text-warning-foreground", icon: Clock },
  leave: { label: "L", color: "bg-info text-info-foreground", icon: Palmtree },
} as const;

type Status = keyof typeof STATUS_CONFIG;

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffList] = useState<Staff[]>(getStaff());
  const [records, setRecords] = useState<AttendanceRecord[]>(getAttendance());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(staffList[0]?.id || null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getRecord = (staffId: string, day: number): Status | null => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rec = records.find(r => r.staffId === staffId && r.date === date);
    return rec?.status as Status || null;
  };

  const cycleStatus = (staffId: string, day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const current = getRecord(staffId, day);
    const order: Status[] = ['present', 'absent', 'half-day', 'leave'];
    const nextIdx = current ? (order.indexOf(current) + 1) % order.length : 0;
    const next = order[nextIdx];
    setAttendanceRecord({ staffId, date, status: next });
    setRecords(getAttendance());
    toast.success(`${next.charAt(0).toUpperCase() + next.slice(1)} marked`);
  };

  const markAllPresent = () => {
    if (!selectedStaff) return;
    const today = new Date();
    const day = today.getDate();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setAttendanceRecord({ staffId: selectedStaff, date, status: 'present' });
    setRecords(getAttendance());
    toast.success("Marked present for today");
  };

  const staff = selectedStaff ? staffList.find(s => s.id === selectedStaff) : null;

  const summary = useMemo(() => {
    if (!selectedStaff) return null;
    const staffRecords = records.filter(r => {
      const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      return r.staffId === selectedStaff && r.date.startsWith(prefix);
    });
    return {
      present: staffRecords.filter(r => r.status === 'present').length,
      absent: staffRecords.filter(r => r.status === 'absent').length,
      halfDay: staffRecords.filter(r => r.status === 'half-day').length,
      leave: staffRecords.filter(r => r.status === 'leave').length,
    };
  }, [selectedStaff, records, year, month]);

  if (staffList.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Mark daily attendance for your staff</p>
        </div>
        <div className="stat-card text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-heading font-semibold mb-1">No Staff Added</h3>
          <p className="text-sm text-muted-foreground">Add staff members first to mark attendance</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Tap on a date to cycle: Present → Absent → Half Day → Leave</p>
      </div>

      {/* Staff selector */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {staffList.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedStaff(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStaff === s.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border hover:bg-muted'
            }`}
          >
            <span className="text-lg">{s.avatar}</span>
            {s.name}
          </button>
        ))}
      </div>

      {selectedStaff && staff && (
        <>
          {/* Month navigation */}
          <div className="stat-card mb-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading font-semibold">{monthName}</h2>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
              {/* Offset for first day */}
              {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => {
                const status = getRecord(selectedStaff, day);
                const config = status ? STATUS_CONFIG[status] : null;
                const isToday = new Date().toISOString().slice(0, 10) === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                return (
                  <button
                    key={day}
                    onClick={() => cycleStatus(selectedStaff, day)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all border ${
                      config ? config.color : 'bg-muted/50 hover:bg-muted'
                    } ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  >
                    <span className="text-[11px] opacity-70">{day}</span>
                    {config && <span className="text-xs font-bold">{config.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="grid grid-cols-4 gap-3">
              {([
                { label: 'Present', value: summary.present, status: 'present' as Status },
                { label: 'Absent', value: summary.absent, status: 'absent' as Status },
                { label: 'Half Day', value: summary.halfDay, status: 'half-day' as Status },
                { label: 'Leave', value: summary.leave, status: 'leave' as Status },
              ]).map(item => (
                <div key={item.label} className="stat-card text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${STATUS_CONFIG[item.status].color}`}>
                    {item.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
