import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface FocusTimerProps {
  onComplete?: (duration: number) => void;
  initialTime: number;
  timeLeft: number;
  isActive: boolean;
  setInitialTime: (t: number) => void;
  setTimeLeft: (t: number) => void;
  setIsActive: (a: boolean) => void;
}

export default function FocusTimer({ 
  onComplete,
  initialTime,
  timeLeft,
  isActive,
  setInitialTime,
  setTimeLeft,
  setIsActive
}: FocusTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / initialTime) * 100;

  const durations = [
    { label: "15m", value: 15 * 60 },
    { label: "25m", value: 25 * 60 },
    { label: "45m", value: 45 * 60 },
    { label: "60m", value: 60 * 60 },
  ];

  const handleDurationChange = (value: number) => {
    setIsActive(false);
    setInitialTime(value);
    setTimeLeft(value);
  };

  const [customMinutes, setCustomMinutes] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes);
    if (!isNaN(mins) && mins > 0) {
      handleDurationChange(mins * 60);
      setCustomMinutes("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Duration Selector */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2 p-1 glass rounded-2xl overflow-x-auto max-w-full">
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => handleDurationChange(d.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                initialTime === d.value 
                  ? "bg-cobalt text-white aura-glow" 
                  : "text-white/20 hover:text-white/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="CUSTOM MINS..."
            className="w-32 px-4 py-2 glass rounded-xl text-[10px] font-black tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-cobalt/50 border-white/5 placeholder:text-white/10 uppercase"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/10 transition-all"
          >
            SET
          </motion.button>
        </form>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Breathing Aura */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.3 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-cobalt blur-3xl"
            />
          )}
        </AnimatePresence>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#2E5BFF"
            strokeWidth="8"
            strokeDasharray="754"
            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Time Display */}
        <div className="z-10 text-6xl font-black tracking-tighter text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsActive(!isActive)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-cobalt text-white shadow-lg aura-glow"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsActive(false);
            setTimeLeft(initialTime);
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full glass text-white/60 hover:text-white"
        >
          <RotateCcw size={24} />
        </motion.button>
      </div>
    </div>
  );
}
