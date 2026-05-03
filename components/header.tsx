"use client";

import { motion } from "framer-motion";
import { Bell, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  currentStep: number;
  autoProgress: boolean;
  onToggleAutoProgress: () => void;
  onNextStep: () => void;
  isRunning: boolean;
}

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function Header({
  currentStep,
  autoProgress,
  onToggleAutoProgress,
  onNextStep,
  isRunning,
}: HeaderProps) {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-xl"
      style={{ marginLeft: "256px" }}
    >
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            AI Content Pipeline
          </h2>
          <p className="text-xs text-gray-500">
            Step {currentStep} of 6 — CrewAI Multi-Agent Workflow
          </p>
        </div>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent"
            />
            <span className="text-xs font-medium text-blue-700">Processing</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAutoProgress}
          className={cn(
            "gap-2",
            autoProgress && "border-blue-300 bg-blue-50 text-blue-700"
          )}
        >
          <Zap className={cn("h-4 w-4", autoProgress && "text-blue-600")} />
          Auto
        </Button>
        <Button
          size="sm"
          onClick={onNextStep}
          disabled={isRunning || currentStep > 6}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {currentStep === 6 ? "Complete" : "Next Step"}
        </Button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Bell className="h-4 w-4 text-gray-600" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <User className="h-4 w-4" />
        </button>
      </div>
    </motion.header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
