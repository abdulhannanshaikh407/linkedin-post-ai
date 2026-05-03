"use client";

import { motion } from "framer-motion";
import {
  Search,
  PenTool,
  Sparkles,
  Image,
  Calendar,
  CheckCircle2,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Help", active: false },
];

const stepIcons = [
  { icon: Search, label: "Research", step: 1 },
  { icon: Sparkles, label: "Strategy", step: 2 },
  { icon: PenTool, label: "Writing", step: 3 },
  { icon: Image, label: "Editing", step: 4 },
  { icon: Calendar, label: "Scheduling", step: 5 },
  { icon: CheckCircle2, label: "Success", step: 6 },
];

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export default function Sidebar({ currentStep, onStepClick }: SidebarProps) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white/80 backdrop-blur-xl"
    >
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center gap-3 px-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Agentic</h1>
            <p className="text-xs text-gray-500">LinkedIn Studio</p>
          </div>
        </motion.div>

        {/* Workflow Steps */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workflow
          </p>
          <nav className="space-y-1">
            {stepIcons.map((item, index) => {
              const isActive = item.step === currentStep;
              const isCompleted = item.step < currentStep;
              const isPending = item.step > currentStep;

              return (
                <motion.button
                  key={item.step}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStepClick?.(item.step)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive && "bg-blue-50 text-blue-700",
                    isCompleted && "text-gray-700 hover:bg-gray-50",
                    isPending && "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      isActive && "bg-blue-100 text-blue-700",
                      isCompleted && "bg-green-100 text-green-700",
                      isPending && "bg-gray-100 text-gray-400"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Bottom Nav */}
        <div className="mt-auto space-y-1">
          {navItems.map((item) => (
            <motion.button
              key={item.label}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
