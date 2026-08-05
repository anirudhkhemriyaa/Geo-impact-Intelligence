'use client';

import React, { useState } from 'react';
import axios from 'axios';
import {
  Zap,
  Search,
  ShieldCheck,
  AlertCircle,
  Globe,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphView from '@/components/GraphView';
import type { AnalysisResponse } from '@/types/analysis';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const EXAMPLE_QUERIES = [
  'Russia Ukraine war',
  'Red Sea crisis',
  'US China tariffs',
  'HDFC cyber attack',
  'Semiconductor shortage',
  'AI regulation in Europe',
];

export default function MVPPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingTexts = [
    'Validating event against real-world sources…',
    'Collecting multi-source evidence…',
    'Assessing evidence sufficiency…',
    'Building explainable impact graph…',
  ];

  const handleAnalyze = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = (overrideQuery ?? query).trim();
    if (!q) return;
    if (overrideQuery) setQuery(overrideQuery);

    setIsLoading(true);
    setData(null);
    setError(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await axios.post<AnalysisResponse>(
        `${API_URL}/api/events/analyze`,
        { query: q }
      );
      setData(response.data);
      if (!response.data.success && response.data.message) {
        setError(response.data.message);
      }
    } catch {
      setError('Unable to reach the analysis service. Check that the API is running.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const graphEnabled = Boolean(data?.graph?.enabled && (data.graph.nodes?.length ?? 0) > 0);
  const showNoGraphBanner =
    data &&
    (!graphEnabled ||
      data.case === 'event_not_found' ||
      data.case === 'insufficient_evidence');

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 font-sans">
      <header className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">
            GeoImpact Intelligence
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm max-w-lg mx-auto">
          Explainable causal impact analysis for any real-world event — built to
          degrade gracefully when evidence is incomplete.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-20">
        <form onSubmit={handleAnalyze} className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-black transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Enter any event (war, cyber attack, tariffs, floods…)"
            className="w-full bg-white border border-border rounded-2xl py-5 pl-14 pr-36 text-lg focus:outline-none focus:border-black shadow-sm transition-all placeholder:text-muted-foreground font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-3 bottom-3 bg-black text-white px-8 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:bg-zinc-400"
          >
            {isLoading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        {!isLoading && !data && (
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Try:</span>
            {EXAMPLE_QUERIES.slice(0, 4).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAnalyze(undefined, t)}
                className="hover:text-black transition-colors underline decoration-dotted underline-offset-4 normal-case"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-8"
          >
            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
            <motion.p
              key={loadingStep}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm font-black uppercase tracking-[0.2em] text-black"
            >
              {loadingTexts[loadingStep]}
            </motion.p>
            <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: '0%' }}
                animate={{ width: `${(loadingStep + 1) * 25}%` }}
                transition={{ duration: 1.8 }}
              />
            </div>
          </motion.div>
        )}

        {error && !data?.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-6 max-w-md mx-auto"
          >
            <AlertCircle size={48} className="text-destructive mx-auto" />
            <h3 className="text-xl font-bold">{error}</h3>
            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold text-sm"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </motion.div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-32"
          >
            {data.message && (
              <div
                className={`rounded-2xl border p-5 flex gap-3 ${
                  data.case === 'event_not_found' || data.case === 'insufficient_evidence'
                    ? 'bg-amber-50 border-amber-200'
                    : data.case === 'limited_graph' || data.case === 'partial_api'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <Info size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold leading-relaxed">{data.message}</p>
                  {data.evidence_quality && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Evidence sufficiency:{' '}
                      <span className="font-black">{data.evidence_quality.sufficiency}</span>
                      {' · '}
                      Score: {data.evidence_quality.score}
                      {data.evidence_quality.signal_count != null &&
                        ` · Signals: ${data.evidence_quality.signal_count}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {data.event && (
              <section className="bg-white border border-border rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight">{data.event.title}</h2>
                    {data.event.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-secondary">
                        {data.event.category.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        data.event.severity === 'high'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {data.event.severity} severity
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">{data.event.summary}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Globe size={14} /> {data.event.region}
                    </span>
                    <span>{data.event.status}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">
                    Confidence
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">{data.event.confidence}%</span>
                    <ShieldCheck size={20} className="text-success" />
                  </div>
                </div>
              </section>
            )}

            {(data.entities || data.evidence_quality) && showNoGraphBanner && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.entities && (
                  <div className="analyst-card p-5 border border-border rounded-xl bg-white">
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">
                      Discovered Entities
                    </h3>
                    {Object.entries(data.entities).map(([k, vals]) =>
                      vals?.length ? (
                        <p key={k} className="text-xs mb-1">
                          <span className="font-bold capitalize">{k}: </span>
                          {vals.join(', ')}
                        </p>
                      ) : null
                    )}
                  </div>
                )}
                {data.source_health && (
                  <div className="analyst-card p-5 border border-border rounded-xl bg-white">
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-3">
                      Source Health
                    </h3>
                    {Object.entries(data.source_health).map(([src, status]) => (
                      <p key={src} className="text-xs font-mono mb-1">
                        {src}: <span className={status === 'ok' ? 'text-success' : 'text-warning'}>{status}</span>
                      </p>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest">
                Causal Impact Graph
                {data.graph?.mode && (
                  <span className="ml-2 text-muted-foreground font-semibold normal-case">
                    ({data.graph.mode})
                  </span>
                )}
              </h3>
              <div className="bg-white border border-border rounded-3xl h-[560px] relative overflow-hidden shadow-sm">
                <GraphView
                  nodes={data.graph?.nodes ?? []}
                  edges={data.graph?.edges ?? []}
                  disabled={!graphEnabled}
                  fallbackMessage={data.message}
                />
              </div>
            </section>

            {data.impacts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(
                  [
                    ['Directly Affected', data.impacts.direct],
                    ['Indirectly Affected', data.impacts.indirect],
                    ['Beneficiaries', data.impacts.beneficiaries],
                  ] as const
                ).map(([title, items]) => (
                  <section key={title} className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest py-2 border-b border-border">
                      {title}
                    </h3>
                    <div className="space-y-3">
                      {!items?.length && (
                        <p className="text-xs text-muted-foreground italic">
                          No signals at this depth.
                        </p>
                      )}
                      {items?.map((item, i) => (
                        <div
                          key={`${item.id}-${i}`}
                          className="bg-white border border-border rounded-xl p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-black uppercase">
                              {(item.name || item.id).replace(/_/g, ' ')}
                            </h4>
                            <span
                              className={`text-xs font-black ${
                                (item.impact_score ?? 0) > 0
                                  ? 'text-success'
                                  : 'text-destructive'
                              }`}
                            >
                              {(item.impact_score ?? 0) > 0 ? '+' : ''}
                              {item.impact_score ?? 0}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Confidence: {Math.round((item.confidence ?? 0) * 100)}%
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {data.reasoning && data.reasoning.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-center py-4 border-y border-border">
                  Reasoning Chains
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.reasoning.map((item, i) => (
                    <div key={i} className="bg-zinc-50 border border-border rounded-xl p-5">
                      <h4 className="text-[11px] font-black uppercase mb-3 flex items-center gap-2">
                        <Zap size={14} /> {item.id.replace(/_/g, ' ')}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.reasoning_chain?.map((step, si) => (
                          <React.Fragment key={si}>
                            <span className="text-[10px] font-bold bg-white border px-2 py-1 rounded">
                              {step}
                            </span>
                            {si < (item.reasoning_chain?.length ?? 0) - 1 && (
                              <ChevronRight size={12} className="text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.sources && data.sources.length > 0 && (
              <section className="space-y-4 border-t border-border pt-10">
                <h3 className="text-xs font-black uppercase tracking-widest">
                  Verification Sources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.sources.map((source, i) => (
                    <div
                      key={i}
                      className="flex flex-col p-4 bg-white border border-border rounded-xl"
                    >
                      <h4 className="text-[11px] font-black uppercase leading-tight mb-2">
                        {source.title || 'Signal'}
                      </h4>
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-auto pt-2 border-t">
                        <span>{source.source}</span>
                        <span>{source.timestamp || '—'}</span>
                      </div>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-accent inline-flex items-center gap-1 text-[10px] font-bold"
                        >
                          Open <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.suggestions && data.suggestions.length > 0 && (
              <section className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-xs font-black uppercase mb-3">Suggestions</h3>
                <ul className="text-sm space-y-2 list-disc pl-5 text-muted-foreground">
                  {data.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                {data.retry_available && (
                  <button
                    type="button"
                    onClick={() => handleAnalyze()}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                  >
                    <RefreshCw size={14} /> Retry analysis
                  </button>
                )}
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-border py-4 px-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success" /> GRACEFUL_DEGRADATION
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" /> SUFFICIENCY_ENGINE_V2
          </span>
        </div>
        <span className="text-[10px] font-black">GEOIMPACT-PRODUCTION</span>
      </footer>
    </div>
  );
}
