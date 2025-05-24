import type { Artwork } from '@/models/art'
import { Expand, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
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
  artwork: Artwork
}

export function ArtworkCard({ artwork }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="w-[300px] min-h-[400px] mx-auto flex flex-col justify-between">
      <CardContent className="flex flex-col">
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="relative w-full h-[300px]">
            <img
              src={artwork.primaryImageSmall}
              alt={artwork.title}
              loading="lazy"
              decoding="async"
              className="object-contain absolute w-full h-full"
            />
          </div>
        </motion.div>
        <p className="text-xs font-semibold mt-4 text-center md:line-clamp-1">
          {artwork.title}
        </p>
      </CardContent>
      <CardFooter className="flex flex-row gap-2 justify-between">
        <motion.div whileTap={{ scale: 0.8 }}>
          <Button variant="ghost" className="cursor-pointer">
            <Heart className="size-5" />
          </Button>
        </motion.div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <motion.div whileTap={{ scale: 0.8 }}>
              <Button variant="ghost" className="cursor-pointer">
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
                <DialogDescription>
                  {artwork.artistDisplayName} • {artwork.objectDate}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <img
                  src={artwork.primaryImage || artwork.primaryImageSmall}
                  alt={artwork.title}
                  loading="lazy"
                  className="w-full max-h-[50vh] object-contain rounded"
                />
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Medium:</strong> {artwork.medium || 'N/A'}
                  </p>
                  <p>
                    <strong>Department:</strong> {artwork.department}
                  </p>
                  <a
                    href={artwork.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    See on official site
                  </a>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
