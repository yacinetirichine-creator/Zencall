"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export const AudioIntro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"); // Son de téléphone doux
    audioRef.current.volume = 0.3;
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-8 right-8 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-colors border border-gray-200"
      title={isPlaying ? t("audio.mute") : t("audio.unmute")}
    >
      {isPlaying ? (
        <Volume2 className="w-6 h-6 text-zencall-coral-500" />
      ) : (
        <VolumeX className="w-6 h-6 text-gray-400" />
      )}
    </button>
  );
};
