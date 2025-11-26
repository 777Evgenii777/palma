import React, { useEffect, useState } from 'react';
import { X, Sparkles, Gift, Copy, Check, Feather } from 'lucide-react';
import NeonButton from './NeonButton';
import { GeneratedWishResponse, Birthday } from '../types';
import { generateBirthdayContent } from '../services/geminiService';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthday: Birthday;
  age: number;
}

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, onClose, birthday, age }) => {
  const [content, setContent] = useState<GeneratedWishResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && birthday) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, birthday]);

  const generate = async () => {
    setLoading(true);
    setContent(null);
    const result = await generateBirthdayContent({
      name: birthday.name,
      age: age,
      relationship: birthday.relationship,
      tone: 'mafia'
    });
    setContent(result);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (content?.wish) {
      navigator.clipboard.writeText(content.wish);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#fffdf5] border-2 border-amber-600 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-amber-200 flex justify-between items-center bg-amber-50">
          <div className="flex items-center gap-2 text-amber-800">
            <Feather className="w-6 h-6" />
            <h3 className="font-mafia text-xl font-bold tracking-wider">Дон советует</h3>
          </div>
          <button onClick={onClose} className="text-amber-800/50 hover:text-red-600 transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 min-h-[300px] flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-t-amber-600 border-r-transparent border-b-amber-600 border-l-transparent animate-spin"></div>
              <p className="text-amber-800 font-mafia text-lg italic">Консильери пишет речь...</p>
            </div>
          ) : content ? (
            <>
              <div className="bg-white border border-amber-200 p-6 shadow-inner relative group transform rotate-1">
                <div className="absolute -top-3 -left-3 text-4xl text-amber-200 font-serif">"</div>
                <p className="text-amber-900 font-mafia text-lg leading-relaxed italic text-center">
                  {content.wish}
                </p>
                <div className="absolute -bottom-6 -right-3 text-4xl text-amber-200 font-serif rotate-180">"</div>
                
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 rounded hover:bg-amber-50 text-amber-400 transition-all opacity-0 group-hover:opacity-100"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2 border-b border-amber-200 pb-1">
                  <Gift className="w-4 h-4" />
                  Подношения
                </h4>
                <ul className="space-y-2">
                  {content.giftIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-amber-900 text-sm bg-amber-100/50 p-3 rounded-sm border-l-4 border-amber-500">
                      <span className="w-2 h-2 rotated-45 bg-amber-600"></span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center text-amber-800/60 font-mafia italic">
               Связь прервана. Попробуйте позже.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-200 flex justify-end gap-3 bg-amber-50">
          <NeonButton variant="secondary" onClick={generate} isLoading={loading} className="text-xs py-2">
            Переписать
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;