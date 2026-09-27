'use client'

import { useState, useEffect } from 'react';

// Interface para extender el evento de instalación nativo
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function BotonInstalar() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [mostrarBoton, setMostrarBoton] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevenir que el navegador muestre su banner por defecto
            e.preventDefault();
            // Guardar el evento para dispararlo manualmente
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setMostrarBoton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Ocultar botón si la app ya fue instalada
        window.addEventListener('appinstalled', () => {
            setMostrarBoton(false);
            setDeferredPrompt(null);
            console.log('PWA instalada con éxito');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstalarClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt nativo de instalación
        await deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('El usuario aceptó instalar la app');
        } else {
            console.log('El usuario rechazó la instalación');
        }

        // Limpiar el evento para no volver a usarlo
        setDeferredPrompt(null);
        setMostrarBoton(false);
    };

    if (!mostrarBoton) return null;

    return (
        <button
            onClick={handleInstalarClick}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors flex items-center gap-2"
        >
            Instalar App
        </button>
    );
}