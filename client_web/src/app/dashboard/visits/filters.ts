import { AlarmClock, ChartNoAxesColumnIncreasing, UserRound, UsersRound } from "lucide-react";
import { FilterConfig, Visit } from "@/types/data-table";

export const getFilterConfig = (
  isWorker: boolean, 
  visits: Visit[], 
  selectedValues?: Record<string, string[]>
): FilterConfig[] => {
  const baseFilters: FilterConfig[] = [
    {
      columnId: "timeFrom",
      title: "Laiką",
      icon: AlarmClock,
      options: [
        { label: "Šiandien", value: "2024-11-05" },
        { label: "Vakar", value: "yesterday" },
        { label: "Šiandien ir vakar", value: "todayAndYesterday" },
      ],
      selectedValues: selectedValues?.timeFrom || []
    },
  ];

  if (isWorker) {
    return baseFilters;
  }

  const uniqueWorkers = [...new Set(visits.map(visit => visit.worker))];
  const uniqueRecipients = [...new Set(visits.map(visit => visit.recipient))];

  return [
    ...baseFilters,
    {
      columnId: "status",
      title: "Statusą",
      icon: ChartNoAxesColumnIncreasing,
      options: [
        { label: "Laukiama", value: "pending" },
        { label: "Vykdoma", value: "in_progress" },
        { label: "Užbaigta", value: "completed" },
        { label: "Atšaukta", value: "cancelled" },
      ],
      selectedValues: selectedValues?.status || []
    },
    {
      columnId: "worker",
      title: "Darbuotoją",
      icon: UserRound,
      options: uniqueWorkers.map(worker => ({
        label: worker,
        value: worker,
      })),
      selectedValues: selectedValues?.worker || []
    },
    {
      columnId: "recipient",
      title: "Paslaugos gavėją",
      icon: UsersRound,
      options: uniqueRecipients.map(recipient => ({
        label: recipient,
        value: recipient,
      })),
      selectedValues: selectedValues?.recipient || []
    },
  ];
};