import React from 'react'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

const CardSkimmer = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                    <Skeleton className="h-4 w-1/3" />
                </Card>
            ))}
        </div>
    )
}

export default CardSkimmer