// app/brown-bag-sessions/page.tsx

import { CheckCircle, Calendar, User, Info } from 'lucide-react';

export const metadata = {
    title: 'Brown Bag Sessions',
    description: 'Display brown bag sessions for the L&D team',
};

interface Session {
    requestId: number;
    employeeID: number;
    employeeName: string;
    topicType: string;
    topicName: string;
    agenda: string;
    speakerDescription: string;
    requestDate: string;
}

async function getSessions(): Promise<Session[]> {
    const res = await fetch(
        'https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/BrownBagRequest/Requests',
        { next: { revalidate: 60 } } // Revalidate every 60 seconds if needed
    );
    const json = await res.json();
    return json.data || [];
}

export default async function BrownBagSessionsPage() {
    const sessions = await getSessions();

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Brown Bag Sessions</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                    <div
                        key={session.requestId}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">{session.topicName}</h2>
                            <CheckCircle className="text-green-500" size={20} />
                        </div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <User className="mr-1" size={16} /> {session.employeeName}
                        </p>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <Info className="mr-1" size={16} /> {session.topicType}
                        </p>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <Calendar className="mr-1" size={16} />
                            {new Date(session.requestDate).toLocaleString()}
                        </p>
                        <p className="text-gray-800 mb-4">{session.agenda}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
