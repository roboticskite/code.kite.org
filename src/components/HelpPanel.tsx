import { X, HelpCircle, MousePointer2, Blocks, Play, Save, Sparkles } from "lucide-react";

export default function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HelpCircle size={22} className="text-kite-600" />
            <span className="font-bold text-lg text-gray-800">Help & Guide</span>
          </div>
          <button className="btn-ghost p-1.5" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
          <div className="bg-kite-50 rounded-xl p-4">
            <h2 className="font-bold text-kite-800 mb-1">Welcome to Kite Robotics!</h2>
            <p className="text-sm text-kite-700">A visual programming platform where you build programs by connecting colorful blocks. No typing required - just drag, snap, and run!</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Getting Started</h3>

            <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
              <div className="shrink-0 w-10 h-10 rounded-full bg-kite-100 text-kite-600 flex items-center justify-center font-bold">1</div>
              <div>
                <div className="font-medium text-gray-800 text-sm flex items-center gap-1"><MousePointer2 size={14} /> Drag blocks</div>
                <p className="text-xs text-gray-500 mt-1">Click a category on the left (like Motion or Events), then drag blocks into the center workspace.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
              <div className="shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">2</div>
              <div>
                <div className="font-medium text-gray-800 text-sm flex items-center gap-1"><Blocks size={14} /> Snap blocks together</div>
                <p className="text-xs text-gray-500 mt-1">Blocks connect by dragging one near another. They snap together like puzzle pieces.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
              <div>
                <div className="font-medium text-gray-800 text-sm flex items-center gap-1"><Play size={14} /> Run your program</div>
                <p className="text-xs text-gray-500 mt-1">Click the green flag button to run your blocks. The stage on the right shows your program in action.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
              <div className="shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">4</div>
              <div>
                <div className="font-medium text-gray-800 text-sm flex items-center gap-1"><Save size={14} /> Save your work</div>
                <p className="text-xs text-gray-500 mt-1">Click the Save button to store your project. You can also export it as a file to share.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-kite-50 to-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1"><Sparkles size={16} className="text-kite-600" /> Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>- Use the AI Assistant to generate programs from descriptions</li>
              <li>- Try the Lessons panel for step-by-step tutorials</li>
              <li>- Explore the Gallery for inspiration from other creators</li>
              <li>- Enable Beginner Mode in Settings for simplified blocks</li>
              <li>- Right-click blocks for duplicate and delete options</li>
            </ul>
          </div>

          <div className="text-center text-xs text-gray-400 pt-2">
            Kite Robotics - Learn to code by building!
          </div>
        </div>
      </div>
    </div>
  );
}
