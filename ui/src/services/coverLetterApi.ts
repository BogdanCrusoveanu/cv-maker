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

  downloadPdf: async (id: number) => {
    const response = await api.get(`/cover-letter/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};
