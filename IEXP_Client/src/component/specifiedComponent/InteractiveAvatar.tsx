import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

export type AvatarStatus = "Listening" | "Thinking" | "Speaking";

interface InteractiveAvatarProps {
  status: AvatarStatus;
  audioLevel?: number;
  modelUrl?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  status,
  audioLevel = 0,
}) => {
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

    const drawGlow = (x: number, y: number, radius: number, alpha: number) => {
      const gradient = context.createRadialGradient(
        x,
        y,
        radius * 0.05,
        x,
        y,
        radius,
      );

      gradient.addColorStop(0, `rgba(74, 174, 255, ${alpha})`);
      gradient.addColorStop(0.35, `rgba(24, 125, 255, ${alpha * 0.45})`);
      gradient.addColorStop(1, "rgba(0, 75, 180, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const drawOrb = (
      centerX: number,
      centerY: number,
      radius: number,
      intensity: number,
      time: number,
      currentStatus: AvatarStatus,
    ) => {
      const statusBoost =
        currentStatus === "Speaking"
          ? 1
          : currentStatus === "Thinking"
            ? 0.72
            : 0.48;

      const pulse =
        currentStatus === "Speaking"
          ? intensity
          : currentStatus === "Thinking"
            ? 0.18 + Math.sin(time * 2.2) * 0.06
            : 0.1 + Math.sin(time * 1.7) * 0.045;

      const orbRadius = radius * (1 + pulse * 0.12);

      drawGlow(
        centerX,
        centerY,
        radius * (2.4 + intensity * 0.8),
        0.16 + intensity * 0.2,
      );

      drawGlow(
        centerX,
        centerY,
        radius * (1.35 + intensity * 0.35),
        0.22 + intensity * 0.18,
      );

      for (let ring = 0; ring < 3; ring += 1) {
        const ringPhase = time * (0.32 + ring * 0.08) + ring * 1.8;
        const ringScale =
          1 + Math.sin(ringPhase) * 0.035 + intensity * (0.04 + ring * 0.012);

        context.beginPath();
        context.arc(
          centerX,
          centerY,
          radius * (1.08 + ring * 0.16) * ringScale,
          0,
          Math.PI * 2,
        );

        context.strokeStyle = `rgba(54, 166, 255, ${
          (0.28 - ring * 0.055) * statusBoost + intensity * 0.16
        })`;
        context.lineWidth = ring === 0 ? 1.6 : 1;
        context.stroke();
      }

      const orbGradient = context.createRadialGradient(
        centerX - orbRadius * 0.3,
        centerY - orbRadius * 0.35,
        orbRadius * 0.05,
        centerX,
        centerY,
        orbRadius,
      );

      orbGradient.addColorStop(0, "rgba(235, 249, 255, 0.98)");
      orbGradient.addColorStop(0.16, "rgba(112, 207, 255, 0.96)");
      orbGradient.addColorStop(0.45, "rgba(35, 137, 255, 0.9)");
      orbGradient.addColorStop(0.78, "rgba(10, 68, 180, 0.82)");
      orbGradient.addColorStop(1, "rgba(2, 25, 70, 0.2)");

      context.fillStyle = orbGradient;
      context.beginPath();
      context.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      context.fill();

      const highlight = context.createRadialGradient(
        centerX - orbRadius * 0.35,
        centerY - orbRadius * 0.42,
        0,
        centerX - orbRadius * 0.35,
        centerY - orbRadius * 0.42,
        orbRadius * 0.75,
      );

      highlight.addColorStop(0, "rgba(255, 255, 255, 0.72)");
      highlight.addColorStop(0.18, "rgba(190, 239, 255, 0.24)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");

      context.fillStyle = highlight;
      context.beginPath();
      context.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      context.fill();

      const coreRadius =
        radius *
        (0.15 + intensity * 0.055 + (currentStatus === "Speaking" ? 0.035 : 0));

      context.beginPath();
      context.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      context.fillStyle = "rgba(245, 252, 255, 0.96)";
      context.shadowBlur = 24 + intensity * 28;
      context.shadowColor = "rgba(80, 190, 255, 0.9)";
      context.fill();
      context.shadowBlur = 0;

      const particleCount = 10;

      for (let i = 0; i < particleCount; i += 1) {
        const angle =
          time * (0.35 + (i % 3) * 0.08) + (Math.PI * 2 * i) / particleCount;

        const orbitRadius = radius * (1.28 + (i % 2) * 0.18 + intensity * 0.12);

        const particleX = centerX + Math.cos(angle) * orbitRadius;
        const particleY = centerY + Math.sin(angle) * orbitRadius * 0.7;

        const particleSize = 1.3 + intensity * 2.1 + (i % 3) * 0.35;

        context.beginPath();
        context.arc(particleX, particleY, particleSize, 0, Math.PI * 2);

        context.fillStyle = `rgba(112, 211, 255, ${0.34 + intensity * 0.42})`;
        context.fill();
      }
    };

    const drawWaveform = (
      centerX: number,
      centerY: number,
      waveformWidth: number,
      waveformHeight: number,
      intensity: number,
      time: number,
      currentStatus: AvatarStatus,
    ) => {
      const speaking = currentStatus === "Speaking";
      const thinking = currentStatus === "Thinking";

      const baseAmplitude = speaking
        ? waveformHeight * (0.08 + intensity * 0.48)
        : thinking
          ? waveformHeight * 0.11
          : waveformHeight * 0.075;

      const segments = 72;

      context.beginPath();

      for (let i = 0; i <= segments; i += 1) {
        const progress = i / segments;
        const x = centerX - waveformWidth / 2 + progress * waveformWidth;

        const envelope = Math.sin(Math.PI * progress);

        const waveA = Math.sin(progress * Math.PI * 10 + time * 5.2);

        const waveB = Math.sin(progress * Math.PI * 21 - time * 3.7) * 0.38;

        const waveC = Math.sin(progress * Math.PI * 37 + time * 7.4) * 0.16;

        const y = centerY + (waveA + waveB + waveC) * baseAmplitude * envelope;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      const gradient = context.createLinearGradient(
        centerX - waveformWidth / 2,
        0,
        centerX + waveformWidth / 2,
        0,
      );

      gradient.addColorStop(0, "rgba(54, 159, 255, 0)");
      gradient.addColorStop(0.18, "rgba(71, 181, 255, 0.6)");
      gradient.addColorStop(0.5, "rgba(219, 247, 255, 0.98)");
      gradient.addColorStop(0.82, "rgba(71, 181, 255, 0.6)");
      gradient.addColorStop(1, "rgba(54, 159, 255, 0)");

      context.strokeStyle = gradient;
      context.lineWidth = speaking ? 2.4 + intensity * 2.2 : 1.5;
      context.shadowBlur = speaking ? 12 + intensity * 14 : 8;
      context.shadowColor = "rgba(56, 172, 255, 0.85)";
      context.stroke();
      context.shadowBlur = 0;

      if (!speaking && !thinking) {
        context.beginPath();
        context.moveTo(centerX - waveformWidth * 0.32, centerY);
        context.lineTo(centerX + waveformWidth * 0.32, centerY);
        context.strokeStyle = "rgba(120, 205, 255, 0.25)";
        context.lineWidth = 1;
        context.stroke();
      }
    };

    const drawThinkingNodes = (
      centerX: number,
      centerY: number,
      radius: number,
      time: number,
    ) => {
      const nodeCount = 7;

      for (let i = 0; i < nodeCount; i += 1) {
        const angle = time * 0.75 + (Math.PI * 2 * i) / nodeCount;

        const distance = radius * (1.75 + Math.sin(time * 1.4 + i) * 0.08);

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.62;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(x, y);
        context.strokeStyle = "rgba(74, 171, 255, 0.16)";
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.arc(x, y, 2 + Math.sin(time * 2 + i) * 0.6, 0, Math.PI * 2);
        context.fillStyle = "rgba(104, 202, 255, 0.7)";
        context.fill();
      }
    };

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
        Math.max(width, height) * 0.52,
      );

      backgroundGlow.addColorStop(
        0,
        `rgba(12, 86, 165, ${0.15 + intensity * 0.08})`,
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
          centerX,
          centerY,
          Math.min(width, height) * 0.09,
          time,
        );
      }

      drawOrb(
        centerX,
        centerY,
        Math.min(width, height) * 0.085,
        rawAudio,
        time,
        currentStatus,
      );

      drawWaveform(
        centerX,
        height * 0.64,
        Math.min(width * 0.68, 430),
        Math.min(height * 0.12, 72),
        intensity,
        time,
        currentStatus,
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

  const statusLabel =
    status === "Speaking"
      ? "Speaking"
      : status === "Thinking"
        ? "Thinking"
        : "Listening";

  const statusColor =
    status === "Speaking"
      ? "#73d5ff"
      : status === "Thinking"
        ? "#a5c8ff"
        : "#72b9ff";

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        overflow: "hidden",
        borderRadius: 4,
        background:
          "radial-gradient(circle at 50% 35%, #0b2442 0%, #061426 38%, #020711 100%)",
        border: "1px solid rgba(70, 164, 255, 0.12)",
        boxShadow: "inset 0 0 80px rgba(0, 104, 210, 0.08)",
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 18,
          right: 18,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          px: 1.25,
          py: 0.65,
          borderRadius: 99,
          background: "rgba(7, 42, 78, 0.46)",
          border: "1px solid rgba(78, 175, 255, 0.24)",
          backdropFilter: "blur(12px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: statusColor,
            boxShadow: `0 0 10px ${statusColor}`,
          }}
        />

        <Typography
          sx={{
            color: statusColor,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          {statusLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default InteractiveAvatar;
