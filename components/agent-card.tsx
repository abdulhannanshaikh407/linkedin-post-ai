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
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AgentCardProps {
  step: number;
  status: "pending" | "running" | "completed";
  onNext: () => void;
  isRunning: boolean;
}

const stepData = [
  {
    id: 1,
    name: "Research Agent",
    icon: Search,
    description: "Analyzing trending topics, audience insights, and competitive landscape for optimal content strategy.",
    color: "blue",
    tasks: [
      "Scanning LinkedIn trending topics",
      "Analyzing audience engagement patterns",
      "Reviewing competitor content strategies",
      "Identifying high-performing content formats",
    ],
    output: "Found 12 trending topics. Audience most engaged with AI/tech content (78% engagement rate). Competitors posting 3x/week with strong video performance.",
  },
  {
    id: 2,
    name: "Strategy Agent",
    icon: Sparkles,
    description: "Developing content strategy based on research findings and brand voice analysis.",
    color: "purple",
    tasks: [
      "Defining content pillars and themes",
      "Optimizing posting schedule for max reach",
      "Crafting hook formulas for engagement",
      "Aligning content with brand voice",
    ],
    output: "Strategy: Focus on AI productivity tools (3 posts/week). Best posting time: Tue/Thu 9am. Hook formula: '[Problem] → [Solution] → [Result]'. Voice: Professional yet approachable.",
  },
  {
    id: 3,
    name: "Writing Agent",
    icon: PenTool,
    description: "Crafting compelling LinkedIn posts with optimal formatting and engagement hooks.",
    color: "indigo",
    tasks: [
      "Drafting attention-grabbing hooks",
      "Writing body content with storytelling",
      "Adding relevant hashtags and mentions",
      "Optimizing for LinkedIn algorithm",
    ],
    output: "Draft ready: 'I replaced my morning routine with AI tools—here's what happened after 30 days...' (1,247 chars, 8 hashtags, 3 mentions. Est. reach: 12K-15K).",
  },
  {
    id: 4,
    name: "Editing Agent",
    icon: ImageIcon,
    description: "Polishing content for clarity, tone, and maximum professional impact.",
    color: "pink",
    tasks: [
      "Proofreading for grammar and clarity",
      "Enhancing tone and professional voice",
      "Adding visual placeholders and media cues",
      "Final formatting and structure check",
    ],
    output: "Edit complete: Improved readability score from 72→89. Enhanced CTA. Added 2 carousel slide markers. Final version approved for publishing.",
  },
  {
    id: 5,
    name: "Scheduling Agent",
    icon: Calendar,
    description: "Optimizing publish timing and managing content calendar integration.",
    color: "cyan",
    tasks: [
      "Analyzing audience online patterns",
      "Selecting optimal publish windows",
      "Setting up cross-platform promotion",
      "Configuring engagement tracking",
    ],
    output: "Scheduled: Post #1 → Tue 9:00am (est. reach 14.2K). Post #2 → Thu 9:00am. Calendar synced. Auto-reminders set for engagement monitoring.",
  },
  {
    id: 6,
    name: "Pipeline Complete",
    icon: CheckCircle2,
    description: "All agents have successfully completed their tasks. Your LinkedIn content is ready.",
    color: "green",
    tasks: [],
    output: "Success! 5 posts created, edited, and scheduled. Estimated total reach: 68K+. Pipeline completed in 3m 42s. Ready to publish or review in dashboard.",
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    gradient: "from-blue-600 to-blue-700",
    glow: "glow-blue",
    progress: "bg-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    gradient: "from-purple-600 to-purple-700",
    glow: "",
    progress: "bg-purple-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    gradient: "from-indigo-600 to-indigo-700",
    glow: "",
    progress: "bg-indigo-600",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    iconBg: "bg-pink-100",
    iconText: "text-pink-600",
    gradient: "from-pink-600 to-pink-700",
    glow: "",
    progress: "bg-pink-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    gradient: "from-cyan-600 to-cyan-700",
    glow: "",
    progress: "bg-cyan-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    gradient: "from-green-600 to-green-700",
    glow: "glow-green",
    progress: "bg-green-600",
  },
};

const cardVariants = {
  enter: { x: 50, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function AgentCard({ step, status, onNext, isRunning }: AgentCardProps) {
  const data = stepData[step - 1];
  const colors = colorMap[data.color as keyof typeof colorMap];
  const Icon = data.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        <Card
          className={cn(
            "overflow-hidden border-2 transition-all duration-300",
            step === 6 && "border-green-200",
            status === "running" && "border-blue-200 shadow-xl shadow-blue-500/10",
            status === "completed" && "border-green-200",
            status === "pending" && "border-gray-200"
          )}
        >
          {/* Header */}
          <CardHeader
            className={cn("border-b", colors.bg, colors.border)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    colors.iconBg
                  )}
                >
                  <Icon className={cn("h-6 w-6", colors.iconText)} />
                </motion.div>
                <div>
                  <CardTitle className="text-xl">{data.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {data.description}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  status === "completed"
                    ? "success"
                    : status === "running"
                    ? "running"
                    : "outline"
                }
                className="gap-1.5 py-1"
              >
                {status === "running" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-3 w-3" />
                  </motion.div>
                )}
                {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                {status === "pending" && <Clock className="h-3 w-3" />}
                {status === "running"
                  ? "Running"
                  : status === "completed"
                  ? "Completed"
                  : "Pending"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress Bar for running state */}
            {status === "running" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Processing...
                  </span>
                  <span className="text-sm text-gray-500">~30s</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Tasks */}
            {data.tasks.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h4 className="mb-3 text-sm font-semibold text-gray-700">
                  <Bot className="inline h-4 w-4 mr-1.5" />
                  Tasks
                </h4>
                <div className="space-y-2">
                  {data.tasks.map((task, index) => (
                    <motion.div
                      key={task}
                      variants={staggerItem}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                          status === "completed"
                            ? "bg-green-100 text-green-700"
                            : status === "running" && index < 2
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-400"
                        )}
                      >
                        {status === "completed" || (status === "running" && index < 2) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          status === "completed"
                            ? "text-gray-700 line-through"
                            : "text-gray-600"
                        )}
                      >
                        {task}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Output */}
            {status !== "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Agent Output
                </h4>
                <div
                  className={cn(
                    "rounded-lg border p-4 text-sm leading-relaxed",
                    colors.bg,
                    colors.border
                  )}
                >
                  {status === "running" ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-blue-400"
                      />
                      Agent is processing...
                    </div>
                  ) : (
                    <p className="text-gray-700">{data.output}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {status === "completed" && step < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex justify-end"
              >
                <Button
                  onClick={onNext}
                  className={cn(
                    "gap-2 bg-gradient-to-r text-white",
                    colors.gradient
                  )}
                >
                  Next: {stepData[step]?.name}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Success State */}
            {step === 6 && status === "completed" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="mt-6 flex flex-col items-center gap-4 py-8"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Pipeline Complete!
                </h3>
                <p className="text-center text-gray-500 max-w-md">
                  Your LinkedIn content workflow has finished. All posts are ready
                  for publishing.
                </p>
                <div className="flex gap-3 mt-2">
                  <Button variant="outline" className="gap-2">
                    View Dashboard
                  </Button>
                  <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    Publish All Posts
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
