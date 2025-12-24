"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export const Hero3D = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, type: "spring" }}
        className="relative z-10"
      >
        <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-zencall-coral-300 to-zencall-blue-300 rounded-full blur-3xl opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-zencall-coral-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-4 w-64">
            <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-white/20 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-white/5 rounded-xl border border-white/10 p-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zencall-blue-400" />
                <div className="h-3 bg-white/30 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/20 rounded w-full" />
                <div className="h-2 bg-white/20 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
