import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";
import { Textarea } from "@/common/ui/textarea";
import { Label } from "@/common/ui/label";
import { useCreatePageMutation } from "@/api/mutations/admin/albumMutations";
import { BookOpenText, LayoutGrid, Check, X, Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { Badge } from "@/common/ui/badge";

interface CreatePageDialogProps {
  albumId: number;
  albumTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreatePageDialog: React.FC<CreatePageDialogProps> = ({
  albumId,
  albumTitle,
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const createPageMutation = useCreatePageMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    
    try {
      await createPageMutation.mutateAsync({
        album_id: albumId,
        title: title.trim(),
        description: description.trim(),
        status: true
      });
      
      toast.success("Página creada correctamente");
      onSuccess?.();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Error al crear la página");
      console.error(error);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-md bg-[#FFFBF6] border-amber-100 rounded-xl p-0 flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b border-amber-100 bg-gradient-to-r from-[#FAF3E0] to-[#FAF3E0]/30 px-4 py-3 flex-shrink-0">
          <DialogTitle className="text-lg font-medium text-[#2C1810] flex items-center gap-2">
            <BookOpenText className="h-4 w-4 text-[#D4A76A]" />
            Nueva Página
          </DialogTitle>
          <p className="text-sm text-[#6F4E37] mt-1 flex items-center">
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5 text-[#D4A76A]/70" />
            Álbum: <Badge className="ml-1.5 bg-amber-100/70 text-amber-800 font-normal">{albumTitle}</Badge>
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-[#6F4E37]">
                Título <span className="text-amber-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Título de la página"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[#6F4E37]">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Contiene los sellos disponibles para..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 mt-1 min-h-[120px]"
              />
            </div>
            
            <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-amber-700">
              <p className="flex items-start">
                <span className="text-amber-500 mr-1.5 mt-0.5">ℹ️</span> 
                La página se asociará automáticamente al álbum seleccionado y se creará en estado activo. Una vez creada, podrás añadir estampas a esta página.
              </p>
            </div>
          </div>
        </form>
        
        <div className="border-t border-amber-100 bg-gradient-to-b from-[#FFFBF6] to-[#FAF3E0]/30 px-4 py-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-amber-200 text-[#6F4E37] hover:bg-amber-50 hover:text-[#2C1810]"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          
          <Button
            type="submit" 
            onClick={handleSubmit}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={createPageMutation.isPending || !title.trim()}
          >
            {createPageMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-1.5" />
            )}
            Crear Página
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};