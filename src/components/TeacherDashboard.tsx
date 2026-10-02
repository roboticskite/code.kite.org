import { X, Users, Plus, BookOpen, Award, Upload, FolderOpen } from "lucide-react";
import { useState } from "react";

export default function TeacherDashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"classes" | "students" | "assignments" | "challenges">("classes");
  const [classes, setClasses] = useState([
    { id: "1", name: "Intro to Coding", students: 24, assignments: 5 },
    { id: "2", name: "Advanced Game Design", students: 15, assignments: 3 },
  ]);
  const [students, setStudents] = useState([
    { id: "1", name: "Alice Johnson", class: "Intro to Coding", progress: 85, projects: 4 },
    { id: "2", name: "Bob Smith", class: "Intro to Coding", progress: 60, projects: 2 },
    { id: "3", name: "Charlie Brown", class: "Advanced Game Design", progress: 92, projects: 7 },
    { id: "4", name: "Dana White", class: "Intro to Coding", progress: 45, projects: 1 },
    { id: "5", name: "Eve Davis", class: "Advanced Game Design", progress: 78, projects: 5 },
  ]);
  const [assignments, setAssignments] = useState([
    { id: "1", title: "Lesson 1: Move a Character", class: "Intro to Coding", due: "2026-09-01", submitted: 18, total: 24 },
    { id: "2", title: "Build a Catch Game", class: "Intro to Coding", due: "2026-09-08", submitted: 12, total: 24 },
    { id: "3", title: "Platform Game", class: "Advanced Game Design", due: "2026-09-05", submitted: 10, total: 15 },
  ]);
  const [challenges, setChallenges] = useState([
    { id: "1", title: "Speed Coder", desc: "Build a game in 10 blocks", submissions: 8 },
    { id: "2", title: "Maze Master", desc: "Create a maze with 3 levels", submissions: 5 },
  ]);
  const [newClassName, setNewClassName] = useState("");

  const addClass = () => {
    if (!newClassName.trim()) return;
    setClasses([...classes, { id: String(Date.now()), name: newClassName, students: 0, assignments: 0 }]);
    setNewClassName("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users size={22} className="text-kite-600" />
            <span className="font-bold text-lg text-gray-800">Teacher Dashboard</span>
          </div>
          <button className="btn-ghost p-1.5" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {(["classes", "students", "assignments", "challenges"] as const).map((t) => (
            <button
              key={t}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t ? "text-kite-600 border-b-2 border-kite-500" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {tab === "classes" && (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="New class name..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-kite-400"
                  onKeyDown={(e) => e.key === "Enter" && addClass()}
                />
                <button className="btn-primary" onClick={addClass}>
                  <Plus size={16} /> Create Class
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-gray-800">{c.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{c.students} students</span>
                      <span>{c.assignments} assignments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "students" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Class</th>
                    <th className="py-2 px-3">Progress</th>
                    <th className="py-2 px-3">Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-700">{s.name}</td>
                      <td className="py-2 px-3 text-gray-500">{s.class}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-kite-500 rounded-full" style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-gray-500">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-500">{s.projects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "assignments" && (
            <div className="space-y-3">
              <button className="btn-primary mb-2"><Plus size={16} /> New Assignment</button>
              {assignments.map((a) => (
                <div key={a.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen size={16} className="text-kite-500" /> {a.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{a.class} - Due: {a.due}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{a.submitted}/{a.total} submitted</div>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "challenges" && (
            <div className="space-y-3">
              <button className="btn-primary mb-2"><Plus size={16} /> Create Challenge</button>
              {challenges.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Award size={16} className="text-yellow-500" /> {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
                  </div>
                  <span className="text-sm text-gray-500">{c.submissions} submissions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
