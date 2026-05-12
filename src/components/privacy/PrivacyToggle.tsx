import { Shield, ShieldOff } from 'lucide-react';
import './PrivacyToggle.css';

interface PrivacyToggleProps {
    privacyMode: boolean;
    onChange: (mode: boolean) => void;
}

export function PrivacyToggle({ privacyMode, onChange }: PrivacyToggleProps) {
    return (
        <div className="privacy-toggle-container">
            <span className={`privacy-toggle-label ${!privacyMode ? 'active text-error' : ''}`} style={!privacyMode ? {} : { opacity: 0.5 }}>
                <ShieldOff size={16} />
                General Mode
            </span>
            <button
                className={`privacy-toggle-switch ${privacyMode ? 'on' : 'off'}`}
                onClick={() => onChange(!privacyMode)}
                aria-label="Toggle Privacy Mode"
                title={privacyMode ? "Disable Privacy Mode (General Mode)" : "Enable Privacy Mode"}
            >
                <div className="privacy-toggle-knob" />
            </button>
            <span className={`privacy-toggle-label ${privacyMode ? 'active' : ''}`}>
                <Shield size={16} />
                Privacy Mode
            </span>
        </div>
    );
}
