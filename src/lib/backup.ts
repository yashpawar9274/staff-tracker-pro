const STAFF_KEY = 'attendance_app_staff';
const ATTENDANCE_KEY = 'attendance_app_records';

export function exportBackup() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    staff: JSON.parse(localStorage.getItem(STAFF_KEY) || '[]'),
    attendance: JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]'),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendease-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<{ staff: number; attendance: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.staff || !data.attendance) throw new Error('Invalid backup file');
        localStorage.setItem(STAFF_KEY, JSON.stringify(data.staff));
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data.attendance));
        resolve({ staff: data.staff.length, attendance: data.attendance.length });
      } catch {
        reject(new Error('Invalid backup file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
