
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export function StarRating({ rating = 0, onRate, readonly = false }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? "fill-[#CC4153] text-[#CC4153]"
              : "fill-gray-200 text-gray-200"
          } ${!readonly && "cursor-pointer hover:text-[#CC4153]"}`}
          onClick={() => !readonly && onRate?.(star)}
        />
      ))}
    </div>
  );
}
