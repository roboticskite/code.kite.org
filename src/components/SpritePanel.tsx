import {
  Plus,
  Trash2,
  Copy,
  Edit2,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { getBuiltinSprites, readFileAsDataURL, generateId } from "../utils/helpers";
import { useState, useRef } from "react";

export default function SpritePanel() {
  const {
    project,
    selectedSpriteId,
    selectSprite,
    addSprite,
    deleteSprite,
    duplicateSprite,
    renameSprite,
    updateSprite,
  } = useEditorStore();

  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      addSprite(file.name.replace(/\.[^.]+$/, ""), dataUrl, img.width, img.height);
    };
    e.target.value = "";
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const confirmEdit = () => {
    if (editingId && editName.trim()) {
      renameSprite(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3 flex flex-col gap-2 h-44 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Sprites</span>
        <div className="flex gap-1">
          <button className="btn-ghost p-1.5" onClick={() => setShowPicker(!showPicker)} title="Add sprite">
            <Plus size={16} />
          </button>
          <button className="btn-ghost p-1.5" onClick={() => fileInputRef.current?.click()} title="Upload image">
            <Upload size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {showPicker && (
        <div className="absolute bottom-44 right-4 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-40 animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-700">Choose a sprite</div>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
            {getBuiltinSprites().map((sprite) => (
              <button
                key={sprite.name}
                className="aspect-square bg-gray-50 rounded-lg p-2 hover:bg-kite-50 hover:scale-105 transition-all flex items-center justify-center"
                onClick={() => {
                  addSprite(sprite.name, sprite.dataUrl, sprite.width, sprite.height);
                  setShowPicker(false);
                }}
                title={sprite.name}
              >
                <img src={sprite.dataUrl} alt={sprite.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {project.sprites.map((sprite) => (
          <div
            key={sprite.id}
            className={`relative shrink-0 w-24 h-24 rounded-xl border-2 cursor-pointer transition-all group ${
              selectedSpriteId === sprite.id ? "border-kite-500 bg-kite-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
            onClick={() => selectSprite(sprite.id)}
          >
            <div className="w-full h-full p-2 flex items-center justify-center">
              <img
                src={sprite.costumes[sprite.currentCostume]?.dataUrl ?? ""}
                alt={sprite.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {editingId === sprite.id ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={confirmEdit}
                onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                className="absolute bottom-0 left-0 right-0 text-xs px-1 py-0.5 border-t border-gray-200 outline-none bg-white"
              />
            ) : (
              <div className="absolute bottom-0 left-0 right-0 text-xs px-1 py-0.5 bg-black/50 text-white truncate rounded-b-lg">
                {sprite.name}
              </div>
            )}
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
              <button
                className="p-1 bg-white/80 rounded shadow-sm hover:bg-white"
                onClick={(e) => { e.stopPropagation(); startEdit(sprite.id, sprite.name); }}
                title="Rename"
              >
                <Edit2 size={12} />
              </button>
              <button
                className="p-1 bg-white/80 rounded shadow-sm hover:bg-white"
                onClick={(e) => { e.stopPropagation(); duplicateSprite(sprite.id); }}
                title="Duplicate"
              >
                <Copy size={12} />
              </button>
              {project.sprites.length > 1 && (
                <button
                  className="p-1 bg-white/80 rounded shadow-sm hover:bg-white text-red-500"
                  onClick={(e) => { e.stopPropagation(); deleteSprite(sprite.id); }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSpriteId && (
        <SpriteProperties
          spriteId={selectedSpriteId}
          onUpdate={updateSprite}
        />
      )}
    </div>
  );
}

function SpriteProperties({
  spriteId,
  onUpdate,
}: {
  spriteId: string;
  onUpdate: (id: string, updates: any) => void;
}) {
  const { project } = useEditorStore();
  const sprite = project.sprites.find((s) => s.id === spriteId);
  if (!sprite) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
      <label className="flex items-center gap-1">
        X:
        <input
          type="number"
          value={Math.round(sprite.x)}
          onChange={(e) => onUpdate(spriteId, { x: Number(e.target.value) })}
          className="w-14 px-1 py-0.5 border border-gray-200 rounded text-xs"
        />
      </label>
      <label className="flex items-center gap-1">
        Y:
        <input
          type="number"
          value={Math.round(sprite.y)}
          onChange={(e) => onUpdate(spriteId, { y: Number(e.target.value) })}
          className="w-14 px-1 py-0.5 border border-gray-200 rounded text-xs"
        />
      </label>
      <label className="flex items-center gap-1">
        Size:
        <input
          type="number"
          value={sprite.size}
          onChange={(e) => onUpdate(spriteId, { size: Number(e.target.value) })}
          className="w-14 px-1 py-0.5 border border-gray-200 rounded text-xs"
        />
      </label>
      <label className="flex items-center gap-1">
        Direction:
        <input
          type="number"
          value={sprite.direction}
          onChange={(e) => onUpdate(spriteId, { direction: Number(e.target.value) })}
          className="w-16 px-1 py-0.5 border border-gray-200 rounded text-xs"
        />
      </label>
      <label className="flex items-center gap-1">
        Rotation:
        <select
          value={sprite.rotationStyle}
          onChange={(e) => onUpdate(spriteId, { rotationStyle: e.target.value })}
          className="px-1 py-0.5 border border-gray-200 rounded text-xs"
        >
          <option value="all-around">All around</option>
          <option value="left-right">Left/Right</option>
          <option value="none">Don't rotate</option>
        </select>
      </label>
    </div>
  );
}
