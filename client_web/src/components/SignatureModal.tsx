import { useT } from "@/utils/i18n.util";
import { createRef } from "react";
import SignaturePad from "react-signature-pad-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export default function SignatureDialog({ onSubmit }: { onSubmit: (signature: string) => Promise<void> }) {
	const ref = createRef<SignaturePad>();
	const t = useT();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full bg-[#0FAA43] text-white" size="lg">
					Baigti
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t('addSignature')}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="border border-gray-200 rounded-lg bg-white">
						<SignaturePad 
							ref={ref}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Button 
							onClick={() => ref.current && onSubmit(ref.current.toDataURL())}
							className="w-full bg-primary text-white"
						>
							{t('addSignatureSave')}
						</Button>
						<Button
							onClick={() => ref.current && ref.current.clear()}
							variant="outline"
						>
							{t('addSignatureClear')}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};