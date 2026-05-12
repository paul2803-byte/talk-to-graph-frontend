import { useState, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { EpsilonSelector } from '../privacy/EpsilonSelector';
import './ChatInput.css';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
    disabledReason?: string;
    isLoading: boolean;
    epsilon: number | undefined;
    onEpsilonChange: (value: number | undefined) => void;
    remainingBudget: number;
    epsilonBase: number;
    privacyMode: boolean;
}

export function ChatInput({
    onSend,
    disabled,
    disabledReason,
    isLoading,
    epsilon,
    onEpsilonChange,
    remainingBudget,
    epsilonBase,
    privacyMode,
}: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSend = useCallback(() => {
        const trimmed = text.trim();
        if (!trimmed || disabled || isLoading) return;
        onSend(trimmed);
        setText('');
    }, [text, disabled, isLoading, onSend]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend],
    );

    return (
        <div className="chat-input-bar">
            <div className={`chat-input-wrapper ${!privacyMode ? 'general-mode' : ''}`}>
                {privacyMode && (
                    <EpsilonSelector
                        epsilon={epsilon}
                        onChange={onEpsilonChange}
                        remainingBudget={remainingBudget}
                        epsilonBase={epsilonBase}
                        disabled={isLoading}
                    />
                )}
                <div className="chat-input-container">
                    <input
                        id="chat-input"
                        type="text"
                        className="input chat-input-field"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={disabledReason ?? 'Ask a question about your data...'}
                        disabled={disabled || isLoading}
                    />
                    <button
                        className="btn btn-primary chat-send-btn"
                        onClick={handleSend}
                        disabled={disabled || isLoading || !text.trim()}
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="spin-icon" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
