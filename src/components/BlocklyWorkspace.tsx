import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as Blockly from "blockly";
import { defineAllBlocks } from "../blocks/blockDefinitions";
import { buildToolboxJson, buildBeginnerToolboxJson } from "../blocks/toolbox";
import { useEditorStore } from "../store/editorStore";

let blocksDefined = false;

export interface BlocklyWorkspaceHandle {
  getWorkspace: () => Blockly.Workspace | null;
  getXml: () => string;
  setXml: (xml: string) => void;
  loadXml: (xml: string) => void;
  clear: () => void;
  addBlockByType: (type: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  center: () => void;
}

interface Props {
  beginnerMode: boolean;
  searchQuery: string;
  onWorkspaceChange?: () => void;
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, Props>(({ beginnerMode, searchQuery, onWorkspaceChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const onWorkspaceChangeRef = useRef(onWorkspaceChange);
  onWorkspaceChangeRef.current = onWorkspaceChange;

  useEffect(() => {
    if (!blocksDefined) {
      defineAllBlocks();
      blocksDefined = true;
    }

    if (!containerRef.current) return;

    const toolbox = beginnerMode ? buildBeginnerToolboxJson() : buildToolboxJson();

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox,
      grid: {
        spacing: 28,
        length: 1,
        colour: "#e2e8f0",
        snap: true,
      },
      zoom: {
        controls: false,
        wheel: true,
        startScale: 1.0,
        maxScale: 2.5,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: false,
      },
      renderer: "zelos",
      sounds: false,
    } as any);

    const onChange = (e: Blockly.Events.Abstract) => {
      if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_DELETE || e.type === Blockly.Events.BLOCK_CHANGE) {
        onWorkspaceChangeRef.current?.();
      }
    };
    workspaceRef.current.addChangeListener(onChange);

    const resizeObserver = new ResizeObserver(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (workspaceRef.current) {
        workspaceRef.current.removeChangeListener(onChange);
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [beginnerMode]);

  useImperativeHandle(ref, () => ({
    getWorkspace: () => workspaceRef.current,
    getXml: () => {
      if (!workspaceRef.current) return "";
      const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      return Blockly.Xml.domToText(dom);
    },
    setXml: (xml: string) => {
      if (!workspaceRef.current || !xml) return;
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspaceRef.current);
    },
    loadXml: (xml: string) => {
      if (!workspaceRef.current || !xml) return;
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
    },
    clear: () => {
      if (!workspaceRef.current) return;
      workspaceRef.current.clear();
    },
    addBlockByType: (type: string) => {
      if (!workspaceRef.current) return;
      const block = workspaceRef.current.newBlock(type);
      block.initSvg();
      const allBlocks = workspaceRef.current.getAllBlocks(false);
      block.moveTo(new Blockly.utils.Coordinate(50 + (allBlocks.length % 5) * 40, 50 + Math.floor(allBlocks.length / 5) * 60));
      block.render();
    },
    zoomIn: () => {
      if (!workspaceRef.current) return;
      workspaceRef.current.zoomCenter(1);
    },
    zoomOut: () => {
      if (!workspaceRef.current) return;
      workspaceRef.current.zoomCenter(-1);
    },
    center: () => {
      if (!workspaceRef.current) return;
      workspaceRef.current.scrollCenter();
    },
  }));

  return <div ref={containerRef} className="w-full h-full" />;
});

BlocklyWorkspace.displayName = "BlocklyWorkspace";
export default BlocklyWorkspace;
