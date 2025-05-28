import { DetailsView } from '~/modules/details/views'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <DetailsView id={id} />
}
