import './BudgetIndicator.css';

interface BudgetIndicatorProps {
    remainingBudget: number;
    epsilonTotal: number;
    fraction: number;
    isExhausted: boolean;
    isLoading: boolean;
}

export function BudgetIndicator({
    remainingBudget,
    epsilonTotal,
    fraction,
    isExhausted,
    isLoading,
}: BudgetIndicatorProps) {
    const percentage = Math.round(fraction * 100);

    const barColor =
        fraction > 0.5
            ? 'var(--budget-high)'
            : fraction > 0.2
                ? 'var(--budget-mid)'
                : 'var(--budget-low)';

    return (
        <div className={`budget-indicator ${isExhausted ? 'budget-indicator--exhausted' : ''}`}>
            <div className="budget-label">
                <span className="budget-label-text">Privacy Budget</span>
                <span className="budget-label-value">
                    {isLoading
                        ? '...'
                        : `${remainingBudget.toFixed(2)} / ${epsilonTotal.toFixed(2)} ε`}
                </span>
            </div>
            <div className="budget-bar">
                <div
                    className="budget-bar-fill"
                    style={{
                        width: `${percentage}%`,
                        background: barColor,
                    }}
                />
            </div>
            {isExhausted && (
                <span className="budget-exhausted-label">Budget exhausted</span>
            )}
        </div>
    );
}
