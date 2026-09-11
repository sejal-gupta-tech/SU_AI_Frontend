import { Review } from '@/types/reviews';

const mockReviews: Review[] = [
  {
    _id: '1',
    customerName: 'Sanjay Verma',
    rating: 5,
    reviewText: 'Amazing quality! The material is very soft and it fits perfectly. Highly recommend this store.',
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    customerName: 'Neha Gupta',
    rating: 2,
    reviewText: 'Delivery was late by 3 days and the packaging was slightly damaged.',
    status: 'New',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const reviewsService = {
  async getReviews(): Promise<{ data: Review[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: [...mockReviews] };
  },

  async generateReply(reviewId: string): Promise<{ data: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const review = mockReviews.find(r => r._id === reviewId);
    if (!review) throw new Error('Review not found');
    
    if (review.rating >= 4) {
      return { data: `Thank you so much for the ${review.rating}-star review, ${review.customerName}! We're thrilled to hear you had a great experience. Looking forward to serving you again soon.` };
    } else {
      return { data: `Dear ${review.customerName}, we apologize for the inconvenience you faced. We strive for 100% customer satisfaction. Please reach out to us at support@example.com so we can make this right.` };
    }
  },

  async sendReply(reviewId: string, replyText: string): Promise<{ data: Review }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockReviews.findIndex(r => r._id === reviewId);
    if (index === -1) throw new Error('Review not found');
    
    mockReviews[index] = {
      ...mockReviews[index],
      status: 'Replied',
      reply: replyText,
      updatedAt: new Date().toISOString()
    };
    
    return { data: mockReviews[index] };
  }
};
