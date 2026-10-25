import React from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldCheck, 
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';
import { tacticalAudio } from '../utils/audioSystem';

export default function SettingsView() {
  const { theme, toggleTheme, isMuted, setIsMuted, addToast } = useOperations();

  const handleTestAudio = () => {
    tacticalAudio.playDispatchConfirmed();
    addToast('Audio synth frequency response tested nominal.', 'success');
  };

  const handleTestSpeech = () => {
    tacticalAudio.speakTacticalAlert('AegisGrid voice synthesis verified. Tactical dispatcher audio operational.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Command Center Settings</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Configure operational interface preferences, audio feedback, and telemetry parameters
        </p>
      </div>

      {/* Theme Settings Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Interface Theme</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Choose between high-clarity daylight operations (Light Mode) or low-light tactical operations (Dark Mode).
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className="btn"
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: theme === 'light' ? 'var(--accent-bg)' : 'var(--surface-secondary)',
              borderColor: theme === 'light' ? 'var(--accent)' : 'var(--border-subtle)',
              color: theme === 'light' ? 'var(--accent)' : 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sun size={20} color={theme === 'light' ? 'var(--accent)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: 600 }}>Light Mode (Default)</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High-contrast daylight clarity</span>
          </button>

          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className="btn"
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: theme === 'dark' ? 'var(--accent-bg)' : 'var(--surface-secondary)',
              borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--border-subtle)',
              color: theme === 'dark' ? 'var(--accent)' : 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Moon size={20} color={theme === 'dark' ? 'var(--accent)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: 600 }}>Dark Mode</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low-light mission control</span>
          </button>
        </div>
      </div>

      {/* Sound & Speech Settings */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Tactical Audio & Voice Dispatch</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Web Audio API mathematical tone oscillators and Web Speech API turn-by-turn guidance.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Audio Feedback</strong>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sonar radar sweep and affirmative dispatch chirps</span>
          </div>

          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              tacticalAudio.setMuted(next);
            }}
            className={`btn ${isMuted ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Muted' : 'Sound Active'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button onClick={handleTestAudio} className="btn btn-secondary btn-sm">
            <span>Test Sound Effects</span>
          </button>
          <button onClick={handleTestSpeech} className="btn btn-secondary btn-sm">
            <span>Test Voice Synthesis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
