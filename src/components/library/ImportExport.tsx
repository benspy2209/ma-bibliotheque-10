
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';
import { exportLibrary, importLibrary } from '@/services/importExport';
import { useQueryClient } from '@tanstack/react-query';

export function ImportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportLibrary();
      
      if (result.success && result.data) {
        // Création d'un objet Blob à partir des données
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        
        // Création d'une URL pour le blob
        const url = URL.createObjectURL(blob);
        
        // Création d'un lien de téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = `ma-bibliotheque-${new Date().toISOString().split('T')[0]}.json`;
        
        // Ajout du lien au document et clic automatique
        document.body.appendChild(link);
        link.click();
        
        // Nettoyage
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          description: "Export réussi. Téléchargement en cours...",
        });
      } else {
        toast({
          variant: "destructive",
          description: result.error || "Erreur lors de l'exportation",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de l'exportation",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    // Simulation du clic sur l'input file caché
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => handleImportFile(e);
    input.click();
  };

  const handleImportFile = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    toast({
      description: "Analyse du fichier en cours...",
    });
    
    try {
      // Lecture du fichier
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          let data: any;
          
          try {
            data = JSON.parse(content);
            console.log('Fichier JSON valide, analyse en cours...');
          } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            toast({
              variant: "destructive",
              description: "Le fichier n'est pas un JSON valide",
            });
            setIsImporting(false);
            return;
          }
          
          // Vérification basique de la structure
          const fileSize = Math.round(content.length / 1024);
          console.log(`Taille du fichier: ${fileSize}KB`);
          
          // Import des données
          toast({
            description: "Importation en cours, veuillez patienter...",
          });
          
          const result = await importLibrary(data);
          
          if (result.success) {
            toast({
              description: result.message || `Importation réussie: ${result.imported} livres importés`,
            });
            
            // Actualisation des données
            queryClient.invalidateQueries({ queryKey: ['books'] });
          } else {
            toast({
              variant: "destructive",
              description: result.message || "Erreur lors de l'importation",
            });
          }
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error);
          toast({
            variant: "destructive",
            description: "Erreur lors du traitement du fichier",
          });
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          variant: "destructive",
          description: "Erreur lors de la lecture du fichier",
        });
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de l'importation",
      });
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium">Importation / Exportation</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full md:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exportation...' : 'Exporter ma bibliothèque'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          disabled={isImporting}
          className="w-full md:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isImporting ? 'Importation...' : 'Importer une bibliothèque'}
        </Button>
      </div>
    </div>
  );
}
