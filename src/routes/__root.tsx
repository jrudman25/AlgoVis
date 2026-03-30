/**
 * __root.tsx
 * Root layout for the application.
 */
import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        AlgoVis
                    </p>
                    <p className="text-sm text-slate-400">
                        Sorting Algorithm Visualizer
                    </p>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export const Route = createRootRoute({
    component: RootLayout,
});
