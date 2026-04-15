import { useState } from 'react';
import { FileUploader } from './FileUploader';
import { JsonEditor } from './JsonEditor';
import { OntologyUrlInput } from './OntologyUrlInput';
import { FileText, Code2 } from 'lucide-react';
import './DataUploadPanel.css';

type Tab = 'file' | 'editor';

interface DataUploadPanelProps {
    jsonText: string;
    parseError: string | null;
    isValid: boolean;
    ontologyUrl: string;
    onJsonTextChange: (text: string) => void;
    onFileUpload: (file: File) => void;
    onOntologyUrlChange: (url: string) => void;
}

export function DataUploadPanel({
    jsonText,
    parseError,
    isValid,
    ontologyUrl,
    onJsonTextChange,
    onFileUpload,
    onOntologyUrlChange,
}: DataUploadPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('file');

    return (
        <div className="data-upload-panel">
            <div className="panel-section">
                <h2 className="panel-heading">Data Source</h2>
                <p className="panel-description">
                    Upload JSON-LD data to query against
                </p>

                <div className="tab-bar">
                    <button
                        className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
                        onClick={() => setActiveTab('file')}
                    >
                        <FileText size={14} />
                        File Upload
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('editor')}
                    >
                        <Code2 size={14} />
                        JSON Editor
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'file' ? (
                        <FileUploader onFileUpload={onFileUpload} hasData={isValid} />
                    ) : (
                        <JsonEditor
                            value={jsonText}
                            onChange={onJsonTextChange}
                            error={parseError}
                        />
                    )}
                </div>

                {isValid && (
                    <div className="data-status data-status--valid animate-fade-in">
                        ✓ Valid JSON-LD loaded
                    </div>
                )}
            </div>

            <div className="panel-section">
                <OntologyUrlInput
                    value={ontologyUrl}
                    onChange={onOntologyUrlChange}
                />
            </div>
        </div>
    );
}
