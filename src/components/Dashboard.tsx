import { motion } from "motion/react";
import GlassCard from "./GlassCard";
import FocusTimer from "./FocusTimer";
import { Clock, MapPin, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { StudyTask, ClassSession } from "../types";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

interface DashboardProps {
  tasks: StudyTask[];
  schedule: ClassSession[];
  sessions: any[];
  onSessionComplete: (duration: number) => void;
  timerInitialTime: number;
  timerTimeLeft: number;
  timerIsActive: boolean;
  setTimerInitialTime: (t: number) => void;
  setTimerTimeLeft: (t: number) => void;
  setTimerIsActive: (a: boolean) => void;
  streak: number;
  dailyGoal: number;
  setDailyGoal: (g: number) => void;
  onAddTask: () => void;
  onAddResource: () => void;
  onAddClass: () => void;
}

export default function Dashboard({ 
  tasks, 
  schedule, 
  sessions, 
  onSessionComplete,
  timerInitialTime,
  timerTimeLeft,
  timerIsActive,
  setTimerInitialTime,
  setTimerTimeLeft,
  setTimerIsActive,
  streak,
  dailyGoal,
  setDailyGoal,
  onAddTask,
  onAddResource,
  onAddClass
}: DashboardProps) {
  const urgentTasks = tasks.filter(t => t.urgent && t.progress < 100).slice(0, 3);
  const pendingTasks = tasks.filter(t => t.progress < 100);
  const nextClass = schedule[0]; 
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [tempGoalMins, setTempGoalMins] = useState((dailyGoal / 60).toString());
  
  // Calculate daily focus time
  const today = new Date().toDateString();
  const dailyFocusTime = sessions
    .filter(s => new Date(s.date).toDateString() === today)
    .reduce((acc, s) => acc + s.duration, 0);
  
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Your future self will thank you for the work you do today.",
    "Focus on being productive instead of busy.",
    "Small progress is still progress. Keep flowing."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const handleSetGoal = () => {
    setIsGoalModalOpen(true);
  };

  const saveGoal = () => {
    const val = parseInt(tempGoalMins);
    if (!isNaN(val) && val > 0) {
      setDailyGoal(val * 60);
      setIsGoalModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-16 max-w-7xl mx-auto">
      {/* Header Section with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <header className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-0.5 bg-cobalt rounded-full aura-glow" />
            <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
              Command Center
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl font-black tracking-tighter text-white uppercase"
          >
            {getGreeting()}, <span className="text-cobalt">ALEX</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm md:text-lg font-medium tracking-wide max-w-2xl leading-relaxed italic"
          >
            "{randomQuote}"
          </motion.p>
        </header>

        {/* Quick Stats Row */}
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-4 md:p-6 rounded-[32px] border-white/5 flex flex-col items-center gap-1 min-w-[100px] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-cobalt/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl md:text-4xl font-black text-cobalt relative z-10">{streak}</span>
            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase relative z-10">Day Streak</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass p-4 md:p-6 rounded-[32px] border-white/5 flex flex-col items-center gap-1 min-w-[100px] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-cobalt/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl md:text-4xl font-black text-white relative z-10">{Math.round(dailyFocusTime / 60)}m</span>
            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase relative z-10">Focused Today</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass p-4 md:p-6 rounded-[32px] border-white/5 flex flex-col items-center gap-1 min-w-[100px] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-cobalt/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl md:text-4xl font-black text-purple-500 relative z-10">
              {tasks.filter(t => t.progress === 100).length}
            </span>
            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase relative z-10">Done</span>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add Task", icon: "⚡", action: onAddTask },
          { label: "New Note", icon: "📝", action: onAddResource },
          { label: "Log Study", icon: "📚", action: onAddClass },
          { label: "Set Goal", icon: "🎯", action: handleSetGoal }
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="glass p-4 rounded-2xl border-white/5 flex items-center gap-3 hover:border-cobalt/30 transition-all group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-[10px] font-black tracking-widest text-white/40 group-hover:text-white uppercase">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8">
        {/* Focus Timer */}
        <div className="lg:col-span-8 order-1 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="flex flex-col items-center justify-center py-10 md:py-16 relative overflow-hidden" glow>
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(46,91,255,0.05)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(46,91,255,0.05)_0%,transparent_70%)] rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <h2 className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                  Deep Work Mode
                </h2>
              </div>
              <FocusTimer 
                onComplete={onSessionComplete}
                initialTime={timerInitialTime}
                timeLeft={timerTimeLeft}
                isActive={timerIsActive}
                setInitialTime={setTimerInitialTime}
                setTimeLeft={setTimerTimeLeft}
                setIsActive={setTimerIsActive}
              />

              {/* Daily Goal Progress */}
              <div className="mt-12 w-full max-w-md px-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Daily Goal</span>
                  <span className="text-[8px] md:text-[10px] font-black text-cobalt uppercase tracking-widest">{Math.min(100, Math.round((dailyFocusTime / dailyGoal) * 100))}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (dailyFocusTime / dailyGoal) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cobalt to-purple-500 aura-glow"
                  />
                </div>
                <p className="mt-3 text-center text-[8px] font-black tracking-widest text-white/10 uppercase">
                  {dailyFocusTime >= dailyGoal ? "Goal Smashed!" : `${Math.max(0, Math.round((dailyGoal - dailyFocusTime) / 60))}m remaining to reach daily target`}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pending Tasks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cobalt/20 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-cobalt" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-white uppercase">
                    Pending <span className="text-cobalt">Tasks</span>
                  </h2>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  {pendingTasks.length} Remaining
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTasks.length > 0 ? pendingTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cobalt/30 transition-all group flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white group-hover:text-cobalt transition-colors">
                        {task.title}
                      </span>
                      <span className="text-[8px] font-black tracking-[0.2em] text-white/20 uppercase">
                        {task.subject}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black text-white/40">{task.progress}%</span>
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cobalt transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-12 text-center">
                    <p className="text-white/20 text-[10px] font-black tracking-widest uppercase">All caught up!</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Up Next & Urgent Tasks */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 order-2">
          {/* Up Next */}
          {nextClass && (
            <GlassCard className="relative overflow-hidden group border-cobalt/20 p-5 md:p-6">
              <div className="absolute -top-6 -right-6 p-4 text-cobalt/5 group-hover:text-cobalt/10 transition-all duration-500 scale-125 hidden sm:block">
                <Clock size={100} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-4">
                  Next Session
                </h3>
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-2">
                      {nextClass.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-white/50">
                      <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <MapPin size={12} className="text-cobalt" />
                        <span className="text-[10px] font-bold">{nextClass.room}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <Clock size={12} className="text-cobalt" />
                        <span className="text-[10px] font-bold">{nextClass.startTime}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(46, 91, 255, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 glass rounded-2xl text-[10px] font-black tracking-widest transition-all border-white/10 uppercase"
                  >
                    ENTER CLASSROOM
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Urgent Tasks */}
          <GlassCard className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h3 className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                Priority
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertCircle size={10} className="text-red-500" />
                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Urgent</span>
              </div>
            </div>
            <div className="space-y-6 md:space-y-8">
              {urgentTasks.length > 0 ? urgentTasks.map((task) => (
                <div key={task.id} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-black tracking-tight text-white/80 group-hover:text-cobalt transition-colors">
                      {task.title}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-black text-white/30">{task.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-cobalt aura-glow"
                    />
                  </div>
                </div>
              )) : (
                <p className="text-white/20 text-[10px] font-black tracking-widest uppercase text-center py-4">No urgent tasks</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {isGoalModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGoalModalOpen(false)}
              className="absolute inset-0 bg-bg/90"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass rounded-[40px] p-8 border-cobalt/20 aura-glow flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-white uppercase">
                  SET <span className="text-cobalt">GOAL</span>
                </h2>
                <button 
                  onClick={() => setIsGoalModalOpen(false)}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black tracking-widest text-white/20 uppercase">
                  Daily Focus Goal (Minutes)
                </label>
                <input
                  type="number"
                  value={tempGoalMins}
                  onChange={(e) => setTempGoalMins(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-cobalt/50 transition-all"
                  placeholder="e.g. 120"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveGoal}
                className="w-full py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow"
              >
                SAVE GOAL
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
