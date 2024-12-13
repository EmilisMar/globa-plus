import { useState, useEffect } from 'react';
import { Visit } from '@/types/data-table';
import { API_GET_Table } from '@/apis/entities/_main.api';
import { useStateUser } from '@/states/user.state';

export const useVisits = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const isWorker = useStateUser((s) => s.user?.role === 'worker');

    const fetchVisits = async () => {
        try {
            setIsLoading(true);
            const response = await API_GET_Table('visits');
            const filteredVisits = isWorker 
                ? (response as Visit[]).filter((visit) => visit.status !== 'APPROVED')
                : response as Visit[];
            setVisits(filteredVisits);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch visits:', error);
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, [isWorker]);

    return { visits, isLoading, error, isWorker, refetch: fetchVisits };
};