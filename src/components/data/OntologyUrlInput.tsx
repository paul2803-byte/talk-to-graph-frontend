import { Globe } from 'lucide-react';
import './OntologyUrlInput.css';

interface OntologyUrlInputProps {
    value: string;
    onChange: (url: string) => void;
}

export function OntologyUrlInput({ value, onChange }: OntologyUrlInputProps) {
    return (
        <div className="ontology-url-input">
            <label className="ontology-label" htmlFor="ontology-url">
                <Globe size={14} />
                Ontology URL
            </label>
            <input
                id="ontology-url"
                type="url"
                className="input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://soya.ownyourdata.eu/YourOntology"
            />
            <span className="ontology-hint">
                The SOYA ontology endpoint (without /yaml suffix)
            </span>
        </div>
    );
}
