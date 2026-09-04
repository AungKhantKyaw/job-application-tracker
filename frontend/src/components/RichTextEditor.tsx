import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  RemoveFormatting,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className = "",
  minHeight = "120px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync incoming value to editor innerHTML if changed externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      const cleanHtml = html === "<br>" || html.trim() === "" ? "" : html;
      onChange(cleanHtml);
      isUpdatingRef.current = false;
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleCreateLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-gray-50 border-b border-gray-200 text-gray-700">
        <button
          type="button"
          title="Bold"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <Bold size={15} />
        </button>

        <button
          type="button"
          title="Italic"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <Italic size={15} />
        </button>

        <button
          type="button"
          title="Underline"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <Underline size={15} />
        </button>

        <button
          type="button"
          title="Strikethrough"
          onClick={() => executeCommand("strikeThrough")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <Strikethrough size={15} />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          title="Bullet List"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <List size={15} />
        </button>

        <button
          type="button"
          title="Numbered List"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          title="Insert Link"
          onClick={handleCreateLink}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <LinkIcon size={15} />
        </button>

        <button
          type="button"
          title="Clear Formatting"
          onClick={() => executeCommand("removeFormat")}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
        >
          <RemoveFormatting size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-3 outline-none text-sm text-gray-800 focus:ring-0 [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-gray-400 [&:empty:before]:pointer-events-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
      />
    </div>
  );
}
