'use client';

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import type { GraphEdge, GraphNode } from '@/types/analysis';

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  disabled?: boolean;
  fallbackMessage?: string;
}

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  disabled = false,
  fallbackMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || disabled) return;

    const safeNodes = Array.isArray(nodes) ? nodes.filter((n) => n?.id) : [];
    const safeEdges = Array.isArray(edges) ? edges : [];

    if (safeNodes.length === 0) return;

    const validNodeIds = new Set(safeNodes.map((n) => n.id));

    const cyNodes = safeNodes.map((n) => ({
      data: {
        id: n.id,
        label: (n.name || n.id).replace(/_/g, ' ').toUpperCase(),
        impact: n.impact_score ?? 0,
        order: n.order ?? 0,
      },
    }));

    const cyEdges = safeEdges
      .filter((e) => e?.source && e?.target)
      .filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map((e, index) => ({
        data: {
          id: e.edge_id || `e${index}`,
          source: e.source,
          target: e.target,
          label: e.type || '',
        },
      }));

    let cy: cytoscape.Core | null = null;
    try {
      cy = cytoscape({
        container: containerRef.current,
        elements: [...cyNodes, ...cyEdges],
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (ele: cytoscape.NodeSingular) => {
                const impact = ele.data('impact') as number;
                if (ele.data('order') === 0) return '#000';
                return impact > 5
                  ? '#10B981'
                  : impact < -5
                    ? '#EF4444'
                    : '#64748B';
              },
              label: 'data(label)',
              color: '#000',
              'font-size': '8px',
              'font-family': 'Inter, sans-serif',
              'font-weight': 800,
              'text-valign': 'bottom',
              'text-margin-y': 6,
              'text-background-opacity': 1,
              'text-background-color': '#fff',
              'text-background-padding': '2px',
              'text-background-shape': 'roundrectangle',
              width: (ele: cytoscape.NodeSingular) =>
                22 + Math.min(Math.abs((ele.data('impact') as number) || 0) / 1.5, 45),
              height: (ele: cytoscape.NodeSingular) =>
                22 + Math.min(Math.abs((ele.data('impact') as number) || 0) / 1.5, 45),
              'border-width': 1.5,
              'border-color': '#000',
              'border-opacity': 0.15,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 1.2,
              'line-color': '#94A3B8',
              'target-arrow-color': '#94A3B8',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              opacity: 0.35,
              'arrow-scale': 0.7,
            },
          },
          {
            selector: 'node[order=0]',
            style: {
              'background-color': '#000',
              color: '#000',
              width: 50,
              height: 50,
              'font-size': '10px',
            },
          },
        ],
        layout: {
          name: safeNodes.length <= 3 ? 'circle' : 'cose',
          animate: safeNodes.length > 2,
          padding: 50,
          fit: true,
          randomize: false,
        },
      });
    } catch (err) {
      console.error('Graph render safeguard:', err);
    }

    return () => {
      if (cy) cy.destroy();
    };
  }, [nodes, edges, disabled]);

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center bg-zinc-50">
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {fallbackMessage ||
            'Graph rendering is disabled due to insufficient verified evidence.'}
        </p>
      </div>
    );
  }

  if (!nodes?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center bg-zinc-50">
        <p className="text-sm text-muted-foreground">
          {fallbackMessage || 'No graph data available for this analysis.'}
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full graph-canvas min-h-[400px]" />;
};

export default GraphView;
