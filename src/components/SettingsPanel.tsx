import { X, Settings, Sparkles, Volume2, Monitor } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { isBeginnerMode, toggleBeginnerMode } = useEditorStore();

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings size={22} className="text-kite-600" />
            <span className="font-bold text-lg text-gray-800">Settings</span>
          </div>
          <button className="btn-ghost p-1.5" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-kite-500" />
              <div>
                <div className="font-medium text-gray-800 text-sm">Beginner Mode</div>
                <div className="text-xs text-gray-500">Simplified blocks with helpful tooltips</div>
              </div>
            </div>
            <button
              onClick={toggleBeginnerMode}
              className={`w-11 h-6 rounded-full transition-colors ${isBeginnerMode ? "bg-kite-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 my-0.5 ${isBeginnerMode ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-purple-500" />
              <div>
                <div className="font-medium text-gray-800 text-sm">Sound Effects</div>
                <div className="text-xs text-gray-500">Enable block and UI sounds</div>
              </div>
            </div>
            <button className="w-11 h-6 rounded-full bg-kite-500">
              <div className="w-5 h-5 bg-white rounded-full translate-x-5 mx-0.5 my-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2">
              <Monitor size={18} className="text-green-500" />
              <div>
                <div className="font-medium text-gray-800 text-sm">Auto-save</div>
                <div className="text-xs text-gray-500">Save project automatically on changes</div>
              </div>
            </div>
            <button className="w-11 h-6 rounded-full bg-kite-500">
              <div className="w-5 h-5 bg-white rounded-full translate-x-5 mx-0.5 my-0.5" />
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">About Kite Robotics</h3>
            <p className="text-xs text-gray-500">Kite Robotics v1.0 - A visual programming platform for students, teachers, and beginners. Build games, animations, and stories with drag-and-drop blocks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
