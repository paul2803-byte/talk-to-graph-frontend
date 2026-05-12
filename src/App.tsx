import { useCallback, useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { DataUploadPanel } from './components/data/DataUploadPanel';
import { ChatWindow } from './components/chat/ChatWindow';
import { ChatInput } from './components/chat/ChatInput';
import { BudgetIndicator } from './components/privacy/BudgetIndicator';
import { BudgetResetButton } from './components/privacy/BudgetResetButton';
import { PrivacyToggle } from './components/privacy/PrivacyToggle';
import { useDataUpload } from './hooks/useDataUpload';
import { useBudget } from './hooks/useBudget';
import { useChat } from './hooks/useChat';
import { ping } from './api/client';
import { WifiOff } from 'lucide-react';
import './App.css';

function App() {
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
    const [epsilon, setEpsilon] = useState<number | undefined>(undefined);
    const [privacyMode, setPrivacyMode] = useState<boolean>(true);

    const {
        data,
        jsonText,
        parseError,
        isValid,
        ontologyUrl,
        isReady,
        setJsonText,
        handleFileUpload,
        setOntologyUrl,
    } = useDataUpload();

    const budget = useBudget();
    const chat = useChat(budget.updateFromResponse);

    // Check backend on mount
    useEffect(() => {
        ping().then(setBackendOnline);
    }, []);

    const handleSend = useCallback(
        (question: string) => {
            if (!data || !ontologyUrl) return;
            chat.sendMessage(question, data, ontologyUrl, epsilon, undefined, privacyMode);
        },
        [data, ontologyUrl, chat, epsilon, privacyMode],
    );

    const handleExecuteAdjustedQuery = useCallback(
        (adjustedQuery: string) => {
            if (!data || !ontologyUrl) return;
            const lastUserMsg = chat.conversationHistory.slice().reverse().find(m => m.role === 'user');
            const questionText = lastUserMsg ? lastUserMsg.content : "Executing adjusted SPARQL query...";
            chat.sendMessage(questionText, data, ontologyUrl, epsilon, adjustedQuery, privacyMode);
        },
        [data, ontologyUrl, chat, epsilon, privacyMode],
    );

    const epsilonExceedsBudget =
        epsilon !== undefined && epsilon > budget.remainingBudget;

    const getDisabledReason = (): string | undefined => {
        if (backendOnline === false) return 'Backend is not reachable';
        if (!isValid) return 'Load JSON-LD data first';
        if (!ontologyUrl.trim()) return 'Enter an ontology URL first';
        
        if (privacyMode) {
            if (budget.isExhausted) return 'Privacy budget exhausted';
            if (epsilonExceedsBudget) return 'Epsilon exceeds remaining budget';
        }
        
        return undefined;
    };

    const disabledReason = getDisabledReason();

    return (
        <AppShell
            header={
                <Header>
                    {privacyMode && (
                        <>
                            <BudgetIndicator
                                remainingBudget={budget.remainingBudget}
                                epsilonTotal={budget.epsilonTotal}
                                fraction={budget.budgetFraction}
                                isExhausted={budget.isExhausted}
                                isLoading={budget.isLoading}
                            />
                            <BudgetResetButton onReset={budget.resetBudget} />
                        </>
                    )}
                    <PrivacyToggle privacyMode={privacyMode} onChange={setPrivacyMode} />
                </Header>
            }
            sidebar={
                <DataUploadPanel
                    jsonText={jsonText}
                    parseError={parseError}
                    isValid={isValid}
                    ontologyUrl={ontologyUrl}
                    onJsonTextChange={setJsonText}
                    onFileUpload={handleFileUpload}
                    onOntologyUrlChange={setOntologyUrl}
                />
            }
            main={
                <>
                    {backendOnline === false && (
                        <div className="offline-banner animate-fade-in">
                            <WifiOff size={16} />
                            <span>
                                Backend is not reachable. Please start the server on{' '}
                                <code>{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</code>
                            </span>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => ping().then(setBackendOnline)}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    <ChatWindow
                        conversationHistory={chat.conversationHistory}
                        isLoading={chat.isLoading}
                        lastResponse={chat.lastResponse}
                        onExecuteQuery={handleExecuteAdjustedQuery}
                    />
                    <ChatInput
                        onSend={handleSend}
                        disabled={!isReady || backendOnline === false || (privacyMode && (budget.isExhausted || epsilonExceedsBudget))}
                        disabledReason={disabledReason}
                        isLoading={chat.isLoading}
                        epsilon={epsilon}
                        onEpsilonChange={setEpsilon}
                        remainingBudget={budget.remainingBudget}
                        epsilonBase={budget.epsilonBase}
                        privacyMode={privacyMode}
                    />
                </>
            }
        />
    );
}

export default App;
