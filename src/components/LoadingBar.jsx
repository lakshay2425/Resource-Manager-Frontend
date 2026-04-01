import { Loader2 } from 'lucide-react';

const LoadingBar = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-slate-700 animate-spin mx-auto mb-4" />
                <p className="text-stone-600 text-sm">{message}</p>
            </div>
        </div>
    );
};

export default LoadingBar;
