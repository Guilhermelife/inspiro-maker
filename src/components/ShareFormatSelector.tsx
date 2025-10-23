import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Share2, Download } from "lucide-react";
import { ImageFormat } from "@/lib/imageGenerator";
import { useState } from "react";

interface ShareFormatSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormatSelect: (format: ImageFormat) => void;
  onDownload: (format: ImageFormat) => void;
  isGenerating: boolean;
}

const FORMATS = [
  {
    id: 'instagram-square' as ImageFormat,
    name: 'Quadrado',
    description: 'Feed do Instagram',
    icon: Instagram,
    aspect: 'aspect-square',
    recommended: true,
  },
  {
    id: 'instagram-portrait' as ImageFormat,
    name: 'Vertical',
    description: 'Post Instagram',
    icon: Instagram,
    aspect: 'aspect-[4/5]',
    recommended: false,
  },
  {
    id: 'instagram-story' as ImageFormat,
    name: 'Stories',
    description: 'Stories Instagram',
    icon: Instagram,
    aspect: 'aspect-[9/16]',
    recommended: false,
  },
  {
    id: 'facebook' as ImageFormat,
    name: 'Facebook',
    description: 'Feed Facebook',
    icon: Facebook,
    aspect: 'aspect-[191/100]',
    recommended: false,
  },
  {
    id: 'twitter' as ImageFormat,
    name: 'Twitter/X',
    description: 'Post Twitter',
    icon: Share2,
    aspect: 'aspect-[16/9]',
    recommended: false,
  },
];

export const ShareFormatSelector = ({
  open,
  onOpenChange,
  onFormatSelect,
  onDownload,
  isGenerating,
}: ShareFormatSelectorProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('instagram-square');

  const handleShare = () => {
    onFormatSelect(selectedFormat);
  };

  const handleDownload = () => {
    onDownload(selectedFormat);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Escolha o formato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {FORMATS.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormat === format.id;
              
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {format.recommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                      Popular
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-full ${format.aspect} bg-gradient-to-br from-primary/10 to-primary/5 rounded-md border-2 ${
                      isSelected ? 'border-primary' : 'border-border'
                    } flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {format.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              disabled={isGenerating}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Compartilhar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
