
import { Book } from '@/types/book';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Share2 } from "lucide-react";
import { useState } from 'react';
import { Card } from "@/components/ui/card";

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

  const handleShareOnFacebook = () => {
    const baseUrl = window.location.origin;
    const bookUrl = `${baseUrl}/book/${book.id}`;
    const quote = `Découvrez ma critique de "${book.title}" sur Ma Bibliothèque\n\n${book.review?.content || ''}`;
    
    const shareUrl = `https://www.facebook.com/dialog/share?app_id=671593115528982&display=popup&href=${encodeURIComponent(bookUrl)}&quote=${encodeURIComponent(quote)}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!isEditing && !book.review) {
    return null;
  }

  if (isEditing || editingReview) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight mb-4">Votre critique</h3>
        <Textarea
          placeholder="Écrivez votre critique ici..."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          className="min-h-[200px] text-base leading-relaxed"
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
      <Card className="overflow-hidden">
        <article className="space-y-6 p-6">
          <header className="flex justify-between items-start border-b pb-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">Ma critique du livre</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Écrite le {new Date(book.review.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareOnFacebook}
                className="hover:bg-muted"
                title="Partager sur Facebook"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingReview(true)}
                className="hover:bg-muted"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteReview}
                className="hover:bg-muted"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          <div className="prose prose-slate max-w-none">
            <div className="text-xl font-medium mb-6 text-primary">
              {book.review.content.split('\n')[0].replace(/^#\s*/, '')}
            </div>
            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {book.review.content.split('\n').slice(1).join('\n').replace(/\*\*/g, '')}
            </div>
          </div>
        </article>
      </Card>
    );
  }

  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold mb-4">Aucune critique pour ce livre</h3>
      <Button onClick={() => setEditingReview(true)} variant="outline" size="lg">
        Ajouter une critique
      </Button>
    </div>
  );
}
