import { useState } from "react";
import { Pencil, Trash2, Phone } from "lucide-react";
import { type Staff } from "@/lib/store";
import { useSwipeable } from "@/hooks/use-swipeable";

interface SwipeableStaffCardProps {
  staff: Staff;
  onEdit: (s: Staff) => void;
  onDelete: (id: string) => void;
}

export default function SwipeableStaffCard({ staff, onEdit, onDelete }: SwipeableStaffCardProps) {
  const [deleted, setDeleted] = useState(false);

  const { offsetX, isSwiping, resetSwipe, handlers } = useSwipeable({
    onSwipeLeft: () => {
      // Delete action
      setTimeout(() => {
        onDelete(staff.id);
      }, 200);
    },
    onSwipeRight: () => {
      // Edit action
      setTimeout(() => {
        onEdit(staff);
        resetSwipe();
      }, 200);
    },
    threshold: 70,
    maxSwipe: 100,
  });

  const leftProgress = Math.min(Math.max(offsetX / 100, 0), 1); // right swipe = edit
  const rightProgress = Math.min(Math.max(-offsetX / 100, 0), 1); // left swipe = delete

  return (
    <div className="relative overflow-hidden rounded-2xl" {...handlers}>
      {/* Background actions revealed on swipe */}
      {/* Right swipe: Edit (green) */}
      <div
        className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 rounded-2xl bg-primary"
        style={{ opacity: leftProgress, width: `${Math.max(offsetX, 0)}px` }}
      >
        <div className="flex flex-col items-center gap-1 text-primary-foreground">
          <Pencil className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Edit</span>
        </div>
      </div>

      {/* Left swipe: Delete (red) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 rounded-2xl bg-destructive"
        style={{ opacity: rightProgress, width: `${Math.max(-offsetX, 0)}px` }}
      >
        <div className="flex flex-col items-center gap-1 text-destructive-foreground">
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Delete</span>
        </div>
      </div>

      {/* Card content */}
      <div
        className={`stat-card relative z-10 ${isSwiping ? '' : 'transition-transform duration-300'}`}
        style={{ transform: `translateX(${offsetX}px)` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">{staff.avatar}</div>
            <div>
              <h3 className="font-semibold text-sm">{staff.name}</h3>
              <p className="text-xs text-muted-foreground">{staff.role || 'Staff'}</p>
            </div>
          </div>
          {/* Desktop-only action buttons */}
          <div className="hidden md:flex gap-1">
            <button onClick={() => onEdit(staff)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(staff.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {staff.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Phone className="w-3.5 h-3.5" /> {staff.phone}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-muted-foreground">Per Day Salary</span>
          <span className="font-heading font-bold text-primary">₹{staff.perDaySalary}</span>
        </div>
      </div>
    </div>
  );
}
