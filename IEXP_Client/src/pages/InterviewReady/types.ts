export interface InterviewReadyScreenProps {
  id?: string;
  loading: boolean;
  isCheckingSession?: boolean;
  mediaReady: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  mediaError: string;
  error: string;
  isResume?: boolean;
  onStart: () => void;
  onBack: () => void;
}
