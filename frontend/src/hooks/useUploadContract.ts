import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadContractToBackend } from "../api/usersApi";

export function useUploadContract(onClose: () => void) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  const {
    mutate: uploadContract,
    isError: isErrorUploading,
    isPending: isPendingUploading,
    isSuccess: isSuccessUploading,
    error: uploadingError,
    reset: resetUploading,
  } = useMutation({
    mutationFn: ({ month, file }: { month: string; file: File }) => {
      abortControllerRef.current = new AbortController();
      return uploadContractToBackend(
        month,
        file,
        abortControllerRef.current.signal,
      );
    },
    mutationKey: ["uploadContract"],
    onSuccess: () => {
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      onClose();
    },
  });

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    resetUploading();
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  }
  function handleFileRemove() {
    resetUploading();
    setSelectedFile(null);
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
    if (isPendingUploading) return;
    const file = e.dataTransfer.files[0];

    if (!file || file.type !== "application/pdf") return;
    resetUploading();
    setSelectedFile(file);
  }

  function handleClose() {
    if (isPendingUploading) return;
    onClose();
  }

  function handleCancelAndClose() {
    if (isPendingUploading) {
      abortControllerRef.current?.abort();
      // the server may have already saved the file before the abort reached it
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    }
    onClose();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPendingUploading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isPendingUploading]);

  return {
    selectedFile,
    setSelectedFile,
    isDragging,
    handleFileChange,
    handleFileRemove,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClose,
    handleCancelAndClose,
    uploadContract,
    isErrorUploading,
    isPendingUploading,
    isSuccessUploading,
    uploadingError,
  };
}
