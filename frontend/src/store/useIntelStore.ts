import { create } from 'zustand';

interface IntelNode {
  id: string;
  impact_score: number;
  confidence: number;
  explanation: string;
  citations: string[];
  reasoning_chain: string[];
}

interface IntelData {
  event_id: string;
  summary: string;
  category: string;
  mechanisms: string[];
  severity: string;
  nodes: IntelNode[];
}

interface IntelState {
  currentAnalysis: IntelData | null;
  isLoading: boolean;
  error: string | null;
  setAnalysis: (data: IntelData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useIntelStore = create<IntelState>((set) => ({
  currentAnalysis: null,
  isLoading: false,
  error: null,
  setAnalysis: (data) => set({ currentAnalysis: data, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading, error: null }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () => set({ currentAnalysis: null, error: null, isLoading: false }),
}));
