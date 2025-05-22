import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import type { Artwork } from "@/types/artwork";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ArtworkCardProps {
  artwork: Artwork;
  onViewDetails: (artwork: Artwork) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onImageCorrupted: (artworkId: number) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  onImageCorrupted,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!artwork.primaryImage || imageError) {
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
    onImageCorrupted(artwork.objectID);
    console.warn(
      `Erro ao carregar imagem para: ${artwork.title} (ID: ${artwork.objectID})`,
      artwork.primaryImage
    );
  };

  return (
    <motion.div
      // layout // Removido para evitar conflito com o layout da grade pai
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden h-full flex flex-col pt-0">
        {" "}
        {/* Adicionado pt-0 */}
        {/* Container da Imagem e Overlays */}
        {/* Alterado para rounded-t-xl para alinhar com o arredondamento do Card (rounded-xl) */}
        <div className="relative overflow-hidden group h-60 rounded-t-xl">
          {" "}
          {/* Alterado para rounded-t-xl */}
          <motion.img
            src={artwork.primaryImage}
            alt={artwork.title}
            // Alterado para rounded-t-xl para a imagem também
            className="w-full h-full object-cover transition-transform duration-300 rounded-t-xl" /* Alterado para rounded-t-xl */
            whileHover={{ scale: 1.15 }}
            onError={handleImageError}
          />
          {/* Department Tag */}
          <div className="absolute top-2 left-2">
            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm capitalize">
              {artwork.department || "Desconhecido"}
            </div>
          </div>
          {/* Overlay com título e artista */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <h3 className="text-lg font-semibold line-clamp-2 text-white">
              {artwork.title || "Título Desconhecido"}
            </h3>
            {artwork.artistDisplayName && (
              <p className="text-xs text-gray-200 line-clamp-1">
                {artwork.artistDisplayName}
              </p>
            )}
          </div>
        </div>
        {/* Conteúdo abaixo da imagem */}
        {/* O p-4 aqui cria um espaço entre a imagem e este conteúdo, o que é esperado. */}
        <CardContent className="p-4 pb-2 flex-grow" data-testid="card-content">
          <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
            <Icon name="calendar" className="h-3 w-3 flex-shrink-0" />
            <span>{artwork.objectDate || "Data Desconhecida"}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1 mt-2">
            <Icon name="building" className="h-3 w-3 flex-shrink-0" />
            <span className="capitalize">
              {artwork.department || "Departamento Desconhecido"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Clicou em Ver Detalhes:", artwork.objectID);
              onViewDetails(artwork);
            }}
            className="gap-1"
          >
            <Icon name="eye" className="h-4 w-4" />
            <span>Detalhes</span>
          </Button>
          <Button
            variant={isFavorite ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleFavorite}
            className="gap-1"
          >
            <Icon
              name="heart"
              className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`}
            />
            <span className="sr-only md:not-sr-only md:inline-block">
              {isFavorite ? "Favorito" : "Favoritar"}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArtworkCard;
