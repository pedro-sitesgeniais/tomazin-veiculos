import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VehicleGalleryProps {
  images: string[];
  videoUrl?: string | null;
  alt: string;
}

export function VehicleGallery({ images, videoUrl, alt }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false));

  const allMedia = videoUrl ? [...images, videoUrl] : images;
  const isVideo = (index: number) => videoUrl && index === allMedia.length - 1;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <>
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary group">
        {isVideo(selectedIndex) ? (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(allMedia[selectedIndex])}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {!imageLoaded[selectedIndex] && (
              <div className="absolute inset-0 bg-secondary animate-pulse" />
            )}
            <img
              src={allMedia[selectedIndex]}
              alt={`${alt} - Imagem ${selectedIndex + 1}`}
              className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                imageLoaded[selectedIndex] ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setLightboxOpen(true)}
              onLoad={() => handleImageLoad(selectedIndex)}
            />
          </>
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {isVideo(index) ? (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
              ) : (
                <img
                  src={media}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="absolute -top-12 right-0"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <img
              src={allMedia[selectedIndex]}
              alt={`${alt} - Imagem ${selectedIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            {allMedia.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
