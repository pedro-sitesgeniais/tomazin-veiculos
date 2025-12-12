import { useCallback, useState } from 'react';
import { Upload, X, Camera, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoData } from './types';
import { cn } from '@/lib/utils';

interface Step3Props {
  data: PhotoData;
  onChange: (data: PhotoData) => void;
}

const PHOTO_SUGGESTIONS = [
  { id: 'frente', label: 'Frente', icon: Camera },
  { id: 'traseira', label: 'Traseira', icon: Camera },
  { id: 'lateral-esq', label: 'Lateral Esquerda', icon: Camera },
  { id: 'lateral-dir', label: 'Lateral Direita', icon: Camera },
  { id: 'painel', label: 'Painel/Interior', icon: Camera },
  { id: 'motor', label: 'Motor', icon: Camera },
];

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function Step3Photos({ data, onChange }: Step3Props) {
  const [dragActive, setDragActive] = useState(false);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1920;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
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
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter(
      (file) => file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE
    );

    const remainingSlots = MAX_PHOTOS - data.files.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);

    const compressedFiles = await Promise.all(
      filesToAdd.map((file) => compressImage(file))
    );

    const newPreviews = await Promise.all(
      compressedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          })
      )
    );

    onChange({
      files: [...data.files, ...compressedFiles],
      previews: [...data.previews, ...newPreviews],
    });
  }, [data, onChange]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (index: number) => {
    onChange({
      files: data.files.filter((_, i) => i !== index),
      previews: data.previews.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Fotos do Veículo</h2>
        <p className="text-muted-foreground">
          Adicione fotos do seu veículo para uma avaliação mais precisa
        </p>
      </div>

      {/* Photo suggestions */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {PHOTO_SUGGESTIONS.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex flex-col items-center p-2 bg-secondary/30 rounded-lg border border-border"
          >
            <suggestion.icon className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground text-center">{suggestion.label}</span>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-colors text-center',
          dragActive ? 'border-primary bg-primary/5' : 'border-border',
          data.files.length >= MAX_PHOTOS && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={data.files.length >= MAX_PHOTOS}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Arraste suas fotos ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Máximo {MAX_PHOTOS} fotos, até 5MB cada (JPG, PNG, WEBP)
            </p>
          </div>
          <Button type="button" variant="outline" disabled={data.files.length >= MAX_PHOTOS}>
            Selecionar Fotos
          </Button>
        </div>
      </div>

      {/* Photo counter */}
      <div className="text-center text-sm text-muted-foreground">
        {data.files.length} de {MAX_PHOTOS} fotos adicionadas
      </div>

      {/* Photo previews */}
      {data.previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden bg-secondary group"
            >
              <img
                src={preview}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-xs text-foreground">
                Foto {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {data.previews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma foto adicionada ainda</p>
          <p className="text-sm">Fotos ajudam a agilizar a avaliação</p>
        </div>
      )}
    </div>
  );
}
