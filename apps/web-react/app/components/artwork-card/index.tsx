import { ARTWORKS_DETAILS_KEY_QUERY } from '@/constants/gallery.constant'
import { ArtworkService } from '@/services/artworks'
import type { ArtworkItem } from '@art-explorer/core'
import { useQuery } from '@tanstack/react-query'
import { Expand } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { FavoriteButton } from '~/components/buttons/favorite.button'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

type Props = {
  artwork: ArtworkItem
}

export function ArtworkCard({ artwork }: Props) {
  const [open, setOpen] = useState(false)

  const { data, error, refetch } = useQuery({
    queryKey: [ARTWORKS_DETAILS_KEY_QUERY, artwork.objectID, open],
    queryFn: () => {
      if (open) {
        return ArtworkService.getById(artwork.objectID)
      }
      return Promise.resolve(undefined)
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  })

  return (
    <Card className="w-[300px] min-h-[200px] mx-auto flex justify-between flex-col rounded-2xl shadow-md bg-muted hover:shadow-lg transition-shadow">
      <CardContent className="flex flex-col p-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="relative w-full h-[220px]">
            <img
              src={artwork.primaryImage}
              alt={artwork.title}
              loading="lazy"
              decoding="async"
              className="object-contain absolute w-full h-full"
            />
          </div>
        </motion.div>
        <p className="text-sm md:text-base font-medium text-center line-clamp-1">
          {artwork.title}
        </p>
      </CardContent>
      <CardFooter className="flex flex-row items-center p-2">
        <FavoriteButton artworkId={artwork.objectID} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <motion.div whileTap={{ scale: 0.8 }}>
              <Button
                variant="ghost"
                className="cursor-pointer"
                aria-label="expand dialog"
              >
                <Expand className="size-5" />
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <DialogHeader>
                <DialogTitle>{artwork.title}</DialogTitle>
                {data && (
                  <DialogDescription>
                    {`${data.artistDisplayName} • ${data.objectDate}`}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {error && (
                  <Button onClick={() => refetch()}>Try loading again</Button>
                )}
                {!error && data && (
                  <img
                    src={data.primaryImage || data.primaryImageSmall}
                    alt={artwork.title}
                    loading="lazy"
                    className="w-full max-h-[50vh] object-contain rounded"
                  />
                )}
                {data && (
                  <div className="flex flex-col gap-2">
                    <p>
                      <strong>Medium:</strong> {data.medium || 'N/A'}
                    </p>
                    <p>
                      <strong>Department:</strong> {data.department}
                    </p>
                    <a
                      href={data.objectURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      See on official site
                    </a>
                    <div className="flex w-full justify-end">
                      <FavoriteButton artworkId={artwork.objectID} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
