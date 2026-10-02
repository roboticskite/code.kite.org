import type { CategoryDef } from "../types";

export const CATEGORIES: CategoryDef[] = [
  { name: "motion", label: "Motion", color: "#4c97ff", colorSecondary: "#3d87f0", icon: "Move" },
  { name: "looks", label: "Looks", color: "#9966ff", colorSecondary: "#8a5cf0", icon: "Eye" },
  { name: "sound", label: "Sound", color: "#cf63cf", colorSecondary: "#c053c0", icon: "Volume2" },
  { name: "events", label: "Events", color: "#ffbf00", colorSecondary: "#f0af00", icon: "Flag" },
  { name: "control", label: "Control", color: "#ffab19", colorSecondary: "#f09b09", icon: "Repeat" },
  { name: "sensing", label: "Sensing", color: "#5cb1d6", colorSecondary: "#4ca1c6", icon: "Hand" },
  { name: "operators", label: "Operators", color: "#59c059", colorSecondary: "#49b049", icon: "Calculator" },
  { name: "variables", label: "Variables", color: "#ff8c1a", colorSecondary: "#f07c0a", icon: "Variable" },
  { name: "functions", label: "Functions", color: "#ff6680", colorSecondary: "#f05670", icon: "FunctionSquare" },
  { name: "drawing", label: "Drawing", color: "#e8b1d6", colorSecondary: "#d8a1c6", icon: "PenTool" },
  { name: "game", label: "Game", color: "#4caf50", colorSecondary: "#3c9f40", icon: "Gamepad2" },
  { name: "advanced", label: "Advanced", color: "#795548", colorSecondary: "#694538", icon: "Code2" },
];

export function getCategoryColor(name: string): string {
  const cat = CATEGORIES.find((c) => c.name === name);
  return cat ? cat.color : "#999999";
}
