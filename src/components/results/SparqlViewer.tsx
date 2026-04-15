import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './SparqlViewer.css';

interface SparqlViewerProps {
    query: string;
}

export function SparqlViewer({ query }: SparqlViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(query);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="sparql-viewer">
            <div className="sparql-header">
                <span className="sparql-label">SPARQL</span>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <pre className="sparql-code">
                <code>{query}</code>
            </pre>
        </div>
    );
}
