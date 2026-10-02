import {
  Plus,
  Trash2,
  Copy,
  Edit2,
  Upload,
  ImagePlus,
  Eye,
  EyeOff,
  Shapes,
} from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { getBuiltinSprites, readFileAsDataURL } from "../utils/helpers";
import { useState, useRef } from "react";
import type { SpriteData } from "../types";

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
    addBackdrop,
    setBackdrop,
    deleteBackdrop,
  } = useEditorStore();

  const [showPicker, setShowPicker] = useState(false);
  const [showBackdropPicker, setShowBackdropPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

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

  const handleBackdropUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addBackdrop(file.name.replace(/\.[^.]+$/, ""), await readFileAsDataURL(file));
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

  const selectedSprite = project.sprites.find((sprite) => sprite.id === selectedSpriteId) ?? null;
  const selectedBackdrop = project.backdrops[project.currentBackdrop] ?? project.backdrops[0];

  return (
    <div className="relative flex h-44 shrink-0 border-t border-gray-200 bg-white">
      <div className="relative flex min-w-0 flex-1 flex-col gap-2 p-2">
        {selectedSprite && (
          <SpriteProperties sprite={selectedSprite} onUpdate={(updates) => updateSprite(selectedSprite.id, updates)} />
        )}

        <div className="flex min-h-0 flex-1 items-start gap-2 overflow-x-auto scrollbar-thin pb-1">
          {project.sprites.map((sprite) => (
            <div
              key={sprite.id}
              role="button"
              tabIndex={0}
              aria-label={`Select sprite ${sprite.name}`}
              aria-pressed={selectedSpriteId === sprite.id}
              className={`group relative h-[68px] w-[68px] shrink-0 cursor-pointer rounded-md border p-1 transition-colors ${
                selectedSpriteId === sprite.id
                  ? "border-kite-500 bg-kite-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => selectSprite(sprite.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") selectSprite(sprite.id);
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-0.5">
                <img
                  src={sprite.costumes[sprite.currentCostume]?.dataUrl ?? ""}
                  alt=""
                  className="h-10 w-full object-contain"
                />
                {editingId === sprite.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={confirmEdit}
                    onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                    className="w-full rounded border border-gray-200 bg-white px-1 text-[10px] outline-none"
                  />
                ) : (
                  <span className="w-full truncate text-center text-[10px] text-gray-700">{sprite.name}</span>
                )}
              </div>
              <div className="absolute right-0.5 top-0.5 hidden gap-0.5 group-hover:flex">
                <button
                  className="rounded bg-white/90 p-0.5 text-gray-700 shadow-sm"
                  onClick={(e) => { e.stopPropagation(); startEdit(sprite.id, sprite.name); }}
                  title="Rename"
                  aria-label={`Rename ${sprite.name}`}
                >
                  <Edit2 size={10} />
                </button>
                <button
                  className="rounded bg-white/90 p-0.5 text-gray-700 shadow-sm"
                  onClick={(e) => { e.stopPropagation(); duplicateSprite(sprite.id); }}
                  title="Duplicate"
                  aria-label={`Duplicate ${sprite.name}`}
                >
                  <Copy size={10} />
                </button>
                {project.sprites.length > 1 && (
                  <button
                    className="rounded bg-white/90 p-0.5 text-red-500 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); deleteSprite(sprite.id); }}
                    title="Delete"
                    aria-label={`Delete ${sprite.name}`}
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowPicker((visible) => !visible)}
            className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-kite-700 text-white shadow-sm hover:bg-kite-800"
            title="Add sprite"
            aria-label="Add sprite"
          >
            <Plus size={22} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            title="Upload sprite"
            aria-label="Upload sprite"
          >
            <Upload size={15} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        {showPicker && (
          <div className="absolute bottom-2 left-2 z-40 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
            <div className="mb-2 text-sm font-semibold text-gray-700">Choose a sprite</div>
            <div className="grid max-h-40 grid-cols-4 gap-2 overflow-y-auto scrollbar-thin">
              {getBuiltinSprites().map((sprite) => (
                <button
                  key={sprite.name}
                  type="button"
                  className="flex aspect-square items-center justify-center rounded-md bg-gray-50 p-2 hover:bg-kite-50"
                  onClick={() => {
                    addSprite(sprite.name, sprite.dataUrl, sprite.width, sprite.height);
                    setShowPicker(false);
                  }}
                  title={sprite.name}
                  aria-label={`Add ${sprite.name}`}
                >
                  <img src={sprite.dataUrl} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="relative flex w-24 shrink-0 flex-col items-center gap-1 border-l border-gray-200 p-2">
        <button
          type="button"
          onClick={() => setShowBackdropPicker((visible) => !visible)}
          className="flex h-[58px] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-1 shadow-sm"
          title="Choose backdrop"
          aria-label="Choose backdrop"
        >
          {selectedBackdrop ? (
            <img src={selectedBackdrop.dataUrl} alt={selectedBackdrop.name} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={22} className="text-gray-400" />
          )}
        </button>
        <span className="text-[11px] font-medium text-gray-600">Backdrops</span>
        <span className="text-[10px] text-gray-400">{project.backdrops.length}</span>
        <button
          type="button"
          onClick={() => backdropInputRef.current?.click()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-kite-700 text-white hover:bg-kite-800"
          title="Add backdrop"
          aria-label="Add backdrop"
        >
          <ImagePlus size={18} />
        </button>
        <input ref={backdropInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackdropUpload} />
        <button
          type="button"
          onClick={() => deleteBackdrop(project.currentBackdrop)}
          disabled={project.backdrops.length <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          title={project.backdrops.length > 1 ? "Delete backdrop" : "Keep at least one backdrop"}
          aria-label="Delete backdrop"
        >
          <Trash2 size={15} />
        </button>

        {showBackdropPicker && (
          <div className="absolute right-full top-0 z-40 mr-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
            <div className="mb-2 text-sm font-semibold text-gray-700">Choose a backdrop</div>
            <div className="grid max-h-40 grid-cols-3 gap-2 overflow-y-auto scrollbar-thin">
              {project.backdrops.map((backdrop, index) => (
                <button
                  key={backdrop.id}
                  type="button"
                  onClick={() => {
                    setBackdrop(index);
                    setShowBackdropPicker(false);
                  }}
                  className={`overflow-hidden rounded-md border text-left ${
                    project.currentBackdrop === index ? "border-kite-500" : "border-gray-200"
                  }`}
                  title={backdrop.name}
                >
                  <img src={backdrop.dataUrl} alt="" className="h-12 w-full object-cover" />
                  <span className="block truncate px-1 py-0.5 text-[10px] text-gray-700">{backdrop.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function SpriteProperties({ sprite, onUpdate }: { sprite: SpriteData; onUpdate: (updates: Partial<SpriteData>) => void }) {
  const fieldClass = "flex h-7 min-w-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5";
  const inputClass = "min-w-0 w-full bg-transparent text-xs text-gray-700 outline-none";
  return (
    <div className="grid shrink-0 gap-1.5">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,72px)_minmax(0,72px)] gap-1.5">
        <div className="flex h-7 min-w-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2">
          <Shapes size={13} className="shrink-0 text-kite-700" />
          <span className="shrink-0 text-[10px] text-gray-500">Sprite</span>
          <span className="truncate text-xs font-medium text-gray-700">{sprite.name}</span>
        </div>
        <label className={fieldClass}>
          <span className="text-[10px] text-gray-500">↔</span>
          <input
            type="number"
            aria-label="Sprite X"
            value={Math.round(sprite.x)}
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            className={inputClass}
          />
          <span className="text-[10px] text-gray-400">X</span>
        </label>
        <label className={fieldClass}>
          <span className="text-[10px] text-gray-500">↕</span>
          <input
            type="number"
            aria-label="Sprite Y"
            value={Math.round(sprite.y)}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className={inputClass}
          />
          <span className="text-[10px] text-gray-400">Y</span>
        </label>
      </div>

      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-1.5">
        <button
          type="button"
          onClick={() => onUpdate({ visible: !sprite.visible })}
          className={`${fieldClass} justify-center text-gray-600 hover:bg-gray-50`}
          aria-label={sprite.visible ? "Hide sprite" : "Show sprite"}
        >
          {sprite.visible ? <Eye size={13} /> : <EyeOff size={13} />}
          <span className="text-[10px]">{sprite.visible ? "Show" : "Hidden"}</span>
        </button>
        <label className={fieldClass}>
          <input
            type="number"
            aria-label="Sprite size"
            value={sprite.size}
            onChange={(e) => onUpdate({ size: Number(e.target.value) })}
            className={inputClass}
          />
          <span className="text-[10px] text-gray-400">Size</span>
        </label>
        <label className={fieldClass}>
          <input
            type="number"
            aria-label="Sprite direction"
            value={sprite.direction}
            onChange={(e) => onUpdate({ direction: Number(e.target.value) })}
            className={inputClass}
          />
          <span className="text-[10px] text-gray-400">°</span>
        </label>
        <label className={fieldClass}>
          <select
            aria-label="Rotation style"
            value={sprite.rotationStyle}
            onChange={(e) => onUpdate({ rotationStyle: e.target.value as SpriteData["rotationStyle"] })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="all-around">All around</option>
            <option value="left-right">Left/Right</option>
            <option value="none">Don't rotate</option>
          </select>
        </label>
      </div>
    </div>
  );
}
