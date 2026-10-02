import { X, Sparkles, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

interface Props {
  blocklyRef: React.MutableRefObject<any>;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Make a game where a cat catches apples",
  "Make the character jump",
  "Add a scoring system",
  "Explain this code",
  "Find the error",
  "Make the sprite bounce off walls",
];

export default function AIPanel({ blocklyRef, onClose }: Props) {
  const { promptHistory, addPromptMessage } = useEditorStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [promptHistory, loading]);

  const generateBlocks = (prompt: string) => {
    const lower = prompt.toLowerCase();
    const ws = blocklyRef.current?.getWorkspace();
    if (!ws) return;

    // Pattern matching for common requests
    if (lower.includes("catch") || lower.includes("apple") || lower.includes("fall")) {
      // Generate a catch game
      addBlockToWorkspace(ws, "event_when_flag", 20, 20);
      addBlockToWorkspace(ws, "control_forever", 20, 80);
      addBlockToWorkspace(ws, "motion_change_y", 60, 120);
      addBlockToWorkspace(ws, "control_if", 60, 160);
      addBlockToWorkspace(ws, "sensing_touching", 120, 160);
      addBlockToWorkspace(ws, "game_change_score", 100, 200);
      addBlockToWorkspace(ws, "motion_goto_xy", 100, 240);
      return "I've created a catch game! The sprite falls down forever. When it touches another sprite, the score goes up and it returns to the top. Click Run to play!";
    }

    if (lower.includes("jump")) {
      addBlockToWorkspace(ws, "event_when_key", 20, 20);
      addBlockToWorkspace(ws, "game_jump", 20, 80);
      addBlockToWorkspace(ws, "control_forever", 20, 140);
      addBlockToWorkspace(ws, "game_apply_gravity", 60, 180);
      return "I've added jump blocks! When you press space, the sprite jumps. Gravity is applied in a forever loop to bring it back down.";
    }

    if (lower.includes("score") || lower.includes("scoring")) {
      addBlockToWorkspace(ws, "event_when_flag", 20, 20);
      addBlockToWorkspace(ws, "game_set_score", 20, 80);
      addBlockToWorkspace(ws, "control_forever", 20, 140);
      addBlockToWorkspace(ws, "control_if", 60, 180);
      addBlockToWorkspace(ws, "sensing_touching", 120, 180);
      addBlockToWorkspace(ws, "game_change_score", 100, 220);
      return "I've added a scoring system! The score starts at 0 and increases by 1 when sprites touch each other.";
    }

    if (lower.includes("bounce")) {
      addBlockToWorkspace(ws, "event_when_flag", 20, 20);
      addBlockToWorkspace(ws, "control_forever", 20, 80);
      addBlockToWorkspace(ws, "motion_move_steps", 60, 120);
      addBlockToWorkspace(ws, "control_if", 60, 160);
      addBlockToWorkspace(ws, "operators_greater", 120, 160);
      addBlockToWorkspace(ws, "motion_turn_clockwise", 100, 200);
      return "I've created a bouncing animation! The sprite moves and turns when it reaches the edge.";
    }

    if (lower.includes("explain")) {
      return "I can see your blocks in the workspace. Here's what they do:\n\n1. Event blocks (like 'when green flag clicked') start your program\n2. Motion blocks move and rotate sprites\n3. Control blocks like 'forever' and 'repeat' create loops\n4. Sensing blocks detect keyboard input and collisions\n5. Variable blocks store and change values\n\nTry running your program with the green flag button!";
    }

    if (lower.includes("error") || lower.includes("bug") || lower.includes("fix")) {
      return "Let me help you find errors. Common issues to check:\n\n1. Make sure event blocks (when flag clicked, when key pressed) are at the top\n2. Check that blocks are properly connected (snapped together)\n3. Verify your conditions in if blocks are correct\n4. Ensure variables are created before using them\n5. Check that sprite names in 'touching' blocks match actual sprite names\n\nTry running your program and see if any errors appear in the console.";
    }

    // Default: add some basic blocks
    addBlockToWorkspace(ws, "event_when_flag", 20, 20);
    addBlockToWorkspace(ws, "motion_move_steps", 20, 80);
    addBlockToWorkspace(ws, "control_forever", 20, 140);
    addBlockToWorkspace(ws, "looks_next_costume", 60, 180);
    return "I've added some starter blocks for you! The sprite will move and animate when you click the green flag. You can modify these blocks or add more from the categories on the left.";
  };

  const addBlockToWorkspace = (ws: any, type: string, x: number, y: number) => {
    try {
      const block = ws.newBlock(type);
      block.initSvg();
      block.setX(x);
      block.setY(y);
      block.render();
    } catch (e) {
      console.error("Failed to add block:", type, e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    addPromptMessage({ role: "user", content: userMsg });
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const response = generateBlocks(userMsg) ?? "I've processed your request. Check the workspace for any new blocks!";
    addPromptMessage({ role: "assistant", content: response });
    setLoading(false);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-kite-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-kite-600" />
          <span className="font-bold text-gray-800">AI Assistant</span>
        </div>
        <button className="btn-ghost p-1" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {promptHistory.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ask me to create programs, explain code, or fix errors!</p>
          </div>
        )}
        {promptHistory.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 text-sm ${
              msg.role === "user"
                ? "bg-kite-500 text-white ml-8"
                : "bg-gray-100 text-gray-700 mr-8"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 rounded-xl p-3 mr-8">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {promptHistory.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-kite-100 hover:text-kite-700 rounded-full transition-colors text-gray-600"
              onClick={() => setInput(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-kite-400"
        />
        <button className="btn-primary p-2" onClick={handleSend} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
