import { useState } from "react";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";
import { Clock, MapPin, Calendar, Plus } from "lucide-react";
import { ClassSession } from "../types";

interface ScheduleViewProps {
  schedule: ClassSession[];
  onAddClass: () => void;
}

export default function ScheduleView({ schedule, onAddClass }: ScheduleViewProps) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const filteredSchedule = schedule.filter(s => s.day === selectedDay);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-16 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-0.5 bg-cobalt rounded-full aura-glow" />
            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
              Timetable
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl font-black tracking-tighter text-white uppercase"
          >
            WEEKLY <span className="text-cobalt">FLOW</span>
          </motion.h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddClass}
          className="px-8 py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow flex items-center gap-2"
        >
          <Plus size={16} /> ADD CLASS
        </motion.button>
      </header>

      {/* Day Selector */}
      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {days.map((day, idx) => (
          <motion.button
            key={day}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDay(idx)}
            className={`flex flex-col items-center gap-2 p-3 md:p-6 rounded-[24px] border transition-all ${
              idx === selectedDay
                ? "bg-cobalt border-cobalt aura-glow"
                : "glass border-white/5 hover:border-white/10"
            }`}
          >
            <span className={`text-[8px] md:text-[10px] font-black tracking-widest uppercase ${
              idx === selectedDay ? "text-white" : "text-white/30"
            }`}>
              {day}
            </span>
            <span className="text-sm md:text-xl font-black">
              {new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + idx)).getDate()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-6">
        {filteredSchedule.length > 0 ? filteredSchedule.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 hover:border-cobalt/30 transition-all">
              <div className="flex flex-col">
                <span className="text-2xl md:text-4xl font-black tracking-tight text-white group-hover:text-cobalt transition-colors">
                  {session.startTime}
                </span>
                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
                  {session.endTime}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-cobalt/10 border border-cobalt/20 text-[8px] font-black text-cobalt uppercase tracking-widest">
                    {session.subject}
                  </span>
                </div>
                <h3 className="text-xl md:text-3xl font-black tracking-tight text-white mb-2">
                  {session.name}
                </h3>
                <div className="flex items-center gap-4 text-white/40">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-cobalt" />
                    <span className="text-xs font-bold">{session.room}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-cobalt" />
                    <span className="text-xs font-bold">90 mins</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-8 py-4 glass rounded-2xl text-[10px] font-black tracking-widest uppercase border-white/5 hover:bg-white/5"
              >
                VIEW DETAILS
              </motion.button>
            </GlassCard>
          </motion.div>
        )) : (
          <p className="text-white/20 text-[10px] font-black tracking-widest uppercase text-center py-20">No classes scheduled</p>
        )}
      </div>
    </div>
  );
}
