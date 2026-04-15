import { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
    return (
        <>
            <div className="header-brand">
                <Shield size={22} className="header-icon" />
                <h1 className="header-title">Talk to Data</h1>
                <span className="header-badge">DP Protected</span>
            </div>
            <div className="header-actions">{children}</div>
        </>
    );
}
