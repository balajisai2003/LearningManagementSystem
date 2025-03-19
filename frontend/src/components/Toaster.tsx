'use client'

import { Toaster } from "@/components/ui/sonner";


export function ToasterProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster position="top-right" />
        </>
    );
}
