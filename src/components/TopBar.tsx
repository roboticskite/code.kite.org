import { useState, useRef } from "react";
import {
  Square,
  Save,
  Undo2,
  Redo2,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2,
  Plus,
  FolderOpen,
  Download,
  Upload,
  Sparkles,
  GraduationCap,
  Images,
  Users,
  Menu,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
} from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { downloadJSON, readFileAsText } from "../utils/helpers";
import { createBlankProject } from "../utils/exampleProjects";

interface Props {
  onRun: () => void;
  onStop: () => void;
  onRestart: () => void;
  blocklyRef: React.MutableRefObject<any>;
}

export default function TopBar({ onRun, onStop, onRestart, blocklyRef }: Props) {
  const {
    project,
    setProjectName,
    isRunning,
    undo,
    redo,
    undoStack,
    redoStack,
    toggleSettings,
    toggleHelp,
    toggleFullscreen,
    fullscreen,
    setProject,
    toggleAIPanel,
    showAIPanel,
    toggleLessons,
    showLessons,
    toggleGallery,
    showGallery,
    toggleTeacherDashboard,
    showTeacherDashboard,
    zoom,
    setZoom,
    pushUndo,
  } = useEditorStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const xml = blocklyRef.current?.getXml() ?? "";
    const projectData = { ...project, scripts: xml, updatedAt: Date.now() };
    const dataStr = JSON.stringify(projectData, null, 2);
    localStorage.setItem("kite_robotics_current", dataStr);
    const projects = JSON.parse(localStorage.getItem("kite_robotics_projects") || "[]");
    const existing = projects.findIndex((p: any) => p.name === project.projectName);
    const entry = { name: project.projectName, data: projectData, savedAt: Date.now() };
    if (existing >= 0) projects[existing] = entry;
    else projects.push(entry);
    localStorage.setItem("kite_robotics_projects", JSON.stringify(projects));
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleNew = () => {
    if (confirm("Start a new project? Unsaved changes will be lost.")) {
      const blank = createBlankProject("New Project");
      setProject(blank);
      blocklyRef.current?.clear();
      setMenuOpen(false);
    }
  };

  const handleExport = () => {
    const xml = blocklyRef.current?.getXml() ?? "";
    const data = { ...project, scripts: xml };
    downloadJSON(data, `${project.projectName.replace(/\s+/g, "_")}.json`);
    setMenuOpen(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const data = JSON.parse(text);
      setProject(data);
      if (data.scripts) blocklyRef.current?.setXml(data.scripts);
      setMenuOpen(false);
    } catch {
      alert("Failed to import project. Make sure it's a valid Kite Robotics file.");
    }
    e.target.value = "";
  };

  return (
    <div className="app-themed-header bg-[#4b0d7a] border-b border-[#3a0b62] px-3 py-1.5 shrink-0 relative z-30 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-between gap-2 min-h-[42px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-2 rounded-md bg-[#2a0c4b] border border-[#6b2c9a] px-1.5 py-1 shadow-inner shadow-[#6a2a8e]/20">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f4f0ff] text-[#4b0d7a] text-lg font-extrabold leading-none">K</div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[14px] font-bold tracking-[0.14em] text-white">KMS-AI</span>
              <span className="mt-0.5 text-[6.5px] uppercase tracking-[0.24em] text-purple-200/80">KITE MAKER STUDIO AI</span>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <button
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/90 hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FolderOpen size={14} className="opacity-90" />
              <span>File</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-fade-in">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={handleNew}><Plus size={16} /> New Project</button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={handleSave}><Save size={16} /> Save Project</button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => fileInputRef.current?.click()}><Upload size={16} /> Import Project</button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={handleExport}><Download size={16} /> Export Project</button>
                  <a href="/kite-robotics-github.zip" download className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Download Source Code</a>
                  <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
                </div>
              </>
            )}
          </div>

          <button
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/90 hover:bg-white/10 transition-colors"
            onClick={toggleGallery}
            title="Open examples"
          >
            <Download size={14} className="opacity-90" />
            <span>Example</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {savedMsg && <span className="text-[10px] text-emerald-200 font-medium">{savedMsg}</span>}

          {!isRunning ? (
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#35b76c] px-2.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:bg-[#2ea862] transition-colors" onClick={onRun} title="Run">
              <Play size={13} fill="currentColor" className="translate-x-[1px]" />
              <span>Run</span>
            </button>
          ) : (
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#d85a6b] px-2.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:bg-[#ca4c5e] transition-colors" onClick={onStop} title="Stop">
              <Square size={10} fill="currentColor" />
              <span>Stop</span>
            </button>
          )}

          <button className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors" onClick={onRestart} title="Restart">
            <RotateCcw size={14} />
          </button>

          <button className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors" onClick={handleSave} title="Save">
            <Save size={14} />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleGallery}
            title="Gallery"
            aria-label="Gallery"
          >
            <Images size={14} />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleLessons}
            title="Lessons"
            aria-label="Lessons"
          >
            <GraduationCap size={14} />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleTeacherDashboard}
            title="Teacher"
            aria-label="Teacher"
          >
            <Users size={14} />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleFullscreen}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleHelp}
            title="Help"
            aria-label="Help"
          >
            <HelpCircle size={14} />
          </button>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 text-white/90 hover:bg-white/15 transition-colors"
            onClick={toggleAIPanel}
            title="AI Assistant"
            aria-label="AI Assistant"
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
