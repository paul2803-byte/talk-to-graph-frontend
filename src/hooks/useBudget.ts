import { useState, useCallback, useEffect } from 'react';
import { getPrivacyBudget, resetPrivacyBudget } from '../api/client';

interface BudgetState {
    remainingBudget: number;
    epsilonTotal: number;
    epsilonBase: number;
    isLoading: boolean;
    error: string | null;
}

export function useBudget() {
    const [state, setState] = useState<BudgetState>({
        remainingBudget: 0,
        epsilonTotal: 0,
        epsilonBase: 0,
        isLoading: true,
        error: null,
    });

    const fetchBudget = useCallback(async () => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        try {
            const data = await getPrivacyBudget();
            setState({
                remainingBudget: data.remaining_budget,
                epsilonTotal: data.epsilon_total,
                epsilonBase: data.epsilon_base,
                isLoading: false,
                error: null,
            });
        } catch (err) {
            setState((s) => ({
                ...s,
                isLoading: false,
                error: (err as Error).message,
            }));
        }
    }, []);

    const updateFromResponse = useCallback((remainingBudget: number) => {
        setState((s) => ({ ...s, remainingBudget }));
    }, []);

    const resetBudget = useCallback(async () => {
        try {
            const data = await resetPrivacyBudget();
            setState((s) => ({
                ...s,
                remainingBudget: data.remaining_budget,
                error: null,
            }));
        } catch (err) {
            setState((s) => ({
                ...s,
                error: (err as Error).message,
            }));
        }
    }, []);

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);

    const budgetFraction =
        state.epsilonTotal > 0
            ? state.remainingBudget / state.epsilonTotal
            : 0;

    const isExhausted = state.remainingBudget <= 0 && state.epsilonTotal > 0;

    return {
        ...state,
        budgetFraction,
        isExhausted,
        fetchBudget,
        updateFromResponse,
        resetBudget,
    };
}
