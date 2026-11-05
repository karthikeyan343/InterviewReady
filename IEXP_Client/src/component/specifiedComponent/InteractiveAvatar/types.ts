export type AvatarStatus = "Listening" | "Thinking" | "Speaking";

export interface InteractiveAvatarProps {
  status: AvatarStatus;
  audioLevel?: number;
  modelUrl?: string;
}
