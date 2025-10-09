import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CreateQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateQuote: (text: string, author: string, photoUrl?: string) => Promise<void>;
}

const CreateQuoteModal = ({ open, onOpenChange, onCreateQuote }: CreateQuoteModalProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim() || !author.trim()) return;

    setIsCreating(true);
    try {
      await onCreateQuote(quoteText, author, photoUrl || undefined);
      setQuoteText("");
      setAuthor("");
      setPhotoUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating quote:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Criar Frase Personalizada</DialogTitle>
          <DialogDescription className="text-sm">
            Crie sua própria frase inspiradora e compartilhe com o mundo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="quote-text" className="text-sm font-medium">Frase *</Label>
            <Textarea
              id="quote-text"
              placeholder="Digite sua frase inspiradora..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              required
              rows={4}
              maxLength={280}
              className="resize-none text-sm focus:ring-2 focus:ring-primary transition-all"
            />
            <p className={`text-xs text-right transition-colors ${
              quoteText.length > 250 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {quoteText.length}/280
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">Autor/Pseudônimo *</Label>
            <Input
              id="author"
              placeholder="Seu nome ou pseudônimo"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              maxLength={50}
              className="text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo-url" className="text-sm font-medium">URL da Foto de Perfil (opcional)</Label>
            <Input
              id="photo-url"
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-11 active:scale-95 transition-all"
            disabled={isCreating || !quoteText.trim() || !author.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar e Compartilhar'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteModal;
