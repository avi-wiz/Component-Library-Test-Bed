// ── Geographic Map ─────────────────────────────────────────────────────────
const REGION_POS = {
  'Northeast': { cx: 0.88, cy: 0.22 }, 'Southeast': { cx: 0.76, cy: 0.65 }, 'Midwest': { cx: 0.55, cy: 0.32 },
  'Southwest': { cx: 0.3, cy: 0.65 }, 'West': { cx: 0.12, cy: 0.45 }, 'Northwest': { cx: 0.12, cy: 0.22 },
  'Mountain': { cx: 0.28, cy: 0.4 }, 'Plains': { cx: 0.45, cy: 0.45 }, 'Great Lakes': { cx: 0.6, cy: 0.25 },
  'Mid-Atlantic': { cx: 0.82, cy: 0.38 }, 'New England': { cx: 0.9, cy: 0.15 }, 'South Central': { cx: 0.48, cy: 0.7 },
  'California': { cx: 0.08, cy: 0.5 }, 'Texas': { cx: 0.38, cy: 0.72 }, 'New York': { cx: 0.84, cy: 0.24 },
  'Florida': { cx: 0.74, cy: 0.8 }, 'Illinois': { cx: 0.58, cy: 0.38 }, 'Pennsylvania': { cx: 0.78, cy: 0.32 },
  'Ohio': { cx: 0.68, cy: 0.34 }, 'Georgia': { cx: 0.7, cy: 0.62 }, 'Michigan': { cx: 0.63, cy: 0.24 },
  'North Carolina': { cx: 0.73, cy: 0.5 }, 'Washington': { cx: 0.1, cy: 0.16 }, 'Arizona': { cx: 0.22, cy: 0.65 },
  'Virginia': { cx: 0.77, cy: 0.42 }, 'Massachusetts': { cx: 0.88, cy: 0.19 }, 'Indiana': { cx: 0.63, cy: 0.4 },
  'Tennessee': { cx: 0.65, cy: 0.55 }, 'Missouri': { cx: 0.54, cy: 0.48 },
};

const GeoMap = ({ regions, metric, colorScale, mapType }) => {
  const svgRef = useRef(null);
  const [usMap, setUsMap] = useState(null);
  const [mapErr, setMapErr] = useState(null);
  const [loading, setLoading] = useState(mapType === 'state');

  const vals = regions.map(r => r.value);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const getColor = (val) => {
    const t = maxV === minV ? 1 : (val - minV) / (maxV - minV);
    const from = (colorScale && colorScale.min) || '#1a2060', to = (colorScale && colorScale.max) || '#7c8fff';
    const f = (s, i) => parseInt(s.slice(1 + i, 3 + i), 16);
    const lerp = (a, b) => Math.round(a + (b - a) * t);
    const r = lerp(f(from, 0), f(to, 0)), g = lerp(f(from, 2), f(to, 2)), b = lerp(f(from, 4), f(to, 4));
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    if (mapType !== 'state') { setLoading(false); return; }
    setLoading(true);
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(r => r.json())
      .then(us => { setUsMap(us); setLoading(false); })
      .catch(() => { setMapErr('Could not load map data (requires network)'); setLoading(false); });
  }, [mapType]);

  useEffect(() => {
    if (mapType !== 'state' || !usMap || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const proj = d3.geoAlbersUsa().scale(800).translate([300, 190]);
    const path = d3.geoPath().projection(proj);
    const features = topojson.feature(usMap, usMap.objects.states).features;
    const lookup = {}; regions.forEach(r => { lookup[r.regionName] = r.value; });
    const nameById = {};
    (usMap.objects.states.geometries || []).forEach(g => { nameById[g.id] = (g.properties && g.properties.name); });
    svg.selectAll('path').data(features).join('path')
      .attr('d', path)
      .attr('fill', d => { const n = nameById[d.id] || (d.properties && d.properties.name); return lookup[n] != null ? getColor(lookup[n]) : 'var(--border)'; })
      .attr('stroke', 'var(--border)').attr('stroke-width', 0.5)
      .append('title').text(d => { const n = nameById[d.id] || ''; return lookup[n] != null ? `${n}: ${formatVal(lookup[n], 'currency')}` : n; });
  }, [usMap, regions, mapType]);

  if (mapType === 'region') {
    const W = 600, H = 360;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: 360 }}>
        <rect width={W} height={H} rx={8} fill="var(--surface)" />
        <text x={W / 2} y={26} textAnchor="middle" fill="var(--text3)" fontSize={11} fontFamily="JetBrains Mono">Region Bubble Map — {metric}</text>
        {regions.map((r, i) => {
          const pos = REGION_POS[r.regionName] || { cx: 0.5, cy: 0.5 };
          const cx = pos.cx * W, cy = pos.cy * H;
          const t = maxV === minV ? 0.5 : (r.value - minV) / (maxV - minV);
          const radius = 12 + t * 38;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={radius} fill={getColor(r.value)} fillOpacity={0.8} stroke="var(--border)" strokeWidth={1} />
              <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={Math.max(8, radius * 0.38)} fontWeight={600} fontFamily="Poppins">{r.regionName}</text>
              <text x={cx} y={cy + radius + 13} textAnchor="middle" fill="var(--text2)" fontSize={9.5} fontFamily="JetBrains Mono">{formatVal(r.value, 'currency')}</text>
            </g>
          );
        })}
      </svg>
    );
  }
  if (loading) return <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 12 }}>Loading US map data…</div>;
  if (mapErr) return <div style={{ padding: 16, color: '#fca5a5', fontSize: 12, fontFamily: 'JetBrains Mono', background: 'rgba(239,68,68,.07)', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)' }}>{mapErr}</div>;
  return (
    <div>
      <svg ref={svgRef} viewBox="0 0 600 380" style={{ width: '100%', maxHeight: 380, display: 'block' }} />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10, fontSize: 10.5, fontFamily: 'JetBrains Mono', color: 'var(--text2)' }}>
        <span>Metric: {metric}</span>
        {regions.map((r, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: getColor(r.value), display: 'inline-block' }} />
            {r.regionName}: {formatVal(r.value, 'currency')}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── CH-001: Line Chart ────────────────────────────────────────────────────
const renderLineChart = (data) => {
  const { series = [], yAxis, annotations = [] } = data;
  const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
  const chartData = allX.map(x => {
    const row = { x }; series.forEach(s => { const pt = s.data.find(d => d.x === x); row[s.name] = (pt && pt.y); }); return row;
  });
  const fmtY = v => (yAxis && yAxis.format === 'currency') ? `$${(v / 1000).toFixed(0)}K` : (yAxis && yAxis.format === 'percent') ? `${v}%` : (v && v.toLocaleString ? v.toLocaleString() : v);
  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color || COLORS[i]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={s.color || COLORS[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis tickFormatter={fmtY} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {annotations.map((a, i) => <ReferenceLine key={i} x={a.x} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: a.label, fill: '#f59e0b', fontSize: 10, position: 'top' }} />)}
          {series.map((s, i) => [
            <Area key={`a${i}`} type="monotone" dataKey={s.name} fill={`url(#lg${i})`} stroke="none" />,
            <Line key={`l${i}`} type="monotone" dataKey={s.name} stroke={s.color || COLORS[i]} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ])}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── CH-002: Bar Chart ─────────────────────────────────────────────────────
const renderBarChart = (data, cfg) => {
  const { data: bd = [], series, yAxis } = data;
  const orientation = (cfg && cfg.orientation) || data.orientation || 'vertical';
  const fmtY = v => (yAxis && yAxis.format === 'currency') ? `$${(v / 1000).toFixed(0)}K` : (v && v.toLocaleString ? v.toLocaleString() : v);
  if (orientation === 'horizontal') return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={bd} layout="vertical" margin={{ top: 5, right: 50, left: 90, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={fmtY} />
        <YAxis dataKey="category" type="category" width={85} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        {series ? series.map((s, i) => <Bar key={i} dataKey={s.name} fill={s.color || COLORS[i]} radius={[0, 4, 4, 0]} />)
          : <Bar dataKey="value" radius={[0, 4, 4, 0]}>{bd.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />)}<LabelList dataKey="value" position="right" formatter={v => fmtY(v)} style={{ fill: 'var(--text2)', fontSize: 10.5 }} /></Bar>}
      </BarChart>
    </ResponsiveContainer>
  );
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={bd} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis tickFormatter={fmtY} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {series ? series.map((s, i) => <Bar key={i} dataKey={s.name} stackId={data.grouping === 'stacked' ? 'a' : undefined} fill={s.color || COLORS[i]} radius={[4, 4, 0, 0]} />)
          : <Bar dataKey="value" radius={[4, 4, 0, 0]}>{bd.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />)}<LabelList dataKey="value" position="top" formatter={v => fmtY(v)} style={{ fill: 'var(--text2)', fontSize: 10.5 }} /></Bar>}
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── CH-003: Donut / Pie ───────────────────────────────────────────────────
const renderDonut = (data) => {
  let { segments = [], centerLabel, showLegend = true } = data;
  if (segments.length > 6) {
    const top5 = segments.slice(0, 5), rest = segments.slice(5);
    segments = [...top5, { label: 'Other', value: rest.reduce((s, d) => s + d.value, 0), color: 'var(--text3)' }];
  }
  const total = segments.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie data={segments} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius="54%" outerRadius="74%" paddingAngle={3}>
              {segments.map((s, i) => <Cell key={i} fill={s.color || COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{centerLabel.value}</div>
            <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>{centerLabel.subtitle}</div>
          </div>
        )}
      </div>
      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segments.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color || COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text2)', minWidth: 80 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace' }}>{((s.value / total) * 100).toFixed(1)}%</span>
              <span style={{ fontSize: 10.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace' }}>({s.value.toLocaleString()})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── CH-004: Geographic Map (wrapper) ──────────────────────────────────────
const renderGeoMap = (data, cfg) => <GeoMap {...data} mapType={(cfg && cfg.mapType) || data.mapType || 'state'} />;

// ── CH-005: Funnel Chart ──────────────────────────────────────────────────
const renderFunnel = (data) => {
  const { stages = [], metric } = data;
  const maxV = Math.max(...stages.map(s => s.value));
  return (
    <div style={{ padding: '0 20px' }}>
      {stages.map((s, i) => (
        <div key={i}>
          {i > 0 && <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', margin: '4px 0' }}>↓ {s.conversionRate ? `${s.conversionRate}% conversion` : ''}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <div style={{ width: `${Math.max((s.value / maxV) * 100, 18)}%`, background: `linear-gradient(135deg,${COLORS[i % COLORS.length]}bb,${COLORS[i % COLORS.length]})`, borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{s.name}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>{s.value.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginTop: 10 }}>Unit: {metric}</div>
    </div>
  );
};

// ── CH-006: Gauge ─────────────────────────────────────────────────────────
const renderGauge = (data) => {
  const { value, max, label, format, thresholds = [] } = data;
  const pct = Math.min(Math.max((value || 0) / (max || 100), 0), 1);
  const cx = 150, cy = 120, r = 90, sw = 18;
  const toXY = deg => ({ x: cx + r * Math.cos(deg * Math.PI / 180), y: cy + r * Math.sin(deg * Math.PI / 180) });
  const arc = (a1, a2) => {
    if (Math.abs(a2 - a1) < 0.01) return '';
    const s = toXY(a1), e = toXY(a2), la = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${la} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };
  const startA = -180, totalA = 179.9, fillA = startA + pct * totalA;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let fillColor = COLORS[0];
  for (const t of sorted) { if ((value || 0) >= t.value) fillColor = t.color; }
  const fv = v => formatVal(v, format);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
      <svg width={300} height={180} viewBox="0 0 300 180" style={{ overflow: 'visible' }}>
        <path d={arc(-180, 0)} fill="none" stroke="var(--border)" strokeWidth={sw} strokeLinecap="round" />
        {sorted.map((t, i) => {
          const nextObj = sorted[i + 1], nv = (nextObj && nextObj.value != null ? nextObj.value : max), ta1 = startA + (t.value / max) * totalA, ta2 = startA + (nv / max) * totalA;
          return <path key={i} d={arc(ta1, ta2)} fill="none" stroke={t.color + '25'} strokeWidth={sw} />;
        })}
        <path d={arc(-180, fillA)} fill="none" stroke={fillColor} strokeWidth={sw} strokeLinecap="round" />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--text)" fontSize={28} fontWeight={800} fontFamily="Satoshi,sans-serif">{fv(value)}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text3)" fontSize={11} fontFamily="JetBrains Mono,monospace">{label}</text>
        <text x={35} y={cy + 10} textAnchor="middle" fill="var(--text3)" fontSize={10}>{fv(0)}</text>
        <text x={265} y={cy + 10} textAnchor="middle" fill="var(--text3)" fontSize={10}>{fv(max)}</text>
      </svg>
      {thresholds.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
          {sorted.map((t, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />{t.label}: {fv(t.value)}+
          </div>)}
        </div>
      )}
    </div>
  );
};

// ── CH-007: Sparkline ─────────────────────────────────────────────────────
const renderSparkline = (data) => {
  const { data: vals = [], color = '#5b6af0', showEndDot = true } = data;
  const nums = vals.map(v => parseFloat(v) || 0);
  const min = Math.min(...nums), max = Math.max(...nums), last = nums[nums.length - 1], first = nums[0];
  return (
    <div>
      <div className="preview-note">⚠ Preview mode — rendered at 80px (spec: 24–40px when embedded in a Metric Card)</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        {[{ l: 'Current', v: last, c: 'var(--text)' }, { l: 'Peak', v: max, c: '#22c78a' }, { l: 'Trough', v: min, c: '#ef4444' }, { l: 'Trend', v: last >= first ? '▲ Up' : '▼ Down', c: last >= first ? '#22c78a' : '#ef4444' }].map((s, i) => (
          <div key={i} style={{ background: '#181b23', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 20, fontWeight: 800, color: s.c }}>{typeof s.v === 'number' ? s.v.toLocaleString() : s.v}</div>
            <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px', background: '#181b23', borderRadius: 10, border: '1px solid var(--border)' }}>
        <SparklineInline data={nums} color={color} height={80} showEndDot={showEndDot} />
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text3)', marginTop: 8, fontFamily: 'JetBrains Mono,monospace', textAlign: 'center' }}>
        {nums.length} points · min {min.toLocaleString()} · max {max.toLocaleString()}
      </div>
    </div>
  );
};

// ── CH-008: Calendar Heatmap ──────────────────────────────────────────────
const renderHeatmap = (data) => {
  const { data: entries = [] } = data;
  if (!entries.length) return null;
  const lookup = {};
  entries.forEach(e => { lookup[e.date] = e.value; });
  const maxV = Math.max(...entries.map(e => e.value));
  const days = [];
  const s = new Date(entries[0].date), e = new Date(entries[entries.length - 1].date);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) days.push(new Date(d).toISOString().split('T')[0]);
  const firstDay = new Date(days[0]), startOffset = firstDay.getDay();
  const grid = []; let week = new Array(startOffset).fill(null);
  days.forEach(d => { week.push(d); if (week.length === 7) { grid.push(week); week = []; } });
  if (week.length) { while (week.length < 7) week.push(null); grid.push(week); }
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const getC = (val) => { if (!val) return '#181b23'; const t = maxV ? val / maxV : 0; return `rgba(91,106,240,${0.1 + t * 0.85})`; };
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <div style={{ width: 16, display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18 }}>
          {dayLabels.map((d, i) => <div key={i} style={{ height: 16, fontSize: 9, color: 'var(--text3)', textAlign: 'center', lineHeight: '16px', fontFamily: 'JetBrains Mono,monospace' }}>{i % 2 === 0 ? d : ''}</div>)}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 14 }} />
            {week.map((d, di) => (
              <div key={di} title={d ? `${d}: ${lookup[d] || 0}` : ''} style={{ width: 16, height: 16, borderRadius: 3, background: d ? getC(lookup[d]) : '#181b23', border: '1px solid var(--border)', opacity: d ? 1 : 0.25, cursor: d ? 'pointer' : 'default' }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 10, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace' }}>
        Less {[0, .2, .4, .6, .8, 1].map((v, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 2, background: `rgba(91,106,240,${0.1 + v * 0.85})` }} />)} More
      </div>
    </div>
  );
};

// ── CH-009: Stacked Area ──────────────────────────────────────────────────
const renderStackedArea = (data, cfg) => {
  const { series = [], yAxis } = data;
  const stacked = (cfg && cfg.stacked) !== false;
  const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
  const chartData = allX.map(x => { const row = { x }; series.forEach(s => { const pt = s.data.find(d => d.x === x); row[s.name] = (pt && pt.y); }); return row; });
  const fmtY = v => (yAxis && yAxis.format === 'currency') ? `$${(v / 1000).toFixed(0)}K` : (v && v.toLocaleString ? v.toLocaleString() : v);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" /><YAxis tickFormatter={fmtY} />
        <Tooltip content={<CustomTooltip />} /><Legend />
        {series.map((s, i) => <Area key={s.name} type="monotone" dataKey={s.name} stackId={stacked ? 'a' : undefined} stroke={s.color || COLORS[i]} fill={(s.color || COLORS[i]) + '30'} strokeWidth={2} />)}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ── CH-010: Waterfall ─────────────────────────────────────────────────────
const renderWaterfall = (data) => {
  const { steps = [], format } = data;
  let running = 0;
  const cd = steps.map(s => {
    const val = s.value || 0, base = s.type === 'total' ? 0 : running;
    if (s.type !== 'total') running += val; else running = val;
    return { name: s.label, value: s.type === 'total' ? val : Math.abs(val), base: s.type === 'total' ? 0 : Math.min(base, base + val), isNeg: val < 0, isTotal: s.type === 'total', raw: val };
  });
  const fmtY = v => format === 'currency' ? `$${(v / 1000).toFixed(0)}K` : (v && v.toLocaleString ? v.toLocaleString() : v);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={cd} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10.5 }} /><YAxis tickFormatter={fmtY} />
        <Tooltip content={({ active, payload, label }) => {
          if (!active || !(payload && payload.length)) return null;
          const d = cd.find(c => c.name === label);
          return <div style={{ background: '#181b23', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 13px', fontSize: 12 }}>
            <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
            <div style={{ color: 'var(--text)', fontWeight: 600 }}>{fmtY(d && d.raw)}</div>
          </div>;
        }} />
        <Bar dataKey="base" fill="transparent" stackId="a" />
        <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
          {cd.map((d, i) => <Cell key={i} fill={d.isTotal ? '#5b6af0' : d.isNeg ? '#ef4444' : '#22c78a'} />)}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// ── CH-011: Horizontal Leaderboard ───────────────────────────────────────
const renderLeaderboard = (data) => {
  const { entries = [], metric, format } = data;
  const maxV = Math.max(...entries.map(e => e.value || 0));
  const fv = v => formatVal(v, format);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10.5, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace' }}>
        <span>Rank · Name</span><span>{metric}</span>
      </div>
      {entries.map((e, i) => {
        const pct = maxV ? (e.value || 0) / maxV * 100 : 0, intensity = 1 - i / (entries.length - 1 || 1) * 0.5;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `rgba(91,106,240,${0.15 + i * 0.02})`, border: '1px solid rgba(91,106,240,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: '#7c8fff', fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{e.rank || i + 1}</div>
            <div style={{ width: 100, fontSize: 11.5, color: 'var(--text2)', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.label}</div>
            <div style={{ flex: 1, height: 28, background: '#181b23', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `rgba(91,106,240,${intensity})`, borderRadius: 6, transition: 'width .6s ease' }} />
              <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--text)', fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{fv(e.value)}</div>
            </div>
            {e.meta && <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{e.meta}</div>}
          </div>
        );
      })}
    </div>
  );
};
