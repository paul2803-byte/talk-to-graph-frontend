import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './BudgetResetButton.css';

interface BudgetResetButtonProps {
    onReset: () => Promise<void>;
}

export function BudgetResetButton({ onReset }: BudgetResetButtonProps) {
    const [confirming, setConfirming] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleClick = async () => {
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
            return;
        }

        setResetting(true);
        await onReset();
        setResetting(false);
        setConfirming(false);
    };

    return (
        <button
            className={`btn btn-sm ${confirming ? 'btn-danger' : 'btn-ghost'} budget-reset-btn`}
            onClick={handleClick}
            disabled={resetting}
        >
            <RotateCcw size={13} className={resetting ? 'spin-icon' : ''} />
            {confirming ? 'Confirm Reset?' : 'Reset Budget'}
        </button>
    );
}
