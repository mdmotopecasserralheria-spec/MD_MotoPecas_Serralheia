"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Smartphone, Home, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallBanner() {
  const { showBanner, isIOS, isInstalled, install, dismiss } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  if (isInstalled) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await install();
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60]
          transform transition-transform duration-500 ease-out
          ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
          border-t border-orange-500/30 shadow-2xl shadow-black/50">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600
                  flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                    Instale o App da MD Moto
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    Acesso rápido, offline e notificações de ofertas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600
                    hover:from-orange-400 hover:to-orange-500
                    text-white text-sm font-medium rounded-xl
                    transition-all duration-200 hover:scale-105 active:scale-95
                    shadow-lg shadow-orange-500/20
                    flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Instalar Agora</span>
                  <span className="sm:hidden">Instalar</span>
                </button>

                <button
                  onClick={dismiss}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10
                    rounded-xl transition-all duration-200"
                  aria-label="Fechar banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm"
          onClick={() => setShowIOSModal(false)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl
            max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600
                flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">
                Instalar no iPhone
              </h3>
              <p className="text-gray-400 text-sm">
                Siga estes passos para adicionar o app à sua tela inicial
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400
                  flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Toque no botão Compartilhar</p>
                  <p className="text-gray-400 text-xs">Ícone de quadrado com seta na barra do Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400
                  flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Role para baixo</p>
                  <p className="text-gray-400 text-xs">Encontre "Adicionar à Tela de Início"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400
                  flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Toque em "Adicionar"</p>
                  <p className="text-gray-400 text-xs">O ícone do app aparecerá na sua home</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-4">
              <Share2 className="w-4 h-4" />
              <span>Ícone de compartilhar no Safari</span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700
                text-white font-medium rounded-xl transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
