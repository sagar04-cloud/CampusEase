import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Paperclip } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function AiChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi there! I am your AI assistant powered by Gemini. How can I help you today? I can help you draft a formal letter, search for campus rules, or answer any college-related queries.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Simulate API call to Gemini
        setTimeout(() => {
            const isLetterRequest = userMsg.content.toLowerCase().includes('letter') || userMsg.content.toLowerCase().includes('leave');

            let responseContent = "I can certainly help you with that. The college administration usually handles these requests within 2-3 business days.";

            if (isLetterRequest) {
                responseContent = `Here is a formal letter draft you requested:

[Date]

To,
The Principal / Head of Department
[College Name]
[City, State, Zip Code]

Subject: Request for [Specific Topic mentioned by user, e.g., Leave of Absence]

Respected Sir/Madam,

I am writing this letter to bring to your attention that [Detailed reason related to user input]. Because of this, I will be unable to [attend classes/participate in event/etc.] from [Start Date] to [End Date].

I kindly request you to consider my application and grant me the necessary [leave/permission/etc.]. I will assure you that I will catch up with the pending academic work as soon as possible.

Thank you for your understanding.

Yours sincerely,

[Your Name]
[Roll Number / ID]
[Class/Department]`;
            } else if (userMsg.content.toLowerCase().includes('event')) {
                responseContent = "If you're looking to organize an event, please use the 'New Request' button on your dashboard. You'll need to provide an event proposal, budget estimation, and target audience details. The faculty will review it within 48 hours.";
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-2">
                        Campus Assistant <Sparkles className="w-6 h-6 text-amber-500" />
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Powered by Google Gemini API to draft letters and answer queries.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden border border-gray-100">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div
                                className={`flex-1 overflow-hidden px-5 py-3.5 rounded-2xl shadow-sm text-sm sm:text-base max-w-[85%] ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 ring-1 ring-gray-900/5'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                <Loader2 size={20} className="animate-spin" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl bg-white text-gray-500 border border-gray-100 rounded-tl-none ring-1 ring-gray-900/5 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-2 relative">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all overflow-hidden flex items-end p-2 relative">
                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for a letter template or a campus question..."
                                className="block w-full resize-none border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 max-h-32 min-h-[44px]"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 md:bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={20} className="ml-1" />
                        </button>
                    </form>
                    <div className="text-center mt-2 text-xs text-gray-400">
                        For demo purposes, the AI will reply to any input. Mentions of "letter" will generate a template.
                    </div>
                </div>
            </div>
        </div>
    );
}
