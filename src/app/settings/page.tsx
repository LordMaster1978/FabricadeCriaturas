'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { toast } = useToast();
  const [resetCapital, setResetCapital] = useState(1000);

  const handleExportData = () => {
    try {
      const bestiary = localStorage.getItem('creature-bestiary') || '[]';
      const capital = localStorage.getItem('player-capital') || '1000';
      const events = localStorage.getItem('universal-events') || '[]';

      const dataToExport = {
        bestiary: JSON.parse(bestiary),
        capital: JSON.parse(capital),
        events: JSON.parse(events),
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'criaturas-backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: '¡Datos exportados!',
        description: 'Tu partida se ha guardado en "criaturas-backup.json".',
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: "No se pudieron exportar los datos.",
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('El fichero no es válido.');
        }
        const importedData = JSON.parse(text);

        if (importedData.bestiary && importedData.capital && importedData.events) {
          localStorage.setItem('creature-bestiary', JSON.stringify(importedData.bestiary));
          localStorage.setItem('player-capital', JSON.stringify(importedData.capital));
          localStorage.setItem('universal-events', JSON.stringify(importedData.events));
          
          toast({
            title: '¡Datos importados correctamente!',
            description: 'Tu partida ha sido restaurada. La página se recargará.',
          });

          setTimeout(() => {
            window.location.href = '/';
          }, 2000);

        } else {
          throw new Error('El formato del fichero no es correcto.');
        }
      } catch (error: any) {
        console.error("Error importing data:", error);
        toast({
          variant: "destructive",
          title: "Error al importar",
          description: error.message || "No se pudo importar el fichero.",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('creature-bestiary');
      localStorage.removeItem('universal-events');
      localStorage.setItem('player-capital', resetCapital.toString());
      toast({
        title: "¡Datos borrados!",
        description: `Tu bestiario ha sido limpiado y tu capital reiniciado a ${resetCapital} €.`,
      });
      // Optionally, force a reload to reflect changes across the app
       setTimeout(() => {
            window.location.href = '/';
       }, 2000);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error al borrar",
        description: "No se pudieron borrar los datos locales.",
      });
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Ajustes</h1>
            <Link href="/">
              <Button variant="outline">Volver al Menú</Button>
            </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Guardar y Cargar Partida</CardTitle>
            <CardDescription>
              Exporta los datos de tu juego a un fichero para guardarlos, o importa un fichero para restaurar una partida.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos a Fichero
            </Button>
            <Button asChild variant="outline">
               <Label htmlFor="import-file">
                 <Upload className="mr-2 h-4 w-4" />
                 Importar Datos desde Fichero
                 <input type="file" id="import-file" accept=".json" className="hidden" onChange={handleImportData} />
               </Label>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Zona Peligrosa</CardTitle>
            <CardDescription>
              Aquí puedes reiniciar completamente tu progreso. Esta acción es irreversible y no se puede deshacer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="reset-capital">Capital Inicial al Reiniciar</Label>
              <Input 
                id="reset-capital"
                type="number"
                value={resetCapital}
                onChange={(e) => setResetCapital(Number(e.target.value))}
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar Bestiario y Reiniciar Capital
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente
                    todas las criaturas y eventos guardados, y reiniciará tu capital a {resetCapital} €.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive hover:bg-destructive/90">Continuar y Borrar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
