"use client";

import { useState, useEffect } from 'react';
import { reviewsService } from '@/services/reviews.service';
import { Review } from '@/types/reviews';
import { Star, Sparkles, Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await reviewsService.getReviews();
      setReviews(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleGenerateReply = async (reviewId: string) => {
    setGeneratingFor(reviewId);
    try {
      const review = reviews.find(r => r._id === reviewId);
      const res = await reviewsService.generateReply(reviewId, review?.reviewText);
      setAiReplies({ ...aiReplies, [reviewId]: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleSendReply = async (reviewId: string) => {
    const replyText = aiReplies[reviewId];
    if (!replyText) return;
    
    try {
      await reviewsService.sendReply(reviewId, replyText);
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, status: 'Replied', reply: replyText } : r));
      const newReplies = { ...aiReplies };
      delete newReplies[reviewId];
      setAiReplies(newReplies);
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Star className="h-6 w-6 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Google Reviews</h1>
          <p className="text-text-muted mt-1">Manage and respond to your customer reviews.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-brand-purple" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center p-12 border border-border rounded-lg bg-surface-elevated text-text-muted shadow-lg">No reviews yet.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <Card key={review._id} className="overflow-hidden bg-surface border-border shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">{review.customerName}</h3>
                    <div className="flex gap-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${review.status === 'Replied' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {review.status}
                  </span>
                </div>
                <p className="text-text-muted">{review.reviewText}</p>
                
                {review.status === 'Replied' ? (
                  <div className="mt-4 bg-brand-purple/10 p-4 rounded-lg border-l-4 border-brand-purple">
                    <p className="text-sm font-semibold mb-1 text-white">Your Reply:</p>
                    <p className="text-sm text-text-secondary">{review.reply}</p>
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-border space-y-4">
                    {aiReplies[review._id] ? (
                      <div className="space-y-3 animate-in fade-in zoom-in-95">
                        <textarea 
                          className="w-full min-h-[80px] p-3 border border-border rounded-md text-sm bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none resize-none"
                          value={aiReplies[review._id]}
                          onChange={(e) => setAiReplies({...aiReplies, [review._id]: e.target.value})}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleGenerateReply(review._id)} className="border-border hover:bg-surface-elevated hover:text-white">Regenerate</Button>
                          <Button size="sm" onClick={() => handleSendReply(review._id)} className="bg-brand-gradient hover:opacity-90 text-white">
                            <Send className="h-4 w-4 mr-2" /> Post Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => handleGenerateReply(review._id)}
                        disabled={generatingFor === review._id}
                        className="border-border hover:bg-surface-elevated hover:text-white"
                      >
                        {generatingFor === review._id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                        ) : (
                          <><Sparkles className="h-4 w-4 mr-2 text-brand-purple" /> Generate AI Reply</>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
