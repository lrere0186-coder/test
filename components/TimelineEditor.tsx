'use client';
import React from 'react';

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

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleEventChange = (index: number, field: 'date' | 'text', value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    onChange(newEvents);
  };

  const addEvent = () => {
    if (events.length < maxEvents) {
      onChange([...events, { date: '', text: '' }]);
    }
  };

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onChange(newEvents);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-300">
          Timeline (max {maxEvents} events)
        </label>
        {events.length < maxEvents && (
          <button
            type="button"
            onClick={addEvent}
            className="px-3 py-1 bg-[#D4AF37] text-[#0A0A0A] text-sm font-bold rounded-md hover:bg-yellow-300 transition-colors"
          >
            + Add Event
          </button>
        )}
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const wordCount = countWords(event.text);
          const isOverLimit = wordCount > maxWords;

          return (
            <div
              key={index}
              className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => removeEvent(index)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                title="Remove event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={event.date}
                    onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                    placeholder="e.g., 1990 or Jan 2000"
                    className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">
                    Event (max {maxWords} words)
                  </label>
                  <textarea
                    rows={2}
                    value={event.text}
                    onChange={(e) => handleEventChange(index, 'text', e.target.value)}
                    placeholder="Describe what happened..."
                    className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:outline-none resize-none"
                  />
                  <p className={`text-right text-xs mt-1 ${isOverLimit ? 'text-red-400' : 'text-gray-500'}`}>
                    {wordCount} / {maxWords} words {isOverLimit && '(Too many!)'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No timeline events yet. Click "+ Add Event" to start building your timeline.
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEditor;
