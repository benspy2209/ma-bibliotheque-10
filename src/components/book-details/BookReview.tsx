
import { Book } from '@/types/book';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from 'react';

interface BookReviewProps {
  book: Book;
  isEditing: boolean;
  onReviewChange: (review: { content: string; date: string; } | undefined) => void;
}

export function BookReview({ book, isEditing, onReviewChange }: BookReviewProps) {
  const [editingReview, setEditingReview] = useState(false);
  const [reviewContent, setReviewContent] = useState(book.review?.content || '');

  const handleSaveReview = () => {
    if (reviewContent.trim()) {
      onReviewChange({
        content: reviewContent,
        date: new Date().toISOString()
      });
    } else {
      onReviewChange(undefined);
    }
    setEditingReview(false);
  };

  const handleDeleteReview = () => {
    setReviewContent('');
    onReviewChange(undefined);
  };

  if (!isEditing && !book.review) {
    return null;
  }

  if (isEditing || editingReview) {
    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Écrivez votre critique ici..."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          className="min-h-[150px]"
        />
        <div className="flex justify-end gap-2">
          {editingReview && (
            <Button 
              variant="outline" 
              onClick={() => {
                setReviewContent(book.review?.content || '');
                setEditingReview(false);
              }}
            >
              Annuler
            </Button>
          )}
          <Button onClick={handleSaveReview}>
            Enregistrer la critique
          </Button>
        </div>
      </div>
    );
  }

  if (book.review) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-sm text-muted-foreground">
            Critique écrite le {new Date(book.review.date).toLocaleDateString('fr-FR')}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingReview(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteReview}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="whitespace-pre-wrap">{book.review.content}</p>
      </div>
    );
  }

  return (
    <Button onClick={() => setEditingReview(true)}>
      Ajouter une critique
    </Button>
  );
}
