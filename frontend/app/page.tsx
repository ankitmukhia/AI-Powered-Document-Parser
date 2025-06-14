import { redirect } from 'next/navigation'
import { RootMarginVisualizer } from '@/components/example'
export default async function Home() {

	return (
		<div className="max-w-xl mx-auto">
			<RootMarginVisualizer />
		</div>
	);
}
