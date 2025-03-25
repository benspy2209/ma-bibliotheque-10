
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { exportLibrary, importLibrary } from "@/services/importExport";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileJson, FileUp, FileDown, FileSpreadsheet } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImportExportLibraryProps {
  onUpdate: () => void;
}

export const ImportExportLibrary = ({ onUpdate }: ImportExportLibraryProps) => {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const result = await exportLibrary();
      
      if (result.success && result.data) {
        // Create and trigger download
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `bibliopulse_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast({
          description: "Votre bibliothèque a été exportée avec succès",
        });
      } else {
        toast({
          variant: "destructive",
          description: result.error || "Une erreur est survenue lors de l'exportation",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de l'exportation",
      });
    } finally {
      setIsLoading(false);
      setExportDialogOpen(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        description: "Veuillez sélectionner un fichier à importer",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          let data;
          
          try {
            data = JSON.parse(content);
          } catch (parseError) {
            console.error("Erreur lors du parsing JSON:", parseError);
            toast({
              variant: "destructive",
              description: "Le fichier n'est pas au format JSON valide",
            });
            setIsLoading(false);
            return;
          }
          
          const result = await importLibrary(data);
          
          if (result.success) {
            toast({
              description: result.message || `${result.imported} livres importés avec succès`,
            });
            // Rafraîchir la bibliothèque
            onUpdate();
            // Fermer le dialogue
            setImportDialogOpen(false);
          } else {
            toast({
              variant: "destructive",
              description: result.message || "Une erreur est survenue lors de l'importation",
            });
          }
        } catch (error) {
          console.error("Erreur lors de l'importation:", error);
          toast({
            variant: "destructive",
            description: "Une erreur est survenue lors de l'importation",
          });
        } finally {
          setIsLoading(false);
          setSelectedFile(null);
        }
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de l'importation",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 flex flex-wrap justify-center sm:justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
              onClick={() => setImportDialogOpen(true)}
              disabled={isLoading}
            >
              <FileUp className="h-4 w-4" />
              Importer
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Formats supportés: JSON</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5"
              onClick={() => setExportDialogOpen(true)}
              disabled={isLoading}
            >
              <FileDown className="h-4 w-4" />
              Exporter
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export au format JSON</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Import Dialog */}
      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importer votre bibliothèque</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>Importez un fichier JSON contenant votre bibliothèque.</p>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <FileJson className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">JSON</span>
                    <span className="text-xs text-muted-foreground">(recommandé)</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Fichier sélectionné: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <Button 
              onClick={handleImport} 
              disabled={isLoading || !selectedFile}
              className="ml-2"
            >
              {isLoading ? "Importation en cours..." : "Importer"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exporter votre bibliothèque</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>Exportez votre bibliothèque au format JSON.</p>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <FileJson className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">JSON</span>
                    <span className="text-xs text-muted-foreground">(complet avec tous les détails)</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport} disabled={isLoading}>
              {isLoading ? "Exportation en cours..." : "Exporter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
