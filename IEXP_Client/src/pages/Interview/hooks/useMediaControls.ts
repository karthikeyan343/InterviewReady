import { useEffect, useRef, useState } from "react";
import type GeminiLiveService from "../../../services/geminiLiveService";

interface UseMediaControlsOptions {
  started: boolean;
  isMobile: boolean;
  geminiSpeakingRef: React.MutableRefObject<boolean>;
  liveServiceRef: React.MutableRefObject<GeminiLiveService | null>;
}

export const useMediaControls = ({
  started,
  isMobile,
  geminiSpeakingRef,
  liveServiceRef,
}: UseMediaControlsOptions) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState("");

  // Video element preview binding and recovery
  useEffect(() => {
    const videoEl = videoRef.current;
    const stream = streamRef.current;

    if (videoEl && stream && cameraEnabled && mediaReady) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      videoEl.play().catch((error) => {
        console.warn("Video playback was prevented:", error);
      });
    }
  }, [started, mediaReady, cameraEnabled, isMobile]);

  const setupMedia = async () => {
    try {
      setMediaError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setMediaError("Camera and microphone are not supported by this browser.");
        return false;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setMediaReady(true);
      setMicEnabled(true);
      setCameraEnabled(true);
      return true;
    } catch (error) {
      console.error("Media permission error:", error);
      setMediaError("Camera and microphone permission is required to start the interview.");
      return false;
    }
  };

  const handleToggleMic = () => {
    const stream = streamRef.current;
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    const nextState = !micEnabled;
    audioTracks.forEach((track) => {
      track.enabled = nextState;
    });
    setMicEnabled(nextState);

    if (!nextState) {
      liveServiceRef.current?.pauseMicrophone();
    } else if (!geminiSpeakingRef.current) {
      liveServiceRef.current?.resumeMicrophone();
    }
  };

  const handleToggleCamera = () => {
    const stream = streamRef.current;
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) return;

    const nextState = !cameraEnabled;
    videoTracks.forEach((track) => {
      track.enabled = nextState;
    });
    setCameraEnabled(nextState);
  };

  const handleToggleSpeaker = () => {
    const nextState = !speakerEnabled;
    setSpeakerEnabled(nextState);
    liveServiceRef.current?.setSpeakerEnabled(nextState);
  };

  const teardownMedia = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  return {
    videoRef,
    streamRef,
    micEnabled,
    cameraEnabled,
    speakerEnabled,
    mediaReady,
    mediaError,
    setMediaError,
    setupMedia,
    handleToggleMic,
    handleToggleCamera,
    handleToggleSpeaker,
    teardownMedia,
  };
};

