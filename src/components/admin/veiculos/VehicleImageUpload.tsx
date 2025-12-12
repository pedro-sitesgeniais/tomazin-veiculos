import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Star, 
  GripVertical, 
  Loader2,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VehicleImage {
  id?: string;
  url: string;
  ordem: number;
  principal: boolean;
}

interface VehicleImageUploadProps {
  images: VehicleImage[];
  onChange: (images: VehicleImage[]) => void;
  vehicleId?: string;
  maxImages?: number;
}

export function VehicleImageUpload({ 
  images, 
  onChange, 
  vehicleId,
  maxImages = 20 
}: VehicleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImages = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast({
        variant: 'destructive',
        title: 'Limite excedido',
        description: `Máximo de ${maxImages} imagens permitidas.`,
      });
      return;
    }

    setUploading(true);
    const newImages: VehicleImage[] = [];

    try {
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Compress image
        const compressedFile = await compressImage(file);
        
        // Generate unique filename
        const fileExt = 'jpg';
        const fileName = `${vehicleId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('veiculos')
          .upload(fileName, compressedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('veiculos')
          .getPublicUrl(fileName);

        newImages.push({
          url: publicUrl,
          ordem: images.length + newImages.length,
          principal: images.length === 0 && newImages.length === 0,
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast({
          title: 'Imagens enviadas',
          description: `${newImages.length} imagem(ns) adicionada(s).`,
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar as imagens.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      uploadImages(e.dataTransfer.files);
    }
  }, [images]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadImages(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the principal image, set the first one as principal
    if (images[index].principal && newImages.length > 0) {
      newImages[0].principal = true;
    }
    // Update ordem
    newImages.forEach((img, i) => {
      img.ordem = i;
    });
    onChange(newImages);
  };

  const setAsPrincipal = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      principal: i === index,
    }));
    onChange(newImages);
  };

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    // Update ordem
    newImages.forEach((img, i) => {
      img.ordem = i;
    });

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Enviando imagens...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Arraste imagens aqui ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground">
                Máximo {maxImages} imagens, JPEG ou PNG
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="image-upload" className="cursor-pointer">
                Selecionar Imagens
              </label>
            </Button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.url}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={cn(
                "relative group aspect-[4/3] rounded-lg overflow-hidden bg-secondary border-2",
                image.principal ? "border-primary" : "border-transparent",
                draggedIndex === index && "opacity-50"
              )}
            >
              <img
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8"
                  onClick={() => setAsPrincipal(index)}
                >
                  <Star className={cn("h-4 w-4", image.principal && "fill-primary text-primary")} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-2 left-2 p-1 bg-black/50 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white" />
              </div>

              {/* Principal Badge */}
              {image.principal && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Principal
                </div>
              )}

              {/* Order Number */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma imagem adicionada</p>
        </div>
      )}
    </div>
  );
}
