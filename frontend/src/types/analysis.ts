export type AnalysisCase =
  | 'verified'
  | 'event_not_found'
  | 'insufficient_evidence'
  | 'limited_graph'
  | 'partial_api'
  | 'invalid_query'
  | 'system_error';

export type SufficiencyLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export interface GraphNode {
  id: string;
  name?: string;
  impact_score?: number;
  confidence?: number;
  explanation?: string;
  order?: number;
  reasoning_chain?: string[];
  citations?: string[];
}

export interface GraphEdge {
  edge_id?: string;
  source: string;
  target: string;
  type?: string;
}

export interface AnalysisResponse {
  success: boolean;
  case?: AnalysisCase;
  message?: string;
  event?: {
    title: string;
    category?: string;
    severity: string;
    region: string;
    status: string;
    confidence: number;
    summary: string;
    geographic_scope?: string[];
  };
  evidence_quality?: {
    sufficiency: SufficiencyLevel;
    score: number;
    explanation: string;
    signal_count?: number;
    independent_sources?: number;
    relevance_pct?: number;
    verification?: string;
    propagation_mode?: string;
    graph_mode?: string;
  };
  graph?: {
    enabled: boolean;
    mode?: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  entities?: Record<string, string[]>;
  impacts?: {
    direct: GraphNode[];
    indirect: GraphNode[];
    beneficiaries: GraphNode[];
  };
  reasoning?: { id: string; reasoning_chain: string[]; confidence: number }[];
  sources?: { title?: string; source?: string; url?: string; timestamp?: string }[];
  source_health?: Record<string, string>;
  searched_sources?: string[];
  suggestions?: string[];
  retry_available?: boolean;
  error_detail?: string;
}
