export interface Review {
  _id: string;
  userId?: string;
  businessId?: string;
  customerName: string;
  rating: number;
  reviewText: string;
  status: 'New' | 'Pending' | 'Replied';
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateReviewReplyRequest {
  reviewId: string;
}
