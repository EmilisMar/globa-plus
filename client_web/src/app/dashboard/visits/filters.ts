import { AlarmClock } from "lucide-react";
import { FilterConfig } from "@/types/data-table";

export const filterConfig: FilterConfig[] = [
    {
      columnId: "timeFrom",
      title: "Laikas",
      icon: AlarmClock,
      options: [
        { label: "Siandien", value: "today" },
        { label: "Vakar", value: "yesterday" },
        { label: "Šiandien ir vakar", value: "todayAndYesterday" },
      ]
    },
]