import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import type { Artwork } from "@/types/artwork";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ArtworkCardProps {
  artwork: Artwork;
  onViewDetails: (artwork: Artwork) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onImageCorrupted: (artworkId: number) => void; // Nova prop
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  onImageCorrupted, // Nova prop
}) => {
  const [imageError, setImageError] = useState(false);

  // Se não houver URL de imagem primária, não há o que renderizar
  // Ou se já detectamos um erro ao carregar a imagem.
  if (!artwork.primaryImage || imageError) {
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
    onImageCorrupted(artwork.objectID); // Informa o componente pai
    console.warn(
      `Erro ao carregar imagem para: ${artwork.title} (ID: ${artwork.objectID})`,
      artwork.primaryImage
    );
  };

  return (
    <motion.div
      layout
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
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden group h-60">
          <motion.img
            src={artwork.primaryImage}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-300"
            whileHover={{ scale: 1.15 }} // Aumentado o valor do scale
            onError={handleImageError}
          />
          <div className="absolute top-2 left-2">
            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm capitalize">
              {artwork.department || "Desconhecido"}
            </div>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <h3 className="text-xl font-semibold line-clamp-1">
            {artwork.title || "Título Desconhecido"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {artwork.artistDisplayName || "Artista Desconhecido"}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0 pb-2 flex-grow">
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
