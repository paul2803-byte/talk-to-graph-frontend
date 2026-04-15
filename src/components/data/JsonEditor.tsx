import './JsonEditor.css';

interface JsonEditorProps {
    value: string;
    onChange: (text: string) => void;
    error: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
    return (
        <div className="json-editor">
            <textarea
                className={`input json-textarea ${error ? 'json-textarea--error' : ''}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='{\n  "@context": { ... },\n  "@graph": [ ... ]\n}'
                spellCheck={false}
                rows={10}
            />
            {error && (
                <div className="json-error animate-fade-in">
                    <span className="json-error-label">Parse Error:</span> {error}
                </div>
            )}
        </div>
    );
}
