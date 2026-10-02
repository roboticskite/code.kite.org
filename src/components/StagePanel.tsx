import { Maximize2, Minimize2, Flag, Square, RotateCcw } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { useState } from "react";

interface Props {
  onRun: () => void;
  onStop: () => void;
  onRestart: () => void;
  stageSize: { width: number; height: number };
  setStageSize: (size: { width: number; height: number }) => void;
}

const STAGE_SIZES = [
  { label: "Small", width: 360, height: 270 },
  { label: "Medium", width: 480, height: 360 },
  { label: "Large", width: 640, height: 480 },
];

export default function StagePanel({ onRun, onStop, onRestart, stageSize, setStageSize }: Props) {
  const { project, setBackdrop, fullscreen, toggleFullscreen, isRunning } = useEditorStore();
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-1">
        <button
          className={`p-1.5 rounded-lg ${isRunning ? "bg-gray-100 text-gray-400" : "bg-green-500 text-white hover:bg-green-600"} transition-all active:scale-90`}
          onClick={onRun}
          disabled={isRunning}
          title="Run"
        >
          <Flag size={18} fill="currentColor" />
        </button>
        <button
          className={`p-1.5 rounded-lg ${isRunning ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-400"} transition-all active:scale-90`}
          onClick={onStop}
          disabled={!isRunning}
          title="Stop"
        >
          <Square size={16} fill="currentColor" />
        </button>
        <button
          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-90"
          onClick={onRestart}
          title="Restart"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Backdrop selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium hidden sm:block">Backdrop:</span>
        <div className="flex gap-1 overflow-x-auto scrollbar-thin max-w-[200px]">
          {project.backdrops.map((bd, i) => (
            <button
              key={bd.id}
              className={`shrink-0 w-8 h-8 rounded-lg border-2 overflow-hidden transition-all ${
                project.currentBackdrop === i ? "border-kite-500" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setBackdrop(i)}
              title={bd.name}
            >
              <img src={bd.dataUrl} alt={bd.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Stage size */}
        <div className="relative">
          <button
            className="btn-ghost text-xs"
            onClick={() => setShowSizeMenu(!showSizeMenu)}
          >
            {STAGE_SIZES.find((s) => s.width === stageSize.width)?.label ?? "Size"}
          </button>
          {showSizeMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSizeMenu(false)} />
              <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20">
                {STAGE_SIZES.map((s) => (
                  <button
                    key={s.label}
                    className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                      stageSize.width === s.width ? "text-kite-600 font-medium" : "text-gray-700"
                    }`}
                    onClick={() => {
                      setStageSize(s);
                      setShowSizeMenu(false);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button className="btn-ghost p-1.5" onClick={toggleFullscreen} title="Fullscreen">
          {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
}
