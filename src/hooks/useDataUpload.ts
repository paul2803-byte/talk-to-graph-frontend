import { useState, useCallback } from 'react';

interface DataUploadState {
    data: object | null;
    ontologyUrl: string;
    jsonText: string;
    parseError: string | null;
    isValid: boolean;
}

export function useDataUpload() {
    const [state, setState] = useState<DataUploadState>({
        data: null,
        ontologyUrl: '',
        jsonText: '',
        parseError: null,
        isValid: false,
    });

    const setJsonText = useCallback((text: string) => {
        if (!text.trim()) {
            setState((s) => ({
                ...s,
                jsonText: text,
                data: null,
                parseError: null,
                isValid: false,
            }));
            return;
        }

        try {
            const parsed = JSON.parse(text) as object;
            setState((s) => ({
                ...s,
                jsonText: text,
                data: parsed,
                parseError: null,
                isValid: true,
            }));
        } catch (err) {
            setState((s) => ({
                ...s,
                jsonText: text,
                data: null,
                parseError: (err as Error).message,
                isValid: false,
            }));
        }
    }, []);

    const handleFileUpload = useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setJsonText(text);
            };
            reader.readAsText(file);
        },
        [setJsonText],
    );

    const setOntologyUrl = useCallback((url: string) => {
        setState((s) => ({ ...s, ontologyUrl: url }));
    }, []);

    const isReady = state.isValid && state.ontologyUrl.trim().length > 0;

    return {
        ...state,
        isReady,
        setJsonText,
        handleFileUpload,
        setOntologyUrl,
    };
}
