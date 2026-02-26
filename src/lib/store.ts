export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string;
  perDaySalary: number;
  joinDate: string;
  avatar: string;
}

export interface AttendanceRecord {
  staffId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

const STAFF_KEY = 'attendance_app_staff';
const ATTENDANCE_KEY = 'attendance_app_records';

export function getStaff(): Staff[] {
  const data = localStorage.getItem(STAFF_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStaff(staff: Staff[]) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function addStaff(staff: Staff) {
  const all = getStaff();
  all.push(staff);
  saveStaff(all);
}

export function updateStaff(staff: Staff) {
  const all = getStaff().map(s => s.id === staff.id ? staff : s);
  saveStaff(all);
}

export function deleteStaff(id: string) {
  saveStaff(getStaff().filter(s => s.id !== id));
  // Also remove attendance records
  const records = getAttendance().filter(r => r.staffId !== id);
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function getAttendance(): AttendanceRecord[] {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
}

export function setAttendanceRecord(record: AttendanceRecord) {
  const all = getAttendance().filter(
    r => !(r.staffId === record.staffId && r.date === record.date)
  );
  all.push(record);
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
}

export function getStaffAttendanceForMonth(staffId: string, year: number, month: number): AttendanceRecord[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return getAttendance().filter(r => r.staffId === staffId && r.date.startsWith(prefix));
}

export function calculateSalary(staffId: string, year: number, month: number) {
  const staff = getStaff().find(s => s.id === staffId);
  if (!staff) return null;
  const records = getStaffAttendanceForMonth(staffId, year, month);
  const presentDays = records.filter(r => r.status === 'present').length;
  const halfDays = records.filter(r => r.status === 'half-day').length;
  const absentDays = records.filter(r => r.status === 'absent').length;
  const leaveDays = records.filter(r => r.status === 'leave').length;
  const effectiveDays = presentDays + halfDays * 0.5;
  const totalSalary = effectiveDays * staff.perDaySalary;

  return {
    staff,
    presentDays,
    halfDays,
    absentDays,
    leaveDays,
    effectiveDays,
    totalSalary,
    perDaySalary: staff.perDaySalary,
  };
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const AVATARS = [
  '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍💻', '👩‍💻', '👨‍🏫', '👩‍🏫',
  '👨‍🍳', '👩‍🍳', '👷‍♂️', '👷‍♀️'
];

export function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
