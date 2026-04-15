import { ReactNode } from 'react';
import './AppShell.css';

interface AppShellProps {
    sidebar: ReactNode;
    main: ReactNode;
    header: ReactNode;
}

export function AppShell({ sidebar, main, header }: AppShellProps) {
    return (
        <div className="app-shell">
            <header className="app-header">{header}</header>
            <div className="app-body">
                <aside className="app-sidebar">{sidebar}</aside>
                <main className="app-main">{main}</main>
            </div>
        </div>
    );
}
