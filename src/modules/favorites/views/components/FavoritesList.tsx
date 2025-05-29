'use client'

import { useFavoriteStore } from '~/modules/favorites/store/favorite'
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
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <ArtworkCard
                artwork={favorite}
                key={favorite.objectID}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
