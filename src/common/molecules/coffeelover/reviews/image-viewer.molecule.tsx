import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/common/ui/dialog";
import { X } from "@/common/ui/icons";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailClassName?: string;
}

export function ImageViewer({
  src,
  alt,
  className,
  thumbnailClassName,
}: ImageViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={cn("cursor-pointer hover:opacity-90 transition-opacity", thumbnailClassName)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const closeButton = document.querySelector('[data-state="open"] button[data-dismiss]');
              if (closeButton instanceof HTMLElement) {
                closeButton.click();
              }
            }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={src}
            alt={alt}
            className={cn("max-h-[85vh] max-w-full object-contain", className)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}