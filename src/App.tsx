/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ScheduleView from "./components/ScheduleView";
import TasksView from "./components/TasksView";
import VaultView from "./components/VaultView";
import Modal from "./components/Modal";
import { StudyTask, Resource, ClassSession } from "./types";
import { Plus, Sparkles } from "lucide-react";

const INITIAL_TASKS: StudyTask[] = [
  { id: "1", title: "Quantum Mechanics Problem Set", subject: "Physics", deadline: new Date(), weighting: 15, progress: 45, urgent: true },
  { id: "2", title: "Cell Biology Lab Report", subject: "Science", deadline: new Date(), weighting: 10, progress: 80, urgent: true },
  { id: "3", title: "History Essay Draft", subject: "History", deadline: new Date(), weighting: 20, progress: 15, urgent: true },
];

const INITIAL_RESOURCES: Resource[] = [
  { id: "1", title: "Quantum Mechanics Vol. 1", type: "Textbook", subject: "Physics", url: "#" },
  { id: "2", title: "Cell Bio Lecture Slides", type: "Slide", subject: "Science", url: "#" },
];

const INITIAL_SCHEDULE: ClassSession[] = [
  { id: "1", name: "Physics", room: "Room 12", startTime: "09:00", endTime: "10:30", day: 1, subject: "Physics" },
  { id: "2", name: "Calculus III", room: "Lecture Hall A", startTime: "11:00", endTime: "12:30", day: 1, subject: "Math" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem("studyflow_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem("studyflow_resources");
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });
  const [schedule, setSchedule] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem("studyflow_schedule");
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });
  const [sessions, setSessions] = useState<any[]>(() => {
    const saved = localStorage.getItem("studyflow_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("studyflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("studyflow_resources", JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem("studyflow_schedule", JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem("studyflow_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addTask = (task: Omit<StudyTask, "id">) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, progress: 100 } : t));
  };

  const addResource = (resource: Omit<Resource, "id">) => {
    const newResource = { ...resource, id: Math.random().toString(36).substr(2, 9) };
    setResources([newResource, ...resources]);
    setIsResourceModalOpen(false);
  };

  const logSession = (duration: number) => {
    const newSession = { id: Date.now(), duration, date: new Date() };
    setSessions([newSession, ...sessions]);
  };

  const addClass = (session: Omit<ClassSession, "id">) => {
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSchedule([...schedule, newSession]);
    setIsScheduleModalOpen(false);
  };

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem("studyflow_daily_goal");
    return saved ? JSON.parse(saved) : 120 * 60; // Default 120m
  });

  useEffect(() => {
    localStorage.setItem("studyflow_daily_goal", JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  const calculateStreak = (sessions: any[]) => {
    if (sessions.length === 0) return 0;
    
    const sessionsByDay: Record<string, number> = {};
    sessions.forEach(s => {
      const date = new Date(s.date).toDateString();
      sessionsByDay[date] = (sessionsByDay[date] || 0) + s.duration;
    });

    let currentStreak = 0;
    let d = new Date();
    const todayStr = d.toDateString();
    
    // If today's goal is not met (10m = 600s), we check if yesterday's was.
    // If yesterday's wasn't either, streak is 0.
    if ((sessionsByDay[todayStr] || 0) < 600) {
      d.setDate(d.getDate() - 1);
      if ((sessionsByDay[d.toDateString()] || 0) < 600) {
        return 0;
      }
    }
    
    // Now d is the most recent day that met the goal.
    while ((sessionsByDay[d.toDateString()] || 0) >= 600) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    }
    return currentStreak;
  };

  const streak = calculateStreak(sessions);

  // Timer State
  const [timerInitialTime, setTimerInitialTime] = useState(() => {
    const saved = localStorage.getItem("studyflow_timer_initial");
    return saved ? JSON.parse(saved) : 25 * 60;
  });
  const [timerTimeLeft, setTimerTimeLeft] = useState(() => {
    const saved = localStorage.getItem("studyflow_timer_left");
    return saved ? JSON.parse(saved) : 25 * 60;
  });
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [isTimerCompleteModalOpen, setIsTimerCompleteModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("studyflow_timer_initial", JSON.stringify(timerInitialTime));
  }, [timerInitialTime]);

  useEffect(() => {
    localStorage.setItem("studyflow_timer_left", JSON.stringify(timerTimeLeft));
  }, [timerTimeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerIsActive && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerTimeLeft === 0) {
      setTimerIsActive(false);
      logSession(timerInitialTime);
      setIsTimerCompleteModalOpen(true);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, timerTimeLeft, timerInitialTime]);

  const handleCloseTimerModal = () => {
    setIsTimerCompleteModalOpen(false);
    setTimerTimeLeft(timerInitialTime);
  };

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            tasks={tasks} 
            schedule={schedule} 
            sessions={sessions} 
            onSessionComplete={logSession}
            timerInitialTime={timerInitialTime}
            timerTimeLeft={timerTimeLeft}
            timerIsActive={timerIsActive}
            setTimerInitialTime={setTimerInitialTime}
            setTimerTimeLeft={setTimerTimeLeft}
            setTimerIsActive={setTimerIsActive}
            streak={streak}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            onAddTask={() => setIsTaskModalOpen(true)}
            onAddResource={() => setIsResourceModalOpen(true)}
            onAddClass={() => setIsScheduleModalOpen(true)}
          />
        );
      case "schedule":
        return <ScheduleView schedule={schedule} onAddClass={() => setIsScheduleModalOpen(true)} />;
      case "tasks":
        return (
          <TasksView
            tasks={tasks}
            onComplete={completeTask}
            onAddTask={() => setIsTaskModalOpen(true)}
          />
        );
      case "vault":
        return (
          <VaultView
            resources={resources}
            onAddResource={() => setIsResourceModalOpen(true)}
          />
        );
      default:
        return (
          <Dashboard 
            tasks={tasks} 
            schedule={schedule} 
            sessions={sessions} 
            onSessionComplete={logSession}
            timerInitialTime={timerInitialTime}
            timerTimeLeft={timerTimeLeft}
            timerIsActive={timerIsActive}
            setTimerInitialTime={setTimerInitialTime}
            setTimerTimeLeft={setTimerTimeLeft}
            setTimerIsActive={setTimerIsActive}
            streak={streak}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            onAddTask={() => setIsTaskModalOpen(true)}
            onAddResource={() => setIsResourceModalOpen(true)}
            onAddClass={() => setIsScheduleModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-cobalt selection:text-white">
      {/* Background Aura Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(46,91,255,0.1)_0%,transparent_70%)] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(46,91,255,0.05)_0%,transparent_70%)] rounded-full" />
        
        {/* Floating Decorative Blobs */}
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-[radial-gradient(circle,rgba(46,91,255,0.05)_0%,transparent_70%)] rounded-full" />
        <div className="absolute bottom-[30%] left-[20%] w-96 h-96 bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] rounded-full" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="md:pl-32 pb-32 md:pb-0 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAdd={addTask}
      />
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onAdd={addResource}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onAdd={addClass}
      />
      <TimerCompleteModal
        isOpen={isTimerCompleteModalOpen}
        onClose={handleCloseTimerModal}
      />
    </div>
  );
}

function TimerCompleteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/90"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass rounded-[40px] p-12 border-cobalt/20 aura-glow flex flex-col items-center text-center gap-8"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors"
            >
              <Plus className="rotate-45" size={24} />
            </button>

            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(46,91,255,0.3)_0%,transparent_70%)] scale-150 rounded-full" />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5
                }}
                className="relative text-7xl"
              >
                🌸
              </motion.div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase">
                SESSION <span className="text-cobalt">COMPLETE</span>
              </h2>
              <p className="text-xl font-medium text-white/60 italic">
                "Yr session is over pookie"
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow"
            >
              BACK TO FLOW
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ScheduleModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (session: any) => void }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [subject, setSubject] = useState("Math");
  const [customSubject, setCustomSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ 
      name, 
      room, 
      startTime, 
      endTime, 
      subject: subject === "Other" ? customSubject : subject, 
      day: new Date().getDay() 
    });
    setName("");
    setRoom("");
    setCustomSubject("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Class Session">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Class Name</label>
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            placeholder="e.g. Advanced Calculus..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Room</label>
            <input
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
              placeholder="e.g. Hall A..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 appearance-none"
            >
              {['Math', 'Science', 'History', 'Literature', 'Computer Science', 'Physics', 'Chemistry', 'Other'].map(s => (
                <option key={s} value={s} className="bg-bg">{s}</option>
              ))}
            </select>
          </div>
        </div>

        {subject === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Custom Subject</label>
            <input
              required
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
              placeholder="Enter subject name..."
            />
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow"
        >
          ADD TO TIMETABLE
        </motion.button>
      </form>
    </Modal>
  );
}

function TaskModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (task: any) => void }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Math");
  const [customSubject, setCustomSubject] = useState("");
  const [weighting, setWeighting] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      subject: subject === "Other" ? customSubject : subject,
      weighting,
      progress: 0,
      deadline: new Date(),
      urgent: weighting > 20
    });
    setTitle("");
    setCustomSubject("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Task Title</label>
          <input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            placeholder="e.g. Physics Problem Set..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 appearance-none"
            >
              {['Math', 'Science', 'History', 'Literature', 'Computer Science', 'Physics', 'Chemistry', 'Other'].map(s => (
                <option key={s} value={s} className="bg-bg">{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Weighting (%)</label>
            <input
              type="number"
              value={weighting}
              onChange={(e) => setWeighting(Number(e.target.value))}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            />
          </div>
        </div>

        {subject === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Custom Subject</label>
            <input
              required
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
              placeholder="Enter subject name..."
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow"
        >
          CREATE TASK
        </motion.button>
      </form>
    </Modal>
  );
}

function ResourceModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (res: any) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [subject, setSubject] = useState("Math");
  const [customSubject, setCustomSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ 
      title, 
      type, 
      subject: subject === "Other" ? customSubject : subject, 
      url: "#" 
    });
    setTitle("");
    setCustomSubject("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resource">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Resource Title</label>
          <input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
            placeholder="e.g. Calculus Vol 1..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 appearance-none"
            >
              {['PDF', 'Slide', 'Textbook', 'Note'].map(t => (
                <option key={t} value={t} className="bg-bg">{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 appearance-none"
            >
              {['Math', 'Science', 'History', 'Literature', 'Computer Science', 'Physics', 'Chemistry', 'Other'].map(s => (
                <option key={s} value={s} className="bg-bg">{s}</option>
              ))}
            </select>
          </div>
        </div>

        {subject === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Custom Subject</label>
            <input
              required
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full px-6 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5"
              placeholder="Enter subject name..."
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow"
        >
          UPLOAD RESOURCE
        </motion.button>
      </form>
    </Modal>
  );
}
