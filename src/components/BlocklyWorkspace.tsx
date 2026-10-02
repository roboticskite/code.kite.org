import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as Blockly from "blockly";
import { defineAllBlocks } from "../blocks/blockDefinitions";
import { buildToolboxJson, buildBeginnerToolboxJson, TOOLBOX_CATEGORIES } from "../blocks/toolbox";
import { useEditorStore } from "../store/editorStore";

let blocksDefined = false;

interface SearchResult {
  type: string;
  category: string;
  label: string;
  tooltip: string;
}

function buildBlockSearchIndex(): SearchResult[] {
  const workspace = new Blockly.Workspace();
  const results: SearchResult[] = [];

  try {
    for (const category of TOOLBOX_CATEGORIES) {
      for (const { type } of category.blocks) {
        let block: Blockly.Block | null = null;
        try {
          block = workspace.newBlock(type);
          const label = block.toString().trim() || type.replace(/[_-]+/g, " ");
          const tooltipValue = block.getTooltip();
          results.push({
            type,
            category: category.name,
            label,
            tooltip: typeof tooltipValue === "string" ? tooltipValue : "",
          });
        } catch (error) {
          console.error(`Could not index Blockly block "${type}"`, error);
        } finally {
          block?.dispose(false);
        }
      }
    }
  } finally {
    workspace.dispose();
  }

  return results;
}

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
  const [blockSearchIndex, setBlockSearchIndex] = useState<SearchResult[]>([]);
  onWorkspaceChangeRef.current = onWorkspaceChange;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    const queryTerms = normalizedQuery.split(/\s+/);
    return blockSearchIndex.filter(({ type, category, label, tooltip }) =>
      queryTerms.every((term) => `${type} ${category} ${label} ${tooltip}`.toLocaleLowerCase().includes(term))
    );
  }, [blockSearchIndex, normalizedQuery]);

  useEffect(() => {
    if (!blocksDefined) {
      defineAllBlocks();
      blocksDefined = true;
    }
    setBlockSearchIndex(buildBlockSearchIndex());

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

  const handleSelectSearchResult = (type: string) => {
    if (!workspaceRef.current) return;
    const block = workspaceRef.current.newBlock(type);
    block.initSvg();
    const allBlocks = workspaceRef.current.getAllBlocks(false);
    block.moveTo(new Blockly.utils.Coordinate(50 + (allBlocks.length % 5) * 40, 50 + Math.floor(allBlocks.length / 5) * 60));
    block.render();
    useEditorStore.getState().setSearchQuery("");
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {normalizedQuery && (
        <div className="absolute left-3 top-3 z-40 max-h-[65%] w-[min(22rem,calc(100%-1.5rem))] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          {searchResults.length > 0 ? searchResults.map((result) => (
            <button
              key={result.type}
              type="button"
              onClick={() => handleSelectSearchResult(result.type)}
              className="flex w-full flex-col gap-0.5 border-b border-slate-100 px-3 py-2 text-left last:border-b-0 hover:bg-slate-50"
            >
              <span className="text-sm font-medium text-slate-800">{result.label}</span>
              <span className="text-[11px] text-slate-500">{result.category}</span>
            </button>
          )) : (
            <p className="px-3 py-3 text-sm text-slate-500">No matching blocks</p>
          )}
        </div>
      )}
    </div>
  );
});

BlocklyWorkspace.displayName = "BlocklyWorkspace";
export default BlocklyWorkspace;
