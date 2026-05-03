"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StepProgress from "@/components/step-progress";
import AgentCard from "@/components/agent-card";
import ActivityLog from "@/components/activity-log";

const steps = [
  { id: 1, name: "Research", status: "completed" as const },
  { id: 2, name: "Strategy", status: "running" as const },
  { id: 3, name: "Writing", status: "pending" as const },
  { id: 4, name: "Editing", status: "pending" as const },
  { id: 5, name: "Scheduling", status: "pending" as const },
  { id: 6, name: "Success", status: "pending" as const },
];

type StepStatus = "pending" | "running" | "completed";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: "completed",
    2: "running",
    3: "pending",
    4: "pending",
    5: "pending",
    6: "pending",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [autoProgress, setAutoProgress] = useState(false);

  const simulateStep = useCallback(
    (step: number) => {
      if (isRunning) return;
      setIsRunning(true);

      // Set current step to running
      setStepStatuses((prev) => ({ ...prev, [step]: "running" }));

      // After delay, complete the step
      setTimeout(() => {
        setStepStatuses((prev) => ({ ...prev, [step]: "completed" }));
        setIsRunning(false);

        // Auto progress to next step
        if (autoProgress && step < 6) {
          setTimeout(() => {
            setCurrentStep(step + 1);
            simulateStep(step + 1);
          }, 800);
        }
      }, 3000);
    },
    [isRunning, autoProgress]
  );

  const handleNextStep = () => {
    if (isRunning || currentStep > 6) return;
    simulateStep(currentStep);
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || stepStatuses[step] === "completed") {
      setCurrentStep(step);
    }
  };

  const handleToggleAutoProgress = () => {
    setAutoProgress((prev) => !prev);
  };

  // Auto-start the first step animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // The first step is already completed, so we show step 2 as running
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getStepStatus = (stepId: number): StepStatus => {
    if (stepStatuses[stepId]) return stepStatuses[stepId];
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "running";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Sidebar currentStep={currentStep} onStepClick={handleStepClick} />

      <div style={{ marginLeft: "256px" }}>
        <Header
          currentStep={currentStep}
          autoProgress={autoProgress}
          onToggleAutoProgress={handleToggleAutoProgress}
          onNextStep={handleNextStep}
          isRunning={isRunning}
        />

        <main className="p-6">
          <div className="mx-auto max-w-6xl">
            {/* Step Progress */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <StepProgress currentStep={currentStep} />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Agent Card - Main Content */}
              <motion.div
                className="lg:col-span-2"
                layout
              >
                <AnimatePresence mode="wait">
                  <AgentCard
                    key={currentStep}
                    step={currentStep}
                    status={getStepStatus(currentStep)}
                    onNext={() => {
                      if (currentStep < 6) {
                        setCurrentStep(currentStep + 1);
                        handleNextStep();
                      }
                    }}
                    isRunning={isRunning && getStepStatus(currentStep) === "running"}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Activity Log - Side Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <ActivityLog
                  currentStep={currentStep}
                  steps={steps.map((s) => ({
                    ...s,
                    status: getStepStatus(s.id),
                  }))}
                />
              </motion.div>
            </div>

            {/* Step Navigation Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isActive = step.id === currentStep;

                return (
                  <motion.button
                    key={step.id}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStepClick(step.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      isActive
                        ? "border-blue-300 bg-blue-50 shadow-md shadow-blue-500/10"
                        : status === "completed"
                        ? "border-green-200 bg-white hover:border-green-300"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status === "completed" ? (
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {isActive && status === "running" && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-blue-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
