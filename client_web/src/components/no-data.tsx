import { Image } from "@mantine/core";

export default function NoData() {
	return <div className="flex justify-center !-mt-0 w-full h-full">
		<Image 
			src="/no-data.svg" 
			alt="No data" 
			className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto"
		/>
	</div>
}
