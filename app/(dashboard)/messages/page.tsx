"use client";

import { useState, useEffect } from 'react';
import { messagesService } from '@/services/messages.service';
import { Message } from '@/types/messages';
import { MessageSquare, Sparkles, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [aiReply, setAiReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await messagesService.getMessages();
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReply = async (messageId: string) => {
    setIsGenerating(true);
    try {
      const res = await messagesService.generateReply(messageId);
      setAiReply(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !aiReply) return;
    try {
      const res = await messagesService.sendReply(selectedMessage._id, aiReply);
      setMessages(messages.map(m => m._id === selectedMessage._id ? res.data : m));
      setSelectedMessage(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-brand-purple" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customer Messages</h1>
          <p className="text-text-muted mt-1">Manage and reply to customer inquiries with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-1 flex flex-col overflow-hidden bg-surface border-border shadow-lg">
          <CardHeader className="py-4 border-b border-border">
            <CardTitle className="text-lg text-white">Inbox</CardTitle>
          </CardHeader>
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No messages.</div>
            ) : (
              <div className="divide-y divide-border">
                {messages.map(message => (
                  <div 
                    key={message._id} 
                    className={`p-4 cursor-pointer hover:bg-surface-elevated transition-colors ${selectedMessage?._id === message._id ? 'bg-brand-purple/10 border-l-4 border-brand-purple' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      setAiReply('');
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-white">{message.customerName}</span>
                      <span className="text-[10px] text-text-muted">{formatDistanceToNow(new Date(message.createdAt))}</span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2">{message.message}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] bg-surface-elevated text-text-secondary px-2 py-0.5 rounded">{message.platform}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${message.status === 'Replied' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {message.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-2 flex flex-col overflow-hidden bg-surface border-border shadow-lg">
          {selectedMessage ? (
            <>
              <CardHeader className="py-4 border-b border-border bg-surface-elevated">
                <CardTitle className="text-lg text-white">{selectedMessage.customerName}</CardTitle>
                <span className="text-xs text-text-muted">via {selectedMessage.platform}</span>
              </CardHeader>
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="bg-surface-elevated border border-border p-4 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm text-text-secondary">{selectedMessage.message}</p>
                </div>
                
                {selectedMessage.status === 'Replied' ? (
                  <div className="bg-brand-purple/10 border border-brand-purple/20 p-4 rounded-lg rounded-tr-none max-w-[80%] ml-auto text-white">
                    <p className="text-sm">{selectedMessage.reply}</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-white">
                        <Sparkles className="h-4 w-4 text-brand-purple" /> AI Suggested Reply
                      </h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleGenerateReply(selectedMessage._id)}
                        disabled={isGenerating}
                        className="border-border hover:bg-surface-elevated hover:text-white"
                      >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Generate'}
                      </Button>
                    </div>
                    
                    {aiReply && (
                      <div className="space-y-3">
                        <textarea 
                          className="w-full min-h-[100px] p-3 border border-border bg-surface-elevated text-white rounded-md text-sm focus:ring-2 focus:ring-brand-purple outline-none resize-none"
                          value={aiReply}
                          onChange={(e) => setAiReply(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={handleSendReply} className="bg-brand-gradient hover:opacity-90 text-white">
                            <Send className="h-4 w-4 mr-2" /> Send Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a message to view and reply.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
