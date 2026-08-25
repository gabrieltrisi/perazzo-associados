'use client';

import { MotionConfig } from 'framer-motion';

// Faz TODAS as animações framer-motion respeitarem "prefers-reduced-motion":
// quando o usuário pede menos movimento, transformações viram transições instantâneas.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}