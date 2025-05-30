'use client'

import { HeartMinus, HeartPlus } from 'lucide-react'
import { motion, useAnimationControls } from 'motion/react'
import { toast } from 'sonner'

import { useFavoriteStore } from '~/modules/favorites/store/favorite'
import { useClient } from '~/shared/hooks/useClient'
import type { Artwork } from '~/shared/types'

interface FavoriteButtonProps {
  artwork: Artwork
}

export function FavoriteButton({ artwork }: FavoriteButtonProps) {
  const isFavorite = useFavoriteStore((state) => state.isFavorite(artwork))
  const addFavorite = useFavoriteStore((state) => state.addFavorite)
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite)

  const controls = useAnimationControls()

  const { isReady } = useClient()

  const handleClick = async () => {
    if (isFavorite) {
      toast.warning('Artwork removed from favorites')
      removeFavorite(artwork)
    } else {
      toast.success('Artwork added to favorites!')
      addFavorite(artwork)
    }

    await controls.start({
      scale: [0.8, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
        type: 'spring',
        stiffness: 500,
        damping: 15,
      },
    })
  }

  if (!isReady) return null

  return (
    <motion.button
      className="cursor-pointer rounded-full bg-white p-2 text-primary-foreground shadow-md transition-colors duration-300 hover:bg-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2.5]"
      disabled={!isReady}
      onClick={handleClick}
      type="button">
      <span className="sr-only">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
      <motion.div
        animate={controls}
        className="flex items-center justify-center">
        {isFavorite ? <HeartMinus /> : <HeartPlus />}
      </motion.div>
    </motion.button>
  )
}
