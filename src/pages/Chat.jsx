import { useState, useRef, useEffect } from 'react';
import Avatar from '../components/Avatar';
import { generateResponse } from '../lib/ai';
import { Send, Phone, Mic, MicOff, Volume2, Square } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm MindEase. I'm here to listen. How are you feeling today?", id: 'init' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentMood, setCurrentMood] = useState('neutral');

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(false); // Default OFF

    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Optional: Auto-send if needed, but safer to let user confirm
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Text to Speech Function
    const speak = (text) => {
        if (!('speechSynthesis' in window)) return;

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.05; // Slightly faster, more conversational
        utterance.pitch = 1.1; // Higher pitch tends to sound friendlier/happier

        // Attempt to select a better voice
        // Chrome loads voices asynchronously, so we try our best here.
        const voices = window.speechSynthesis.getVoices();

        // Priority list of "Friendly/Natural" voices often available in browsers
        const preferredVoices = [
            'Google US English',      // Chrome (Very natural)
            'Google UK English Female',
            'Samantha',               // Mac (High quality)
            'Microsoft Zira',         // Windows (Decent)
            'Karen',
            'Rishi'
        ];

        let selectedVoice = null;
        for (const name of preferredVoices) {
            selectedVoice = voices.find(v => v.name.includes(name));
            if (selectedVoice) break;
        }

        // Fallback to any generic female voice if specific ones aren't found
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Female'));
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput(''); // Clear input for new speech
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic Start Error", e);
            }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        setInput('');
        stopSpeaking(); // Stop any previous speech

        // Add User Message
        const userMsg = { role: 'user', content: userText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            // Get AI Response with Context
            const history = messages.slice(-3);
            const response = await generateResponse(userText, history);

            setCurrentMood(response.mood);

            const aiMsg = {
                role: 'assistant',
                content: response.text,
                isCrisis: response.isCrisis,
                id: Date.now() + 1
            };

            setMessages(prev => [...prev, aiMsg]);

            // Auto-Speak ONLY if enabled
            if (autoSpeak) {
                speak(response.text);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] max-w-2xl mx-auto">

            {/* Avatar Container & Controls */}
            <div className="flex-none flex justify-center py-4 relative">
                <Avatar mood={currentMood} className="transform scale-75 md:scale-100" />

                {/* Auto-Speak Toggle */}
                <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`absolute top-0 right-0 md:right-10 p-2 rounded-full transition-all text-xs font-bold flex items-center gap-1 border
                        ${autoSpeak
                            ? 'bg-mint-100 text-mint-700 border-mint-200'
                            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                    title={autoSpeak ? "Disable Auto-Speech" : "Enable Auto-Speech"}
                >
                    {autoSpeak ? <Volume2 size={14} /> : <div className="relative"><Volume2 size={14} /><div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-400 -rotate-45 transform origin-center"></div></div>}
                    <span className="hidden md:inline">{autoSpeak ? "Auto-Read: ON" : "Auto-Read: OFF"}</span>
                </button>

                {/* Speaking Indicator */}
                {isSpeaking && (
                    <div className="absolute top-4 left-0 md:left-10 animate-pulse bg-mint-100 text-mint-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Volume2 size={12} /> Speaking...
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`
                                max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed animate-in slide-in-from-bottom-2 relative group
                                ${msg.role === 'user'
                                    ? 'bg-mint-500 text-white rounded-br-none shadow-md shadow-mint-100'
                                    : 'bg-white text-slate-700 border border-lavender-100 rounded-bl-none shadow-sm'
                                }
                                ${msg.isCrisis ? 'border-red-200 bg-red-50 text-red-800' : ''}
                            `}
                        >
                            {msg.content}

                            {/* Play Button for AI Messages */}
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={() => speak(msg.content)}
                                    className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-mint-600 bg-white rounded-full shadow-sm border border-slate-100"
                                    title="Read Aloud"
                                >
                                    <Volume2 size={14} />
                                </button>
                            )}

                            {msg.isCrisis && (
                                <div className="mt-3 pt-3 border-t border-red-200">
                                    <p className="font-semibold text-xs uppercase mb-2">Emergency Resources:</p>
                                    <a href="tel:988" className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700">
                                        <Phone size={16} /> Call 988 (Crisis Line)
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-lavender-50 shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="flex-none pt-4 pb-2">

                {/* Floating Stop Button (Only when speaking) */}
                {isSpeaking && (
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
                        <button
                            onClick={stopSpeaking}
                            className="bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold hover:bg-slate-900 transition-transform hover:scale-105"
                        >
                            <Square size={12} fill="currentColor" /> Stop Speaking
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Type a message..."}
                            className={`w-full pl-6 pr-12 py-4 rounded-full border bg-white outline-none shadow-lg shadow-lavender-100/50 transition-all font-medium text-slate-700
                                ${isListening ? 'border-mint-400 ring-4 ring-mint-50 animate-pulse' : 'border-slate-200 focus:border-mint-400 focus:ring-4 focus:ring-mint-50'}
                            `}
                            disabled={loading || isListening}
                        />

                        {/* Mic Button INSIDE Input */}
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`absolute right-2 top-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-mint-600 hover:bg-slate-50'}`}
                            title="Voice Input"
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || loading || isListening}
                        className="p-4 bg-mint-500 text-white rounded-full hover:bg-mint-600 disabled:opacity-50 disabled:hover:bg-mint-500 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
