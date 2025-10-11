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
import ImageUpload from "@/components/ImageUpload";
import { z } from "zod";

const quoteSchema = z.object({
  text: z.string()
    .trim()
    .min(10, "A frase deve ter pelo menos 10 caracteres")
    .max(280, "A frase não pode ter mais de 280 caracteres")
    .refine(val => !/<script|javascript:/i.test(val), "Conteúdo suspeito detectado"),
  author: z.string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome não pode ter mais de 50 caracteres"),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

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

    // Client-side validation
    const validationResult = quoteSchema.safeParse({
      text: quoteText,
      author: author,
      photoUrl: photoUrl,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      alert(firstError.message);
      return;
    }

    setIsCreating(true);
    try {
      await onCreateQuote(quoteText.trim(), author.trim(), photoUrl || undefined);
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
            <Label className="text-sm font-medium">Foto de Perfil (opcional)</Label>
            <ImageUpload
              value={photoUrl}
              onChange={setPhotoUrl}
              disabled={isCreating}
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
