import { useState, useRef, useEffect } from "react";
import { X, Send, Mic, MicOff, Volume2, VolumeX, Leaf, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findResponse } from "./chatResponses";
import { translateToKannada, getKannadaVoice } from "./kannadaTranslations";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

interface Message {
  id: number;
  text: string;
  textKannada?: string;
  isBot: boolean;
  timestamp: Date;
}

interface AssistBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistBotModal = ({ isOpen, onClose }: AssistBotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm AssistBot 🌱 I'm here to help you navigate CarbonChain. Ask me about buying credits, submitting projects, or how verification works!",
      textKannada: "ನಮಸ್ಕಾರ! ನಾನು ಅಸಿಸ್ಟ್‌ಬಾಟ್ 🌱 ಕಾರ್ಬನ್‌ಚೈನ್ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಕ್ರೆಡಿಟ್ ಖರೀದಿ, ಯೋಜನೆ ಸಲ್ಲಿಕೆ ಅಥವಾ ಪರಿಶೀಲನೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂಬುದರ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isKannadaMode, setIsKannadaMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speakResponse = (text: string, useKannada: boolean = false) => {
    if (isSpeechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      if (useKannada) {
        const kannadaVoice = getKannadaVoice();
        if (kannadaVoice) {
          utterance.voice = kannadaVoice;
        }
        utterance.lang = 'kn-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Get bot response
    setTimeout(() => {
      const englishResponse = findResponse(inputValue);
      const kannadaResponse = translateToKannada(englishResponse);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: englishResponse,
        textKannada: kannadaResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Speak in the current language mode
      if (isKannadaMode) {
        speakResponse(kannadaResponse, true);
      } else {
        speakResponse(englishResponse, false);
      }
    }, 500);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleKannadaMode = () => {
    setIsKannadaMode(!isKannadaMode);
    
    // Speak a confirmation in the new language
    if (!isKannadaMode) {
      speakResponse("ಕನ್ನಡ ಮೋಡ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ", true);
    } else {
      speakResponse("Switched to English mode", false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="bg-gradient-primary p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">AssistBot</h3>
            <p className="text-xs text-white/80">
              {isKannadaMode ? "ನಿಮ್ಮ ಕಾರ್ಬನ್‌ಚೈನ್ ಮಾರ್ಗದರ್ಶಿ" : "Your CarbonChain Guide"}
            </p>
          </div>
          
          {/* Kannada Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleKannadaMode}
            className={`text-white hover:bg-white/20 px-2 py-1 text-xs font-medium rounded-full transition-all ${
              isKannadaMode ? "bg-white/30 ring-2 ring-white/50" : ""
            }`}
            title={isKannadaMode ? "Switch to English" : "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"}
          >
            <Languages className="w-4 h-4 mr-1" />
            {isKannadaMode ? "EN" : "ಕನ್ನಡ"}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className="text-white hover:bg-white/20"
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Language Mode Indicator */}
        {isKannadaMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
              🇮🇳 ಕನ್ನಡ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ • Kannada Mode Active
            </p>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.isBot
                      ? "bg-accent text-accent-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-3 h-3" />
                      <span className="text-xs font-medium">AssistBot</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">
                    {message.isBot && isKannadaMode && message.textKannada
                      ? message.textKannada
                      : message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isKannadaMode ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ..." : "Type or speak your question..."}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-primary">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isListening && (
            <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">
              🎤 {isKannadaMode ? "ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ" : "Listening... Speak now"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistBotModal;
