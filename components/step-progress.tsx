"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Research", description: "Gathering insights" },
  { id: 2, name: "Strategy", description: "Planning approach" },
  { id: 3, name: "Writing", description: "Creating content" },
  { id: 4, name: "Editing", description: "Refining draft" },
  { id: 5, name: "Scheduling", description: "Setting timeline" },
  { id: 6, name: "Success", description: "Ready to publish" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function StepProgress({ currentStep }: StepProgressProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full rounded-xl bg-white p-6 shadow-sm border border-gray-200"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Pipeline Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isPending = step.id > currentStep;

          return (
            <motion.div
              key={step.id}
              variants={stepVariants}
              className="flex flex-col items-center flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isActive && "border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/25",
                  isCompleted && "border-green-500 bg-green-50",
                  isPending && "border-gray-200 bg-gray-50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive && "text-blue-600",
                      isPending && "text-gray-400"
                    )}
                  >
                    {step.id}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-blue-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isActive && "text-blue-600",
                    isCompleted && "text-green-600",
                    isPending && "text-gray-400"
                  )}
                >
                  {step.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
