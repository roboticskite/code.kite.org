import type { ProjectData } from "../types";
import { generateId, generateSpriteId, getBuiltinBackdrops, getBuiltinSprites } from "../utils/helpers";

function spriteFromBuiltin(name: string, builtinIndex: number, x: number, y: number): any {
  const builtin = getBuiltinSprites()[builtinIndex];
  return {
    id: generateSpriteId(),
    name,
    x,
    y,
    direction: 90,
    size: 100,
    visible: true,
    costumes: [{ id: generateId("costume"), name: builtin.name.toLowerCase(), dataUrl: builtin.dataUrl, width: 80, height: 80 }],
    currentCostume: 0,
    rotationStyle: "all-around" as const,
    layerOrder: 0,
    variables: {},
    blocks: "",
    volume: 100,
    effects: { color: 0, brightness: 0, ghost: 0 },
  };
}

export const EXAMPLE_PROJECTS: { name: string; description: string; data: ProjectData }[] = [
  {
    name: "Catch the Apple",
    description: "Move the basket to catch falling apples. Score increases for each apple caught!",
    data: {
      projectName: "Catch the Apple",
      sprites: [
        spriteFromBuiltin("Basket", 7, 0, -140),
        spriteFromBuiltin("Apple", 5, 0, 180),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 0,
      variables: [
        { id: generateId("var"), name: "score", value: 0, visible: true, spriteScoped: false },
      ],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    name: "Bouncing Ball",
    description: "A ball that bounces around the screen forever. Watch it move!",
    data: {
      projectName: "Bouncing Ball",
      sprites: [
        spriteFromBuiltin("Ball", 3, 0, 0),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 0,
      variables: [],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    name: "Dancing Cat",
    description: "The cat dances and changes costumes. A fun animation project!",
    data: {
      projectName: "Dancing Cat",
      sprites: [
        spriteFromBuiltin("Cat", 1, 0, 0),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 1,
      variables: [],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    name: "Space Shooter",
    description: "Control a robot ship in space. Shoot enemies and score points!",
    data: {
      projectName: "Space Shooter",
      sprites: [
        spriteFromBuiltin("Ship", 2, 0, -120),
        spriteFromBuiltin("Enemy", 6, 100, 120),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 1,
      variables: [
        { id: generateId("var"), name: "score", value: 0, visible: true, spriteScoped: false },
      ],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    name: "Maze Game",
    description: "Navigate through a maze using arrow keys. Reach the star to win!",
    data: {
      projectName: "Maze Game",
      sprites: [
        spriteFromBuiltin("Player", 2, -180, -120),
        spriteFromBuiltin("Goal", 4, 180, 120),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 2,
      variables: [],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    name: "Flappy Bird",
    description: "Press space to flap. Avoid hitting the ground in this classic-style game!",
    data: {
      projectName: "Flappy Bird",
      sprites: [
        spriteFromBuiltin("Bird", 7, -100, 0),
      ],
      backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
      currentBackdrop: 0,
      variables: [
        { id: generateId("var"), name: "score", value: 0, visible: true, spriteScoped: false },
      ],
      scripts: "",
      sounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
];

export function createBlankProject(name: string = "New Project"): ProjectData {
  const builtinSprites = getBuiltinSprites();
  return {
    projectName: name,
    sprites: [
      {
        id: generateSpriteId(),
        name: "Sprite1",
        x: 0,
        y: 0,
        direction: 90,
        size: 100,
        visible: true,
        costumes: [{ id: generateId("costume"), name: "kite", dataUrl: builtinSprites[0].dataUrl, width: 80, height: 80 }],
        currentCostume: 0,
        rotationStyle: "all-around",
        layerOrder: 0,
        variables: {},
        blocks: "",
        volume: 100,
        effects: { color: 0, brightness: 0, ghost: 0 },
      },
    ],
    backdrops: getBuiltinBackdrops().map((b) => ({ id: generateId("backdrop"), name: b.name, dataUrl: b.dataUrl })),
    currentBackdrop: 0,
    variables: [],
    scripts: "",
    sounds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
