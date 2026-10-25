import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Radio,
  Headphones,
  Film,
  Compass,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

const TOUR_SCENES = [
  {
    start: 0,
    end: 8,
    nav: 'overview-dashboard',
    title: 'Command Center & Mission Hook',
    caption: 'When disaster strikes, minutes decide between life and death. Traditional emergency response is fragmented, delayed, and blind. Meet AegisGrid AI.'
  },
  {
    start: 8,
    end: 18,
    nav: 'overview-map',
    title: 'Tactical GIS Map & Real-World Telemetry',
    caption: 'A unified, real-time crisis intelligence mesh. Here in Chennai during Cyclone Michaung, our watermark-free GIS map tracks live flood perimeters, trapped souls, and responder squads.'
  },
  {
    start: 18,
    end: 28,
    nav: 'ops-triage',
    title: 'AI Multimodal Triage Lab',
    caption: 'Powered by ResNet-152 and Vision Transformers, our AI Triage Lab analyzes live drone feeds, web images, or field cameras to detect structural breaches and trapped victims in under two seconds.'
  },
  {
    start: 28,
    end: 38,
    nav: 'ops-evac',
    title: 'Dynamic Evacuation Engine',
    caption: 'Our dynamic evacuation engine flags flooded causeways as lethal death traps, rerouting convoys over one-hundred-percent secure elevated viaducts.'
  },
  {
    start: 38,
    end: 48,
    nav: 'community-sos',
    title: 'Zero-Cellular P2P LoRa SOS Mesh',
    caption: 'Citizens in dead zones trigger distress beacons over zero-cellular P2P LoRa mesh, instantly locking their GPS coordinates into rescue dispatch.'
  },
  {
    start: 48,
    end: 56,
    nav: 'system-integrations',
    title: 'Real Live Telemetry & Doppler Radar',
    caption: 'Integrated directly with live Open-Meteo weather stations, USGS real-time earthquakes, and Doppler cyclone radar feeds.'
  },
  {
    start: 56,
    end: 88,
    nav: 'overview-dashboard',
    title: 'AegisGrid AI Life-Safety Mesh',
    caption: 'AegisGrid AI: Building the future of autonomous crisis intelligence. Saving lives before the grid goes dark.'
  }
];

export default function VoiceoverTourModal({ isOpen, onClose }) {
  const { setActiveNav } = useOperations();
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Mode: 'video' (Cinematic Explanation Video with Voice) or 'interactive' (Live App Tour)
  const [activeTab, setActiveTab] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(87.88);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [hasUserStartedAudio, setHasUserStartedAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const speakSceneText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  };

  // Reset states on modal close/open
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setHasUserStartedAudio(false);
      return;
    }
  }, [isOpen]);

  // Synchronize interactive tour audio with scene changes
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    const sceneIdx = TOUR_SCENES.findIndex(s => time >= s.start && time < s.end);
    if (sceneIdx !== -1 && sceneIdx !== currentSceneIdx) {
      setCurrentSceneIdx(sceneIdx);
      const scene = TOUR_SCENES[sceneIdx];
      if (scene && scene.nav) {
        setActiveNav(scene.nav);
      }
    }
  };

  const startInteractiveTourWithAudio = () => {
    setHasUserStartedAudio(true);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('HTML5 audio error, falling back to speech synthesis:', err);
        setAudioError('Browser blocked HTML5 audio; activated browser speech fallback.');
        speakSceneText(TOUR_SCENES[0].caption);
        setIsPlaying(true);
      });
    } else {
      speakSceneText(TOUR_SCENES[0].caption);
      setIsPlaying(true);
    }
    setActiveNav(TOUR_SCENES[0].nav);
  };

  const toggleInteractivePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      setHasUserStartedAudio(true);
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          speakSceneText(TOUR_SCENES[currentSceneIdx]?.caption || '');
          setIsPlaying(true);
        });
      } else {
        speakSceneText(TOUR_SCENES[currentSceneIdx]?.caption || '');
        setIsPlaying(true);
      }
    }
  };

  const restartTour = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    speakSceneText(TOUR_SCENES[0].caption);
    setIsPlaying(true);
    setCurrentSceneIdx(0);
    setActiveNav(TOUR_SCENES[0].nav);
  };

  const seekToScene = (idx) => {
    if (idx < 0 || idx >= TOUR_SCENES.length || !audioRef.current) return;
    const scene = TOUR_SCENES[idx];
    audioRef.current.currentTime = scene.start;
    setCurrentSceneIdx(idx);
    setActiveNav(scene.nav);
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  const activeScene = TOUR_SCENES[currentSceneIdx] || TOUR_SCENES[0];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/voiceover_narration.wav"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 87.88)}
        onEnded={() => {
          setIsPlaying(false);
          setActiveNav('overview-dashboard');
        }}
      />

      {/* Main Modal Backdrop (Active in Video Mode, or when opening tour) */}
      {(activeTab === 'video' || !isMinimized) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '920px',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-panel)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-panel)',
              backgroundColor: 'rgba(15, 23, 42, 0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(34, 211, 238, 0.12)',
                  border: '1px solid rgba(34, 211, 238, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Headphones size={18} color="#22D3EE" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-bright)' }}>
                    AegisGrid AI — Video & Guided Voiceover Experience
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Synchronized voiceover narration with 1080p demonstration video
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '3px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`btn btn-xs ${activeTab === 'video' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ gap: '5px', fontSize: '11px', fontWeight: 600 }}
                  >
                    <Film size={12} />
                    <span>Watch Video (MP4 + Voice)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('interactive');
                      if (!hasUserStartedAudio) startInteractiveTourWithAudio();
                    }}
                    className={`btn btn-xs ${activeTab === 'interactive' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ gap: '5px', fontSize: '11px', fontWeight: 600 }}
                  >
                    <Compass size={12} />
                    <span>Live Interactive Tour</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-xs"
                  style={{ padding: '6px', color: 'var(--text-muted)' }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'video' ? (
                /* TAB 1: Standalone MP4 Video with embedded voice */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    backgroundColor: '#000000',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    aspectRatio: '16 / 9'
                  }}>
                    <video
                      ref={videoRef}
                      controls
                      autoPlay
                      playsInline
                      src="/aegisgrid_explanation_video_with_voice.mp4"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Video Meta & Action Toolbar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 size={16} color="#10B981" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                        Audio Track Included: Complete 60s English Voiceover Narration
                      </span>
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>
                        5.69 MB MP4 (1080p)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href="/aegisgrid_explanation_video_with_voice.mp4"
                        download="aegisgrid_explanation_video_with_voice.mp4"
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px', fontSize: '12px', fontWeight: 600 }}
                      >
                        <Download size={14} />
                        <span>Download MP4 Video</span>
                      </a>

                      <a
                        href="/voiceover_narration.wav"
                        download="voiceover_narration.wav"
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px', fontSize: '12px', fontWeight: 600 }}
                      >
                        <Download size={14} />
                        <span>Download Audio (.WAV)</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: Live Interactive Tour Explanation */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(34, 211, 238, 0.08)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#22D3EE" />
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-bright)' }}>
                        Live In-App Interactive Tour Mode
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-normal)' }}>
                      In this mode, AegisGrid AI speaks directly through your speakers while automatically navigating between the Command Dashboard, Tactical GIS Map (Chennai Cyclone), AI Multimodal Triage Lab, Evacuation Engine, and SOS Mesh!
                    </p>

                    {!hasUserStartedAudio && (
                      <button
                        onClick={startInteractiveTourWithAudio}
                        className="btn btn-primary btn-md"
                        style={{
                          alignSelf: 'flex-start',
                          gap: '8px',
                          marginTop: '4px',
                          boxShadow: '0 0 16px rgba(37, 99, 235, 0.4)'
                        }}
                      >
                        <Volume2 size={16} />
                        <span>🔊 Click to Start Voice & Guided Tour</span>
                      </button>
                    )}

                    {hasUserStartedAudio && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="live-dot" style={{ backgroundColor: '#10B981' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                          Voice narration active on speakers. Minimize to watch the app live!
                        </span>
                        <button
                          onClick={() => setIsMinimized(true)}
                          className="btn btn-secondary btn-xs"
                          style={{ gap: '4px', marginLeft: 'auto' }}
                        >
                          <Minimize2 size={12} />
                          <span>Minimize Player to HUD Bar</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scene Roadmap */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tour Chapters & Live Scenes
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                      {TOUR_SCENES.map((scene, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            seekToScene(idx);
                            setIsMinimized(true);
                          }}
                          style={{
                            padding: '10px 14px',
                            backgroundColor: currentSceneIdx === idx ? 'rgba(37, 99, 235, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                            border: `1px solid ${currentSceneIdx === idx ? 'var(--accent)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: currentSceneIdx === idx ? '#22D3EE' : 'var(--text-muted)' }}>
                              SCENE {idx + 1}
                            </span>
                            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {formatTime(scene.start)}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-bright)' }}>
                            {scene.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Tour HUD Bar (Visible when activeTab is interactive and minimized, or tour is playing) */}
      {(activeTab === 'interactive' && isMinimized) && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          width: '92%',
          maxWidth: '760px',
          backgroundColor: 'rgba(8, 13, 24, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(37, 99, 235, 0.25)',
          padding: '14px 20px',
          color: '#FFFFFF',
          transition: 'all 0.25s ease'
        }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-dot" style={{ backgroundColor: '#22D3EE' }} />
              <Headphones size={15} color="#22D3EE" />
              <strong style={{ fontSize: '12px', letterSpacing: '0.5px' }}>
                AEGISGRID AI GUIDED TOUR
              </strong>
              <span className="badge badge-info" style={{ fontSize: '10px' }}>
                SCENE {currentSceneIdx + 1} OF {TOUR_SCENES.length}: {activeScene.title.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsMinimized(false)}
                className="btn btn-ghost btn-xs"
                style={{ padding: '3px', color: '#94A3B8' }}
                title="Expand Tour Modal"
              >
                <Maximize2 size={13} />
              </button>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-xs"
                style={{ padding: '3px', color: '#94A3B8' }}
                title="Close Tour"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Subtitle Caption */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: '10px'
          }}>
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '1.4',
              margin: 0,
              color: '#F8FAFC'
            }}>
              "{activeScene.caption}"
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#2563EB',
              boxShadow: '0 0 8px #2563EB',
              transition: 'width 0.15s linear'
            }} />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={toggleInteractivePlay}
                className="btn btn-primary btn-sm"
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={restartTour}
                className="btn btn-secondary btn-xs"
                style={{ padding: '4px 8px', gap: '4px', fontSize: '11px' }}
                title="Restart"
              >
                <RotateCcw size={12} />
                <span>Restart</span>
              </button>

              <button
                onClick={() => seekToScene(currentSceneIdx - 1)}
                disabled={currentSceneIdx === 0}
                className="btn btn-ghost btn-xs"
                style={{ padding: '4px' }}
                title="Previous Scene"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={() => seekToScene(currentSceneIdx + 1)}
                disabled={currentSceneIdx === TOUR_SCENES.length - 1}
                className="btn btn-ghost btn-xs"
                style={{ padding: '4px' }}
                title="Next Scene"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={14} color="#10B981" />
              <span className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
