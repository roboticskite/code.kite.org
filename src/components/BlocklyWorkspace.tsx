import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as Blockly from "blockly";
import { defineAllBlocks } from "../blocks/blockDefinitions";
import { buildToolboxJson, buildBeginnerToolboxJson, TOOLBOX_CATEGORIES } from "../blocks/toolbox";
import { useEditorStore } from "../store/editorStore";

let blocksDefined = false;

function getCategoryPosition(name: string, beginnerMode: boolean) {
  const beginnerCategories = ["Events", "Motion", "Looks", "Sound", "Control", "Game"];
  const categories = beginnerMode
    ? TOOLBOX_CATEGORIES.filter((category) => beginnerCategories.includes(category.name))
    : TOOLBOX_CATEGORIES;
  return categories.findIndex((category) => category.name === name);
}

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
  selectCategory: (name: string) => void;
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
  const [selectedCategory, setSelectedCategory] = useState("Events");
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

    const toolboxElement = document.querySelector(".blocklyToolboxDiv");
    const syncToolboxSelection = () => {
      const category = toolboxElement?.querySelector('[aria-selected="true"]')?.textContent?.trim();
      if (category) setSelectedCategory(category);
    };
    const toolboxSelectionObserver = toolboxElement ? new MutationObserver(syncToolboxSelection) : null;
    if (toolboxElement && toolboxSelectionObserver) {
      toolboxSelectionObserver.observe(toolboxElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ["aria-selected", "class"],
      });
      toolboxElement.addEventListener("click", syncToolboxSelection);
      syncToolboxSelection();
    }

    const onChange = (e: Blockly.Events.Abstract) => {
      if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_DELETE || e.type === Blockly.Events.BLOCK_CHANGE) {
        onWorkspaceChangeRef.current?.();
      }
      if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        const selectedItem = workspaceRef.current?.getToolbox()?.getSelectedItem() as { getName?: () => string } | null;
        const selectedName = selectedItem?.getName?.();
        if (selectedName) setSelectedCategory(selectedName);
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
      toolboxSelectionObserver?.disconnect();
      toolboxElement?.removeEventListener("click", syncToolboxSelection);
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
    selectCategory: (name: string) => {
      const toolbox = workspaceRef.current?.getToolbox();
      if (!toolbox) return;
      const position = getCategoryPosition(name, beginnerMode);
      if (position >= 0) toolbox.selectItemByPosition(position);
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
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="flex h-10 shrink-0 items-stretch border-b border-gray-200 bg-white px-2" role="tablist" aria-label="Editor panels">
        <button type="button" role="tab" aria-selected="true" className="palette-tab palette-tab-active">Blocks</button>
        <button type="button" role="tab" aria-selected="false" disabled className="palette-tab">Python</button>
        <button type="button" role="tab" aria-selected="false" disabled className="palette-tab">Costumes</button>
        <button type="button" role="tab" aria-selected="false" disabled className="palette-tab">Sounds</button>
      </div>
      <div className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-200 bg-gray-50 px-2 scrollbar-thin" aria-label="Quick block categories">
        {["Events", "Motion", "Looks", "Sound", "Control"].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              const toolbox = workspaceRef.current?.getToolbox();
              const position = getCategoryPosition(category, beginnerMode);
              if (position >= 0) {
                toolbox?.selectItemByPosition(position);
                setSelectedCategory(category);
              }
            }}
            className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === category
                ? "border-[#602080] bg-[#602080] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-kite-300 hover:bg-kite-50 hover:text-kite-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="relative min-h-0 flex-1">
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
    </div>
  );
});

BlocklyWorkspace.displayName = "BlocklyWorkspace";
export default BlocklyWorkspace;
