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
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { toast } = useToast();
  const [resetCapital, setResetCapital] = useState(1000);

  const handleClearData = () => {
    try {
      localStorage.removeItem('creature-bestiary');
      localStorage.setItem('player-capital', resetCapital.toString());
      toast({
        title: "¡Datos borrados!",
        description: `Tu bestiario ha sido limpiado y tu capital reiniciado a ${resetCapital} €.`,
      });
      // Optionally, force a reload to reflect changes across the app
      window.location.href = '/';
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
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Ajustes</h1>
            <Link href="/">
              <Button variant="outline">Volver al Menú</Button>
            </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Datos Locales</CardTitle>
            <CardDescription>
              Aquí puedes gestionar los datos de tus criaturas y tu capital guardados en el navegador.
              Esta acción es irreversible.
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
                    todas las criaturas guardadas y reiniciará tu capital a {resetCapital} €.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Continuar y Borrar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
