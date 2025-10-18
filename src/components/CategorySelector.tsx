import { categoryThemes, CategoryKey } from "@/lib/categoryThemes";
import { Check } from "lucide-react";

export type QuoteCategory = 
  | "motivacional"
  | "reflexiva"
  | "biblica"
  | "autor"
  | "amor"
  | "motivacao-reversa"
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
  { value: "amor", label: "Amor" },
  { value: "motivacao-reversa", label: "Motivação Reversa" },
];

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const theme = categoryThemes[cat.value as CategoryKey];
          const isSelected = value === cat.value;
          
          return (
            <button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              className={`
                group relative p-6 rounded-2xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-lg active:scale-95
                ${isSelected 
                  ? `${theme.border} ${theme.bgGradient}` 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {theme.icon}
                </span>
                <span className={`text-sm font-semibold text-center ${isSelected ? theme.color : 'text-foreground'}`}>
                  {cat.label}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
