import { X, GraduationCap, CheckCircle2, Circle, Lightbulb, Trophy } from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import { LESSONS } from "../lessons/lessonsData";

export default function LessonsPanel({ onClose }: { onClose: () => void }) {
  const { lessonProgress, setLessonProgress } = useEditorStore();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);

  const lesson = LESSONS.find((l) => l.id === currentLesson);
  const progress = lesson ? lessonProgress[lesson.id] ?? 0 : 0;

  const completeStep = (stepIndex: number) => {
    if (!lesson) return;
    const newProgress = Math.max(progress, ((stepIndex + 1) / lesson.steps.length) * 100);
    setLessonProgress(lesson.id, newProgress);
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-kite-50 to-green-50">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-kite-600" />
          <span className="font-bold text-gray-800">Lessons</span>
        </div>
        <button className="btn-ghost p-1" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {!lesson ? (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {LESSONS.map((l) => {
            const prog = lessonProgress[l.id] ?? 0;
            return (
              <button
                key={l.id}
                onClick={() => setCurrentLesson(l.id)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-kite-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-kite-100 text-kite-700 text-sm font-bold flex items-center justify-center">
                      {l.id}
                    </span>
                    <span className="font-semibold text-gray-800 group-hover:text-kite-700">{l.title}</span>
                  </div>
                  {prog === 100 && <Trophy size={18} className="text-yellow-500" />}
                </div>
                <p className="text-sm text-gray-500 mb-2">{l.description}</p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-kite-400 to-kite-600 rounded-full transition-all"
                    style={{ width: `${prog}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{Math.round(prog)}% complete</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <button
            className="text-sm text-kite-600 mb-4 flex items-center gap-1 hover:underline"
            onClick={() => setCurrentLesson(null)}
          >
            ← Back to lessons
          </button>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
          <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>

          <div className="mb-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kite-400 to-kite-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 mt-1 block">{Math.round(progress)}% complete</span>
          </div>

          <div className="space-y-2 mb-6">
            {lesson.steps.map((step, i) => {
              const isComplete = progress >= ((i + 1) / lesson.steps.length) * 100;
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all ${
                    isComplete ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button onClick={() => completeStep(i)} className="mt-0.5 shrink-0">
                      {isComplete ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <Circle size={20} className="text-gray-300 hover:text-kite-400" />
                      )}
                    </button>
                    <span className={`text-sm ${isComplete ? "text-gray-500 line-through" : "text-gray-700"}`}>
                      {step.instruction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-yellow-600" />
              <span className="font-semibold text-yellow-800">Challenge</span>
            </div>
            <p className="text-sm text-yellow-700">{lesson.challenge}</p>
          </div>

          <div className="bg-kite-50 border border-kite-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={18} className="text-kite-600" />
              <span className="font-semibold text-kite-800">Block Hints</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {lesson.hintBlocks.map((b) => (
                <span key={b} className="text-xs px-2 py-1 bg-white text-kite-600 rounded-full border border-kite-200">
                  {b.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
