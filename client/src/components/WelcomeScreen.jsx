import React from "react";
import { Code, BookOpen, Calendar, Cpu, Sparkles, MessageSquare } from "lucide-react";

/**
 * WelcomeScreen displays when starting a new study session.
 * Features hero greeting, tagline, and clickable suggestion prompt cards.
 */
export default function WelcomeScreen({ onSelectPrompt }) {
  const suggestions = [
    {
      title: "Explain Recursion",
      description: "Concept breakdown with base case and visual call stack example",
      prompt: "Explain recursion in simple terms with a C++ or Python code example",
      icon: Code,
      badge: "Programming",
    },
    {
      title: "Create a DSA Quiz",
      description: "Generate 3 challenging multiple-choice questions with answers",
      prompt: "Create a 3-question multiple choice quiz on Data Structures & Algorithms with explanations for the answers",
      icon: BookOpen,
      badge: "Exam Prep",
    },
    {
      title: "Make a Study Plan",
      description: "Structured 2-week revision plan for midterm exams",
      prompt: "Create a realistic 2-week study plan for university midterms covering Object-Oriented Programming and Discrete Math",
      icon: Calendar,
      badge: "Planning",
    },
    {
      title: "Explain OOP",
      description: "The 4 core pillars explained clearly: Encapsulation, Polymorphism, etc.",
      prompt: "Explain the 4 pillars of Object-Oriented Programming (OOP) with clean, beginner-friendly real-world examples",
      icon: Cpu,
      badge: "CS Concepts",
    },
    {
      title: "recursion ta easy kore bujhao",
      description: "Bangla & Banglish tutoring support demo",
      prompt: "recursion ta easy kore bujhao with an example",
      icon: Sparkles,
      badge: "Banglish / বাংলা",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto px-4 py-8 text-center animate-fade-in">
      {/* Robot Hero Icon */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-[#9A67FF] flex items-center justify-center text-white shadow-card">
          <span className="text-4xl select-none" role="img" aria-label="Robot">
            🤖
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-soft">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
        </div>
      </div>

      {/* Main App Title & Tagline */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-2">
        StudyMate AI
      </h1>
      <p className="text-lg font-semibold text-primary mb-2">
        "Learn smarter. Understand better."
      </p>
      <p className="text-sm sm:text-base text-secondary max-w-xl mb-8 leading-relaxed">
        Ask me anything about programming, academics, exams, or learning.
        I support English, বাংলা, and Banglish!
      </p>

      {/* Suggestion Prompt Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-primary/50 hover:shadow-card hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-secondary group-hover:bg-primary-light group-hover:text-primary transition-colors flex-shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
