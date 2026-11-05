import type { AvatarStatus } from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const drawGlow = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number
) => {
  const gradient = context.createRadialGradient(
    x,
    y,
    radius * 0.05,
    x,
    y,
    radius
  );

  gradient.addColorStop(0, `rgba(74, 174, 255, ${alpha})`);
  gradient.addColorStop(0.35, `rgba(24, 125, 255, ${alpha * 0.45})`);
  gradient.addColorStop(1, "rgba(0, 75, 180, 0)");

  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
};

export const drawOrb = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  intensity: number,
  time: number,
  currentStatus: AvatarStatus
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
    context,
    centerX,
    centerY,
    radius * (2.4 + intensity * 0.8),
    0.16 + intensity * 0.2
  );

  drawGlow(
    context,
    centerX,
    centerY,
    radius * (1.35 + intensity * 0.35),
    0.22 + intensity * 0.18
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
      Math.PI * 2
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
    orbRadius
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
    orbRadius * 0.75
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

export const drawWaveform = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  waveformWidth: number,
  waveformHeight: number,
  intensity: number,
  time: number,
  currentStatus: AvatarStatus
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
    0
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

export const drawThinkingNodes = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  time: number
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
