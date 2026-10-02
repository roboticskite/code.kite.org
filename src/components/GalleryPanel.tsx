import { X, Images, Play, Heart, Repeat2, Plus } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

export default function GalleryPanel({ onClose }: { onClose: () => void }) {
  const { galleryProjects, toggleGalleryLike } = useEditorStore();

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Images size={22} className="text-kite-600" />
            <span className="font-bold text-lg text-gray-800">Project Gallery</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary text-sm">
              <Plus size={16} /> Publish
            </button>
            <button className="btn-ghost p-1.5" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryProjects.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-video bg-gradient-to-br from-kite-100 to-purple-100 relative flex items-center justify-center">
                  <img src="/kite.svg" alt={p.name} className="w-16 h-16 opacity-50" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="btn-success">
                      <Play size={18} fill="currentColor" /> Play
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">by {p.creator}</p>
                  <div className="flex items-center justify-between">
                    <button
                      className={`flex items-center gap-1 text-sm transition-all ${p.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                      onClick={() => toggleGalleryLike(p.id)}
                    >
                      <Heart size={16} fill={p.liked ? "currentColor" : "none"} />
                      <span>{p.likes}</span>
                    </button>
                    <button className="btn-ghost text-xs text-kite-600">
                      <Repeat2 size={14} /> Remix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
