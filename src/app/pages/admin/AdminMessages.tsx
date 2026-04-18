import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useNotifications } from '../../components/NotificationContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { getApiUrl } from '../../utils/apiConfig';

interface Message {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

interface ConversationGroup {
  userId: number;
  userName?: string;
  userEmail?: string;
  messages: Message[];
  lastMessage: string;
}

export function AdminMessages() {
  const [conversations, setConversations] = useState<ConversationGroup[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [previousUserMessageCount, setPreviousUserMessageCount] = useState(0);
  const { setUnreadMessages } = useNotifications();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    fetchAllMessages();
    // Poll for new messages every 5 seconds (increased from 2s to reduce network stress)
    const interval = setInterval(fetchAllMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change or user switches
    if (messagesContainerRef.current) {
      const timer = setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedUserId, conversations]);

  const fetchAllMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/messages'));
      if (!response.ok) throw new Error('Failed to load messages');
      const data = await response.json();

      // Group messages by userId and capture user info
      const grouped: Record<number, { messages: Message[]; userName?: string; userEmail?: string }> = {};
      const messagesArray = Array.isArray(data) ? data : [];
      messagesArray.forEach((msg: Message) => {
        if (!grouped[msg.userId]) {
          grouped[msg.userId] = {
            messages: [],
            userName: msg.userName,
            userEmail: msg.userEmail,
          };
        }
        grouped[msg.userId].messages.push(msg);
      });

      const convos = Object.entries(grouped).map(([userId, data]) => ({
        userId: parseInt(userId),
        userName: data.userName,
        userEmail: data.userEmail,
        messages: data.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        lastMessage: data.messages[data.messages.length - 1]?.text || '',
      }));

      // Count user messages (not admin)
      const totalUserMessages = convos.reduce((sum, convo) => 
        sum + convo.messages.filter((m: Message) => m.sender === 'user').length, 0
      );
      
      // Update unread count in notification context
      setUnreadMessages(totalUserMessages);
      
      // Show notification if new user message arrived
      if (previousUserMessageCount > 0 && totalUserMessages > previousUserMessageCount) {
        toast.success('New message from user!');
      }
      
      setPreviousUserMessageCount(totalUserMessages);
      setConversations(convos);
      setError(''); // Clear error on success
      if (convos.length > 0 && !selectedUserId) {
        setSelectedUserId(convos[0].userId);
      }
    } catch (err) {
      const errorMsg = (err as Error).message || 'Unable to load messages';
      console.error('[AdminMessages] Error:', errorMsg);
      
      // Only show error if it's not a network error or if we've retried too many times
      if (!errorMsg.includes('network') && !errorMsg.includes('ERR_')) {
        setError(errorMsg);
      }
      
      // Auto-retry on network errors
      if (retryCount < maxRetries && (errorMsg.includes('network') || errorMsg.includes('ERR_'))) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedUserId) return;

    try {
      await fetch(getApiUrl('/api/messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: selectedUserId, sender: 'admin', text: replyText }),
      });
      setReplyText('');
      fetchAllMessages();
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };



className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{convo.userName || convo.userEmail || `User ${convo.userId}`}</p>
                        <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Messages View */}
          <div className="flex-1 border border-border rounded-lg overflow-hidden flex flex-col">
            {selectedConvo ? (
              <>
                <div className="p-4 border-b border-border bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConvo.userName || selectedConvo.userEmail || `User ${selectedConvo.userId}`}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConvo.userEmail && selectedConvo.userName ? selectedConvo.userEmail : ''} • {selectedConvo.messages.length} messages
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
                  {selectedConvo.messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${msg.sender === 'user' ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === 'user' ? 'bg-accent' : 'bg-primary'
                        }`}>
                          {msg.sender === 'user' ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className={`px-4 py-2 rounded-2xl ${">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConvo.userName || selectedConvo.userEmail || `User ${selectedConvo.userId}`}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConvo.userEmail && selectedConvo.userName ? selectedConvo.userEmail : ''} • {selectedConvo.messages.length} messages
                      </p>
                    </div>
