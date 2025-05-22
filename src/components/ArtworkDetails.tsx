import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { useFavoritesStore } from "@/stores/favoritesStore";
import type { Artwork } from "@/types/artwork";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ArtworkDetailsProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
  artwork,
  onClose,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isFavorite, saveFavoriteArtwork, removeFavorite } =
    useFavoritesStore();

  // Segurança: verificar se artwork é null/undefined antes de acessar propriedades
  const favorite = artwork?.objectID ? isFavorite(artwork.objectID) : false;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (artwork && artwork.objectID) {
      setIsDialogOpen(true);
      console.log(
        "ArtworkDetails: useEffect - Configurando isDialogOpen para true para artwork ID:",
        artwork.objectID
      );
    } else if (!artwork) {
      setIsDialogOpen(false);
      console.log(
        "ArtworkDetails: useEffect - artwork é nula/undefined, configurando isDialogOpen para false."
      );
    }
  }, [artwork]);

  const handleOpenChange = (open: boolean) => {
    console.log(
      "ArtworkDetails: handleOpenChange - Novo estado do Dialog:",
      open,
      "- Artwork ID:",
      artwork?.objectID
    );
    setIsDialogOpen(open);
    if (!open) {
      onClose();
    }
  };

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(artwork.objectID);
    } else {
      saveFavoriteArtwork(artwork);
    }
  };

  // Verificar se artwork existe antes de acessar suas propriedades
  if (!artwork || !artwork.objectID) {
    console.log(
      "ArtworkDetails: Prop artwork está nula, indefinida ou sem objectID. Não renderizando o diálogo."
    );
    return null;
  }

  // Definir os detalhes depois de verificar que artwork não é nulo
  const details = [
    { label: "Artista", value: artwork.artistDisplayName || "Desconhecido" },
    { label: "Data", value: artwork.objectDate || "Desconhecido" },
    { label: "Departamento", value: artwork.department || "Desconhecido" },
    { label: "Técnica", value: artwork.medium || "Desconhecido" },
    { label: "Dimensões", value: artwork.dimensions || "Desconhecido" },
    { label: "Crédito", value: artwork.creditLine || "Desconhecido" },
  ];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 }, // Modificado: mais pronunciado
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.7, // Modificado: um pouco mais longo
      },
    },
    exit: {
      // Mantido por enquanto, mas pode precisar de AnimatePresence
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -30 }, // Modificado: adicionado movimento x
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }, // Adicionado delay
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 }, // Modificado: y maior
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3, // Modificado: delay maior para o container de conteúdo
        duration: 0.6,
        staggerChildren: 0.15, // Modificado: stagger maior
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Modificado: y maior
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, // Modificado: duração maior
    },
  };

  console.log(
    "ArtworkDetails: Renderizando. Artwork ID:",
    artwork.objectID,
    "isDialogOpen:",
    isDialogOpen
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-7xl p-0 gap-0 rounded-xl overflow-hidden border-none h-[90vh] max-h-[1100px]"
        aria-describedby="artwork-details-description"
      >
        <div id="artwork-details-description" className="sr-only">
          Detalhes completos da obra de arte {artwork.title} por{" "}
          {artwork.artistDisplayName || "Artista Desconhecido"}
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          className="flex flex-col md:flex-row w-full h-full bg-card" // Aplicar flex aqui
        >
          {/* Seção da imagem */}
          <motion.div
            className="w-full md:w-1/2 h-[45vh] md:h-full relative flex items-center justify-center p-4 md:p-6 bg-black/5" // Alterado para h-[45vh] em mobile e md:h-full
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {artwork.primaryImage ? (
              <div className="w-full h-full relative md:max-h-[65vh]">
                <img
                  src={artwork.primaryImage}
                  alt={artwork.title}
                  className="w-full h-full object-contain"
                  onLoad={() => setImageLoaded(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      name="loader"
                      className="h-10 w-10 animate-spin text-muted-foreground"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 md:max-h-[65vh]">
                <Icon
                  name="imageOff"
                  className="h-16 w-16 text-muted-foreground mb-4"
                />
                <span className="text-muted-foreground text-lg">
                  Imagem não disponível
                </span>
              </div>
            )}
          </motion.div>

          {/* Seção de detalhes */}
          <motion.div
            className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto flex-1 min-h-0" // Adicionado min-h-0
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader className="mb-4">
              <div className="flex justify-between items-start gap-4">
                <motion.div
                  variants={itemVariants}
                  className="flex-1 min-w-0"
                  initial="hidden" // Adicionado para garantir animação do item
                  animate="visible"
                >
                  <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight break-words">
                    {artwork.title || "Sem título"}
                  </DialogTitle>
                  {artwork.artistDisplayName && (
                    <p className="text-muted-foreground mt-1 md:mt-2 text-md md:text-lg truncate">
                      {artwork.artistDisplayName}
                    </p>
                  )}
                </motion.div>
                <div className="flex items-center gap-2 shrink-0">
                  {artwork.objectURL && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        asChild
                      >
                        <a
                          href={artwork.objectURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ver no site do museu"
                        >
                          <Icon name="externalLink" className="h-4 w-4" />
                        </a>
                      </Button>
                    </motion.div>
                  )}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={toggleFavorite}
                      aria-label={
                        favorite
                          ? "Remover dos Favoritos"
                          : "Adicionar aos Favoritos"
                      }
                    >
                      <Icon
                        name="heart"
                        className={`h-5 w-5 ${
                          favorite ? "text-red-500" : "text-muted-foreground"
                        }`}
                        fill={favorite ? "currentColor" : "none"}
                        data-testid="heart-icon"
                      />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={onClose}
                        aria-label="Fechar"
                      >
                        <Icon name="close" className="h-4 w-4" />
                        <span className="sr-only">Fechar</span>
                      </Button>
                    </DialogClose>
                  </motion.div>
                </div>
              </div>
            </DialogHeader>

            <motion.div
              className="space-y-3 text-sm flex-1 min-h-0"
              variants={itemVariants} // Este variants é para o container dos detalhes como um todo
              initial="hidden"
              animate="visible"
            >
              {details.map((detail) => (
                <motion.div
                  key={detail.label}
                  className="grid grid-cols-3 gap-2 items-start"
                  variants={itemVariants} // Aplicando itemVariants para cada linha de detalhe
                  // initial e animate são herdados do pai se contentVariants tiver staggerChildren
                >
                  <span className="font-semibold text-muted-foreground col-span-1">
                    {detail.label}:
                  </span>
                  <span className="col-span-2 break-words">{detail.value}</span>
                </motion.div>
              ))}
            </motion.div>

            {artwork.tags && artwork.tags.length > 0 && (
              <motion.div
                className="pt-4 border-t border-border" // Removido mt-auto. Mantido pt-4 e border-t para separação.
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h4 className="font-semibold mb-2 text-muted-foreground">
                  Tags:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <motion.span
                      key={tag.term}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs"
                      variants={itemVariants} // Animação para cada tag
                      // initial e animate são herdados
                    >
                      {tag.term}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkDetails;
