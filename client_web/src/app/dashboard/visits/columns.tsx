import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Clock, Circle, TimerOff, CircleCheckBig } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useT } from "@/utils/i18n.util"
import { useLocation, useNavigate } from "react-router-dom"
import { useStateUser } from "@/states/user.state"

export interface Visit {
    pid: string
    status: 'NOT_STARTED' | 'STARTED' | 'SERVICE_COMPLETED' | 'PAUSED' | 'ENDED' | 
           'APPROVED' | 'CANCELLED' | 'PROVIDER_ADD_TIME' | 'SERVICE_UNCHECK'
    recipient: string
    timeFrom: string
    timeTo: string
    worker?: string
}

export const getColumns = (isWorker: boolean): ColumnDef<Visit>[] => {
  const baseColumns: ColumnDef<Visit>[] = [
    {
      accessorKey: "recipient",
      header: "Paslaugos gavėjas",
    },
    {
      accessorKey: "timeFrom",
      header: () => <div>Laikas nuo</div>,
      cell: ({ row }) => {
        const date = row.getValue("timeFrom") as string;
        if (!date) return null;
        
        const dateObj = new Date(date);
        return <div>
          {dateObj.toISOString().split('T')[0]}
          <br />
          {dateObj.toLocaleTimeString('lt', { hour: '2-digit', minute: '2-digit' })}
        </div>;
      },
    },
    
    {
      accessorKey: "timeTo",
      header: () => <div>Laikas iki</div>,
      cell: ({ row }) => {
        const date = row.getValue("timeTo") as string;
        if (!date) return null;
        
        const dateObj = new Date(date);
        return <div>
          {dateObj.toISOString().split('T')[0]}
          <br />
          {dateObj.toLocaleTimeString('lt', { hour: '2-digit', minute: '2-digit' })}
        </div>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div>Statusas</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusConfig;
        const t = useT();

        const statusConfig = {
          "NOT_STARTED": {
            color: "bg-[#E8E5E5] text-[#79797A]",
            icon: Circle
          },
          "STARTED": {
            color: "bg-[#D8E8F6] text-[#1E77CA]",
            icon: Clock
          },
          "PAUSED": {
            color: "bg-[#E8E5E5] text-[#626263]",
            icon: TimerOff
          },
          "CANCELLED": {
            color: "bg-[#FFE5E5] text-[#FF0000]",
            icon: TimerOff
          },
          "ENDED": {
            color: "bg-[#E0F6E7] text-[#0FAA43]",
            icon: CircleCheckBig
          },
          "APPROVED": {
            color: "bg-[#E0F6E7] text-[#0FAA43]",
            icon: CircleCheckBig
          },
        } as const;

        const Icon = statusConfig[status]?.icon || Circle;
        const colorClass = statusConfig[status]?.color || "bg-[#E8E5E5] text-[#79797A]";

        return (
          <div className={`${colorClass} p-2 rounded-md text-center flex items-center justify-center gap-2`}>
            <Icon size={16} />
            {t(`s.${status}` as 's')}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div>Plačiau</div>,
      cell: ({ row }) => {
        const nav = useNavigate();
        const pathname = useLocation().pathname;
        const isWorker = useStateUser((s) => s.user?.role === 'worker');


        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {!isWorker && (
                <DropdownMenuItem>
                  Trinti
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => {
                nav(`${pathname}/${row.original.pid}`)
              }}>
                Redaguoti
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }
  ];

  if (!isWorker) {
    baseColumns.unshift({
      accessorKey: "worker",
      header: "Darbuotojas",
    });
  }

  return baseColumns;
};