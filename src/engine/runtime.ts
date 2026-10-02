import * as Blockly from "blockly";
import type { RuntimeSpriteState, ProjectData } from "../types";
import { initializeRuntimeState, createRuntimeSprite } from "./spriteState";
import { generateSpriteId } from "../utils/helpers";

export interface RuntimeContext {
  sprites: Record<string, RuntimeSpriteState>;
  clones: RuntimeSpriteState[];
  variables: Record<string, any>;
  lists: Record<string, any[]>;
  functions: Record<string, any>;
  backdrop: number;
  timer: number;
  answer: string;
  running: boolean;
  keysPressed: Set<string>;
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  penCanvas: HTMLCanvasElement | null;
  penCtx: CanvasRenderingContext2D | null;
  audioCtx: AudioContext | null;
  activeSounds: { osc?: OscillatorNode; buffer?: AudioBufferSourceNode }[];
  broadcastHandlers: Map<string, (() => void)[]>;
  stopAll: boolean;
  stopScript: boolean;
  startTime: number;
  cloneCounter: number;
  onStateChange: () => void;
  askCallback: ((question: string) => Promise<string>) | null;
}

interface RunningScript {
  stopped: boolean;
  stop: () => void;
  key?: string;
}

export class RuntimeEngine {
  ctx: RuntimeContext;
  project: ProjectData;
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private runningScripts: RunningScript[] = [];
  private heldKeyScripts = new Map<string, RunningScript[]>();
  private sensingImageCache = new Map<string, Promise<HTMLImageElement | null>>();

  constructor(project: ProjectData, onStateChange: () => void) {
    this.project = project;
    const state = initializeRuntimeState(project);
    this.ctx = {
      ...state,
      penCanvas: null,
      penCtx: null,
      audioCtx: null,
      activeSounds: [],
      broadcastHandlers: new Map(),
      stopAll: false,
      stopScript: false,
      cloneCounter: 0,
      onStateChange,
      askCallback: null,
    };
  }

  setPenCanvas(canvas: HTMLCanvasElement) {
    this.ctx.penCanvas = canvas;
    this.ctx.penCtx = canvas.getContext("2d");
  }

  setAskCallback(cb: (question: string) => Promise<string>) {
    this.ctx.askCallback = cb;
  }

  private getAllSprites(): RuntimeSpriteState[] {
    return [...Object.values(this.ctx.sprites), ...this.ctx.clones];
  }

  private moveSpriteTo(sprite: RuntimeSpriteState, x: number, y: number) {
    const canvas = this.ctx.penCanvas;
    const penCtx = this.ctx.penCtx;
    if (sprite.penDown && canvas && penCtx) {
      penCtx.beginPath();
      penCtx.moveTo((sprite.x + 240) * canvas.width / 480, (180 - sprite.y) * canvas.height / 360);
      penCtx.lineTo((x + 240) * canvas.width / 480, (180 - y) * canvas.height / 360);
      penCtx.strokeStyle = sprite.penColor;
      penCtx.lineWidth = sprite.penSize;
      penCtx.lineCap = "round";
      penCtx.stroke();
    }
    sprite.x = x;
    sprite.y = y;
  }

  async run(workspace: Blockly.Workspace, trigger: { type: string; key?: string; spriteId?: string; message?: string }) {
    this.ctx.running = true;
    this.ctx.stopAll = false;
    this.ctx.gameOver = false;
    this.ctx.levelComplete = false;
    this.ctx.startTime = Date.now();
    this.ctx.timer = 0;

    const topBlocks = workspace.getTopBlocks();

    for (const block of topBlocks) {
      if (this.ctx.stopAll) break;
      const shouldRun = this.matchTrigger(block, trigger);
      if (shouldRun) {
        const sprite = this.getBlockSprite(block);
        if (trigger.type === "key" && trigger.key && block.type === "event_when_key") {
          this.startKeyScript(block, sprite, trigger.key);
        } else {
          this.startScript(block, sprite);
        }
      }
    }

    this.startGameLoop();
  }

  private matchTrigger(block: Blockly.Block, trigger: { type: string; key?: string; spriteId?: string; message?: string }): boolean {
    switch (block.type) {
      case "event_when_flag":
        return trigger.type === "flag";
      case "event_when_key":
        if (trigger.type !== "key") return false;
        const keyField = block.getFieldValue("KEY");
        if (keyField === "any") return true;
        return keyField === trigger.key;
      case "event_when_clicked":
        return trigger.type === "clicked" && trigger.spriteId === this.getBlockSpriteId(block);
      case "event_when_start":
        return trigger.type === "start" || trigger.type === "flag";
      case "event_when_receive":
        if (trigger.type !== "receive") return false;
        return block.getFieldValue("MESSAGE") === trigger.message;
      case "control_when_start_as_clone":
        return trigger.type === "clone";
      case "procedures_def":
        return false;
      default:
        return false;
    }
  }

  private getBlockSpriteId(block: Blockly.Block): string {
    const target = block.getCommentText?.() ?? "";
    return target || (this.project.sprites[0]?.id ?? "");
  }

  private getBlockSprite(block: Blockly.Block): RuntimeSpriteState | null {
    const id = this.getBlockSpriteId(block);
    return this.ctx.sprites[id] ?? null;
  }

  private startScript(block: Blockly.Block, sprite: RuntimeSpriteState | null): Promise<void> {
    const scriptObj: RunningScript = { stopped: false, stop: () => { scriptObj.stopped = true; } };
    this.runningScripts.push(scriptObj);

    return (async () => {
      try {
        let current: Blockly.Block | null = block;
        // Skip the event hat block itself
        if (this.isHatBlock(block)) {
          current = block.getNextBlock();
        }
        while (current && !scriptObj.stopped && !this.ctx.stopAll) {
          await this.executeBlock(current, sprite, scriptObj);
          current = current.getNextBlock();
        }
      } catch (e) {
        // Script ended
      }
      this.runningScripts = this.runningScripts.filter((s) => s !== scriptObj);
    })();
  }

  private startKeyScript(block: Blockly.Block, sprite: RuntimeSpriteState | null, key: string) {
    const existing = this.heldKeyScripts.get(key) ?? [];
    if (existing.some((script) => !script.stopped && (script as RunningScript & { blockId?: string }).blockId === block.id)) return;

    const scriptObj: RunningScript & { blockId: string } = {
      stopped: false,
      key,
      blockId: block.id,
      stop: () => { scriptObj.stopped = true; },
    };
    this.runningScripts.push(scriptObj);
    this.heldKeyScripts.set(key, [...existing, scriptObj]);

    void (async () => {
      try {
        while (!scriptObj.stopped && this.ctx.keysPressed.has(key) && !this.ctx.stopAll) {
          let current = block.getNextBlock();
          while (current && !scriptObj.stopped && !this.ctx.stopAll) {
            await this.executeBlock(current, sprite, scriptObj);
            current = current.getNextBlock();
          }
          if (!scriptObj.stopped && this.ctx.keysPressed.has(key) && !this.ctx.stopAll) {
            await this.wait(0.1, scriptObj);
          }
        }
      } catch (error) {
        console.error("Key script error:", error);
      } finally {
        this.runningScripts = this.runningScripts.filter((script) => script !== scriptObj);
        const activeScripts = (this.heldKeyScripts.get(key) ?? []).filter((script) => script !== scriptObj);
        if (activeScripts.length) this.heldKeyScripts.set(key, activeScripts);
        else this.heldKeyScripts.delete(key);
      }
    })();
  }

  private isHatBlock(block: Blockly.Block): boolean {
    return [
      "event_when_flag",
      "event_when_key",
      "event_when_clicked",
      "event_when_start",
      "event_when_receive",
      "control_when_start_as_clone",
    ].includes(block.type);
  }

  private async executeBlock(block: Blockly.Block, sprite: RuntimeSpriteState | null, script?: RunningScript): Promise<any> {
    if (this.ctx.stopAll || this.ctx.stopScript) return;
    const type = block.type;

    switch (type) {
      // ============ MOTION ============
      case "motion_move_steps": {
        if (sprite) {
          const steps = this.getNumField(block, "STEPS");
          const rad = ((sprite.direction - 90) * Math.PI) / 180;
          this.moveSpriteTo(sprite, sprite.x + Math.cos(rad) * steps, sprite.y - Math.sin(rad) * steps);
        }
        break;
      }
      case "motion_turn_clockwise": {
        if (sprite) sprite.direction += this.getNumField(block, "DEGREES");
        break;
      }
      case "motion_turn_counter": {
        if (sprite) sprite.direction -= this.getNumField(block, "DEGREES");
        break;
      }
      case "motion_goto_xy": {
        if (sprite) {
          this.moveSpriteTo(sprite, this.getNumField(block, "X"), this.getNumField(block, "Y"));
        }
        break;
      }
      case "motion_glide_xy": {
        if (sprite) {
          const targetX = this.getNumField(block, "X");
          const targetY = this.getNumField(block, "Y");
          const secs = this.getNumField(block, "SECS");
          const startX = sprite.x;
          const startY = sprite.y;
          const steps = Math.max(1, Math.floor(secs * 60));
          for (let i = 1; i <= steps; i++) {
            if (this.ctx.stopAll || script?.stopped) return;
            const t = i / steps;
            this.moveSpriteTo(sprite, startX + (targetX - startX) * t, startY + (targetY - startY) * t);
            this.ctx.onStateChange();
            await this.frame();
          }
        }
        break;
      }
      case "motion_change_x": {
        if (sprite) this.moveSpriteTo(sprite, sprite.x + this.getNumField(block, "DX"), sprite.y);
        break;
      }
      case "motion_change_y": {
        if (sprite) this.moveSpriteTo(sprite, sprite.x, sprite.y + this.getNumField(block, "DY"));
        break;
      }
      case "motion_set_x": {
        if (sprite) this.moveSpriteTo(sprite, this.getNumField(block, "X"), sprite.y);
        break;
      }
      case "motion_set_y": {
        if (sprite) this.moveSpriteTo(sprite, sprite.x, this.getNumField(block, "Y"));
        break;
      }
      case "motion_point_direction": {
        if (sprite) sprite.direction = this.getNumField(block, "DIR");
        break;
      }
      case "motion_x": return sprite?.x ?? 0;
      case "motion_y": return sprite?.y ?? 0;
      case "motion_direction": return sprite?.direction ?? 90;

      // ============ LOOKS ============
      case "looks_say": {
        if (sprite) {
          sprite.saying = this.getField(block, "TEXT");
          this.ctx.onStateChange();
        }
        break;
      }
      case "looks_say_for": {
        if (sprite) {
          sprite.saying = this.getField(block, "TEXT");
          this.ctx.onStateChange();
          const secs = this.getNumField(block, "SECS");
          await this.wait(secs);
          sprite.saying = null;
          this.ctx.onStateChange();
        }
        break;
      }
      case "looks_show": {
        if (sprite) sprite.visible = true;
        break;
      }
      case "looks_hide": {
        if (sprite) sprite.visible = false;
        break;
      }
      case "looks_change_size": {
        if (sprite) sprite.size += this.getNumField(block, "SIZE");
        break;
      }
      case "looks_set_size": {
        if (sprite) sprite.size = this.getNumField(block, "SIZE");
        break;
      }
      case "looks_next_costume": {
        if (sprite) {
          sprite.costumeIndex = (sprite.costumeIndex + 1) % sprite.costumes.length;
        }
        break;
      }
      case "looks_change_costume": {
        if (sprite) {
          const name = this.getField(block, "COSTUME");
          const idx = sprite.costumes.findIndex((c) => c.name === name);
          if (idx >= 0) sprite.costumeIndex = idx;
        }
        break;
      }
      case "looks_change_color": {
        if (sprite) sprite.effects.color += this.getNumField(block, "EFFECT");
        break;
      }
      case "looks_switch_backdrop": {
        this.ctx.backdrop = Math.min(this.ctx.backdrop + 1, Math.max(0, this.project.backdrops.length - 1));
        break;
      }
      case "looks_size": return sprite?.size ?? 100;

      // ============ SOUND ============
      case "sound_play":
      case "sound_start": {
        this.playBeep(440, 0.3, sprite?.volume);
        break;
      }
      case "sound_stop_all": {
        this.stopAllSounds();
        break;
      }
      case "sound_change_volume": {
        if (sprite) sprite.volume = Math.max(0, Math.min(100, sprite.volume + this.getNumField(block, "VOLUME")));
        break;
      }
      case "sound_set_volume": {
        if (sprite) sprite.volume = Math.max(0, Math.min(100, this.getNumField(block, "VOLUME")));
        break;
      }
      case "sound_play_note": {
        const note = this.getNumField(block, "NOTE");
        const beats = this.getNumField(block, "BEATS");
        const freq = 440 * Math.pow(2, (note - 69) / 12);
        this.playBeep(freq, beats * 0.5, sprite?.volume);
        break;
      }

      // ============ EVENTS ============
      case "event_broadcast": {
        const msg = this.getField(block, "MESSAGE");
        await this.broadcast(msg, false, block.workspace, sprite);
        break;
      }
      case "event_broadcast_wait": {
        const msg = this.getField(block, "MESSAGE");
        await this.broadcast(msg, true, block.workspace, sprite);
        break;
      }

      // ============ CONTROL ============
      case "control_wait": {
        await this.wait(this.getNumField(block, "SECS"), script);
        break;
      }
      case "control_repeat": {
        const times = await this.evalInput(block, "TIMES", 0, script) as number;
        const doBlock = block.getInput("DO")?.connection?.targetBlock();
        for (let i = 0; i < times; i++) {
          if (this.ctx.stopAll || script?.stopped) return;
          await this.runStatementStack(doBlock, sprite, script);
        }
        break;
      }
      case "control_forever": {
        const doBlock = block.getInput("DO")?.connection?.targetBlock();
        while (!this.ctx.stopAll && !script?.stopped) {
          await this.runStatementStack(doBlock, sprite, script);
          await this.frame();
        }
        return;
      }
      case "control_if": {
        const cond = await this.evalInput(block, "CONDITION", false, script);
        if (cond) {
          const doBlock = block.getInput("DO")?.connection?.targetBlock();
          await this.runStatementStack(doBlock, sprite, script);
        }
        break;
      }
      case "control_if_else": {
        const cond = await this.evalInput(block, "CONDITION", false, script);
        const branch = cond ? "DO" : "ELSE";
        const doBlock = block.getInput(branch)?.connection?.targetBlock();
        await this.runStatementStack(doBlock, sprite, script);
        break;
      }
      case "control_repeat_until": {
        const doBlock = block.getInput("DO")?.connection?.targetBlock();
        let cond = await this.evalInput(block, "CONDITION", false, script);
        while (!cond && !this.ctx.stopAll && !script?.stopped) {
          await this.runStatementStack(doBlock, sprite, script);
          await this.frame();
          cond = await this.evalInput(block, "CONDITION", false, script);
        }
        break;
      }
      case "control_stop": {
        const mode = this.getField(block, "STOP");
        if (mode === "all") this.ctx.stopAll = true;
        else if (mode === "this") script?.stop();
        else this.runningScripts.forEach((running) => {
          if (running !== script) running.stop();
        });
        break;
      }
      case "control_create_clone": {
        const targetName = this.getField(block, "SPRITE");
        const target = targetName === "myself" ? sprite : Object.values(this.ctx.sprites).find((s) => s.name === targetName);
        if (target) {
          const clone = { ...target, id: generateSpriteId(), isClone: true, parentId: target.id, layerOrder: 1000 + this.ctx.cloneCounter++, saying: null, sayTimer: 0, variables: { ...target.variables } };
          this.ctx.clones.push(clone);
          for (const hat of block.workspace.getTopBlocks(false)) {
            if (hat.type === "control_when_start_as_clone") this.startScript(hat, clone);
          }
        }
        break;
      }
      case "control_delete_clone": {
        if (sprite?.isClone) {
          const idx = this.ctx.clones.findIndex((c) => c.id === sprite.id);
          if (idx >= 0) this.ctx.clones.splice(idx, 1);
          script?.stop();
        }
        break;
      }

      // ============ SENSING ============
      case "sensing_key_pressed": {
        const key = this.getField(block, "KEY");
        if (key === "any") return this.ctx.keysPressed.size > 0;
        return this.ctx.keysPressed.has(key);
      }
      case "sensing_mouse_down": return this.ctx.mouseDown;
      case "sensing_mouse_x": return this.ctx.mouseX;
      case "sensing_mouse_y": return this.ctx.mouseY;
      case "sensing_touching": {
        if (!sprite) return false;
        const targetName = this.getField(block, "SPRITE");
        const targets = this.getAllSprites().filter((s) => s.id !== sprite.id && s.name === targetName && s.visible);
        for (const t of targets) {
          if (this.checkCollision(sprite, t)) return true;
        }
        return false;
      }
      case "sensing_touching_color": {
        if (!sprite) return false;
        return this.isTouchingColor(sprite, this.getField(block, "COLOR"));
      }
      case "sensing_touching_edge": {
        if (!sprite) return false;
        const costume = sprite.costumes[sprite.costumeIndex];
        const halfW = ((costume?.width ?? 80) * sprite.size / 100) / 2;
        const halfH = ((costume?.height ?? 80) * sprite.size / 100) / 2;
        const STAGE_W = 240;
        const STAGE_H = 180;
        return sprite.x - halfW <= -STAGE_W || sprite.x + halfW >= STAGE_W ||
               sprite.y - halfH <= -STAGE_H || sprite.y + halfH >= STAGE_H;
      }
      case "sensing_touching_mouse": {
        if (!sprite) return false;
        const costume = sprite.costumes[sprite.costumeIndex];
        const halfW = ((costume?.width ?? 80) * sprite.size / 100) / 2;
        const halfH = ((costume?.height ?? 80) * sprite.size / 100) / 2;
        const dx = Math.abs(sprite.x - this.ctx.mouseX);
        const dy = Math.abs(sprite.y - this.ctx.mouseY);
        return dx < halfW && dy < halfH;
      }
      case "sensing_bounce_off_edge": {
        if (sprite) {
          const costume = sprite.costumes[sprite.costumeIndex];
          const halfW = ((costume?.width ?? 80) * sprite.size / 100) / 2;
          const halfH = ((costume?.height ?? 80) * sprite.size / 100) / 2;
          const STAGE_W = 240;
          const STAGE_H = 180;
          if (sprite.x + halfW >= STAGE_W) {
            sprite.x = STAGE_W - halfW;
            sprite.direction = 180 - sprite.direction;
          } else if (sprite.x - halfW <= -STAGE_W) {
            sprite.x = -STAGE_W + halfW;
            sprite.direction = 180 - sprite.direction;
          }
          if (sprite.y + halfH >= STAGE_H) {
            sprite.y = STAGE_H - halfH;
            sprite.direction = -sprite.direction;
          } else if (sprite.y - halfH <= -STAGE_H) {
            sprite.y = -STAGE_H + halfH;
            sprite.direction = -sprite.direction;
          }
          sprite.direction = ((sprite.direction % 360) + 360) % 360;
        }
        break;
      }
      case "sensing_distance": {
        if (!sprite) return 0;
        const targetName = this.getField(block, "SPRITE");
        const target = this.getAllSprites().find((s) => s.name === targetName && s.id !== sprite.id);
        if (!target) return 10000;
        const dx = sprite.x - target.x;
        const dy = sprite.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
      }
      case "sensing_ask": {
        const question = this.getField(block, "QUESTION");
        if (this.ctx.askCallback) {
          this.ctx.answer = await this.ctx.askCallback(question);
        }
        break;
      }
      case "sensing_answer": return this.ctx.answer;
      case "sensing_timer": return (Date.now() - this.ctx.startTime) / 1000;
      case "sensing_reset_timer": this.ctx.startTime = Date.now(); break;

      // ============ OPERATORS ============
      case "operators_add": return (await this.evalInput(block, "A", 0)) + (await this.evalInput(block, "B", 0));
      case "operators_subtract": return (await this.evalInput(block, "A", 0)) - (await this.evalInput(block, "B", 0));
      case "operators_multiply": return (await this.evalInput(block, "A", 0)) * (await this.evalInput(block, "B", 0));
      case "operators_divide": {
        const b = await this.evalInput(block, "B", 0);
        const a = await this.evalInput(block, "A", 0);
        return b === 0 ? 0 : a / b;
      }
      case "operators_random": {
        const from = this.getNumField(block, "FROM");
        const to = this.getNumField(block, "TO");
        return from + Math.random() * (to - from);
      }
      case "operators_greater": return (await this.evalInput(block, "A", 0)) > (await this.evalInput(block, "B", 0));
      case "operators_less": return (await this.evalInput(block, "A", 0)) < (await this.evalInput(block, "B", 0));
      case "operators_equal": return (await this.evalInput(block, "A", 0)) === (await this.evalInput(block, "B", 0));
      case "operators_and": return (await this.evalInput(block, "A", false)) && (await this.evalInput(block, "B", false));
      case "operators_or": return (await this.evalInput(block, "A", false)) || (await this.evalInput(block, "B", false));
      case "operators_not": return !(await this.evalInput(block, "A", false));
      case "operators_join": return this.getField(block, "A") + this.getField(block, "B");
      case "operators_length": return this.getField(block, "TEXT").length;
      case "operators_mod": {
        const b = this.getNumField(block, "B");
        return b === 0 ? 0 : this.getNumField(block, "A") % b;
      }
      case "operators_round": return Math.round(this.getNumField(block, "NUM"));

      // ============ VARIABLES ============
      case "variables_set": {
        const name = this.getField(block, "VAR");
        const valStr = this.getField(block, "VALUE");
        const val = isNaN(Number(valStr)) ? valStr : Number(valStr);
        this.setVariable(name, val, sprite);
        break;
      }
      case "variables_change": {
        const name = this.getField(block, "VAR");
        const current = this.getVariable(name, sprite);
        const newVal = Number(current) + this.getNumField(block, "VALUE");
        this.setVariable(name, newVal, sprite);
        break;
      }
      case "variables_show": {
        const name = this.getField(block, "VAR");
        // Mark visible in project variables
        const v = this.project.variables.find((v) => v.name === name);
        if (v) v.visible = true;
        break;
      }
      case "variables_hide": {
        const name = this.getField(block, "VAR");
        const v = this.project.variables.find((v) => v.name === name);
        if (v) v.visible = false;
        break;
      }
      case "variables_get": {
        return this.getVariable(this.getField(block, "VAR"), sprite);
      }
      case "variables_create": {
        const name = this.getField(block, "NAME");
        if (!(name in this.ctx.variables)) this.ctx.variables[name] = 0;
        break;
      }

      // ============ FUNCTIONS ============
      case "procedures_def": return;
      case "procedures_call": {
        const name = this.getField(block, "NAME");
        const defBlock = this.findFunctionDef(block.workspace, name);
        if (defBlock) {
          const fnSprite = sprite;
          let current = defBlock.getNextBlock();
          this.ctx.stopScript = false;
          delete this.ctx.functions.__return;
          while (current && !this.ctx.stopAll && !this.ctx.stopScript && !script?.stopped) {
            await this.executeBlock(current, fnSprite, script);
            current = current.getNextBlock();
          }
          if (this.ctx.functions.__return !== undefined) {
            this.ctx.functions[name] = this.ctx.functions.__return;
            delete this.ctx.functions.__return;
          }
          this.ctx.stopScript = false;
        }
        break;
      }
      case "procedures_return": {
        this.ctx.functions.__return = this.getField(block, "VALUE");
        this.ctx.stopScript = true;
        break;
      }

      // ============ DRAWING ============
      case "drawing_pen_down": if (sprite) sprite.penDown = true; break;
      case "drawing_pen_up": if (sprite) sprite.penDown = false; break;
      case "drawing_set_color": if (sprite) {
        const color = this.getField(block, "COLOR");
        sprite.penColor = color.startsWith("#") ? color : `#${color}`;
      } break;
      case "drawing_set_size": if (sprite) sprite.penSize = this.getNumField(block, "SIZE"); break;
      case "drawing_clear": this.clearPen(); break;
      case "drawing_stamp": if (sprite) await this.stamp(sprite); break;

      // ============ GAME ============
      case "game_set_score": if (sprite) sprite.score = this.getNumField(block, "SCORE"); break;
      case "game_change_score": if (sprite) sprite.score += this.getNumField(block, "VALUE"); break;
      case "game_score": return sprite?.score ?? 0;
      case "game_set_health": if (sprite) sprite.health = this.getNumField(block, "HEALTH"); break;
      case "game_change_health": if (sprite) sprite.health += this.getNumField(block, "VALUE"); break;
      case "game_set_lives": if (sprite) sprite.lives = this.getNumField(block, "LIVES"); break;
      case "game_change_lives": if (sprite) sprite.lives += this.getNumField(block, "VALUE"); break;
      case "game_set_gravity": if (sprite) sprite.gravity = this.getNumField(block, "GRAVITY"); break;
      case "game_jump": {
        if (sprite) sprite.vy = this.getNumField(block, "POWER");
        break;
      }
      case "game_apply_gravity": {
        if (sprite) {
          sprite.vy -= sprite.gravity;
          this.moveSpriteTo(sprite, sprite.x, sprite.y + sprite.vy);
        }
        break;
      }
      case "game_game_over": this.ctx.gameOver = true; break;
      case "game_level_complete": this.ctx.levelComplete = true; break;
      case "game_move_player": {
        if (sprite) {
          const dir = this.getField(block, "DIR");
          const speed = this.getNumField(block, "SPEED");
          switch (dir) {
            case "left": this.moveSpriteTo(sprite, sprite.x - speed, sprite.y); break;
            case "right": this.moveSpriteTo(sprite, sprite.x + speed, sprite.y); break;
            case "up": this.moveSpriteTo(sprite, sprite.x, sprite.y + speed); break;
            case "down": this.moveSpriteTo(sprite, sprite.x, sprite.y - speed); break;
          }
        }
        break;
      }
      case "game_random_move": {
        if (sprite) {
          const speed = this.getNumField(block, "SPEED");
          const angle = Math.random() * Math.PI * 2;
          this.moveSpriteTo(sprite, sprite.x + Math.cos(angle) * speed, sprite.y + Math.sin(angle) * speed);
        }
        break;
      }

      // ============ ADVANCED ============
      case "advanced_js": {
        try {
          const code = this.getField(block, "CODE");
          // eslint-disable-next-line no-new-func
          Function(code)();
        } catch (e) {
          console.error("JS block error:", e);
        }
        break;
      }
      case "advanced_console_log": console.log(this.getField(block, "TEXT")); break;
      case "advanced_list_create": {
        const name = this.getField(block, "NAME");
        if (!(name in this.ctx.lists)) this.ctx.lists[name] = [];
        break;
      }
      case "advanced_list_add": {
        const listName = this.getField(block, "LIST");
        const item = this.getField(block, "ITEM");
        if (!this.ctx.lists[listName]) this.ctx.lists[listName] = [];
        this.ctx.lists[listName].push(isNaN(Number(item)) ? item : Number(item));
        break;
      }
      case "advanced_list_length": {
        const listName = this.getField(block, "LIST");
        return this.ctx.lists[listName]?.length ?? 0;
      }
      case "advanced_math_func": {
        const func = this.getField(block, "FUNC");
        const num = this.getNumField(block, "NUM");
        const mathFuncs: Record<string, (n: number) => number> = {
          abs: Math.abs, floor: Math.floor, ceil: Math.ceil, sqrt: Math.sqrt,
          sin: Math.sin, cos: Math.cos, tan: Math.tan,
        };
        return mathFuncs[func]?.(num) ?? 0;
      }
      case "advanced_wait_until": {
        let cond = await this.evalInput(block, "CONDITION", false, script);
        while (!cond && !this.ctx.stopAll && !script?.stopped) {
          await this.frame();
          cond = await this.evalInput(block, "CONDITION", false, script);
        }
        break;
      }

      default: break;
    }
    this.ctx.onStateChange();
  }

  private findFunctionDef(workspace: Blockly.Workspace, name: string): Blockly.Block | null {
    const allBlocks = workspace.getAllBlocks(false);
    return allBlocks.find((b) => b.type === "procedures_def" && b.getFieldValue("NAME") === name) ?? null;
  }

  private async runStatementStack(block: Blockly.Block | null | undefined, sprite: RuntimeSpriteState | null, script?: RunningScript) {
    let current = block;
    while (current && !this.ctx.stopAll && !this.ctx.stopScript && !script?.stopped) {
      await this.executeBlock(current, sprite, script);
      current = current.getNextBlock();
    }
    this.ctx.stopScript = false;
  }

  private async evalInput(block: Blockly.Block, inputName: string, defaultValue: any, script?: RunningScript): Promise<any> {
    const inputBlock = block.getInput(inputName)?.connection?.targetBlock();
    if (inputBlock) {
      const spriteId = block.getCommentText?.() ?? "";
      const inputSprite = this.ctx.sprites[spriteId] ?? null;
      return await this.executeBlock(inputBlock, inputSprite, script);
    }
    return defaultValue;
  }

  private getNumField(block: Blockly.Block, name: string): number {
    return Number(block.getFieldValue(name)) || 0;
  }

  private getField(block: Blockly.Block, name: string): string {
    return String(block.getFieldValue(name) ?? "");
  }

  private getVariable(name: string, sprite: RuntimeSpriteState | null): any {
    if (sprite && name in sprite.variables) return sprite.variables[name];
    return this.ctx.variables[name] ?? 0;
  }

  private setVariable(name: string, value: any, sprite: RuntimeSpriteState | null) {
    if (sprite && name in sprite.variables) sprite.variables[name] = value;
    else this.ctx.variables[name] = value;
  }

  private checkCollision(a: RuntimeSpriteState, b: RuntimeSpriteState): boolean {
    const aCostume = a.costumes[a.costumeIndex];
    const bCostume = b.costumes[b.costumeIndex];
    const aRad = (a.size / 100) * (aCostume?.width ?? 80) / 2;
    const bRad = (b.size / 100) * (bCostume?.width ?? 80) / 2;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < (aRad + bRad) * 0.7;
  }

  private async isTouchingColor(sprite: RuntimeSpriteState, color: string): Promise<boolean> {
    if (!sprite.visible) return false;
    let hex = color.trim().replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map((digit) => digit + digit).join("");
    if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
    const target = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    const createCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 360;
      return canvas;
    };
    const loadImage = (dataUrl: string): Promise<HTMLImageElement | null> => {
      const cached = this.sensingImageCache.get(dataUrl);
      if (cached) return cached;
      const imagePromise = new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = dataUrl;
      });
      this.sensingImageCache.set(dataUrl, imagePromise);
      return imagePromise;
    };
    const drawSprite = async (context: CanvasRenderingContext2D, targetSprite: RuntimeSpriteState) => {
      const costume = targetSprite.costumes[targetSprite.costumeIndex];
      if (!costume) return;
      const image = await loadImage(costume.dataUrl);
      if (!image) return;
      const width = (costume.width || image.naturalWidth) * targetSprite.size / 100;
      const height = (costume.height || image.naturalHeight) * targetSprite.size / 100;
      context.save();
      context.translate(targetSprite.x + 240, 180 - targetSprite.y);
      if (targetSprite.rotationStyle === "all-around") {
        context.rotate(((targetSprite.direction - 90) * Math.PI) / 180);
      } else if (targetSprite.rotationStyle === "left-right" && targetSprite.direction < 0) {
        context.scale(-1, 1);
      }
      context.globalAlpha = Math.max(0, 1 - targetSprite.effects.ghost / 100);
      context.filter = targetSprite.effects.color ? `hue-rotate(${targetSprite.effects.color * 3.6}deg)` : "none";
      context.drawImage(image, -width / 2, -height / 2, width, height);
      context.restore();
    };

    const sceneCanvas = createCanvas();
    const sceneContext = sceneCanvas.getContext("2d");
    const maskCanvas = createCanvas();
    const maskContext = maskCanvas.getContext("2d");
    if (!sceneContext || !maskContext) return false;

    const backdrop = this.project.backdrops[this.ctx.backdrop] ?? this.project.backdrops[this.project.currentBackdrop];
    if (backdrop) {
      const backdropImage = await loadImage(backdrop.dataUrl);
      if (backdropImage) sceneContext.drawImage(backdropImage, 0, 0, 480, 360);
    }
    for (const otherSprite of this.getAllSprites()) {
      if (otherSprite.id !== sprite.id && otherSprite.visible) await drawSprite(sceneContext, otherSprite);
    }
    await drawSprite(maskContext, sprite);

    const scenePixels = sceneContext.getImageData(0, 0, 480, 360).data;
    const spritePixels = maskContext.getImageData(0, 0, 480, 360).data;
    for (let index = 0; index < scenePixels.length; index += 4) {
      if (spritePixels[index + 3] === 0 || scenePixels[index + 3] === 0) continue;
      if (Math.abs(scenePixels[index] - target[0]) <= 20 &&
          Math.abs(scenePixels[index + 1] - target[1]) <= 20 &&
          Math.abs(scenePixels[index + 2] - target[2]) <= 20) return true;
    }
    return false;
  }

  private async broadcast(message: string, wait: boolean, workspace: Blockly.Workspace, sender: RuntimeSpriteState | null) {
    const executions = workspace.getTopBlocks(false)
      .filter((block) => block.type === "event_when_receive" && this.getField(block, "MESSAGE") === message)
      .map((block) => this.startScript(block, this.getBlockSprite(block) ?? sender));
    if (wait) await Promise.all(executions);
  }

  private playBeep(freq: number, duration: number, volume = 100) {
    if (!this.ctx.audioCtx) {
      this.ctx.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = this.ctx.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(Math.max(0.0001, 0.15 * Math.max(0, Math.min(100, volume)) / 100), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.max(0.01, duration));
    osc.start();
    osc.stop(ctx.currentTime + Math.max(0.01, duration));
    const activeSound = { osc };
    this.ctx.activeSounds.push(activeSound);
    osc.onended = () => {
      this.ctx.activeSounds = this.ctx.activeSounds.filter((sound) => sound !== activeSound);
    };
  }

  private stopAllSounds() {
    for (const sound of this.ctx.activeSounds) {
      try {
        sound.osc?.stop();
        sound.buffer?.stop();
      } catch {
        // A sound may already have ended.
      }
    }
    this.ctx.activeSounds = [];
  }

  private clearPen() {
    if (this.ctx.penCtx && this.ctx.penCanvas) {
      this.ctx.penCtx.clearRect(0, 0, this.ctx.penCanvas.width, this.ctx.penCanvas.height);
    }
  }

  private async stamp(sprite: RuntimeSpriteState) {
    const ctx = this.ctx.penCtx;
    const canvas = this.ctx.penCanvas;
    const costume = sprite.costumes[sprite.costumeIndex];
    if (!ctx || !canvas || !costume) return;
    const imagePromise = this.sensingImageCache.get(costume.dataUrl) ?? new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = costume.dataUrl;
    });
    this.sensingImageCache.set(costume.dataUrl, imagePromise);
    const image = await imagePromise;
    if (!image) return;

    const width = (costume.width || image.naturalWidth) * sprite.size / 100;
    const height = (costume.height || image.naturalHeight) * sprite.size / 100;
    ctx.save();
    ctx.translate((sprite.x + 240) * canvas.width / 480, (180 - sprite.y) * canvas.height / 360);
    if (sprite.rotationStyle === "all-around") {
      ctx.rotate(((sprite.direction - 90) * Math.PI) / 180);
    } else if (sprite.rotationStyle === "left-right" && sprite.direction < 0) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  private async wait(seconds: number, script?: RunningScript) {
    const ms = seconds * 1000;
    const start = Date.now();
    while (Date.now() - start < ms) {
      if (this.ctx.stopAll || script?.stopped) return;
      await this.frame();
    }
  }

  private frame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  private startGameLoop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.lastTime = performance.now();
    const loop = (time: number) => {
      if (!this.ctx.running) return;
      const dt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      this.ctx.timer = (Date.now() - this.ctx.startTime) / 1000;
      this.ctx.onStateChange();
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  stop() {
    this.ctx.running = false;
    this.ctx.stopAll = true;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.runningScripts.forEach((s) => s.stop());
    this.runningScripts = [];
    this.heldKeyScripts.clear();
    this.stopAllSounds();
    if (this.ctx.audioCtx) {
      this.ctx.audioCtx.close();
      this.ctx.audioCtx = null;
    }
  }

  handleKeyDown(key: string, workspace?: Blockly.Workspace | null) {
    if (this.ctx.keysPressed.has(key)) return;
    this.ctx.keysPressed.add(key);
    if (!workspace || !this.ctx.running || this.ctx.stopAll) return;
    for (const block of workspace.getTopBlocks(false)) {
      if (block.type !== "event_when_key") continue;
      const blockKey = String(block.getFieldValue("KEY") ?? "");
      if (blockKey === key || blockKey === "any") {
        this.startKeyScript(block, this.getBlockSprite(block), key);
      }
    }
  }

  handleKeyUp(key: string) {
    this.ctx.keysPressed.delete(key);
    for (const script of this.heldKeyScripts.get(key) ?? []) script.stop();
  }

  clearPressedKeys() {
    for (const key of this.ctx.keysPressed) this.handleKeyUp(key);
  }

  handleMouseMove(x: number, y: number) {
    this.ctx.mouseX = x;
    this.ctx.mouseY = y;
  }

  handleMouseDown() {
    this.ctx.mouseDown = true;
  }

  handleMouseUp() {
    this.ctx.mouseDown = false;
  }
}
