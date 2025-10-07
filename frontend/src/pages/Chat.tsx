import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth0 } from "@auth0/auth0-react";
import { chatApi, userApi, geminiApi, type Citation as ApiCitation } from "@/lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ApiCitation[];
}

const Chat = () => {
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: "Hello! I'm your onboarding assistant. Ask me anything about the company's tech stack, policies, or onboarding process.",
      citations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user and load chat history
  useEffect(() => {
    if (user) {
      initializeUser();
    } else {
      // Fallback: if no Auth0 user, set a temporary user ID so chat can work
      console.warn('No Auth0 user found, using fallback user ID');
      setCurrentUserId(1); // Use a default user ID
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user) return;
    
    try {
      // Create or get user from database
      const dbUser = await userApi.upsertUser({
        auth0_id: user.sub!,
        email: user.email!,
        name: user.name,
      });
      
      setCurrentUserId(dbUser.id!);
      
      // Load chat history
      await loadChatHistory(dbUser.id!);
    } catch (error) {
      console.error('Error initializing user:', error);
      toast.error('Failed to initialize user profile; chat will still work');
      // Fallback so chat can proceed without persistence
      setCurrentUserId(-1);
    }
  };

  const loadChatHistory = async (userId: number) => {
    try {
      const history = await chatApi.getUserChatHistory(userId, 50);
      if (history.length > 0) {
        const formattedMessages: Message[] = history.map(msg => ({
          id: msg.id?.toString() || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          citations: msg.citations || []
        }));
        setMessages([...messages, ...formattedMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Don't show error to user, just use default welcome message
    }
  };

  const sampleQuestions = [
    { icon: BookOpen, text: "What's our tech stack?" },
    { icon: FileText, text: "Show me the first week checklist" },
    { icon: BookOpen, text: "Can I bring the black book home?" },
    { icon: FileText, text: "What's the company architecture?" },
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Ensure we have a valid user ID (use fallback if needed)
    const userId = currentUserId || -1;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Save user message to database (non-blocking)
      const userMessageData = {
        user_id: userId,
        role: "user" as const,
        content: userInput
      };
      console.log('Sending user message:', userMessageData);
      
      // Validate required fields before sending
      if (userMessageData.user_id === undefined || userMessageData.user_id === null || !userMessageData.role || !userMessageData.content) {
        console.error('Invalid user message data:', userMessageData);
        throw new Error('Missing required fields for user message');
      }
      
      chatApi.createMessage(userMessageData).catch((err) => {
        console.warn('Non-blocking: failed to save user message', err);
      });
      
      // Call backend Gemini chat endpoint
      console.log('=== DEBUG: About to call geminiApi.sendChatMessage ===');
      const historyForGemini = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10) // send last 10 turns max
        .map(m => ({
          role: m.role === 'user' ? 'user' as const : 'model' as const,
          parts: m.content,
        }));

      console.log('=== DEBUG: Calling geminiApi.sendChatMessage with:', {
        userInput,
        historyLength: historyForGemini.length,
        config: { temperature: 0.3, maxOutputTokens: 4096 }
      });
      
      const assistantContent = await geminiApi.sendChatMessage(userInput, {
        history: historyForGemini,
        model: 'flash',
        config: { temperature: 0.3, maxOutputTokens: 4096 },
      });

      console.log('Assistant content received:', assistantContent);

      // Add assistant message to chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantContent
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database (no citations yet)
      try {
        const assistantMessageData = {
          user_id: userId,
          role: "assistant" as const,
          content: assistantContent
        };
        console.log('Sending assistant message:', assistantMessageData);
        
        // Validate required fields before sending
        if (assistantMessageData.user_id === undefined || assistantMessageData.user_id === null || !assistantMessageData.role || !assistantMessageData.content) {
          console.error('Invalid assistant message data:', assistantMessageData);
          throw new Error('Missing required fields for assistant message');
        }
        
        await chatApi.createMessage(assistantMessageData);
      } catch (error) {
        console.error('Error saving assistant message:', error);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('=== DEBUG: Error in handleSend ===');
      console.error('Error type:', typeof error);
      console.error('Error instanceof Error:', error instanceof Error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Full error object:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      toast.error(`Failed to get response: ${error instanceof Error ? error.message : String(error)}`);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm p-6 shadow-soft">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">InternCompass Assistant</h2>
                <p className="text-sm text-muted-foreground">Your AI-powered onboarding companion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages with improved layout */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`max-w-3xl w-full ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold">InternCompass</span>
                    </div>
                  )}

                  <Card
                    className={`p-5 transition-all hover:shadow-large ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-medium border-primary/20"
                        : "bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 first:mt-0" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-base font-semibold mt-3 mb-2 first:mt-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside my-3 space-y-1.5" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-3 space-y-1.5" {...props} />,
                            li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                            p: ({ node, ...props }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0" {...props} />,
                            code: ({ node, inline, className, children, ...props }: {
                              node?: unknown;
                              inline?: boolean;
                              className?: string;
                              children?: React.ReactNode;
                            }) =>
                              inline ? (
                                <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono border border-border/50" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className="block bg-muted/50 p-4 rounded-lg overflow-x-auto my-3 text-sm border border-border/50" {...props}>
                                  {children}
                                </code>
                              ),
                            pre: ({ node, ...props }) => <pre className="bg-muted/50 rounded-lg overflow-x-auto my-3 border border-border/50" {...props} />,
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground bg-muted/30 py-2 rounded-r" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                              <a className="text-primary underline hover:text-primary/80 transition-colors font-medium" {...props} />
                            ),
                            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-4 rounded-lg border border-border">
                                <table className="min-w-full border-collapse" {...props} />
                              </div>
                            ),
                            th: ({ node, ...props }) => (
                              <th className="border-b border-border bg-muted/50 px-4 py-2 text-left font-semibold" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="border-b border-border px-4 py-2" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                  </Card>

                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-3 w-3" />
                        Sources referenced:
                      </p>
                      {message.citations.map((citation, idx) => (
                        <Card
                          key={idx}
                          className="p-3 bg-muted/30 border-l-4 border-primary hover:bg-muted/50 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-medium"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{citation.doc_title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{citation.snippet}</p>
                            </div>
                            {citation.page && (
                              <Badge variant="secondary" className="flex-shrink-0">
                                p.{citation.page}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
                <div className="max-w-3xl w-full mr-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold">InternCompass</span>
                  </div>
                  <Card className="p-5 bg-card/80 backdrop-blur-sm shadow-soft">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-border bg-card/80 backdrop-blur-sm shadow-large">
          <div className="max-w-6xl mx-auto p-6 space-y-4">
            {/* Sample Questions with icons */}
            {messages.length <= 1 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3">Quick start questions:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sampleQuestions.map((question, idx) => {
                    const Icon = question.icon;
                    return (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 text-left h-auto py-3 hover:bg-accent/50 hover:scale-[1.02] transition-all"
                        onClick={() => {
                          setInput(question.text);
                          inputRef.current?.focus();
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{question.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input with better styling */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask about onboarding, policies, tech stack, or anything else..."
                  className="pr-12 h-12 text-base shadow-medium focus:shadow-large transition-all border-2 focus:border-primary/50"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {input.length > 0 && `${input.length} chars`}
                </div>
              </div>
              <Button 
                onClick={handleSend} 
                size="lg" 
                className="shadow-medium hover:shadow-large transition-all h-12 px-6 bg-gradient-primary hover:opacity-90" 
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
