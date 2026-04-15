import { useState } from 'react';
import { ResultTable } from '../results/ResultTable';
import { SparqlViewer } from '../results/SparqlViewer';
import { User, Bot, ChevronDown, ChevronRight } from 'lucide-react';
import type { QueryResultRow } from '../../types/types';
import './MessageBubble.css';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
    queryResults?: QueryResultRow[];
    sparqlQuery?: string;
    animationDelay?: number;
}

export function MessageBubble({
    role,
    content,
    isError,
    queryResults,
    sparqlQuery,
    animationDelay = 0,
}: MessageBubbleProps) {
    const [showResults, setShowResults] = useState(false);
    const [showSparql, setShowSparql] = useState(false);
    const isUser = role === 'user';

    return (
        <div
            className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'} ${isError ? 'message-bubble--error' : ''}`}
            style={{ animationDelay: `${animationDelay}s` }}
        >
            <div className="message-avatar">
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="message-content">
                <div className="message-text">{content}</div>

                {(queryResults || sparqlQuery) && (
                    <div className="message-extras">
                        {queryResults && queryResults.length > 0 && (
                            <div className="message-expandable">
                                <button
                                    className="expand-btn"
                                    onClick={() => setShowResults((v) => !v)}
                                >
                                    {showResults ? (
                                        <ChevronDown size={14} />
                                    ) : (
                                        <ChevronRight size={14} />
                                    )}
                                    Raw Data ({queryResults.length} row
                                    {queryResults.length !== 1 ? 's' : ''})
                                </button>
                                {showResults && (
                                    <div className="animate-fade-in">
                                        <ResultTable rows={queryResults} />
                                    </div>
                                )}
                            </div>
                        )}

                        {sparqlQuery && (
                            <div className="message-expandable">
                                <button
                                    className="expand-btn"
                                    onClick={() => setShowSparql((v) => !v)}
                                >
                                    {showSparql ? (
                                        <ChevronDown size={14} />
                                    ) : (
                                        <ChevronRight size={14} />
                                    )}
                                    SPARQL Query
                                </button>
                                {showSparql && (
                                    <div className="animate-fade-in">
                                        <SparqlViewer query={sparqlQuery} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
