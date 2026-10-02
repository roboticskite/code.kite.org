import * as Blockly from "blockly";
import { CATEGORIES } from "./categories";
import type { CategoryName } from "../types";

function colorFor(cat: CategoryName): string {
  const c = CATEGORIES.find((x) => x.name === cat);
  return c ? c.color : "#999";
}

function defineBlock(
  type: string,
  category: CategoryName,
  tooltip: string,
  def: (this: any) => void
) {
  const block = Blockly.Blocks[type];
  if (block) return;
  Blockly.defineBlocksWithJsonArray === undefined;
  const obj: any = {
    type,
    colour: colorFor(category),
    tooltip,
  };
  Blockly.Blocks[type] = {
    init() {
      (this as any).jsonInit(obj);
      def.call(this);
    },
  };
}

export function defineAllBlocks() {
  // ============ MOTION ============
  Blockly.Blocks["motion_move_steps"] = {
    init() {
      this.appendDummyInput().appendField("move").appendField(new Blockly.FieldNumber(10), "STEPS").appendField("steps");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Moves the sprite forward by the given number of steps");
    },
  };

  Blockly.Blocks["motion_turn_clockwise"] = {
    init() {
      this.appendDummyInput().appendField("turn clockwise").appendField(new Blockly.FieldNumber(15), "DEGREES").appendField("degrees");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Rotates the sprite clockwise");
    },
  };

  Blockly.Blocks["motion_turn_counter"] = {
    init() {
      this.appendDummyInput().appendField("turn counter-clockwise").appendField(new Blockly.FieldNumber(15), "DEGREES").appendField("degrees");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Rotates the sprite counter-clockwise");
    },
  };

  Blockly.Blocks["motion_goto_xy"] = {
    init() {
      this.appendDummyInput().appendField("go to x:").appendField(new Blockly.FieldNumber(0), "X").appendField("y:").appendField(new Blockly.FieldNumber(0), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Moves the sprite to a specific position");
    },
  };

  Blockly.Blocks["motion_glide_xy"] = {
    init() {
      this.appendDummyInput().appendField("glide to x:").appendField(new Blockly.FieldNumber(0), "X").appendField("y:").appendField(new Blockly.FieldNumber(0), "Y").appendField("in").appendField(new Blockly.FieldNumber(1), "SECS").appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Smoothly glides the sprite to a position over time");
    },
  };

  Blockly.Blocks["motion_change_x"] = {
    init() {
      this.appendDummyInput().appendField("change x by").appendField(new Blockly.FieldNumber(10), "DX");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Changes the sprite's x position");
    },
  };

  Blockly.Blocks["motion_change_y"] = {
    init() {
      this.appendDummyInput().appendField("change y by").appendField(new Blockly.FieldNumber(10), "DY");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Changes the sprite's y position");
    },
  };

  Blockly.Blocks["motion_set_x"] = {
    init() {
      this.appendDummyInput().appendField("set x to").appendField(new Blockly.FieldNumber(0), "X");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Sets the sprite's x position");
    },
  };

  Blockly.Blocks["motion_set_y"] = {
    init() {
      this.appendDummyInput().appendField("set y to").appendField(new Blockly.FieldNumber(0), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Sets the sprite's y position");
    },
  };

  Blockly.Blocks["motion_point_direction"] = {
    init() {
      this.appendDummyInput().appendField("point in direction").appendField(new Blockly.FieldNumber(90), "DIR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("motion"));
      this.setTooltip("Points the sprite in a direction (0=up, 90=right, 180=down, -90=left)");
    },
  };

  Blockly.Blocks["motion_x"] = {
    init() {
      this.appendDummyInput().appendField("x position");
      this.setOutput(true, "Number");
      this.setColour(colorFor("motion"));
      this.setTooltip("Returns the sprite's current x position");
    },
  };

  Blockly.Blocks["motion_y"] = {
    init() {
      this.appendDummyInput().appendField("y position");
      this.setOutput(true, "Number");
      this.setColour(colorFor("motion"));
      this.setTooltip("Returns the sprite's current y position");
    },
  };

  Blockly.Blocks["motion_direction"] = {
    init() {
      this.appendDummyInput().appendField("direction");
      this.setOutput(true, "Number");
      this.setColour(colorFor("motion"));
      this.setTooltip("Returns the sprite's current direction");
    },
  };

  // ============ LOOKS ============
  Blockly.Blocks["looks_say"] = {
    init() {
      this.appendDummyInput().appendField("say").appendField(new Blockly.FieldTextInput("Hello!"), "TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Shows a speech bubble with the given text");
    },
  };

  Blockly.Blocks["looks_say_for"] = {
    init() {
      this.appendDummyInput().appendField("say").appendField(new Blockly.FieldTextInput("Hello!"), "TEXT").appendField("for").appendField(new Blockly.FieldNumber(2), "SECS").appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Shows a speech bubble for a duration");
    },
  };

  Blockly.Blocks["looks_show"] = {
    init() {
      this.appendDummyInput().appendField("show");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Shows the sprite");
    },
  };

  Blockly.Blocks["looks_hide"] = {
    init() {
      this.appendDummyInput().appendField("hide");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Hides the sprite");
    },
  };

  Blockly.Blocks["looks_change_size"] = {
    init() {
      this.appendDummyInput().appendField("change size by").appendField(new Blockly.FieldNumber(10), "SIZE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Changes the sprite's size");
    },
  };

  Blockly.Blocks["looks_set_size"] = {
    init() {
      this.appendDummyInput().appendField("set size to").appendField(new Blockly.FieldNumber(100), "SIZE").appendField("%");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Sets the sprite's size");
    },
  };

  Blockly.Blocks["looks_next_costume"] = {
    init() {
      this.appendDummyInput().appendField("next costume");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Switches to the next costume");
    },
  };

  Blockly.Blocks["looks_change_costume"] = {
    init() {
      this.appendDummyInput().appendField("switch costume to").appendField(new Blockly.FieldTextInput("costume1"), "COSTUME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Switches to a specific costume");
    },
  };

  Blockly.Blocks["looks_change_color"] = {
    init() {
      this.appendDummyInput().appendField("change color effect by").appendField(new Blockly.FieldNumber(25), "EFFECT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Changes the color effect");
    },
  };

  Blockly.Blocks["looks_switch_backdrop"] = {
    init() {
      this.appendDummyInput().appendField("switch backdrop to").appendField(new Blockly.FieldTextInput("backdrop1"), "BACKDROP");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("looks"));
      this.setTooltip("Changes the stage backdrop");
    },
  };

  Blockly.Blocks["looks_size"] = {
    init() {
      this.appendDummyInput().appendField("size");
      this.setOutput(true, "Number");
      this.setColour(colorFor("looks"));
      this.setTooltip("Returns the sprite's current size");
    },
  };

  // ============ SOUND ============
  Blockly.Blocks["sound_play"] = {
    init() {
      this.appendDummyInput().appendField("play sound").appendField(new Blockly.FieldTextInput("meow"), "SOUND");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Plays a sound");
    },
  };

  Blockly.Blocks["sound_start"] = {
    init() {
      this.appendDummyInput().appendField("start sound").appendField(new Blockly.FieldTextInput("meow"), "SOUND");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Starts playing a sound (does not wait)");
    },
  };

  Blockly.Blocks["sound_stop_all"] = {
    init() {
      this.appendDummyInput().appendField("stop all sounds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Stops all playing sounds");
    },
  };

  Blockly.Blocks["sound_change_volume"] = {
    init() {
      this.appendDummyInput().appendField("change volume by").appendField(new Blockly.FieldNumber(10), "VOLUME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Changes the volume");
    },
  };

  Blockly.Blocks["sound_set_volume"] = {
    init() {
      this.appendDummyInput().appendField("set volume to").appendField(new Blockly.FieldNumber(100), "VOLUME").appendField("%");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Sets the volume");
    },
  };

  Blockly.Blocks["sound_play_note"] = {
    init() {
      this.appendDummyInput().appendField("play note").appendField(new Blockly.FieldNumber(60), "NOTE").appendField("for").appendField(new Blockly.FieldNumber(0.5), "BEATS").appendField("beats");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sound"));
      this.setTooltip("Plays a musical note (60=middle C)");
    },
  };

  // ============ EVENTS ============
  Blockly.Blocks["event_when_flag"] = {
    init() {
      this.appendDummyInput().appendField("when").appendField(new Blockly.FieldLabelSerializable("green flag", "FLAG"), "FLAG").appendField("clicked");
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Runs when the green flag is clicked");
    },
  };

  Blockly.Blocks["event_when_key"] = {
    init() {
      const dd = new Blockly.FieldDropdown([
        ["space", " "],
        ["up arrow", "ArrowUp"],
        ["down arrow", "ArrowDown"],
        ["left arrow", "ArrowLeft"],
        ["right arrow", "ArrowRight"],
        ["a", "a"],
        ["b", "b"],
        ["c", "c"],
        ["d", "d"],
        ["e", "e"],
        ["f", "f"],
        ["w", "w"],
        ["s", "s"],
      ]);
      this.appendDummyInput().appendField("when").appendField(dd, "KEY").appendField("key pressed");
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Runs when a key is pressed");
    },
  };

  Blockly.Blocks["event_when_clicked"] = {
    init() {
      this.appendDummyInput().appendField("when this sprite clicked");
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Runs when the sprite is clicked");
    },
  };

  Blockly.Blocks["event_when_start"] = {
    init() {
      this.appendDummyInput().appendField("when project starts");
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Runs when the project starts");
    },
  };

  Blockly.Blocks["event_broadcast"] = {
    init() {
      this.appendDummyInput().appendField("broadcast").appendField(new Blockly.FieldTextInput("message1"), "MESSAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Sends a message to all sprites");
    },
  };

  Blockly.Blocks["event_broadcast_wait"] = {
    init() {
      this.appendDummyInput().appendField("broadcast").appendField(new Blockly.FieldTextInput("message1"), "MESSAGE").appendField("and wait");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Sends a message and waits for all receivers to finish");
    },
  };

  Blockly.Blocks["event_when_receive"] = {
    init() {
      this.appendDummyInput().appendField("when I receive").appendField(new Blockly.FieldTextInput("message1"), "MESSAGE");
      this.setNextStatement(true, null);
      this.setColour(colorFor("events"));
      this.setTooltip("Runs when a matching message is received");
    },
  };

  // ============ CONTROL ============
  Blockly.Blocks["control_wait"] = {
    init() {
      this.appendDummyInput().appendField("wait").appendField(new Blockly.FieldNumber(1), "SECS").appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Pauses execution for a duration");
    },
  };

  Blockly.Blocks["control_repeat"] = {
    init() {
      this.appendValueInput("TIMES").setCheck("Number").appendField("repeat");
      this.appendStatementInput("DO").setCheck(null).appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Repeats the blocks a number of times");
    },
  };

  Blockly.Blocks["control_forever"] = {
    init() {
      this.appendStatementInput("DO").setCheck(null).appendField("forever");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Repeats the blocks forever");
    },
  };

  Blockly.Blocks["control_if"] = {
    init() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").setCheck(null).appendField("then");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Runs blocks if a condition is true");
    },
  };

  Blockly.Blocks["control_if_else"] = {
    init() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").setCheck(null).appendField("then");
      this.appendStatementInput("ELSE").setCheck(null).appendField("else");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Runs different blocks based on a condition");
    },
  };

  Blockly.Blocks["control_repeat_until"] = {
    init() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("repeat until");
      this.appendStatementInput("DO").setCheck(null).appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Repeats blocks until a condition becomes true");
    },
  };

  Blockly.Blocks["control_stop"] = {
    init() {
      const dd = new Blockly.FieldDropdown([
        ["all", "all"],
        ["this script", "this"],
        ["other scripts", "other"],
      ]);
      this.appendDummyInput().appendField("stop").appendField(dd, "STOP");
      this.setPreviousStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Stops scripts");
    },
  };

  Blockly.Blocks["control_create_clone"] = {
    init() {
      this.appendDummyInput().appendField("create clone of").appendField(new Blockly.FieldTextInput("myself"), "SPRITE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Creates a clone of a sprite");
    },
  };

  Blockly.Blocks["control_delete_clone"] = {
    init() {
      this.appendDummyInput().appendField("delete this clone");
      this.setPreviousStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Deletes this clone");
    },
  };

  Blockly.Blocks["control_when_start_as_clone"] = {
    init() {
      this.appendDummyInput().appendField("when I start as a clone");
      this.setNextStatement(true, null);
      this.setColour(colorFor("control"));
      this.setTooltip("Runs when a clone is created");
    },
  };

  // ============ SENSING ============
  Blockly.Blocks["sensing_key_pressed"] = {
    init() {
      const dd = new Blockly.FieldDropdown([
        ["space", " "],
        ["up arrow", "ArrowUp"],
        ["down arrow", "ArrowDown"],
        ["left arrow", "ArrowLeft"],
        ["right arrow", "ArrowRight"],
        ["any", "any"],
        ["a", "a"],
        ["w", "w"],
        ["s", "s"],
        ["d", "d"],
      ]);
      this.appendDummyInput().appendField("key").appendField(dd, "KEY").appendField("pressed?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if a key is currently pressed");
    },
  };

  Blockly.Blocks["sensing_mouse_down"] = {
    init() {
      this.appendDummyInput().appendField("mouse down?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if the mouse button is pressed");
    },
  };

  Blockly.Blocks["sensing_mouse_x"] = {
    init() {
      this.appendDummyInput().appendField("mouse x");
      this.setOutput(true, "Number");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Returns the mouse x position");
    },
  };

  Blockly.Blocks["sensing_mouse_y"] = {
    init() {
      this.appendDummyInput().appendField("mouse y");
      this.setOutput(true, "Number");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Returns the mouse y position");
    },
  };

  Blockly.Blocks["sensing_touching"] = {
    init() {
      this.appendDummyInput().appendField("touching").appendField(new Blockly.FieldTextInput("Sprite2"), "SPRITE").appendField("?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if this sprite is touching another sprite");
    },
  };

  Blockly.Blocks["sensing_touching_color"] = {
    init() {
      this.appendDummyInput().appendField("touching color #").appendField(new Blockly.FieldTextInput("ff0000"), "COLOR").appendField("?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if this sprite is touching a color");
    },
  };

  Blockly.Blocks["sensing_touching_edge"] = {
    init() {
      this.appendDummyInput().appendField("touching edge?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if this sprite is touching the edge of the stage");
    },
  };

  Blockly.Blocks["sensing_touching_mouse"] = {
    init() {
      this.appendDummyInput().appendField("touching mouse pointer?");
      this.setOutput(true, "Boolean");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Checks if this sprite is touching the mouse pointer");
    },
  };

  Blockly.Blocks["sensing_bounce_off_edge"] = {
    init() {
      this.appendDummyInput().appendField("if on edge, bounce");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sensing"));
      this.setTooltip("Bounces the sprite if it is touching the edge of the stage");
    },
  };

  Blockly.Blocks["sensing_distance"] = {
    init() {
      this.appendDummyInput().appendField("distance to").appendField(new Blockly.FieldTextInput("Sprite2"), "SPRITE");
      this.setOutput(true, "Number");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Returns the distance to another sprite");
    },
  };

  Blockly.Blocks["sensing_ask"] = {
    init() {
      this.appendDummyInput().appendField("ask").appendField(new Blockly.FieldTextInput("What's your name?"), "QUESTION").appendField("and wait");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sensing"));
      this.setTooltip("Asks a question and waits for an answer");
    },
  };

  Blockly.Blocks["sensing_answer"] = {
    init() {
      this.appendDummyInput().appendField("answer");
      this.setOutput(true, "String");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Returns the last answer from ask");
    },
  };

  Blockly.Blocks["sensing_timer"] = {
    init() {
      this.appendDummyInput().appendField("timer");
      this.setOutput(true, "Number");
      this.setColour(colorFor("sensing"));
      this.setTooltip("Returns the elapsed time in seconds");
    },
  };

  Blockly.Blocks["sensing_reset_timer"] = {
    init() {
      this.appendDummyInput().appendField("reset timer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("sensing"));
      this.setTooltip("Resets the timer to 0");
    },
  };

  // ============ OPERATORS ============
  const ops: [string, string][] = [
    ["+", "ADD"],
    ["-", "SUBTRACT"],
    ["×", "MULTIPLY"],
    ["÷", "DIVIDE"],
  ];
  for (const [symbol, field] of ops) {
    Blockly.Blocks[`operators_${field.toLowerCase()}`] = {
      init() {
        this.appendValueInput("A").setCheck("Number");
        this.appendValueInput("B").setCheck("Number").appendField(symbol);
        this.setOutput(true, "Number");
        this.setInputsInline(true);
        this.setColour(colorFor("operators"));
        this.setTooltip(`Performs ${symbol} on two numbers`);
      },
    };
  }

  Blockly.Blocks["operators_random"] = {
    init() {
      this.appendDummyInput().appendField("pick random").appendField(new Blockly.FieldNumber(1), "FROM").appendField("to").appendField(new Blockly.FieldNumber(10), "TO");
      this.setOutput(true, "Number");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("Returns a random number between two values");
    },
  };

  const comps: [string, string][] = [
    [">", "GREATER"],
    ["<", "LESS"],
    ["=", "EQUAL"],
  ];
  for (const [symbol, field] of comps) {
    Blockly.Blocks[`operators_${field.toLowerCase()}`] = {
      init() {
        this.appendValueInput("A");
        this.appendValueInput("B").appendField(symbol);
        this.setOutput(true, "Boolean");
        this.setInputsInline(true);
        this.setColour(colorFor("operators"));
        this.setTooltip(`Compares two values with ${symbol}`);
      },
    };
  }

  Blockly.Blocks["operators_and"] = {
    init() {
      this.appendValueInput("A").setCheck("Boolean");
      this.appendValueInput("B").setCheck("Boolean").appendField("and");
      this.setOutput(true, "Boolean");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("True if both conditions are true");
    },
  };

  Blockly.Blocks["operators_or"] = {
    init() {
      this.appendValueInput("A").setCheck("Boolean");
      this.appendValueInput("B").setCheck("Boolean").appendField("or");
      this.setOutput(true, "Boolean");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("True if either condition is true");
    },
  };

  Blockly.Blocks["operators_not"] = {
    init() {
      this.appendValueInput("A").setCheck("Boolean").appendField("not");
      this.setOutput(true, "Boolean");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("True if the condition is false");
    },
  };

  Blockly.Blocks["operators_join"] = {
    init() {
      this.appendDummyInput().appendField("join").appendField(new Blockly.FieldTextInput("apple"), "A").appendField(new Blockly.FieldTextInput("banana"), "B");
      this.setOutput(true, "String");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("Combines two pieces of text");
    },
  };

  Blockly.Blocks["operators_length"] = {
    init() {
      this.appendDummyInput().appendField("length of").appendField(new Blockly.FieldTextInput("apple"), "TEXT");
      this.setOutput(true, "Number");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("Returns the number of characters in text");
    },
  };

  Blockly.Blocks["operators_mod"] = {
    init() {
      this.appendDummyInput().appendField(new Blockly.FieldNumber(7), "A").appendField("mod").appendField(new Blockly.FieldNumber(3), "B");
      this.setOutput(true, "Number");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("Returns the remainder of division");
    },
  };

  Blockly.Blocks["operators_round"] = {
    init() {
      this.appendDummyInput().appendField("round").appendField(new Blockly.FieldNumber(3.5), "NUM");
      this.setOutput(true, "Number");
      this.setInputsInline(true);
      this.setColour(colorFor("operators"));
      this.setTooltip("Rounds a number to the nearest integer");
    },
  };

  // ============ VARIABLES ============
  Blockly.Blocks["variables_set"] = {
    init() {
      this.appendDummyInput().appendField("set").appendField(new Blockly.FieldTextInput("my variable"), "VAR").appendField("to").appendField(new Blockly.FieldTextInput("0"), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Sets a variable to a value");
    },
  };

  Blockly.Blocks["variables_change"] = {
    init() {
      this.appendDummyInput().appendField("change").appendField(new Blockly.FieldTextInput("my variable"), "VAR").appendField("by").appendField(new Blockly.FieldNumber(1), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Changes a variable by a number");
    },
  };

  Blockly.Blocks["variables_show"] = {
    init() {
      this.appendDummyInput().appendField("show variable").appendField(new Blockly.FieldTextInput("my variable"), "VAR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Shows a variable on the stage");
    },
  };

  Blockly.Blocks["variables_hide"] = {
    init() {
      this.appendDummyInput().appendField("hide variable").appendField(new Blockly.FieldTextInput("my variable"), "VAR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Hides a variable from the stage");
    },
  };

  Blockly.Blocks["variables_get"] = {
    init() {
      this.appendDummyInput().appendField(new Blockly.FieldTextInput("my variable"), "VAR");
      this.setOutput(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Returns the value of a variable");
    },
  };

  Blockly.Blocks["variables_create"] = {
    init() {
      this.appendDummyInput().appendField("create variable").appendField(new Blockly.FieldTextInput("newVar"), "NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("variables"));
      this.setTooltip("Creates a new variable");
    },
  };

  // ============ FUNCTIONS ============
  Blockly.Blocks["procedures_def"] = {
    init() {
      this.appendDummyInput().appendField("define").appendField(new Blockly.FieldTextInput("my function"), "NAME");
      this.setNextStatement(true, null);
      this.setColour(colorFor("functions"));
      this.setTooltip("Defines a custom function");
    },
  };

  Blockly.Blocks["procedures_call"] = {
    init() {
      this.appendDummyInput().appendField("call").appendField(new Blockly.FieldTextInput("my function"), "NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("functions"));
      this.setTooltip("Calls a custom function");
    },
  };

  Blockly.Blocks["procedures_return"] = {
    init() {
      this.appendDummyInput().appendField("return").appendField(new Blockly.FieldTextInput(""), "VALUE");
      this.setPreviousStatement(true, null);
      this.setColour(colorFor("functions"));
      this.setTooltip("Returns a value from a function");
    },
  };

  // ============ DRAWING ============
  Blockly.Blocks["drawing_pen_down"] = {
    init() {
      this.appendDummyInput().appendField("pen down");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Lowers the pen so the sprite draws as it moves");
    },
  };

  Blockly.Blocks["drawing_pen_up"] = {
    init() {
      this.appendDummyInput().appendField("pen up");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Raises the pen so the sprite stops drawing");
    },
  };

  Blockly.Blocks["drawing_set_color"] = {
    init() {
      this.appendDummyInput().appendField("set pen color to #").appendField(new Blockly.FieldTextInput("ff0000"), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Sets the pen color");
    },
  };

  Blockly.Blocks["drawing_set_size"] = {
    init() {
      this.appendDummyInput().appendField("set pen size to").appendField(new Blockly.FieldNumber(1), "SIZE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Sets the pen thickness");
    },
  };

  Blockly.Blocks["drawing_clear"] = {
    init() {
      this.appendDummyInput().appendField("clear");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Clears all pen drawings");
    },
  };

  Blockly.Blocks["drawing_stamp"] = {
    init() {
      this.appendDummyInput().appendField("stamp");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("drawing"));
      this.setTooltip("Stamps the sprite's image onto the stage");
    },
  };

  // ============ GAME ============
  Blockly.Blocks["game_set_score"] = {
    init() {
      this.appendDummyInput().appendField("set score to").appendField(new Blockly.FieldNumber(0), "SCORE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Sets the game score");
    },
  };

  Blockly.Blocks["game_change_score"] = {
    init() {
      this.appendDummyInput().appendField("change score by").appendField(new Blockly.FieldNumber(1), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Increases or decreases the score");
    },
  };

  Blockly.Blocks["game_score"] = {
    init() {
      this.appendDummyInput().appendField("score");
      this.setOutput(true, "Number");
      this.setColour(colorFor("game"));
      this.setTooltip("Returns the current score");
    },
  };

  Blockly.Blocks["game_set_health"] = {
    init() {
      this.appendDummyInput().appendField("set health to").appendField(new Blockly.FieldNumber(100), "HEALTH");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Sets the sprite's health");
    },
  };

  Blockly.Blocks["game_change_health"] = {
    init() {
      this.appendDummyInput().appendField("change health by").appendField(new Blockly.FieldNumber(-10), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Changes the sprite's health");
    },
  };

  Blockly.Blocks["game_set_lives"] = {
    init() {
      this.appendDummyInput().appendField("set lives to").appendField(new Blockly.FieldNumber(3), "LIVES");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Sets the number of lives");
    },
  };

  Blockly.Blocks["game_change_lives"] = {
    init() {
      this.appendDummyInput().appendField("change lives by").appendField(new Blockly.FieldNumber(-1), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Changes the number of lives");
    },
  };

  Blockly.Blocks["game_set_gravity"] = {
    init() {
      this.appendDummyInput().appendField("set gravity to").appendField(new Blockly.FieldNumber(0.5), "GRAVITY");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Sets gravity for the sprite");
    },
  };

  Blockly.Blocks["game_jump"] = {
    init() {
      this.appendDummyInput().appendField("jump with power").appendField(new Blockly.FieldNumber(10), "POWER");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Makes the sprite jump with the given power");
    },
  };

  Blockly.Blocks["game_apply_gravity"] = {
    init() {
      this.appendDummyInput().appendField("apply gravity");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Applies gravity to the sprite's velocity");
    },
  };

  Blockly.Blocks["game_game_over"] = {
    init() {
      this.appendDummyInput().appendField("game over");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Ends the game");
    },
  };

  Blockly.Blocks["game_level_complete"] = {
    init() {
      this.appendDummyInput().appendField("level complete");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Completes the level");
    },
  };

  Blockly.Blocks["game_move_player"] = {
    init() {
      const dd = new Blockly.FieldDropdown([
        ["left", "left"],
        ["right", "right"],
        ["up", "up"],
        ["down", "down"],
      ]);
      this.appendDummyInput().appendField("move player").appendField(dd, "DIR").appendField("by").appendField(new Blockly.FieldNumber(5), "SPEED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Moves the player in a direction");
    },
  };

  Blockly.Blocks["game_random_move"] = {
    init() {
      this.appendDummyInput().appendField("random move by").appendField(new Blockly.FieldNumber(5), "SPEED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("game"));
      this.setTooltip("Moves the sprite in a random direction");
    },
  };

  // ============ ADVANCED ============
  Blockly.Blocks["advanced_js"] = {
    init() {
      this.appendDummyInput().appendField("JavaScript:").appendField(new Blockly.FieldTextInput("console.log('Hello')"), "CODE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("advanced"));
      this.setTooltip("Runs custom JavaScript code");
    },
  };

  Blockly.Blocks["advanced_console_log"] = {
    init() {
      this.appendDummyInput().appendField("log").appendField(new Blockly.FieldTextInput("message"), "TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("advanced"));
      this.setTooltip("Logs a message to the console");
    },
  };

  Blockly.Blocks["advanced_list_create"] = {
    init() {
      this.appendDummyInput().appendField("create list").appendField(new Blockly.FieldTextInput("myList"), "NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("advanced"));
      this.setTooltip("Creates a new list/array");
    },
  };

  Blockly.Blocks["advanced_list_add"] = {
    init() {
      this.appendDummyInput().appendField("add").appendField(new Blockly.FieldTextInput("item"), "ITEM").appendField("to list").appendField(new Blockly.FieldTextInput("myList"), "LIST");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("advanced"));
      this.setTooltip("Adds an item to a list");
    },
  };

  Blockly.Blocks["advanced_list_length"] = {
    init() {
      this.appendDummyInput().appendField("length of list").appendField(new Blockly.FieldTextInput("myList"), "LIST");
      this.setOutput(true, "Number");
      this.setColour(colorFor("advanced"));
      this.setTooltip("Returns the number of items in a list");
    },
  };

  Blockly.Blocks["advanced_math_func"] = {
    init() {
      const dd = new Blockly.FieldDropdown([
        ["abs", "abs"],
        ["floor", "floor"],
        ["ceiling", "ceil"],
        ["sqrt", "sqrt"],
        ["sin", "sin"],
        ["cos", "cos"],
        ["tan", "tan"],
      ]);
      this.appendDummyInput().appendField(dd, "FUNC").appendField("of").appendField(new Blockly.FieldNumber(0), "NUM");
      this.setOutput(true, "Number");
      this.setColour(colorFor("advanced"));
      this.setTooltip("Applies a math function to a number");
    },
  };

  Blockly.Blocks["advanced_wait_until"] = {
    init() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("wait until");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(colorFor("advanced"));
      this.setTooltip("Waits until a condition becomes true");
    },
  };
}
