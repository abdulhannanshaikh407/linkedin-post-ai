"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  PenTool,
  ImageIcon,
  Calendar,
  CheckCircle2,
  Loader2,
  Clock,
  Bot,
} from "lucide-react";

interface ActivityLogProps {
  currentStep: number;
  steps: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

interface ActivityItem {
  id: string;
  step: number;
  message: string;
  time: string;
  type: "info" | "success" | "processing";
}

const activityIcons: Record<number, any> = {
  1: Search,
  2: Sparkles,
  3: PenTool,
  4: ImageIcon,
  5: Calendar,
  6: CheckCircle2,
};

const activities: ActivityItem[] = [
  { id: "1", step: 1, message: "Research agent initialized", time: "Just now", type: "info" },
  { id: "2", step: 1, message: "Scanning 150+ LinkedIn posts", time: "Just now", type: "processing" },
  { id: "3", step: 1, message: "Identified 12 trending topics", time: "2m ago", type: "success" },
  { id: "4", step: 1, message: "Audience analysis complete", time: "2m ago", type: "success" },
  { id: "5", step: 2, message: "Strategy agent initialized", time: "1m ago", type: "info" },
  { id: "6", step: 2, message: "Building content calendar", time: "1m ago", type: "processing" },
  { id: "7", step: 2, message: "Content pillars defined", time: "1m ago", type: "success" },
  { id: "8", step: 3, message: "Writing agent drafting post #1", time: "30s ago", type: "processing" },
  { id: "9", step: 3, message: "Hook formula applied", time: "30s ago", type: "success" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export default function ActivityLog({ currentStep, steps }: ActivityLogProps) {
  const visibleActivities = activities.filter((a) => a.step <= currentStep);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Activity Log</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {visibleActivities.length} events
        </span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-1 h-[calc(100%-8px)] w-px bg-gray-200" />

        <div className="space-y-3">
          <AnimatePresence>
            {visibleActivities.map((activity) => {
              const Icon = activityIcons[activity.step] || Bot;
              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex items-start gap-3"
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      activity.type === "success" && "bg-green-100",
                      activity.type === "processing" && "bg-blue-100",
                      activity.type === "info" && "bg-gray-100"
                    )}
                  >
                    {activity.type === "success" ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : activity.type === "processing" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-3 w-3 text-blue-600" />
                      </motion.div>
                    ) : (
                      <Icon className="h-3 w-3 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {activity.message}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Live indicator */}
      {currentStep <= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2"
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-blue-600"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-blue-700">Live updates active</span>
        </motion.div>
      )}
    </motion.div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
