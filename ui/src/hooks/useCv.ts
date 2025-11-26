import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { CvData, CvBackendResponse } from '../types/cv';

export const useCvs = () => {
    return useQuery<CvBackendResponse[]>({
        queryKey: ['cvs'],
        queryFn: async () => {
            const response = await api.get('/cv');
            return response.data;
        }
    });
};

export const useCv = (id: string | undefined) => {
    return useQuery<CvBackendResponse | null>({
        queryKey: ['cv', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/cv/${id}`);
            return response.data;
        },
        enabled: !!id
    });
};

export const useSaveCv = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cvData: CvData) => {
            const payload = {
                id: cvData.id || 0,
                title: cvData.title || "My CV",
                data: JSON.stringify(cvData)
            };
            const response = await api.post('/cv', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cv'] });
            queryClient.invalidateQueries({ queryKey: ['cvs'] });
        }
    });
};

export const useDeleteCv = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/cv/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cvs'] });
        }
    });
};
