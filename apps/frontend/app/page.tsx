import { redirect } from 'next/navigation'

export default async function Home() {
	redirect("/editor")

	return (
		<div className="max-w-xl mx-auto">
		</div>
	);
}
