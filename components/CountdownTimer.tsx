
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

  const timeComponents = [
    { label: 'Days', value: formatTimeUnit(timeLeft.days) },
    { label: 'Hours', value: formatTimeUnit(timeLeft.hours) },
    { label: 'Minutes', value: formatTimeUnit(timeLeft.minutes) },
    { label: 'Seconds', value: formatTimeUnit(timeLeft.seconds) },
  ];

  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-8">
      {timeComponents.map((component, index) => (
        <div key={component.label} className="flex items-center">
          <div className="text-center">
            <div className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-[#F5F5F0]">
              {component.value}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-[#D4AF37]/80">
              {component.label}
            </div>
          </div>
          {index < timeComponents.length - 1 && <div className="text-4xl md:text-6xl text-[#D4AF37]/50 mx-2 md:mx-4">:</div>}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
