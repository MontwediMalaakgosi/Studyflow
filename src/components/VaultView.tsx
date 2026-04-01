import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "./GlassCard";
import { Search, Plus, FileText, Download } from "lucide-react";
import { Resource } from "../types";

interface VaultViewProps {
  resources: Resource[];
  onAddResource: () => void;
}

export default function VaultView({ resources, onAddResource }: VaultViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
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
              Knowledge
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl font-black tracking-tighter text-white uppercase"
          >
            THE <span className="text-cobalt">VAULT</span>
          </motion.h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="SEARCH RESOURCES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 glass rounded-2xl text-[10px] font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-cobalt/50 border-white/5 placeholder:text-white/10 uppercase"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddResource}
            className="px-8 py-4 bg-cobalt rounded-2xl text-[10px] font-black tracking-widest uppercase aura-glow flex items-center gap-2"
          >
            <Plus size={16} /> UPLOAD
          </motion.button>
        </div>
      </header>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
          >
            <GlassCard className="p-6 md:p-8 flex flex-col gap-6 h-full hover:border-cobalt/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/5 rounded-xl text-cobalt group-hover:aura-glow transition-all">
                  <FileText size={24} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                  {resource.type}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2 group-hover:text-cobalt transition-colors">
                  {resource.title}
                </h3>
                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
                  {resource.subject}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 glass rounded-2xl text-[10px] font-black tracking-widest uppercase border-white/5 hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  <Download size={14} /> DOWNLOAD
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20">
            <p className="text-white/20 text-[10px] font-black tracking-widest uppercase">No resources found</p>
          </div>
        )}
      </div>
    </div>
  );
}
