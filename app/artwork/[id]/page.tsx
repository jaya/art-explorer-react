import { ArtworkDetail } from "@/components/artwork-detail";

interface ArtworkPageProps {
  params: {
    id: string;
  };
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  const objectID = parseInt(params.id);

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
