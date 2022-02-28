import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: ReactNode }) {
    const { pathname } = useRouter();

    const fullScreenPages = ['/signin', '/signup'];

    if (fullScreenPages.includes(pathname)) {
        return (
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                minWidth: '100vw'
            }}>
                {children}
            </div>
        )
    }

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}