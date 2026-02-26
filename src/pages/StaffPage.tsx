import { useState } from "react";
import { Plus, Pencil, Trash2, Phone, X } from "lucide-react";
import { getStaff, addStaff, updateStaff, deleteStaff, generateId, randomAvatar, type Staff } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>(getStaff());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', role: '', perDaySalary: '' });

  const refresh = () => setStaffList(getStaff());

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', phone: '', role: '', perDaySalary: '' });
    setDialogOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ name: s.name, phone: s.phone, role: s.role, perDaySalary: String(s.perDaySalary) });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.perDaySalary) {
      toast.error("Name and salary are required");
      return;
    }
    if (editing) {
      updateStaff({ ...editing, ...form, perDaySalary: Number(form.perDaySalary) });
      toast.success("Staff updated");
    } else {
      addStaff({
        id: generateId(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        perDaySalary: Number(form.perDaySalary),
        joinDate: new Date().toISOString().slice(0, 10),
        avatar: randomAvatar(),
      });
      toast.success("Staff added");
    }
    setDialogOpen(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this staff member?")) {
      deleteStaff(id);
      toast.success("Staff deleted");
      refresh();
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Staff Profiles</h1>
          <p className="page-subtitle">Manage your team members and salary details</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Staff
        </Button>
      </div>

      {staffList.length === 0 ? (
        <div className="stat-card text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-heading font-semibold mb-1">No Staff Members</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first team member to get started</p>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Staff
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(s => (
            <div key={s.id} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">{s.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.role || 'Staff'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {s.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Phone className="w-3.5 h-3.5" /> {s.phone}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-muted-foreground">Per Day Salary</span>
                <span className="font-heading font-bold text-primary">₹{s.perDaySalary}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone" />
            </div>
            <div>
              <Label>Role / Position</Label>
              <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Manager, Driver" />
            </div>
            <div>
              <Label>Per Day Salary (₹) *</Label>
              <Input type="number" value={form.perDaySalary} onChange={e => setForm({ ...form, perDaySalary: e.target.value })} placeholder="e.g. 500" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Add Staff'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
