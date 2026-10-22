import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";

export function useUploadContract(onClose: () => void) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    if (!file || file.type !== "application/pdf") return;
    setSelectedFile(file);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return {
    selectedFile,
    setSelectedFile,
    isDragging,
    setIsDragging,
    handleFileChange,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
