import { useState, useCallback, useEffect, useRef } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import './EpsilonSelector.css';

interface EpsilonSelectorProps {
    epsilon: number | undefined;
    onChange: (value: number | undefined) => void;
    remainingBudget: number;
    epsilonBase: number;
    disabled: boolean;
}

export function EpsilonSelector({
    epsilon,
    onChange,
    remainingBudget,
    epsilonBase,
    disabled,
}: EpsilonSelectorProps) {
    const displayValue = epsilon ?? epsilonBase;
    const maxBudget = Math.max(remainingBudget, 0.01);
    const isDefault = epsilon === undefined;

    /* Local text state so the user can type freely, then we validate on blur */
    const [inputText, setInputText] = useState(displayValue.toFixed(2));
    const inputRef = useRef<HTMLInputElement>(null);

    /* Keep local text in sync when the controlled value changes externally */
    useEffect(() => {
        setInputText(displayValue.toFixed(2));
    }, [displayValue]);

    const clampMin = useCallback(
        (v: number) => Math.max(v, 0.01),
        [],
    );

    const clampFull = useCallback(
        (v: number) => Math.min(Math.max(v, 0.01), maxBudget),
        [maxBudget],
    );

    const exceedsBudget = !isDefault && displayValue > remainingBudget;

    const handleSliderChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = clampFull(parseFloat(e.target.value));
            onChange(v);
        },
        [onChange, clampFull],
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputText(e.target.value);
        },
        [],
    );

    const handleInputBlur = useCallback(() => {
        const parsed = parseFloat(inputText);
        if (isNaN(parsed) || parsed <= 0) {
            /* Invalid → revert to current value */
            setInputText(displayValue.toFixed(2));
        } else {
            /* Don't clamp to max — let the error message handle it */
            onChange(clampMin(parsed));
        }
    }, [inputText, displayValue, onChange, clampMin]);

    const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
            }
        },
        [],
    );

    const handleResetDefault = useCallback(() => {
        onChange(undefined);
    }, [onChange]);

    /* Slider fill percentage for the custom track gradient */
    const fillPercent = ((displayValue - 0.01) / (maxBudget - 0.01)) * 100 || 0;

    return (
        <div className={`epsilon-selector ${disabled ? 'epsilon-selector--disabled' : ''}`}>
            <div className="epsilon-selector-header">
                <SlidersHorizontal size={14} className="epsilon-selector-icon" />
                <span className="epsilon-selector-title">Epsilon (ε)</span>

                <button
                    type="button"
                    className="btn btn-ghost btn-sm epsilon-reset-btn"
                    onClick={handleResetDefault}
                    disabled={disabled || isDefault}
                    title={`Reset to server default (${epsilonBase})`}
                >
                    <RotateCcw size={12} />
                    Default ({epsilonBase})
                </button>
            </div>

            <div className="epsilon-selector-controls">
                <input
                    id="epsilon-slider"
                    type="range"
                    className="epsilon-slider"
                    min={0.01}
                    max={maxBudget}
                    step={0.01}
                    value={displayValue}
                    onChange={handleSliderChange}
                    disabled={disabled}
                    style={
                        { '--fill': `${fillPercent}%` } as React.CSSProperties
                    }
                />

                <input
                    ref={inputRef}
                    id="epsilon-input"
                    type="text"
                    inputMode="decimal"
                    className={`epsilon-number-input ${exceedsBudget ? 'epsilon-number-input--error' : ''}`}
                    value={inputText}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    disabled={disabled}
                    aria-label="Epsilon value"
                />

                <span className="epsilon-max-label">max {maxBudget.toFixed(2)}</span>
            </div>

            {exceedsBudget && (
                <span className="epsilon-error-msg animate-fade-in">
                    ε exceeds remaining budget ({remainingBudget.toFixed(2)})
                </span>
            )}
        </div>
    );
}
