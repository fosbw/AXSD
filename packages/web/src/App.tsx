import { useEffect, useState } from 'react';

type Resource = { id: string; name: string; type: string; provider: string; status: string; capabilities: string[] };

export function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { fetch('/api/v1/resources').then(async r => { if (!r.ok) throw new Error('Unable to load resources'); return r.json(); }).then(x => setResources(x.data)).catch(e => setError(e.message)); }, []);
  return <main className="shell"><header><div><span className="eyebrow">AXSD CONTROL PLANE</span><h1>AI resources under your control.</h1><p>Models, agents, tools and environments with policy-aware execution.</p></div><div className="status">● Control plane</div></header><section className="grid"><article><span>Active sessions</span><strong>0</strong></article><article><span>Pending approvals</span><strong>0</strong></article><article><span>Running executions</span><strong>0</strong></article><article><span>Registered resources</span><strong>{resources.length}</strong></article></section><section className="panel"><div className="panel-head"><h2>Resources</h2><span>{resources.length} registered</span></div>{error ? <p role="alert">{error}</p> : resources.length === 0 ? <div className="empty">No resources registered yet. Add one through the API or discovery layer.</div> : <ul>{resources.map(r => <li key={r.id}><div><strong>{r.name}</strong><small>{r.provider} · {r.type}</small></div><span>{r.status}</span></li>)}</ul>}</section></main>;
}