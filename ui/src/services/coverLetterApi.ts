import api from "./api";
import { CoverLetterData } from "../types/coverLetter";

export const coverLetterApi = {
  getAll: async () => {
    const response = await api.get<CoverLetterData[]>("/cover-letter");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<CoverLetterData>(`/cover-letter/${id}`);
    return response.data;
  },

  create: async (data: CoverLetterData) => {
    const response = await api.post<CoverLetterData>("/cover-letter", data);
    return response.data;
  },

  update: async (id: number, data: CoverLetterData) => {
    const response = await api.put(`/cover-letter/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/cover-letter/${id}`);
  },

  share: async (id: number) => {
    const response = await api.post<{ token: string }>(
      `/cover-letter/${id}/share`
    );
    return response.data;
  },

  unshare: async (id: number) => {
    await api.post(`/cover-letter/${id}/unshare`);
  },

  getShared: async (token: string) => {
    const response = await api.get<CoverLetterData>(
      `/cover-letter/shared/${token}`
    );
    return response.data;
  },

  downloadPdf: async (id: number) => {
    const response = await api.get(`/cover-letter/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  rename: async (id: number, title: string) => {
    await api.patch(`/cover-letter/${id}/title`, { title });
  },
};
