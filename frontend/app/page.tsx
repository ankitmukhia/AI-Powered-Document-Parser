import { redirect } from 'next/navigation'
export default async function Home() {
	if (true) redirect("/editor")

	return (
		<div className="max-w-xl mx-auto">
			Cooking.
		</div>
	);
}
