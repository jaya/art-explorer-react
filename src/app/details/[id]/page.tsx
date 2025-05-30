import type { Metadata } from 'next'

import { DetailsView } from '~/modules/details/views'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Details | Art Explorer',
  description: 'Details of the artwork',
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <DetailsView id={id} />
}
