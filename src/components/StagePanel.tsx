import { ChevronDown, Palette, SlidersHorizontal } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { useState } from "react";

interface Props {
  onRun: () => void;
  onStop: () => void;
  onRestart: () => void;
  stageSize: { width: number; height: number };
  setStageSize: (size: { width: number; height: number }) => void;
}

type StageTheme = "default" | "dark" | "chalk";

export default function StagePanel({ onRun, onStop, onRestart, stageSize, setStageSize }: Props) {
  const {
    project,
    selectedSpriteId,
    updateSprite,
    appearance: stageAppearance,
    setAppearance,
    theme,
  } = useEditorStore();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [showDirectionSlider, setShowDirectionSlider] = useState(false);

  const selectedSprite = project.sprites.find((sprite) => sprite.id === selectedSpriteId) ?? project.sprites[0];

  const sizeValue = selectedSprite?.size ?? 100;
  const directionValue = selectedSprite?.direction ?? 90;

  const handleThemeChange = (value: StageTheme) => {
    setAppearance(value);
    setShowThemeMenu(false);
  };

  const themeStyles: Record<StageTheme, string> = {
    default: "bg-[#f2f4f6] border-gray-200 text-slate-700",
    dark: "bg-slate-900 border-slate-700 text-slate-100",
    chalk: "bg-[#d9e7d4] border-[#bdd3b6] text-[#2b422f]",
  };

  const textStyles: Record<StageTheme, string> = {
    default: "text-slate-700",
    dark: "text-slate-100",
    chalk: "text-[#2b422f]",
  };

  const currentAppearance = stageAppearance ?? "default";

  return (
    <>
      <div className={`flex items-center justify-between px-3 py-2 border-b shrink-0 gap-2 ${themeStyles[currentAppearance]}`}>
        <div className="flex items-center gap-1 min-w-0">
          <span className={`text-[13px] font-semibold whitespace-nowrap ${textStyles[currentAppearance]}`}>Stage</span>
        </div>

        <div className="flex items-center gap-2 relative z-20 flex-wrap justify-end min-w-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowThemeMenu((prev) => !prev);
                setShowSizeSlider(false);
                setShowDirectionSlider(false);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border whitespace-nowrap ${
                currentAppearance === "dark" ? "border-slate-600 bg-slate-800 text-slate-100" :
                currentAppearance === "chalk" ? "border-[#a7bf9e] bg-[#edf6e7] text-[#2b422f]" :
                "border-gray-200 bg-white text-slate-700"
              }`}
            >
              {currentAppearance === "default" ? "Default Team" : currentAppearance === "dark" ? "Dark" : "Chalk"}
              <ChevronDown size={12} />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 top-9 z-20 w-32 rounded-xl border border-gray-200 bg-white shadow-xl p-1.5">
                {(["default", "dark", "chalk"] as StageTheme[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleThemeChange(option)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs ${
                      currentAppearance === option ? "bg-kite-50 text-kite-700" : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{option === "default" ? "Default Team" : option === "dark" ? "Dark" : "Chalk"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowSizeSlider((prev) => !prev);
              setShowDirectionSlider(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border whitespace-nowrap ${
              currentAppearance === "dark" ? "border-slate-600 bg-slate-800 text-slate-100" :
              currentAppearance === "chalk" ? "border-[#a7bf9e] bg-[#edf6e7] text-[#2b422f]" :
              "border-gray-200 bg-white text-slate-700"
            }`}
          >
            <SlidersHorizontal size={12} />
            Size
          </button>

          <button
            type="button"
            onClick={() => {
              setShowDirectionSlider((prev) => !prev);
              setShowSizeSlider(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border whitespace-nowrap ${
              currentAppearance === "dark" ? "border-slate-600 bg-slate-800 text-slate-100" :
              currentAppearance === "chalk" ? "border-[#a7bf9e] bg-[#edf6e7] text-[#2b422f]" :
              "border-gray-200 bg-white text-slate-700"
            }`}
          >
            <Palette size={12} />
            Direction
          </button>

          <span className={`text-[11px] ${textStyles[currentAppearance]}`}>{stageSize.width} × {stageSize.height}</span>
        </div>
      </div>

      {(showSizeSlider || showDirectionSlider) && (
        <div className={`px-3 py-3 border-b ${currentAppearance === "dark" ? "bg-slate-800 border-slate-700" : currentAppearance === "chalk" ? "bg-[#edf6e7] border-[#bdd3b6]" : "bg-white border-gray-200"}`}>
          {showSizeSlider && selectedSprite && (
            <div className="flex items-center gap-3 text-xs">
              <span className={currentAppearance === "dark" ? "text-slate-200" : currentAppearance === "chalk" ? "text-[#2b422f]" : "text-slate-600"}>Size</span>
              <input
                type="range"
                min={20}
                max={200}
                value={sizeValue}
                onChange={(e) => updateSprite(selectedSprite.id, { size: Number(e.target.value) })}
                className="flex-1 accent-kite-500"
              />
              <span className={currentAppearance === "dark" ? "text-slate-200" : currentAppearance === "chalk" ? "text-[#2b422f]" : "text-slate-600"}>{Math.round(sizeValue)}%</span>
            </div>
          )}

          {showDirectionSlider && selectedSprite && (
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className={currentAppearance === "dark" ? "text-slate-200" : currentAppearance === "chalk" ? "text-[#2b422f]" : "text-slate-600"}>Direction</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={directionValue}
                onChange={(e) => updateSprite(selectedSprite.id, { direction: Number(e.target.value) })}
                className="flex-1 accent-kite-500"
              />
              <span className={currentAppearance === "dark" ? "text-slate-200" : currentAppearance === "chalk" ? "text-[#2b422f]" : "text-slate-600"}>{Math.round(directionValue)}°</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
