"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "md-moto-pwa-installed";
const STORAGE_KEY_DISMISSED = "md-moto-banner-dismissed";
const sharedRef = { current: null as any };

export function usePWAInstall() {
  const promptRef = useRef<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    setIsStandalone(standalone);
    setIsIOS(iOS);

    const alreadyInstalled = localStorage.getItem(STORAGE_KEY) === "true";
    if (standalone || alreadyInstalled) {
      setIsInstalled(true);
      return
    };

    if (standalone) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      promptRef.current = e;
      sharedRef.current = e;
      setIsInstallable(true);
    };

    const onInstalled = () => {
      promptRef.current = null;
      sharedRef.current = null;
      localStorage.setItem(STORAGE_KEY, "true");
      setIsInstalled(true);
      setIsInstallable(false);
      setShowBanner(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (isInstalled || isStandalone) return;

    const dismissedAt = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000) return;

    const timer = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(timer);
  }, [isInstalled, isStandalone]);

  const install = useCallback(async () => {
    const prompt = promptRef.current || sharedRef.current;
    if (!prompt) return;

    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      promptRef.current = null;
      sharedRef.current = null;

      if (outcome === "accepted") {
        localStorage.setItem(STORAGE_KEY, "true");
        setIsInstalled(true);
        setShowBanner(false);
      }
    } catch {
      promptRef.current = null;
      sharedRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
  }, []);

  return { isInstallable, isInstalled, isIOS, isStandalone, showBanner, install, dismiss };
}
