"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Eraser,
  Link2,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  borderless?: boolean;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Add description...",
  minHeight = "120px",
  borderless = true,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [headingVal, setHeadingVal] = useState("p");
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);

  // Sync external value to contentEditable div
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const exec = (command: string, valueArg: string | undefined = undefined) => {
    if (typeof document !== "undefined" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, valueArg);
      isUpdatingRef.current = true;
      onChange?.(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const handleAddLink = () => {
    if (typeof window === "undefined" || !editorRef.current) return;
    const url = window.prompt("Enter URL:", "https://");
    if (url && url.trim()) {
      editorRef.current.focus();
      document.execCommand("createLink", false, url.trim());
      // Ensure target="_blank" and proper styling on links
      const links = editorRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        link.classList.add(
          "text-primary",
          "underline",
          "font-medium",
          "cursor-pointer",
        );
      });
      isUpdatingRef.current = true;
      onChange?.(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setIsFocused(true);
      isUpdatingRef.current = true;
      onChange?.(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const handleHeadingChange = (val: string) => {
    setHeadingVal(val);
    if (typeof document !== "undefined" && editorRef.current) {
      editorRef.current.focus();
      const tagName = val.toUpperCase();
      try {
        document.execCommand("formatBlock", false, tagName);
      } catch {
        document.execCommand("formatBlock", false, `<${val}>`);
      }
      isUpdatingRef.current = true;
      onChange?.(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (
      containerRef.current &&
      containerRef.current.contains(e.relatedTarget as Node)
    ) {
      return;
    }
    setIsFocused(false);
  };

  return (
    <div
      ref={containerRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={
        borderless
          ? "flex w-full flex-col transition-all outline-none focus:outline-none focus-visible:outline-none"
          : "border-border bg-card flex w-full flex-col overflow-hidden rounded-md border shadow-xs transition-all"
      }
    >
      {/* TOOLBAR - Only visible when editing / focused */}
      {isFocused && (
        <div
          className={
            borderless
              ? "bg-secondary/40 border-border/60 animate-in fade-in mb-2 flex flex-wrap items-center gap-1.5 rounded-md border p-1.5 text-xs duration-150 select-none"
              : "bg-secondary/40 border-border animate-in fade-in flex flex-wrap items-center gap-1.5 border-b p-1.5 text-xs duration-150 select-none"
          }
        >
          {/* Heading Dropdown */}
          <select
            value={headingVal}
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="bg-background border-border text-foreground focus:border-primary h-7 cursor-pointer rounded-xs border px-2 py-1 text-[11px] font-bold outline-none"
          >
            <option value="p">Normal (p)</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
          </select>

          <div className="bg-border mx-0.5 h-4 w-[1px]" />

          {/* Formatting Buttons */}
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("bold")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("italic")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("underline")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("strikeThrough")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          {/* Link Button */}
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={handleAddLink}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Insert Link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>

          <div className="bg-border mx-0.5 h-4 w-[1px]" />

          {/* Lists */}
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("insertUnorderedList")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Bullet Points"
          >
            <List className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("insertOrderedList")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>

          <div className="bg-border mx-0.5 h-4 w-[1px]" />

          {/* Alignment */}
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("justifyLeft")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("justifyCenter")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("justifyRight")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("justifyFull")}
            className="hover:bg-secondary border-border/40 text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border"
            title="Align Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </button>

          <div className="bg-border mx-0.5 h-4 w-[1px]" />

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => exec("removeFormat")}
            className="hover:bg-secondary border-border/40 flex h-7 w-7 cursor-pointer items-center justify-center rounded-xs border text-rose-500"
            title="Clear Formatting"
          >
            <Eraser className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* NATIVE CONTENTEDITABLE EDITOR AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className={`text-foreground empty:before:text-muted-foreground/50 [&_a]:text-primary flex-1 overflow-y-auto font-sans text-sm leading-relaxed tracking-wider outline-none empty:before:content-[attr(data-placeholder)] focus:ring-0 focus:outline-none focus-visible:outline-none [&_a]:cursor-pointer [&_a]:font-medium [&_a]:underline [&_a]:hover:opacity-80 [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-1.5 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-1 [&_h3]:text-lg [&_h3]:font-bold [&_h4]:my-1 [&_h4]:text-base [&_h4]:font-bold [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 ${
          borderless ? "border-none bg-transparent p-1" : "bg-background p-3"
        }`}
      />
    </div>
  );
}
