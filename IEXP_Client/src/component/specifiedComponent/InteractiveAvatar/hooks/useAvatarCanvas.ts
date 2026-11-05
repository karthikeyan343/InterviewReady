import { useEffect, useRef } from "react";
import type { AvatarStatus } from "../types";
import {
  clamp,
  drawOrb,
  drawThinkingNodes,
  drawWaveform,
} from "../canvasRenderer";

export const useAvatarCanvas = (status: AvatarStatus, audioLevel: number = 0) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const audioLevelRef = useRef(0);
  const statusRef = useRef<AvatarStatus>(status);

  useEffect(() => {
    audioLevelRef.current = clamp(audioLevel, 0, 1);
  }, [audioLevel]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;

    const resize = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const animate = (timestamp: number) => {
      if (disposed) {
        return;
      }

      animationFrame = requestAnimationFrame(animate);

      const time = timestamp / 1000;
      const currentStatus = statusRef.current;
      const rawAudio = clamp(audioLevelRef.current, 0, 1);

      const previousAudio = Number.isFinite(audioLevelRef.current)
        ? audioLevelRef.current
        : 0;

      const intensity = clamp(previousAudio, 0, 1);

      context.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.43;

      const backgroundGlow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.52
      );

      backgroundGlow.addColorStop(
        0,
        `rgba(12, 86, 165, ${0.15 + intensity * 0.08})`
      );
      backgroundGlow.addColorStop(0.45, "rgba(5, 39, 82, 0.08)");
      backgroundGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.fillStyle = backgroundGlow;
      context.fillRect(0, 0, width, height);

      context.globalAlpha = 0.07;

      for (let y = 0; y < height; y += 5) {
        context.fillStyle = "rgba(120, 205, 255, 0.12)";
        context.fillRect(0, y, width, 1);
      }

      context.globalAlpha = 1;

      if (currentStatus === "Thinking") {
        drawThinkingNodes(
          context,
          centerX,
          centerY,
          Math.min(width, height) * 0.09,
          time
        );
      }

      drawOrb(
        context,
        centerX,
        centerY,
        Math.min(width, height) * 0.085,
        rawAudio,
        time,
        currentStatus
      );

      drawWaveform(
        context,
        centerX,
        height * 0.64,
        Math.min(width * 0.68, 430),
        Math.min(height * 0.12, 72),
        intensity,
        time,
        currentStatus
      );
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return {
    canvasRef,
    containerRef,
  };
};
