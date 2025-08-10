import { ArtworkDetail } from "@/components/Artwork/Detail/ArtworkDetail";

interface ArtworkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = await params;
  const objectID = parseInt(id);

  if (isNaN(objectID)) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Invalid Artwork ID</h1>
        <p className="text-gray-600 mt-2">
          The artwork ID provided is not valid.
        </p>
      </div>
    );
  }

  return <ArtworkDetail objectID={objectID} />;
}
