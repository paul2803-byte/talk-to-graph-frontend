import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageSquare } from 'lucide-react';
import type { ConversationEntry, TalkToDataResponse } from '../../types/types';
import './ChatWindow.css';

interface ChatWindowProps {
    conversationHistory: ConversationEntry[];
    isLoading: boolean;
    lastResponse: TalkToDataResponse | null;
    onExecuteQuery?: (query: string) => void;
}

export function ChatWindow({
    conversationHistory,
    isLoading,
    lastResponse,
    onExecuteQuery,
}: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversationHistory, isLoading]);

    if (conversationHistory.length === 0 && !isLoading) {
        return (
            <div className="chat-window chat-window--empty">
                <div className="chat-empty-state animate-fade-in">
                    <MessageSquare size={48} strokeWidth={1.2} />
                    <h3>Ask a question about your data</h3>
                    <p>
                        Upload your JSON-LD data, set the ontology URL, and start asking
                        natural-language questions. Results are protected by differential
                        privacy.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window" ref={scrollRef}>
            <div className="chat-messages">
                {conversationHistory.map((entry, i) => {
                    // Determine if this is the last assistant message and has results data
                    const isLastAssistant =
                        entry.role === 'assistant' &&
                        i === conversationHistory.length - 1 &&
                        lastResponse;

                    const queryResults =
                        isLastAssistant && lastResponse?.status === 'success'
                            ? lastResponse.data.query_results
                            : undefined;

                    const sparqlQuery =
                        isLastAssistant && lastResponse?.status === 'success'
                            ? lastResponse.data.sparql_query
                            : undefined;

                    const isError =
                        isLastAssistant && lastResponse?.status === 'error';

                    return (
                        <MessageBubble
                            key={i}
                            role={entry.role}
                            content={entry.content}
                            isError={!!isError}
                            queryResults={queryResults}
                            sparqlQuery={sparqlQuery}
                            animationDelay={i * 0.05}
                            onExecuteQuery={onExecuteQuery}
                        />
                    );
                })}

                {isLoading && (
                    <div className="chat-loading animate-fade-in">
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
