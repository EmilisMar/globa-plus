import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
	return (
		<div className="flex flex-1 flex-col justify-center items-center">
			<Loader2 className="animate-spin size-10 text-primary" />
		</div>
	)
}
