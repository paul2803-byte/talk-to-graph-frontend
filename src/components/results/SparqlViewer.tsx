import { useState, useEffect } from 'react';
import { Copy, Check, Edit2, Play, X } from 'lucide-react';
import './SparqlViewer.css';

interface SparqlViewerProps {
    query: string;
    onExecuteQuery?: (query: string) => void;
}

export function SparqlViewer({ query, onExecuteQuery }: SparqlViewerProps) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuery, setEditedQuery] = useState(query);

    // Sync query if it changes from outside
    useEffect(() => {
        setEditedQuery(query);
        setIsEditing(false);
    }, [query]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(isEditing ? editedQuery : query);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setIsEditing(false);
            setEditedQuery(query);
        } else {
            setIsEditing(true);
        }
    };

    const handleExecute = () => {
        if (onExecuteQuery && editedQuery.trim() !== '') {
            onExecuteQuery(editedQuery);
            setIsEditing(false);
        }
    };

    return (
        <div className="sparql-viewer">
            <div className="sparql-header">
                <span className="sparql-label">SPARQL</span>
                <div className="sparql-actions">
                    <button className="btn btn-ghost btn-sm" onClick={handleCopy} title="Copy Query">
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    {!isEditing && onExecuteQuery && (
                        <button className="btn btn-ghost btn-sm" onClick={handleEditToggle} title="Edit Query">
                            <Edit2 size={13} />
                            Edit
                        </button>
                    )}
                    {isEditing && (
                        <>
                            <button className="btn btn-ghost btn-sm text-error" onClick={handleEditToggle} title="Cancel Editing">
                                <X size={13} />
                                Cancel
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={handleExecute} title="Execute Query">
                                <Play size={13} />
                                Execute
                            </button>
                        </>
                    )}
                </div>
            </div>
            {isEditing ? (
                <textarea
                    className="sparql-textarea"
                    value={editedQuery}
                    onChange={(e) => setEditedQuery(e.target.value)}
                    spellCheck="false"
                />
            ) : (
                <pre className="sparql-code">
                    <code>{query}</code>
                </pre>
            )}
        </div>
    );
}
