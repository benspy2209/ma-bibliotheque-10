
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  coverImage: string | null;
  onImageChange: (image: string | null) => void;
}

export function ImageUpload({ coverImage, onImageChange }: ImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Couverture</FormLabel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="max-w-[300px]"
        />
        {coverImage && (
          <div className="w-32 h-44 overflow-hidden rounded border">
            <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
