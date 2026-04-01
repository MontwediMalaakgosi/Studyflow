import { motion } from "motion/react";
import { LayoutDashboard, Calendar, ListTodo, Library, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "schedule", icon: Calendar, label: "Schedule" },
  { id: "tasks", icon: ListTodo, label: "Tasks" },
  { id: "vault", icon: Library, label: "Vault" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar (Floating) */}
      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 h-[80vh] w-20 flex-col items-center py-10 matte-glass rounded-[40px] z-50">
        <div className="mb-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 bg-cobalt rounded-2xl flex items-center justify-center aura-glow"
          >
            <span className="text-xl font-black italic">SF</span>
          </motion.div>
        </div>

        <nav className="flex-1 flex flex-col space-y-6">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.id)}
              className={`relative p-3 rounded-2xl transition-all duration-300 ${
                activeTab === item.id ? "text-white bg-cobalt/20" : "text-white/30 hover:text-white/60"
              }`}
            >
              <item.icon size={24} />
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-cobalt rounded-full aura-glow"
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col space-y-6">
          <button className="text-white/20 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <button className="text-white/20 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav (Floating) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 matte-glass rounded-[32px] z-50 flex items-center justify-around px-4">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(item.id)}
            className={`relative p-3 rounded-2xl transition-all duration-300 ${
              activeTab === item.id ? "text-white bg-cobalt/20" : "text-white/30"
            }`}
          >
            <item.icon size={22} />
            {activeTab === item.id && (
              <motion.div
                layoutId="active-pill-mobile"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 bg-cobalt rounded-full aura-glow"
              />
            )}
          </motion.button>
        ))}
      </div>
    </>
  );
}
