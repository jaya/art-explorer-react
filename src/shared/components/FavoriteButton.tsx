'use client'

import { HeartMinus, HeartPlus } from 'lucide-react'
import { motion, useAnimationControls } from 'motion/react'

import type { Artwork } from '~/modules/artworks/types'
import { useFavorites } from '~/modules/favorites/hooks/useFavorites'
import { useFavoriteStore } from '~/modules/favorites/store/favorite'

interface FavoriteButtonProps {
  artwork: Artwork
}

export function FavoriteButton({ artwork }: FavoriteButtonProps) {
  const isFavorite = useFavoriteStore((state) => state.isFavorite(artwork))
  const addFavorite = useFavoriteStore((state) => state.addFavorite)
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite)

  const controls = useAnimationControls()

  const { isReady } = useFavorites()

  const handleClick = () => {
    if (isFavorite) {
      removeFavorite(artwork)
    } else {
      addFavorite(artwork)
    }
  }

  const handleTap = async () => {
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
      className="cursor-pointer rounded-full bg-white p-2 text-black shadow-md transition-colors duration-300 hover:bg-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2.5]"
      disabled={!isReady}
      onClick={handleClick}
      onTap={handleTap}
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
