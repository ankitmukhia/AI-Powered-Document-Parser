import { FileUploader } from '@/components/file-uploader'

export default function Home() {
	return (
		<div className="min-h-svh max-w-xl mx-auto">
			<div className="flex flex-col h-screen items-center justify-center">
				<FileUploader />
			</div>
		</div>
	);
}
