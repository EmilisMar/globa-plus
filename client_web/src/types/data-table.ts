import { LucideIcon } from "lucide-react";

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type FilterConfig = {
  columnId: string;
  title: string;
  icon: LucideIcon;
  options: {
    label: string;
    value: string;
  }[];
  selectedValues?: string[];
} 

export interface Visit {
  pid: string
  recipientName: string
  recipient: string
  worker: string
  timeFrom: string
  timeTo: string
  status: 'NOT_STARTED' | 'STARTED' | 'SERVICE_COMPLETED' | 'PAUSED' | 'ENDED' | 'APPROVED' | 'CANCELLED' | 'PROVIDER_ADD_TIME' | 'SERVICE_UNCHECK'
  // ... other fields
} 