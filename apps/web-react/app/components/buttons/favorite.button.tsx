'use client'

import { Heart, HeartOff } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '~/components/ui/button'
import { useFavorites } from '~/hooks/use-favorites'

type Props = {
  artworkId: number
}

export const FavoriteButton = ({ artworkId }: Props) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const toggleFavorite = () => {
    if (isFavorite(artworkId)) {
      removeFavorite(artworkId)
    } else {
      addFavorite(artworkId)
    }
  }

  return (
    <motion.div whileTap={{ scale: 0.8 }}>
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={toggleFavorite}
      >
        {isFavorite(artworkId) ? (
          <HeartOff className="text-red-500 size-5" />
        ) : (
          <Heart className="size-5" />
        )}
      </Button>
    </motion.div>
  )
}
