import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type QuoteCategory = 
  | "motivacional"
  | "reflexiva"
  | "biblica"
  | "autor"
  | "amor"
  | "aleatoria";

interface CategorySelectorProps {
  value: QuoteCategory;
  onChange: (value: QuoteCategory) => void;
}

const categories: { value: QuoteCategory; label: string }[] = [
  { value: "aleatoria", label: "Aleatória" },
  { value: "motivacional", label: "Motivacional" },
  { value: "reflexiva", label: "Reflexiva" },
  { value: "biblica", label: "Bíblica" },
  { value: "autor", label: "De Autor" },
  { value: "amor", label: "Amor & Espiritual" },
];

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-2 bg-background">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
