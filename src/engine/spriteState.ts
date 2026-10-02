import type {
  RuntimeSpriteState,
  Costume,
  ProjectData,
  Variable,
} from "../types";
import { generateSpriteId } from "../utils/helpers";

export function createRuntimeSprite(
  sprite: any,
  layerOrder: number
): RuntimeSpriteState {
  return {
    id: sprite.id,
    name: sprite.name,
    x: sprite.x ?? 0,
    y: sprite.y ?? 0,
    direction: sprite.direction ?? 90,
    size: sprite.size ?? 100,
    visible: sprite.visible !== false,
    costumeIndex: sprite.currentCostume ?? 0,
    costumes: sprite.costumes ?? [],
    rotationStyle: sprite.rotationStyle ?? "all-around",
    layerOrder,
    volume: sprite.volume ?? 100,
    effects: sprite.effects ?? { color: 0, brightness: 0, ghost: 0 },
    saying: null,
    sayTimer: 0,
    variables: {},
    vx: 0,
    vy: 0,
    gravity: 0,
    health: 100,
    lives: 3,
    score: 0,
    isClone: false,
    penDown: false,
    penColor: "#ff0000",
    penSize: 1,
  };
}

export function cloneSprite(
  parent: RuntimeSpriteState,
  layerOrder: number
): RuntimeSpriteState {
  return {
    ...parent,
    id: generateSpriteId(),
    isClone: true,
    parentId: parent.id,
    layerOrder,
    saying: null,
    sayTimer: 0,
    vx: 0,
    vy: 0,
    variables: { ...parent.variables },
  };
}

export function getSpriteCostume(sprite: RuntimeSpriteState): Costume | null {
  if (sprite.costumes.length === 0) return null;
  const idx = Math.max(0, Math.min(sprite.costumeIndex, sprite.costumes.length - 1));
  return sprite.costumes[idx];
}

export function initializeRuntimeState(project: ProjectData) {
  const sprites: Record<string, RuntimeSpriteState> = {};
  project.sprites.forEach((s, i) => {
    sprites[s.id] = createRuntimeSprite(s, i);
  });
  const variables: Record<string, any> = {};
  project.variables.forEach((v: Variable) => {
    variables[v.name] = v.value;
  });
  return {
    sprites,
    variables,
    clones: [] as RuntimeSpriteState[],
    backdrop: project.currentBackdrop ?? 0,
    timer: 0,
    answer: "",
    running: false,
    messages: [] as string[],
    keysPressed: new Set<string>(),
    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
    gameOver: false,
    levelComplete: false,
    penLayer: null as HTMLCanvasElement | null,
    lists: {} as Record<string, any[]>,
    functions: {} as Record<string, any>,
    broadcastQueue: [] as string[],
    startTime: Date.now(),
  };
}
