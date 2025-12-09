import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coverLetterApi } from "../services/coverLetterApi";
import { CoverLetterData } from "../types/coverLetter";

export function useCoverLetters() {
  return useQuery({
    queryKey: ["coverLetters"],
    queryFn: coverLetterApi.getAll,
  });
}

export function useCoverLetter(id: number) {
  return useQuery({
    queryKey: ["coverLetter", id],
    queryFn: () => coverLetterApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CoverLetterData) => coverLetterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
    },
  });
}

export function useUpdateCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CoverLetterData }) =>
      coverLetterApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
      queryClient.invalidateQueries({
        queryKey: ["coverLetter", variables.id],
      });
    },
  });
}

export function useDeleteCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coverLetterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
    },
  });
}
