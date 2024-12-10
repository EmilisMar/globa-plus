import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function Header({ title, children }: { title: string; children?: React.ReactNode }) {
	return (
		<header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />
			<div className="flex w-full items-center justify-between gap-2">
				<div className="text-lg">{title}</div>
				<div>{children}</div>
			</div>
		</header>
	)
}
