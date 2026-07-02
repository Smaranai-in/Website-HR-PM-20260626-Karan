import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, AlertTriangle, CheckCircle, Mic, MicOff, Video, VideoOff, Maximize, Minimize, MonitorPlay, Clock, ShieldAlert, Sparkles, Eye, EyeOff, WifiOff } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { toast } from 'react-toastify';

const MAX_TAB_SWITCHES = 3;
const FACE_CHECK_INTERVAL_MS = 2000;
const FACE_BRIGHTNESS_THRESHOLD = 15;
const FACE_WARNING_THRESHOLD = 10;
const FACE_SUSPICIOUS_THRESHOLD = 30;

export default function Interview({ interviewId, interviewData, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Face visibility proctoring state
  const [faceMissingDuration, setFaceMissingDuration] = useState(0);
  const [faceVisibilityWarnings, setFaceVisibilityWarnings] = useState(0);
  const [faceWarningMessage, setFaceWarningMessage] = useState('');
  const [isFaceVisible, setIsFaceVisible] = useState(true);
  const [cameraDisconnected, setCameraDisconnected] = useState(false);
  const [cameraDisconnectedEvents, setCameraDisconnectedEvents] = useState([]);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrls, setVideoUrls] = useState([]);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceCheckIntervalRef = useRef(null);
  const faceMissingStartRef = useRef(null);
  const faceMissingDurationRef = useRef(0); // mirror of state for interval access
  const faceWarningsRef = useRef(0); // mirror of state for interval access
  const lastWarningThresholdRef = useRef(0); // track which threshold was last warned at

  useEffect(() => {
    const initialize = async () => {
      await restoreOrGenerateQuestions();
      await startWebcam();
      setupTabDetection();
    };
    initialize();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      e.preventDefault();
      toast.error("Pasting is disabled during the interview.");
    };
    const handleGlobalCopy = (e) => {
      e.preventDefault();
      toast.error("Copying is disabled during the interview.");
    };
    const handleGlobalCut = (e) => {
      e.preventDefault();
    };
    const handleGlobalContextMenu = (e) => {
      e.preventDefault();
    };
    const handleGlobalDrop = (e) => {
      e.preventDefault();
      toast.error("Dropping text is disabled during the interview.");
    };

    window.addEventListener('paste', handleGlobalPaste);
    window.addEventListener('copy', handleGlobalCopy);
    window.addEventListener('cut', handleGlobalCut);
    window.addEventListener('contextmenu', handleGlobalContextMenu);
    window.addEventListener('drop', handleGlobalDrop);

    // Disable text selection on the body during the interview
    const originalUserSelect = document.body.style.userSelect;
    const originalWebkitUserSelect = document.body.style.webkitUserSelect;
    const originalMozUserSelect = document.body.style.mozUserSelect;
    const originalMsUserSelect = document.body.style.msUserSelect;

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
      window.removeEventListener('copy', handleGlobalCopy);
      window.removeEventListener('cut', handleGlobalCut);
      window.removeEventListener('contextmenu', handleGlobalContextMenu);
      window.removeEventListener('drop', handleGlobalDrop);

      document.body.style.userSelect = originalUserSelect;
      document.body.style.webkitUserSelect = originalWebkitUserSelect;
      document.body.style.mozUserSelect = originalMozUserSelect;
      document.body.style.msUserSelect = originalMsUserSelect;
    };
  }, []);

  useEffect(() => {
    if (questions && questions.length > 0) {
      localStorage.setItem(`interview_${interviewId}_questions`, JSON.stringify(questions));
      localStorage.setItem(`interview_${interviewId}_answers`, JSON.stringify(answers));
      localStorage.setItem(`interview_${interviewId}_currentQuestion`, currentQuestion.toString());
      localStorage.setItem(`interview_${interviewId}_currentAnswer`, currentAnswer);
      localStorage.setItem(`interview_${interviewId}_tabSwitchCount`, tabSwitchCount.toString());
      localStorage.setItem(`interview_${interviewId}_elapsedTime`, elapsedTime.toString());
      localStorage.setItem(`interview_${interviewId}_faceMissingDuration`, faceMissingDuration.toString());
      localStorage.setItem(`interview_${interviewId}_faceVisibilityWarnings`, faceVisibilityWarnings.toString());
      localStorage.setItem(`interview_${interviewId}_cameraDisconnectedEvents`, JSON.stringify(cameraDisconnectedEvents));
      localStorage.setItem(`interview_${interviewId}_videoUrls`, JSON.stringify(videoUrls));
    }
  }, [interviewId, questions, currentQuestion, answers, currentAnswer, tabSwitchCount, elapsedTime, faceMissingDuration, faceVisibilityWarnings, cameraDisconnectedEvents, videoUrls]);

  useEffect(() => {
    if (showFullscreenPrompt === false && generatedQuestions) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [showFullscreenPrompt, generatedQuestions]);

  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        video.play().catch(err => {
          console.error('Error playing video in useEffect:', err);
        });
      }
    }
  }, [stream, showFullscreenPrompt]);

  const startInterview = async () => {
    try {
      // Camera permission gate: prevent start if camera is not available
      if (!streamRef.current || cameraPermissionDenied) {
        setCameraPermissionDenied(true);
        return;
      }

      setQuestions(generatedQuestions);
      await enterFullscreen();
      setShowFullscreenPrompt(false);

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        mediaRecorderRef.current.start();
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      setShowFullscreenPrompt(false);
    }
  };

  const restoreOrGenerateQuestions = async () => {
    try {
      const storedQuestions = localStorage.getItem(`interview_${interviewId}_questions`);
      const storedAnswers = localStorage.getItem(`interview_${interviewId}_answers`);
      const storedCurrentQuestion = localStorage.getItem(`interview_${interviewId}_currentQuestion`);
      const storedTabSwitchCount = localStorage.getItem(`interview_${interviewId}_tabSwitchCount`);
      const storedElapsedTime = localStorage.getItem(`interview_${interviewId}_elapsedTime`);

      // Try to fetch from DB first
      const { data: dbRecord, error: dbError } = await supabase
        .from('interviews')
        .select('questions, answers, tab_switch_count, video_url')
        .eq('id', interviewId)
        .single();

      if (dbError) {
        console.warn("Error fetching interview from DB:", dbError);
      }

      const existingQuestions = dbRecord?.questions || (storedQuestions ? JSON.parse(storedQuestions) : null);
      
      if (existingQuestions && existingQuestions.length > 0) {
        setQuestions(existingQuestions);
        setGeneratedQuestions(existingQuestions);

        const dbAnswers = dbRecord?.answers || [];
        const localAnswers = storedAnswers ? JSON.parse(storedAnswers) : [];
        const restoredAnswers = dbAnswers.length >= localAnswers.length ? dbAnswers : localAnswers;

        let restoredCurrentQ = 0;
        if (storedCurrentQuestion) {
          restoredCurrentQ = parseInt(storedCurrentQuestion);
        } else {
          restoredCurrentQ = restoredAnswers.length;
        }

        // Clamp restoredCurrentQ to valid indices: [0, existingQuestions.length - 1]
        if (restoredCurrentQ >= existingQuestions.length) {
          restoredCurrentQ = existingQuestions.length - 1;
        }
        if (restoredCurrentQ < 0) {
          restoredCurrentQ = 0;
        }

        // Slice answers to match current question index
        const clampedAnswers = restoredAnswers.slice(0, restoredCurrentQ);
        setAnswers(clampedAnswers);
        setCurrentQuestion(restoredCurrentQ);

        const dbTabCount = dbRecord?.tab_switch_count || 0;
        const localTabCount = storedTabSwitchCount ? parseInt(storedTabSwitchCount) : 0;
        const restoredTabCount = Math.max(dbTabCount, localTabCount);
        setTabSwitchCount(restoredTabCount);

        if (storedElapsedTime) {
          setElapsedTime(parseInt(storedElapsedTime));
        }

        const storedCurrentAnswer = localStorage.getItem(`interview_${interviewId}_currentAnswer`);
        if (storedCurrentAnswer) {
          setCurrentAnswer(storedCurrentAnswer);
        }

        // Restore face missing duration and warnings if any
        const storedFaceMissing = localStorage.getItem(`interview_${interviewId}_faceMissingDuration`);
        if (storedFaceMissing) {
          const fm = parseInt(storedFaceMissing);
          setFaceMissingDuration(fm);
          faceMissingDurationRef.current = fm;
        }
        const storedFaceWarnings = localStorage.getItem(`interview_${interviewId}_faceVisibilityWarnings`);
        if (storedFaceWarnings) {
          const fw = parseInt(storedFaceWarnings);
          setFaceVisibilityWarnings(fw);
          faceWarningsRef.current = fw;
        }
        const storedDisconnects = localStorage.getItem(`interview_${interviewId}_cameraDisconnectedEvents`);
        if (storedDisconnects) {
          setCameraDisconnectedEvents(JSON.parse(storedDisconnects));
        }

        const storedVideoUrls = localStorage.getItem(`interview_${interviewId}_videoUrls`);
        const dbVideoUrl = dbRecord?.video_url;
        let restoredVideoUrls = [];
        if (dbVideoUrl) {
          try {
            if (dbVideoUrl.startsWith('[')) {
              restoredVideoUrls = JSON.parse(dbVideoUrl);
            } else {
              restoredVideoUrls = [dbVideoUrl];
            }
          } catch (e) {
            restoredVideoUrls = [dbVideoUrl];
          }
        } else if (storedVideoUrls) {
          restoredVideoUrls = JSON.parse(storedVideoUrls);
        }
        setVideoUrls(restoredVideoUrls);

        setShowFullscreenPrompt(true);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Error restoring interview state:", e);
    }
    // Default fallback: generate questions
    await generateQuestions();
  };

  const generateQuestions = async () => {
    try {
      const requestBody = {
        jobRole: interviewData.jobRole,
        skillRating: interviewData.skillRating,
      };

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      let token = session?.access_token;
      if (!token) {
        const { data: { user } } = await supabase.auth.getUser();
        // Fallback: If no token but user exists, they might need to re-auth, but we'll try the anon key as a last resort (which usually fails for edge functions requiring auth)
        token = process.env.REACT_APP_SUPABASE_ANON_KEY;
      }

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/Interview_generate-questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.error || `Failed to generate questions: ${response.status} ${response.statusText}`);
      }

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format: questions array not found');
      }

      setGeneratedQuestions(data.questions);

      await supabase
        .from('interviews')
        .update({ questions: data.questions })
        .eq('id', interviewId);

      setShowFullscreenPrompt(true);
      setLoading(false);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.message || 'Failed to generate questions. Please try again.');
      setLoading(false);
    }
  };

  const startRecordingForQuestion = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    
    let options = {};
    const candidates = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4;codecs=h264,aac',
      'video/mp4'
    ];

    for (const mimeType of candidates) {
      try {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          options = { mimeType };
          break;
        }
      } catch (e) {
        console.warn(`MediaRecorder.isTypeSupported thrown exception for ${mimeType}:`, e);
      }
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstart = () => {
        setIsRecording(true);
      };
      mediaRecorder.onstop = () => {
        setIsRecording(false);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (e) {
      console.error('Error starting media recorder for next question:', e);
    }
  };

  const startWebcam = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setCameraPermissionDenied(false);
        setCameraDisconnected(false);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermissionDenied(true);
          setError('Camera access denied. Please allow camera access in your browser settings to start the interview.');
        } else {
          setError('Could not access camera. Please ensure you have granted camera permissions.');
        }
        return;
      }

      const videoTracks = mediaStream.getVideoTracks();

      if (videoTracks.length === 0) {
        throw new Error('No video tracks available');
      }

      setStream(mediaStream);
      streamRef.current = mediaStream;
      setIsVideoOn(true);
      setShowStartButton(false);

      if (videoRef.current) {
        const video = videoRef.current;

        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;

        const onLoaded = () => {
          video.play().catch(err => {
            console.error('Error playing video:', err);
            setError('Error playing video stream');
          });
        };

        if (video.readyState >= 1) {
          onLoaded();
        } else {
          video.onloadedmetadata = onLoaded;
        }

        video.onerror = (e) => {
          console.error('Video playback error:', e);
          console.error('Video error details:', video.error);
          setError('Error playing video stream');
        };

        video.onplay = () => {
          setError('');
        };
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
        } catch (e) {
          console.error('Error stopping previous tracks:', e);
        }
        mediaRecorderRef.current = null;
      }

      startRecordingForQuestion();

      // Listen for camera disconnect (track ended)
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.warn('Camera track ended — camera disconnected');
          setCameraDisconnected(true);
          setIsVideoOn(false);
          setCameraDisconnectedEvents(prev => {
            const newEvts = [
              ...prev,
              { type: 'disconnected', timestamp: new Date().toISOString() }
            ];
            localStorage.setItem(`interview_${interviewId}_cameraDisconnectedEvents`, JSON.stringify(newEvts));
            return newEvts;
          });
        };
      }

    } catch (err) {
      console.error('Webcam error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermissionDenied(true);
        setError('Camera access denied. Please allow camera access in your browser settings.');
      } else {
        setError('Unable to access webcam. Please grant permission.');
      }
    }
  };

  // --- Face Visibility Detection ---

  const checkFaceVisibility = useCallback(() => {
    if (!videoRef.current || !isVideoOn || cameraDisconnected) {
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) return;

    // Create or reuse a hidden canvas for frame analysis
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Use small sample for performance
    const sampleWidth = 64;
    const sampleHeight = 48;
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    try {
      ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight);
      const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imageData.data;

      // Calculate average brightness
      let totalBrightness = 0;
      const pixelCount = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        // Luminance formula: 0.299*R + 0.587*G + 0.114*B
        totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }
      const avgBrightness = totalBrightness / pixelCount;

      const isCameraBlocked = avgBrightness < FACE_BRIGHTNESS_THRESHOLD;
      console.log('checkFaceVisibility - avgBrightness:', avgBrightness, 'isBlocked:', isCameraBlocked);

      if (isCameraBlocked) {
        // Camera appears blocked/covered
        setIsFaceVisible(false);

        if (!faceMissingStartRef.current) {
          faceMissingStartRef.current = Date.now();
        }

        const missingSeconds = Math.floor((Date.now() - faceMissingStartRef.current) / 1000);
        const newTotalDuration = faceMissingDurationRef.current + (FACE_CHECK_INTERVAL_MS / 1000);
        faceMissingDurationRef.current = newTotalDuration;
        setFaceMissingDuration(Math.round(newTotalDuration));

        console.log('checkFaceVisibility - blocked duration:', missingSeconds, 'total:', newTotalDuration);

        // Tiered warning system
        if (missingSeconds >= FACE_SUSPICIOUS_THRESHOLD && lastWarningThresholdRef.current < FACE_SUSPICIOUS_THRESHOLD) {
          // > 30 seconds: mark suspicious level
          lastWarningThresholdRef.current = FACE_SUSPICIOUS_THRESHOLD;
          faceWarningsRef.current += 1;
          setFaceVisibilityWarnings(faceWarningsRef.current);
          setFaceWarningMessage('Camera has been blocked for over 30 seconds. This will be flagged for review.');
          setTimeout(() => setFaceWarningMessage(''), 10000);
        } else if (missingSeconds >= FACE_WARNING_THRESHOLD && lastWarningThresholdRef.current < FACE_WARNING_THRESHOLD) {
          // 10-30 seconds: record warning
          lastWarningThresholdRef.current = FACE_WARNING_THRESHOLD;
          faceWarningsRef.current += 1;
          setFaceVisibilityWarnings(faceWarningsRef.current);
          setFaceWarningMessage('Your camera appears to be blocked. Please ensure your face is visible.');
          setTimeout(() => setFaceWarningMessage(''), 6000);
        }
        // < 10 seconds: no penalty, no warning
      } else {
        // Camera is fine — face/scene is visible
        if (!isFaceVisible || faceMissingStartRef.current) {
          // Reset missing tracking
          faceMissingStartRef.current = null;
          lastWarningThresholdRef.current = 0;
        }
        setIsFaceVisible(true);
      }
    } catch (e) {
      // Canvas operations can fail in some edge cases — ignore silently
      console.warn('Face visibility check error:', e);
    }
  }, [isVideoOn, cameraDisconnected, isFaceVisible]);

  // Reactively manage face visibility check interval to avoid stale closures
  useEffect(() => {
    const isInterviewActive = !showFullscreenPrompt && generatedQuestions && questions && questions.length > 0;
    
    if (!isInterviewActive || !isVideoOn || cameraDisconnected) {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current);
        faceCheckIntervalRef.current = null;
      }
      return;
    }

    console.log('Starting face visibility check interval');
    faceCheckIntervalRef.current = setInterval(() => {
      checkFaceVisibility();
    }, FACE_CHECK_INTERVAL_MS);

    return () => {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current);
        faceCheckIntervalRef.current = null;
      }
    };
  }, [showFullscreenPrompt, generatedQuestions, questions, isVideoOn, cameraDisconnected, checkFaceVisibility]);

  const handleReconnectCamera = async () => {
    setCameraDisconnected(false);
    setError('');
    try {
      await startWebcam();
      setIsVideoOn(true);
      setCameraDisconnectedEvents(prev => {
        const newEvts = [
          ...prev,
          { type: 'reconnected', timestamp: new Date().toISOString() }
        ];
        localStorage.setItem(`interview_${interviewId}_cameraDisconnectedEvents`, JSON.stringify(newEvts));
        return newEvts;
      });
    } catch (err) {
      console.error('Failed to reconnect camera:', err);
      setError('Failed to reconnect camera. Please try again.');
      setCameraDisconnected(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleVideo = async () => {
    if (!stream) {
      try {
        await startWebcam();
        setIsVideoOn(true);
      } catch (err) {
        console.error('Failed to start webcam:', err);
        setError('Failed to start camera. Please try again.');
      }
      return;
    }

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const newState = !videoTrack.enabled;
      videoTrack.enabled = newState;
      setIsVideoOn(newState);

      if (!newState) {
        setShowStartButton(true);
      }
    }
  };

  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  const setupTabDetection = useCallback(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          setShowWarning(true);

          const warningDuration = newCount >= MAX_TAB_SWITCHES ? 10000 : 5000;
          setTimeout(() => setShowWarning(false), warningDuration);

          if (newCount >= MAX_TAB_SWITCHES) {
            // handleSubmit();
          }

          return newCount;
        });
      }
    };

    const handleBlur = () => {
      if (document.visibilityState === 'visible') {
        handleVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handleNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let uploadedUrl = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        const uploadPromise = new Promise((resolve) => {
          mediaRecorderRef.current.onstop = () => {
            setIsRecording(false);
            const recordedMimeType = mediaRecorderRef.current.mimeType || 'video/webm';
            const blob = new Blob(recordedChunksRef.current, { type: recordedMimeType });
            resolve({ blob, mimeType: recordedMimeType });
          };
          mediaRecorderRef.current.stop();
        });

        const result = await uploadPromise;
        if (result && result.blob) {
          const { blob, mimeType } = result;
          const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const fileName = `video_${interviewId}_q${currentQuestion}_${Date.now()}.${extension}`;
          
          const { error: uploadError } = await supabase.storage
            .from('Interview_Resumes')
            .upload(fileName, blob, { contentType: mimeType });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('Interview_Resumes')
              .getPublicUrl(fileName);

            if (urlData) {
              uploadedUrl = urlData.publicUrl;
            }
          } else {
            console.error('Upload Error:', uploadError);
          }
        }
      } catch (err) {
        console.error('Error recording/uploading video for question:', err);
      }
    }

    const updatedVideoUrls = [...videoUrls];
    if (uploadedUrl) {
      updatedVideoUrls.push(uploadedUrl);
      setVideoUrls(updatedVideoUrls);
      
      // Update database
      await supabase
        .from('interviews')
        .update({ video_url: JSON.stringify(updatedVideoUrls) })
        .eq('id', interviewId);
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsSubmitting(false);
      // Restart recording
      startRecordingForQuestion();
    } else {
      await handleSubmit(newAnswers, updatedVideoUrls);
    }
  };

  const handleSubmit = async (finalAnswers, finalVideoUrls) => {
    // stop media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsSubmitting(true);
    const allAnswers = finalAnswers || [...answers, currentAnswer];
    const targetVideoUrls = finalVideoUrls || videoUrls;

    // Snapshot current proctoring values
    const finalFaceMissingDuration = Math.round(faceMissingDurationRef.current);
    const finalFaceWarnings = faceWarningsRef.current;

    try {
      await supabase
        .from('interviews')
        .update({
          answers: allAnswers,
          video_url: JSON.stringify(targetVideoUrls),
          tab_switch_count: tabSwitchCount,
          face_missing_duration: finalFaceMissingDuration,
          face_visibility_warnings: finalFaceWarnings,
          camera_disconnected_events: cameraDisconnectedEvents,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', interviewId);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      let token = session?.access_token;
      if (!token) {
        token = process.env.REACT_APP_SUPABASE_ANON_KEY;
      }

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/Interview_grade-interview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          questions,
          answers: allAnswers,
          tabSwitchCount,
          faceMissingDuration: finalFaceMissingDuration,
          faceVisibilityWarnings: finalFaceWarnings,
          cameraDisconnectedEvents,
          jobRole: interviewData?.jobRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grade interview');
      }

      // Clean up localStorage for this interview on success
      localStorage.removeItem(`interview_${interviewId}_questions`);
      localStorage.removeItem(`interview_${interviewId}_answers`);
      localStorage.removeItem(`interview_${interviewId}_currentQuestion`);
      localStorage.removeItem(`interview_${interviewId}_currentAnswer`);
      localStorage.removeItem(`interview_${interviewId}_tabSwitchCount`);
      localStorage.removeItem(`interview_${interviewId}_elapsedTime`);
      localStorage.removeItem(`interview_${interviewId}_faceMissingDuration`);
      localStorage.removeItem(`interview_${interviewId}_faceVisibilityWarnings`);
      localStorage.removeItem(`interview_${interviewId}_cameraDisconnectedEvents`);
      localStorage.removeItem(`interview_${interviewId}_videoUrls`);

      // Ensure proctoring data is present on results — combined suspicion formula
      const resultsWithProctoring = {
        ...data,
        tab_switch_count: tabSwitchCount,
        face_missing_duration: finalFaceMissingDuration,
        face_visibility_warnings: finalFaceWarnings,
        is_suspicious: (tabSwitchCount >= 3) || (finalFaceMissingDuration >= 30),
      };

      onComplete(resultsWithProctoring);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px] animate-pulse animation-delay-2000" />
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-pulse animation-delay-4000" />
        </div>

        {/* Loading Card */}
        <div className="relative z-10 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center shadow-xl dark:shadow-2xl ring-1 ring-slate-200 dark:ring-white/20 transition-colors duration-300">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 p-6 rounded-2xl border border-slate-200 dark:border-white/10 inline-block">
              <MonitorPlay className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            Preparing Your Interview
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto">
            Generating personalized questions based on your profile
          </p>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (showFullscreenPrompt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-300">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Prompt Card */}
        <div className="relative z-10 max-w-lg w-full">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-10 shadow-xl dark:shadow-2xl ring-1 ring-slate-200 dark:ring-white/20 transition-colors duration-300 text-slate-900 dark:text-white">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                  <MonitorPlay className="w-14 h-14 text-emerald-600 dark:text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                Ready to Begin
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Your personalized interview questions are ready
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-lg mr-4 border border-green-200 dark:border-transparent">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white">Questions Generated</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{generatedQuestions?.length} questions tailored for you</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg mr-4 border border-emerald-200 dark:border-transparent">
                  <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white">Video Recording</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Your responses will be recorded for analysis</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-colors">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg mr-4 border border-indigo-200 dark:border-transparent">
                  <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white">Proctoring Active</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Tab switching and face/webcam visibility will be monitored</p>
                </div>
              </div>
            </div>

            {cameraPermissionDenied && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold text-sm">Camera Permission Required</h3>
                  <p className="text-red-200 text-xs mt-1">
                    Camera access is disabled or denied. Please grant camera/webcam permission in your browser settings and try again.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={cameraPermissionDenied ? startWebcam : startInterview}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-1 ${
                cameraPermissionDenied
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25 hover:shadow-amber-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
              }`}
            >
              {cameraPermissionDenied ? 'Enable / Retry Camera' : 'Start Interview'}
            </button>

            <p className="text-center text-slate-500 text-sm mt-6">
              Fullscreen mode will be activated automatically
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-10 max-w-md w-full shadow-2xl ring-1 ring-white/10">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full" />
              <div className="relative bg-red-500/20 p-5 rounded-2xl border border-red-500/30">
                <AlertTriangle className="w-14 h-14 text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Something Went Wrong</h2>
            <p className="text-slate-400 mb-6">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] relative overflow-hidden transition-colors duration-300 text-slate-900 dark:text-white pt-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] dark:opacity-10" />
      </div>

      {/* Warning Toast (Tab Switches) */}
      {showWarning && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/20">
            <div className="relative">
              <span className="absolute inset-0 bg-red-500 blur-lg rounded-full opacity-50 animate-pulse" />
              <AlertTriangle className="relative w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Focus Alert</h3>
              <p className="text-red-200 text-sm">
                {tabSwitchCount >= MAX_TAB_SWITCHES
                  ? 'Maximum warnings reached!'
                  : `You switched tabs ${tabSwitchCount} time${tabSwitchCount > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Toast (Face Visibility) */}
      {faceWarningMessage && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-4 bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/20">
            <div className="relative">
              <span className="absolute inset-0 bg-amber-500 blur-lg rounded-full opacity-50 animate-pulse" />
              <EyeOff className="relative w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Proctoring Alert</h3>
              <p className="text-amber-200 text-sm">
                {faceWarningMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Toast (Camera Disconnected) */}
      {cameraDisconnected && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center gap-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/20">
            <div className="relative">
              <span className="absolute inset-0 bg-red-500 blur-lg rounded-full opacity-50 animate-pulse" />
              <WifiOff className="relative w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Camera Disconnected</h3>
              <p className="text-red-200 text-sm">
                Your webcam connection has been lost. Please reconnect it immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-xl ring-1 ring-slate-200 dark:ring-white/10 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl ${isRecording ? 'bg-red-500/30 blur-lg animate-pulse' : 'bg-slate-300 dark:bg-slate-500/30 blur-lg'} transition-all duration-300`} />
                  <div className="relative bg-white dark:bg-white/10 p-3 rounded-xl border border-slate-200 dark:border-white/20">
                    <MonitorPlay className="w-6 h-6 text-slate-800 dark:text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">AI Interview Session</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{interviewData.jobRole} Position</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Timer */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{formatTime(elapsedTime)}</span>
                </div>

                {/* Recording Status */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <span className={`relative flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-500'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                  </span>
                  <span className="text-slate-800 dark:text-white text-sm font-medium">{isRecording ? 'Recording' : 'Paused'}</span>
                </div>

                {/* Tab Switch Warning */}
                {tabSwitchCount > 0 && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${tabSwitchCount >= MAX_TAB_SWITCHES
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}>
                    <AlertTriangle className={`w-5 h-5 ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-400' : 'text-yellow-400'
                      }`} />
                    <span className={`text-sm font-medium ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                      {tabSwitchCount} / {MAX_TAB_SWITCHES}
                    </span>
                  </div>
                )}

                {/* Face Visibility Warning Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  cameraDisconnected
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                    : isFaceVisible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : faceMissingDuration >= FACE_SUSPICIOUS_THRESHOLD
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}>
                  {cameraDisconnected ? (
                    <WifiOff className="w-5 h-5 text-red-400" />
                  ) : isFaceVisible ? (
                    <Eye className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <EyeOff className={`w-5 h-5 ${faceMissingDuration >= FACE_SUSPICIOUS_THRESHOLD ? 'text-red-400' : 'text-yellow-400'}`} />
                  )}
                  <span className="text-sm font-medium">
                    {cameraDisconnected
                      ? 'Camera Offline'
                      : isFaceVisible
                      ? 'Face Visible'
                      : `Face Hidden (${Math.round(faceMissingDuration)}s)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden transition-colors">
                <div className="p-8">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg">{currentQuestion + 1}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400">of</span>
                      <span className="font-bold text-lg text-slate-800 dark:text-white">{questions.length}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full mb-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="bg-slate-50 dark:bg-[#1e293b]/50 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50 shadow-inner">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-lg leading-relaxed font-medium text-slate-800 dark:text-slate-100">
                        {questions[currentQuestion]}
                      </p>
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="space-y-4">
                    <label htmlFor="answer" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Response
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-300 blur" />
                      <textarea
                        id="answer"
                        rows="6"
                        className="relative w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 resize-none shadow-sm dark:shadow-inner"
                        placeholder="Type your answer here..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        onPaste={(e) => {
                          e.preventDefault();
                          toast.error("Pasting answers is disabled during the interview.");
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          toast.error("Copying text is disabled during the interview.");
                        }}
                        onCut={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          toast.error("Dropping text is disabled during the interview.");
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                      <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {currentAnswer.length} chars
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim() || isSubmitting}
                      className={`relative group px-8 py-4 rounded-xl font-bold transition-all duration-300 border-2 ${
                        currentAnswer.trim() && !isSubmitting
                          ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1'
                          : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>{currentQuestion === questions.length - 1 ? 'Submit Interview' : 'Next Question'}</span>
                            <svg className={`w-5 h-5 transition-transform duration-300 ${currentAnswer.trim() ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Webcam Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Webcam Card */}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden transition-colors">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-slate-800 dark:text-white">Camera Feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleVideo}
                      className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                      title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                      title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative pt-[56.25%] bg-slate-900 rounded-b-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: 'scaleX(-1)',
                      display: isVideoOn ? 'block' : 'none'
                    }}
                    onError={(e) => {
                      console.error('Video error:', e);
                      console.error('Video error details:', e.target.error);
                      setError('Failed to load video stream. Please check camera permissions.');
                      setShowStartButton(true);
                    }}
                    onCanPlay={() => {
                      videoRef.current?.play().catch(err => {
                        console.error('Play error:', err);
                        setError('Failed to play video. Please try starting the camera manually.');
                        setShowStartButton(true);
                      });
                    }}
                  />

                  {/* Camera Disconnect Overlay */}
                  {cameraDisconnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm z-30 animate-fade-in-up">
                      <div className="text-center p-6 max-w-xs">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full animate-pulse" />
                          <div className="relative bg-red-500/20 p-4 rounded-xl border border-red-500/40">
                            <WifiOff className="w-10 h-10 text-red-400" />
                          </div>
                        </div>
                        <h4 className="text-white font-bold text-base mb-1">Webcam Offline</h4>
                        <p className="text-slate-300 text-xs mb-4">Your camera connection was lost. Please reconnect and click below.</p>
                        <button
                          onClick={handleReconnectCamera}
                          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md shadow-red-500/20 hover:shadow-red-500/30"
                        >
                          Reconnect Camera
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Camera Off Overlay */}
                  {!isVideoOn && showStartButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                      <div className="text-center p-8">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-slate-300 dark:bg-slate-500/30 blur-2xl rounded-full" />
                          <div className="relative bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                            <VideoOff className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg font-medium">Camera is turned off</p>
                        <button
                          onClick={async () => {
                            setShowStartButton(false);
                            setError('');
                            try {
                              await startWebcam();
                              setIsVideoOn(true);
                            } catch (err) {
                              console.error('Failed to start webcam:', err);
                              setError('Failed to start camera. Please try again.');
                              setShowStartButton(true);
                            }
                          }}
                          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
                        >
                          Enable Camera
                        </button>
                        {error && (
                          <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/20">{error}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-500'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                    </span>
                    <span className="text-white text-sm font-medium">{isRecording ? 'Recording' : 'Paused'}</span>
                  </div>
                </div>

                {/* Tab Switch Warning */}
                {tabSwitchCount > 0 && (
                  <div className={`p-4 border-t ${tabSwitchCount >= MAX_TAB_SWITCHES
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
                    }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      <div>
                        <h3 className={`text-sm font-medium ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                          {tabSwitchCount >= MAX_TAB_SWITCHES
                            ? 'Maximum warnings reached!'
                            : `Tab switched ${tabSwitchCount} time${tabSwitchCount > 1 ? 's' : ''}`}
                        </h3>
                        <p className={`text-xs mt-1 ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-300/80' : 'text-yellow-300/80'
                          }`}>
                          {tabSwitchCount >= MAX_TAB_SWITCHES
                            ? 'Interview may be flagged for review.'
                            : `Stay focused. (Max ${MAX_TAB_SWITCHES} allowed)`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl ring-1 ring-slate-200 dark:ring-white/10 transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
                  Progress Summary
                </h3>

                <div className="space-y-6">
                  {/* Questions Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Questions Answered</span>
                      <span className="font-bold text-slate-800 dark:text-white">{currentQuestion} / {questions.length}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700 ease-out relative"
                        style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Tab Switches */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-sm">Tab Switches</span>
                      <span className={`font-semibold ${tabSwitchCount >= MAX_TAB_SWITCHES ? 'text-red-400' : 'text-white'
                        }`}>
                        {tabSwitchCount} / {MAX_TAB_SWITCHES}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(MAX_TAB_SWITCHES)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded-full transition-all duration-300 ${i < tabSwitchCount
                            ? (i >= MAX_TAB_SWITCHES - 1
                              ? 'bg-red-500 shadow-lg shadow-red-500/30'
                              : 'bg-yellow-500 shadow-lg shadow-yellow-500/30')
                            : 'bg-white/10'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Answer Length */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Current Answer</span>
                      <span className="font-bold text-slate-800 dark:text-white">{currentAnswer.length} chars</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300 relative"
                        style={{ width: `${Math.min((currentAnswer.length / 2000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
