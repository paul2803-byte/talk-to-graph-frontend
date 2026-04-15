import { useState, useCallback } from 'react';
import { talkToData } from '../api/client';
import type {
    ConversationEntry,
    TalkToDataResponse,
    TalkToDataSuccessResponse,
} from '../types/types';

interface ChatState {
    conversationHistory: ConversationEntry[];
    sessionId: string | null;
    isLoading: boolean;
    lastResponse: TalkToDataResponse | null;
}

export function useChat(
    onBudgetUpdate: (remaining: number) => void,
) {
    const [state, setState] = useState<ChatState>({
        conversationHistory: [],
        sessionId: null,
        isLoading: false,
        lastResponse: null,
    });

    const sendMessage = useCallback(
        async (question: string, data: object, ontologyUrl: string) => {
            // Optimistically add user message
            setState((s) => ({
                ...s,
                isLoading: true,
                conversationHistory: [
                    ...s.conversationHistory,
                    { role: 'user', content: question },
                ],
            }));

            try {
                const response = await talkToData({
                    question,
                    data,
                    ontology_url: ontologyUrl,
                    sessionId: state.sessionId,
                });

                // Update budget from response
                onBudgetUpdate(response.remainingPrivacyBudget);

                setState((s) => ({
                    ...s,
                    isLoading: false,
                    sessionId: response.sessionId,
                    conversationHistory: response.conversationHistory,
                    lastResponse: response,
                }));

                return response;
            } catch (err) {
                const errorMsg = (err as Error).message || 'An unexpected error occurred.';
                setState((s) => ({
                    ...s,
                    isLoading: false,
                    conversationHistory: [
                        ...s.conversationHistory,
                        { role: 'assistant', content: errorMsg },
                    ],
                }));
                return null;
            }
        },
        [state.sessionId, onBudgetUpdate],
    );

    const resetChat = useCallback(() => {
        setState({
            conversationHistory: [],
            sessionId: null,
            isLoading: false,
            lastResponse: null,
        });
    }, []);

    const lastSuccessData =
        state.lastResponse?.status === 'success'
            ? (state.lastResponse as TalkToDataSuccessResponse).data
            : null;

    return {
        ...state,
        lastSuccessData,
        sendMessage,
        resetChat,
    };
}
