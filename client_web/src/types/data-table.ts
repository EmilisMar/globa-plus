export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type FilterConfig = {
  columnId: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
} 