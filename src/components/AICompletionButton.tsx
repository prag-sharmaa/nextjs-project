"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import toast from "react-hot-toast";

interface AICompletionButtonProps {
  currentText: string;
  postContent?: string;
  onCompletion: (completion: string) => void;
  disabled?: boolean;
}

export function AICompletionButton({
  currentText,
  postContent,
  onCompletion,
  disabled = false,
}: AICompletionButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAICompletion = async () => {
    if (!currentText.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentText,
          context: postContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate completion");
      }

      if (data.success && data.completion) {
        onCompletion(data.completion);
        toast.success("AI completion added!");
      } else {
        throw new Error("Invalid response from AI service");
      }
    } catch (error) {
      console.error("AI completion error:", error);
      toast.error("Failed to generate AI completion");
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show button if there's some text and it's not too long
  const shouldShow = currentText.trim().length > 3 && currentText.trim().length < 100;

  if (!shouldShow) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleAICompletion}
      disabled={disabled || isGenerating}
      className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
    >
      <SparklesIcon className="size-3" />
      {isGenerating ? "Generating..." : "Complete with AI"}
    </Button>
  );
} 