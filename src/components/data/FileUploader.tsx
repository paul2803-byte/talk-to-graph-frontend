import { useCallback, useRef, useState } from 'react';
import { Upload, FileCheck } from 'lucide-react';
import './FileUploader.css';

interface FileUploaderProps {
    onFileUpload: (file: File) => void;
    hasData: boolean;
}

export function FileUploader({ onFileUpload, hasData }: FileUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            setFileName(file.name);
            onFileUpload(file);
        },
        [onFileUpload],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    return (
        <div
            className={`file-uploader ${isDragOver ? 'drag-over' : ''} ${hasData ? 'has-data' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".json,.jsonld"
                onChange={handleChange}
                className="file-input-hidden"
            />
            {hasData ? (
                <>
                    <FileCheck size={28} className="file-icon file-icon--success" />
                    <span className="file-label">{fileName ?? 'File loaded'}</span>
                    <span className="file-hint">Click or drop to replace</span>
                </>
            ) : (
                <>
                    <Upload size={28} className="file-icon" />
                    <span className="file-label">Drop a JSON-LD file here</span>
                    <span className="file-hint">or click to browse (.json, .jsonld)</span>
                </>
            )}
        </div>
    );
}
