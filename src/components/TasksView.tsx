import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import { Search, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { StudyTask } from "../types";

interface TasksViewProps {
  tasks: StudyTask[];
  onComplete: (id: string) => void;
  onAddTask: () => void;
}

export default function TasksView({ tasks, onComplete, onAddTask }: TasksViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Management
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl font-black tracking-tighter text-white uppercase"
          >
            TASK <span className="text-cobalt">COMMAND</span>
          </motion.h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="SEARCH TASKS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 glass rounded-2xl text-[10px] font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 placeholder:text-white/10 uppercase"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddTask}
            className="p-4 bg-cobalt rounded-2xl text-white aura-glow"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </header>

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
          >
            <GlassCard className={`p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 transition-all ${task.progress === 100 ? 'opacity-50 grayscale' : 'hover:border-cobalt/30'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                    {task.subject}
                  </span>
                  {task.urgent && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={8} /> URGENT
                    </span>
                  )}
                </div>
                <h3 className="text-xl md:text-3xl font-black tracking-tight text-white mb-2 group-hover:text-cobalt transition-colors">
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 text-white/40">
                  <span className="text-[10px] font-black tracking-widest uppercase">Weighting: {task.weighting}%</span>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Progress: {task.progress}%</span>
                </div>
              </div>

              <div className="w-full md:w-64">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className="h-full bg-cobalt aura-glow"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={task.progress === 100}
                  onClick={() => onComplete(task.id)}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    task.progress === 100 
                      ? "bg-green-500/20 text-green-500 border border-green-500/20" 
                      : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  {task.progress === 100 ? <CheckCircle2 size={14} /> : null}
                  {task.progress === 100 ? "COMPLETED" : "MARK DONE"}
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )) : (
          <p className="text-white/20 text-[10px] font-black tracking-widest uppercase text-center py-20">No tasks found</p>
        )}
      </div>
    </div>
  );
}
