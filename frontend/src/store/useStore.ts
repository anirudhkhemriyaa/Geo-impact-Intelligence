import { create } from 'zustand';

interface GraphState {
  analysisData: any | null;
  isLoading: boolean;
  error: string | null;
  setAnalysisData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<GraphState>((set) => ({
  analysisData: null,
  isLoading: false,
  error: null,
  setAnalysisData: (data) => set({ analysisData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
}));
