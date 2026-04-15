import type { QueryResultRow } from '../../types/types';
import './ResultTable.css';

interface ResultTableProps {
    rows: QueryResultRow[];
}

export function ResultTable({ rows }: ResultTableProps) {
    if (rows.length === 0) return null;

    const columns = Object.keys(rows[0]);

    return (
        <div className="result-table-wrapper">
            <table className="result-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td key={col}>
                                    {typeof row[col] === 'number'
                                        ? (row[col] as number).toLocaleString(undefined, {
                                            maximumFractionDigits: 4,
                                        })
                                        : String(row[col])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
