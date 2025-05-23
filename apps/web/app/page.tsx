import { Gallery } from "@/app/gallery";
import { fetchObjectIDs } from "@/services/artworks";

export const dynamic = "force-dynamic";

export default async function Home() {
	const objectIDs = await fetchObjectIDs();

	// just for now for test
	const limitedIds = objectIDs.slice(0, 1000);
	return (
		<main>
			<h1>Art Explorer - The Met Museum</h1>
			<Gallery objectIds={limitedIds} />
		</main>
	);
}
