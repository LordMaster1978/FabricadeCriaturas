'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function CraftPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [gameTime, setGameTime] = useState({ hour: 0, minute: 0 });

  useEffect(() => {
    // Establecer la fecha actual en el cliente para evitar errores de hidratación
    setCurrentDate(new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    const timer = setInterval(() => {
      setGameTime(prevTime => {
        const newHour = (prevTime.hour + 1) % 24;
        return { hour: newHour, minute: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatGameTime = () => {
    const hour = gameTime.hour.toString().padStart(2, '0');
    const minute = gameTime.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Taller de Criaturas</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-foreground/70" />
                <span className="text-foreground/90">{currentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-foreground/70" />
                <span className="font-mono text-xl text-primary">{formatGameTime()}</span>
              </div>
            </div>
        </div>
        <p className="text-center mt-2 text-lg text-foreground/70">Aquí es donde la magia sucede.</p>
      </div>
    </main>
  );
}
