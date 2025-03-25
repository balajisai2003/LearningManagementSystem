import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-20 w-20 text-primary animate-spin" />
                <p className="text-primary text-sm">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;
