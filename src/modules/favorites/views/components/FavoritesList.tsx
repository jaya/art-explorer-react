'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useFavoriteStore } from '~/modules/favorites/store/favorite'
import { containerVariants, itemVariants } from '~/shared/animations/stagger'
import { ArtworkCard } from '~/shared/components/ArtworkCard'

export function FavoritesList() {
  const favorites = useFavoriteStore((state) => state.favorites)

  return (
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-24">
        <h2 className="text-center font-serif text-7xl text-foreground after:mx-auto after:mt-4 after:block after:h-0.5 after:w-2/5 after:bg-primary">
          Favorites
        </h2>
        {favorites.length === 0 ? (
          <p className="text-center text-2xl text-muted-foreground">
            This place is so empty, please add some artworks to your favorites!
          </p>
        ) : (
          <motion.div
            animate="visible"
            className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3"
            data-testid="favorites-list"
            initial="hidden"
            variants={containerVariants}>
            <AnimatePresence mode="popLayout">
              {favorites.map((favorite) => (
                <motion.div
                  className="flex"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  key={favorite.objectID}
                  layout
                  variants={itemVariants}>
                  <ArtworkCard artwork={favorite} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
