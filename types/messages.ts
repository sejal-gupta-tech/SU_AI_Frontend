export interface Message {
  _id: string;
  userId?: string;
  businessId?: string;
  customerName: string;
  message: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'WhatsApp' | string;
  status: 'New' | 'Pending' | 'Replied';
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateReplyRequest {
  messageId: string;
}
