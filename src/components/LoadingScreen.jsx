import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

const LoadingScreen = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-stone-50 flex items-center justify-center z-50">
                <div className="text-center">
                    {/* Logo Animation */}
                    <div className="relative mb-6">
                        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse mx-auto">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Brand Name */}
                    <h1
                        className="text-2xl font-bold text-stone-900 mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        ResourceHub
                    </h1>

                    {/* Loading indicator */}
                    <div className="flex justify-center gap-1 mt-4">
                        <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default LoadingScreen;
