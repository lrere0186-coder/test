'use client';
import React, { useState, useRef, KeyboardEvent } from 'react';

export interface TimelineEvent {
  date: string;
  text: string;
}

interface TimelineEditorProps {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ events, onChange }) => {
  const maxEvents = 12;
  const maxWords = 30;
  const [currentDate, setCurrentDate] = useState('');
  const [currentText, setCurrentText] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentText.trim() && events.length < maxEvents) {
      const wordCount = countWords(currentText);
      if (wordCount <= maxWords) {
        onChange([...events, { date: currentDate.trim(), text: currentText.trim() }]);
        setCurrentDate('');
        setCurrentText('');
      }
    }
  };

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onChange(newEvents);
  };

  const currentWordCount = countWords(currentText);
  const isOverLimit = currentWordCount > maxWords;

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-gray-300">
        Timeline (max {maxEvents} events)
      </label>

      {/* Timeline verticale */}
      <div className="relative">
        {/* Ligne verticale de la timeline */}
        {events.length > 0 && (
          <div className="absolute left-20 top-0 bottom-0 w-0.5 bg-[#D4AF37]/30"></div>
        )}

        {/* Events existants */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4 group">
              {/* Date à gauche */}
              <div className="w-16 flex-shrink-0 text-right">
                <span className="text-[#D4AF37] text-sm font-bold">
                  {event.date || '—'}
                </span>
              </div>

              {/* Flèche / Point */}
              <div className="relative flex items-center justify-center w-8 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#D4AF37] border-4 border-[#0A0A0A] z-10"></div>
                <svg
                  className="absolute left-3 w-4 h-4 text-[#D4AF37]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </div>

              {/* Texte à droite */}
              <div className="flex-1 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-3 group-hover:border-[#D4AF37]/40 transition-colors">
                <p className="text-gray-300 text-sm">{event.text}</p>
              </div>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => removeEvent(index)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                title="Remove event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Input pour nouvel event */}
        {events.length < maxEvents && (
          <div className="relative flex items-start gap-4 mt-6">
            {/* Input date */}
            <input
              type="text"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              placeholder="Year"
              className="w-16 flex-shrink-0 text-right bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
            />

            {/* Flèche / Point */}
            <div className="relative flex items-center justify-center w-8 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-gray-600 border-4 border-[#0A0A0A] z-10"></div>
              <svg
                className="absolute left-3 w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
              </svg>
            </div>

            {/* Input texte */}
            <div className="flex-1">
              <input
                ref={textInputRef}
                type="text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the event... (Press Enter to add)"
                disabled={isOverLimit}
                className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-3 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {currentText && (
                <p className={`text-xs mt-1 ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
                  {currentWordCount} / {maxWords} words {isOverLimit && '(Too many!)'}
                </p>
              )}
            </div>
          </div>
        )}

        {events.length >= maxEvents && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Maximum de {maxEvents} events atteint
          </p>
        )}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
          Aucun événement dans la timeline. Commencez à ajouter des moments importants !
        </div>
      )}
    </div>
  );
};

export default TimelineEditor;
