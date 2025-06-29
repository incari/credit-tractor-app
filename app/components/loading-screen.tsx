"use client";

import { Loader2, Tractor } from "lucide-react";
import React from "react";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  debugInfo?: React.ReactNode;
}

export function LoadingScreen({
  message = "Loading...",
  subMessage,
  debugInfo,
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto animate-pulse">
          <Tractor className="h-6 w-6 text-white" />
        </div>
        {message && <p className="text-gray-600">{message}</p>}
        {subMessage && <p className="text-xs text-gray-500">{subMessage}</p>}
        {debugInfo && <div className="text-xs text-gray-400">{debugInfo}</div>}
      </div>
    </div>
  );
}
