"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone, CheckCircle, Home, Share2 } from "lucide-react";
import { useState } from "react";

export default function InstallButton() {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || isStandalone) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
        <CheckCircle size={18} />
        App instalado ✓
      </div>
    );
  }

  const handleClick = () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      install();
    }
  };

  if (!isInstallable && !isIOS) {
    return (
      <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-gray-400 bg-gray-100 dark:bg-dark-700 border border-dashed border-gray-300 dark:border-dark-500 text-sm">
        <Smartphone size={20} />
        Abra no celular para instalar
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/20 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #F97316, #ea580c)' }}
      >
        <Smartphone size={20} />
        Instalar App Grátis
        <Download size={16} />
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowIOSModal(false)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Instalar no iPhone</h3>
              <p className="text-gray-400 text-sm">
                Siga estes passos para adicionar o app à sua tela inicial
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <p className="text-white text-sm font-medium">Toque no botão Compartilhar</p>
                  <p className="text-gray-400 text-xs">Ícone de quadrado com seta na barra do Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <p className="text-white text-sm font-medium">Role para baixo</p>
                  <p className="text-gray-400 text-xs">Encontre "Adicionar à Tela de Início"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
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

            <button onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors">
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
