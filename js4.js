// ── renderAlertBanner (complete) ──────────────────────────────────────────
const renderAlertBanner = (data) => {
  const { type = 'info', title: alertTitle, body, dismissible } = data;
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return <div style={{ textAlign: 'center', fontSize: 11, color: '#5a6075', padding: 12 }}>Banner dismissed ✓</div>;
  const icons = { info: 'ℹ️', warning: '⚠️', error: '🚨', success: '✅' };
  const titleColors = { info: '#38bdf8', warning: '#f59e0b', error: '#ef4444', success: '#22c78a' };
  return (
    <div className={`alert-banner ${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <div style={{ flex: 1 }}>
        <div className="alert-title" style={{ color: titleColors[type] }}>{alertTitle}</div>
        <div className="alert-body">{body}</div>
      </div>
      {dismissible && <span onClick={() => setDismissed(true)} style={{ cursor: 'pointer', color: '#5a6075', fontSize: 18, flexShrink: 0, lineHeight: 1 }}>×</span>}
    </div>
  );
};

// ── UW-017: File Preview Card ─────────────────────────────────────────────
const renderFilePreviewCard = (data) => {
  const { fileName, fileType, fileSize, uploadedDate, actions = [] } = data;
  const fileIcons = { pdf: '📄', png: '🖼️', jpeg: '🖼️', xlsx: '📊', txt: '📝', mp4: '🎬', folder: '📁' };
  const icon = fileIcons[fileType] || '📄';
  const fmtDate = d => { try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; } };
  return (
    <div style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ fontSize: 36, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
          <span>{(fileType ? fileType.toUpperCase() : '')}</span>
          <span>{fileSize}</span>
          <span>Uploaded {fmtDate(uploadedDate)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {actions.map((a, i) => renderAction(a, i))}
      </div>
    </div>
  );
};

// ── UW-018: Permission Matrix ─────────────────────────────────────────────
const renderPermissionMatrix = (data) => {
  const { roleName, modules = [] } = data;
  const [expanded, setExpanded] = useState({ 0: true });
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 16, fontWeight: 800 }}>{roleName}</div>
        <StatusBadge label="Role" variant="special" size="sm" />
      </div>
      {modules.map((mod, mi) => (
        <div key={mi} className="acc-section">
          <div className="acc-hdr" onClick={() => setExpanded(e => ({ ...e, [mi]: !e[mi] }))}>
            <span className="acc-hdr-name">{mod.moduleName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
                {mod.permissions.filter(p => p.enabled).length}/{mod.permissions.length} enabled
              </span>
              <span style={{ color: '#5a6075', fontSize: 12 }}>{expanded[mi] ? '⌄' : '›'}</span>
            </div>
          </div>
          {expanded[mi] && (
            <div className="acc-body">
              {mod.permissions.map((p, pi) => (
                <div key={pi} className="perm-row">
                  <span className="perm-name">{p.name}</span>
                  <span className={p.enabled ? 'perm-icon-y' : 'perm-icon-n'}>{p.enabled ? '✓' : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── UW-019: Import/Export Progress ────────────────────────────────────────
const renderImportExportProgress = (data) => {
  const { operation, entity, status, progress, details, errors = [] } = data;
  const [showErrors, setShowErrors] = useState(false);
  const statusVariant = { in_progress: 'warning', completed: 'success', failed: 'danger', cancelled: 'neutral' };
  const statusLabel = { in_progress: 'In Progress', completed: 'Completed', failed: 'Failed', cancelled: 'Cancelled' };
  const opIcon = operation === 'import' ? '⬇️' : '⬆️';
  const barColor = status === 'failed' ? '#ef4444' : status === 'completed' ? '#22c78a' : '#5b6af0';
  return (
    <div style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{opIcon}</span>
            <span style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 15, fontWeight: 700, textTransform: 'capitalize' }}>{operation} — {entity}</span>
          </div>
          <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>{(details && details.fileName)}</div>
        </div>
        <StatusBadge label={statusLabel[status] || status} variant={statusVariant[status] || 'neutral'} size="md" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 6 }}>
          <span style={{ color: '#8b92a8' }}>{(details && details.processedRows ? details.processedRows.toLocaleString() : '0')} / {(details && details.totalRows ? details.totalRows.toLocaleString() : '0')} rows</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="prog-bar-wrap">
          <div className={`prog-bar-fill ${status === 'in_progress' ? 'animated' : ''}`} style={{ width: `${progress}%`, background: barColor }} />
        </div>
      </div>
      {(details && details.errorCount > 0) && (
        <div>
          <div onClick={() => setShowErrors(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 11.5, color: '#fca5a5', marginTop: 10 }}>
            <span>⚠ {details.errorCount} error{details.errorCount !== 1 ? 's' : ''}</span>
            <span style={{ fontSize: 10 }}>{showErrors ? '▲' : '▼'}</span>
          </div>
          {showErrors && errors.length > 0 && (
            <div style={{ marginTop: 8, background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 7, padding: '10px 12px' }}>
              {errors.map((e, i) => (
                <div key={i} style={{ fontSize: 10.5, color: '#fca5a5', fontFamily: 'JetBrains Mono,monospace', marginBottom: 3 }}>• {e}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── UW-020: Segment Definition ────────────────────────────────────────────
const renderSegmentDefinition = (data) => {
  const { segmentName, segmentType, includeRules = [], excludeRules = [], matchMode, memberCount } = data;
  const RuleRow = ({ rule }) => (
    <div className="seg-rule">
      <span className="seg-pill cond">{rule.condition}</span>
      <span className="seg-pill op">{rule.operator}</span>
      {rule.values.map((v, i) => <span key={i} className="seg-pill val">{v}</span>)}
    </div>
  );
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 16, fontWeight: 800 }}>{segmentName}</div>
        <StatusBadge label={segmentType} variant="info" size="sm" />
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 24, fontWeight: 800, color: '#5b6af0' }}>{(memberCount ? memberCount.toLocaleString() : '0')}</div>
          <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>MEMBERS</div>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontSize: 11, color: '#5a6075' }}>
        Match <b style={{ color: '#e8eaf0' }}>{(matchMode ? matchMode.toUpperCase() : '')}</b> of the following conditions
      </div>
      {includeRules.length > 0 && (
        <div style={{ background: 'rgba(34,199,138,.05)', border: '1px solid rgba(34,199,138,.2)', borderRadius: 9, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22c78a', marginBottom: 8, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8 }}>✓ Include if</div>
          {includeRules.map((r, i) => <RuleRow key={i} rule={r} />)}
        </div>
      )}
      {excludeRules.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 9, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', marginBottom: 8, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8 }}>✕ Exclude if</div>
          {excludeRules.map((r, i) => <RuleRow key={i} rule={r} />)}
        </div>
      )}
    </div>
  );
};

// ── UW-021: Discount Summary ──────────────────────────────────────────────
const renderDiscountSummary = (data) => {
  const { name, type, status, promotionCode, application, channels = [], customerEligibility, productEligibility, discountValue, schedule, campaignLimit } = data;
  const Row = ({ label, value, mono }) => (
    <div style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid #1e2130' }}>
      <span style={{ fontSize: 11.5, color: '#5a6075', minWidth: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11.5, color: '#e8eaf0', fontFamily: mono ? 'JetBrains Mono,monospace' : undefined }}>{value}</span>
    </div>
  );
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 17, fontWeight: 800 }}>{name}</div>
        {status && <StatusBadge {...status} />}
        <StatusBadge label={type} variant="info" size="sm" />
      </div>
      <Row label="Application" value={application ? application.charAt(0).toUpperCase() + application.slice(1) : ''} />
      {promotionCode && <Row label="Promo Code" value={promotionCode} mono />}
      <Row label="Channels" value={channels.join(', ')} />
      <Row label="Customer Eligibility" value={customerEligibility} />
      <Row label="Product Eligibility" value={productEligibility} />
      <Row label="Schedule" value={`${(schedule && schedule.start)}  →  ${(schedule && schedule.end)}`} mono />
      <Row label="Campaign Limit" value={campaignLimit} />
      {(discountValue && discountValue.tiers && discountValue.tiers.length > 0) && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>Tiered Discount Structure</div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #252935' }}>
            <table className="tbl">
              <thead><tr><th>Min Qty</th><th>Max Qty</th><th>Discount</th></tr></thead>
              <tbody>
                {discountValue.tiers.map((t, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{t.minQty}</td>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{(t.maxQty != null ? t.maxQty : '∞')}</td>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: '#22c78a' }}>{t.value}{discountValue.type === 'percent' ? '%' : ' off'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ── UW-022: Workflow Status ───────────────────────────────────────────────
const renderWorkflowStatus = (data) => {
  const { workflowName, status, startTime, endTime, nodes = [] } = data;
  const fmtDate = d => { try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };
  const nodeIcons = { completed: '✓', running: '⟳', failed: '✕', pending: '○', skipped: '⤷' };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 16, fontWeight: 800 }}>{workflowName}</div>
        {status && <StatusBadge {...status} />}
      </div>
      <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginBottom: 24 }}>
        Started {fmtDate(startTime)}{endTime ? ` · Ended ${fmtDate(endTime)}` : ' · Running now'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {nodes.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '0 6px' }}>
              <div className={`wf-node-circle ${node.status}`}>
                <span style={{ fontSize: 14 }}>{nodeIcons[node.status] || '○'}</span>
              </div>
              <div className="wf-node-name">{node.name}</div>
              <div style={{ fontSize: 9, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>{node.type}</div>
            </div>
            {i < nodes.length - 1 && <span className="wf-arrow">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── UW-023: Recurring Payment ─────────────────────────────────────────────
const renderRecurringPayment = (data) => {
  const { name, customer, status, amount, frequency, dates, paymentMethod } = data;
  const fmtDate = d => { try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; } };
  const start = new Date(dates && dates.start), next = new Date(dates && dates.nextBilling), end = new Date(dates && dates.end);
  const totalMs = end - start || 1;
  const nextPct = Math.min(Math.max(((next - start) / totalMs) * 100, 0), 100).toFixed(0);
  return (
    <div style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#5a6075' }}>{customer}</div>
        </div>
        {status && <StatusBadge {...status} />}
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { lbl: 'Payable Amount', v: `$${(amount && amount.payable ? amount.payable.toLocaleString() : '0')} ${(amount && amount.currency)}`, big: true },
          { lbl: 'Frequency', v: frequency },
          { lbl: 'Payment Method', v: paymentMethod },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginBottom: 3, textTransform: 'uppercase', letterSpacing: .6 }}>{s.lbl}</div>
            <div style={{ fontSize: s.big ? 20 : 13, fontWeight: s.big ? 800 : 600, color: '#e8eaf0', fontFamily: s.big ? 'Satoshi,sans-serif' : undefined }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 10 }}>Billing Timeline</div>
      <div style={{ position: 'relative', height: 44, marginBottom: 6 }}>
        <div style={{ position: 'absolute', top: 16, left: 8, right: 8, height: 2, background: '#252935', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: 16, left: 8, width: `calc(${nextPct}% - 8px)`, height: 2, background: '#5b6af0', borderRadius: 2 }} />
        {/* Start dot */}
        <div style={{ position: 'absolute', left: 0, top: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c78a', border: '2px solid #22c78a' }} />
          <div style={{ fontSize: 9, color: '#22c78a', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap', marginTop: 2 }}>Start</div>
        </div>
        {/* Next billing dot */}
        <div style={{ position: 'absolute', left: `${nextPct}%`, top: 10, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#f59e0b', border: '2px solid #f59e0b', boxShadow: '0 0 10px rgba(245,158,11,.4)' }} />
          <div style={{ fontSize: 9, color: '#f59e0b', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap', marginTop: 2 }}>Next Bill</div>
        </div>
        {/* End dot */}
        <div style={{ position: 'absolute', right: 0, top: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#252935', border: '2px solid #5a6075' }} />
          <div style={{ fontSize: 9, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap', marginTop: 2 }}>End</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 8 }}>
        <span>{fmtDate(dates && dates.start)}</span>
        <span style={{ color: '#f59e0b' }}>{fmtDate(dates && dates.nextBilling)}</span>
        <span>{fmtDate(dates && dates.end)}</span>
      </div>
    </div>
  );
};

// ── Widget Renderer wrapper (isolates hooks into their own component scope) ──
const WidgetRenderer = ({ renderFn, data, cfg }) => {
  return renderFn(data, cfg);
};

// ── RENDERERS map ─────────────────────────────────────────────────────────
const RENDERERS = {
  'CH-001': renderLineChart, 'CH-002': renderBarChart,
  'CH-003': renderDonut, 'CH-004': renderGeoMap,
  'CH-005': renderFunnel, 'CH-006': renderGauge,
  'CH-007': renderSparkline, 'CH-008': renderHeatmap,
  'CH-009': renderStackedArea, 'CH-010': renderWaterfall,
  'CH-011': renderLeaderboard,
  'UW-001': renderMetricCard, 'UW-002': renderMetricCardRow,
  'UW-003': renderEntityCard, 'UW-004': renderDataTable,
  'UW-005': renderKanban, 'UW-006': renderStatusBadge,
  'UW-007': renderCustomer360, 'UW-008': renderProductCard,
  'UW-009': renderProductGrid, 'UW-010': renderTimeline,
  'UW-011': renderCompactList, 'UW-012': renderCartSummary,
  'UW-013': renderFilterChipBar, 'UW-014': renderAgentReasoning,
  'UW-015': renderComparisonCard, 'UW-016': renderAlertBanner,
  'UW-017': renderFilePreviewCard, 'UW-018': renderPermissionMatrix,
  'UW-019': renderImportExportProgress, 'UW-020': renderSegmentDefinition,
  'UW-021': renderDiscountSummary, 'UW-022': renderWorkflowStatus,
  'UW-023': renderRecurringPayment,
};

// ── App ───────────────────────────────────────────────────────────────────
const App = () => {
  const [selectedComp, setSelectedComp] = useState(null);
  const [catFilter, setCatFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dataMode, setDataMode] = useState('preset');
  const [jsonText, setJsonText] = useState('');
  const [compCfg, setCompCfg] = useState({});
  const [chartTitle, setChartTitle] = useState('');
  const [chartSub, setChartSub] = useState('');
  const [canvasSize, setCanvasSize] = useState('lg');
  const [renderedComp, setRenderedComp] = useState(null);
  const [renderedData, setRenderedData] = useState(null);
  const [renderedCfg, setRenderedCfg] = useState({});
  const [error, setError] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [canvasTab, setCanvasTab] = useState('preview');
  const [isDark, setIsDark] = useState(true);
  const fileRef = useRef();

  // Apply theme to root element whenever isDark changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auto-load preset when a component is selected
  useEffect(() => {
    if (!selectedComp) return;
    if (PRESETS[selectedComp]) setJsonText(PRESETS[selectedComp]);
    const cfgDefs = COMP_CONFIGS[selectedComp] || [];
    const defaults = {};
    cfgDefs.forEach(c => { defaults[c.key] = c.def; });
    setCompCfg(defaults);
    setError(null);
  }, [selectedComp]);

  const handleRender = () => {
    if (!selectedComp) { setError('Select a component first.'); return; }
    if (!jsonText.trim()) { setError('No data loaded — choose a preset or paste JSON.'); return; }
    try {
      const parsed = JSON.parse(jsonText);
      setRendering(true);
      setTimeout(() => {
        setRenderedComp(selectedComp);
        setRenderedData(parsed);
        setRenderedCfg({ ...compCfg });
        setError(null);
        setRendering(false);
      }, 300);
    } catch (e) {
      setError('JSON parse error: ' + e.message);
    }
  };

  const filteredComps = COMPONENTS.filter(c => {
    if (catFilter !== 'ALL' && c.cat !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    }
    return true;
  });

  const activeComp = COMPONENTS.find(c => c.id === renderedComp);
  const canRender = !!(selectedComp && jsonText.trim());

  const isValidJson = useMemo(() => {
    if (!jsonText.trim()) return null;
    try { JSON.parse(jsonText); return true; } catch { return false; }
  }, [jsonText]);

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="logo">⚡ WizCommerce <span className="logo-badge">Component Lab</span></div>
        <div className="h-div" />
        <span className="h-sub">v2.0 · 37 components</span>
        <div className="h-space" />
        <div className="status-dot" />
        <span className="status-lbl">React 18 · Recharts 2.12 · D3 7.8</span>
        <div className="h-div" />
        <button
          className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
          onClick={() => setIsDark(d => !d)}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb" />
          </span>
          <span className="theme-toggle-label">{isDark ? '🌙 Dark' : '☀️ Light'}</span>
        </button>
      </header>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-scroll">

          {/* 01 — Component Selector */}
          <div className="sec-label">01 &nbsp; Select Component</div>
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Search by name, ID, or purpose…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="cat-pills">
              {['ALL', 'CHARTS', 'WIDGETS'].map(c => (
                <div key={c} className={`cat-pill ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</div>
              ))}
            </div>
          </div>
          <div className="comp-grid">
            {filteredComps.map(c => (
              <div
                key={c.id}
                className={`comp-card ${selectedComp === c.id ? 'selected' : ''}`}
                onClick={() => setSelectedComp(c.id)}
              >
                <div className="card-icon">{c.icon}</div>
                <div className="card-id">{c.id}</div>
                <div className="card-name">{c.name}</div>
                <div className="card-desc">{c.desc}</div>
                <div className="card-chk">✓</div>
              </div>
            ))}
            {filteredComps.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: 11, color: '#5a6075', padding: 16 }}>No components match "{search}"</div>
            )}
          </div>

          {/* 02 — Data */}
          <div className="sec-label">02 &nbsp; Load Data</div>
          <div className="data-panel">
            <div className="tab-row">
              <div
                className={`tab-btn ${dataMode === 'preset' ? 'active' : ''}`}
                onClick={() => { setDataMode('preset'); if (selectedComp && PRESETS[selectedComp]) setJsonText(PRESETS[selectedComp]); }}
              >📦 Preset</div>
              <div className={`tab-btn ${dataMode === 'json' ? 'active' : ''}`} onClick={() => setDataMode('json')}>✏️ JSON</div>
              <div className={`tab-btn ${dataMode === 'upload' ? 'active' : ''}`} onClick={() => setDataMode('upload')}>📁 Upload</div>
            </div>

            {(dataMode === 'preset' || dataMode === 'json') && (
              <div>
                {dataMode === 'preset' && !selectedComp && (
                  <div style={{ fontSize: 11, color: '#5a6075', textAlign: 'center', padding: '12px 0', fontFamily: 'JetBrains Mono,monospace' }}>Select a component to load its preset →</div>
                )}
                <textarea
                  className="json-editor"
                  placeholder={'{\n  "key": "value"\n}'}
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  rows={8}
                  spellCheck={false}
                />
                {isValidJson === true && <div className="data-ok">✓ Valid JSON · {selectedComp ? `${selectedComp} preset` : 'custom data'}</div>}
                {isValidJson === false && <div className="data-err">⚠ Invalid JSON — check syntax</div>}
              </div>
            )}

            {dataMode === 'upload' && (
              <div>
                <input
                  ref={fileRef} type="file" accept=".json,.csv,.txt" style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = ev => { setJsonText(ev.target.result); setDataMode('json'); };
                    reader.readAsText(f);
                  }}
                />
                <div className="upload-zone" onClick={() => fileRef.current.click()}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
                  <div className="upload-text">Drop a JSON file or click to browse</div>
                  <div className="upload-hint">.json — keys match component spec</div>
                </div>
                {jsonText && <div className="data-ok" style={{ marginTop: 8 }}>✓ File loaded — switch to JSON tab to review</div>}
              </div>
            )}
          </div>

          {/* 03 — Configure */}
          <div className="sec-label">03 &nbsp; Configure</div>
          <div className="cfg-panel">
            <div className="cfg-row">
              <label className="cfg-label">Chart / Widget Title</label>
              <input className="cfg-input" placeholder="e.g. Monthly Revenue Trend" value={chartTitle} onChange={e => setChartTitle(e.target.value)} />
            </div>
            <div className="cfg-row">
              <label className="cfg-label">Subtitle / Context</label>
              <input className="cfg-input" placeholder="e.g. Last 12 months · All reps" value={chartSub} onChange={e => setChartSub(e.target.value)} />
            </div>
            {/* Dynamic component-specific options */}
            {selectedComp && (COMP_CONFIGS[selectedComp] || []).map(cfg => (
              <div key={cfg.key} className="cfg-row">
                <label className="cfg-label">{cfg.label}</label>
                {cfg.type === 'select' ? (
                  <select
                    className="cfg-select"
                    value={compCfg[cfg.key] ?? cfg.def}
                    onChange={e => setCompCfg(c => ({ ...c, [cfg.key]: e.target.value }))}
                  >
                    {cfg.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <div className="toggle-row">
                    <input
                      type="checkbox" id={cfg.key}
                      checked={compCfg[cfg.key] ?? cfg.def}
                      onChange={e => setCompCfg(c => ({ ...c, [cfg.key]: e.target.checked }))}
                      style={{ accentColor: '#5b6af0' }}
                    />
                    <label className="toggle-lbl" htmlFor={cfg.key}>
                      {(compCfg[cfg.key] ?? cfg.def) ? 'Enabled' : 'Disabled'}
                    </label>
                  </div>
                )}
              </div>
            ))}
            <div className="cfg-row">
              <label className="cfg-label">Canvas Width</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['sm', 'md', 'lg', 'xl'].map(s => (
                  <div key={s} className={`sz-btn ${canvasSize === s ? 'active' : ''}`} onClick={() => setCanvasSize(s)}>{s.toUpperCase()}</div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* end sidebar-scroll */}

        {/* Render button — pinned to bottom */}
        <div className="render-sec">
          <button className={`render-btn ${canRender ? '' : 'disabled'}`} onClick={handleRender}>
            {rendering
              ? <><div className="spinner" /><span>Rendering…</span></>
              : <span>🚀 Render Component</span>
            }
          </button>
        </div>
      </aside>

      {/* ── Canvas ── */}
      <main className="canvas">
        <div className="canvas-toolbar">
          <span className="canvas-title">🖼 Preview Canvas</span>
          {renderedComp && <span className="canvas-badge">{(activeComp && activeComp.id)} · {(activeComp && activeComp.name)}</span>}
          <div style={{ flex: 1 }} />
          {renderedComp && (
            <span className="canvas-meta">{(activeComp && activeComp.cat)} · {renderedComp}</span>
          )}
          {renderedComp && (
            <div className="size-row">
              {['sm', 'md', 'lg', 'xl'].map(s => (
                <div key={s} className={`sz-btn ${canvasSize === s ? 'active' : ''}`} onClick={() => setCanvasSize(s)}>{s.toUpperCase()}</div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="err-banner">⚠ {error}</div>}

        {renderedComp && renderedData ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Canvas Tabs */}
            <div className="canvas-tabs">
              {[['preview', '🖼 Preview'], ['code', '💻 Code'], ['fields', '📚 Fields']].map(([k, lbl]) => (
                <div key={k} className={`canvas-tab ${canvasTab === k ? 'active' : ''}`} onClick={() => setCanvasTab(k)}>{lbl}</div>
              ))}
            </div>

            {/* Preview Tab */}
            {canvasTab === 'preview' && (
              <div className="chart-frame">
                <div className={`chart-wrap ${canvasSize} fade-in`}>
                  {(chartTitle || chartSub) && (
                    <div className="chart-hdr">
                      {chartTitle && <div className="chart-title">{chartTitle}</div>}
                      {chartSub && <div className="chart-sub">{chartSub}</div>}
                    </div>
                  )}
                  <WidgetErrorBoundary name={renderedComp} key={renderedComp}>
                    {RENDERERS[renderedComp]
                      ? <WidgetRenderer renderFn={RENDERERS[renderedComp]} data={renderedData} cfg={renderedCfg} key={renderedComp + '_wr'} />
                      : <div style={{ color: '#5a6075', textAlign: 'center', padding: 24 }}>Renderer not found for {renderedComp}</div>
                    }
                  </WidgetErrorBoundary>
                </div>
              </div>
            )}

            {/* Code Tab */}
            {canvasTab === 'code' && (
              <div className="dev-panel">
                <div className="dev-panel-header">
                  <div>
                    <div className="dev-panel-title">💻 React Source — {renderedComp}</div>
                    <div className="dev-panel-sub">Function source code for this component renderer</div>
                  </div>
                  <button className="dev-download-btn" onClick={() => {
                    const fn = RENDERERS[renderedComp];
                    const src = fn ? fn.toString() : '// Renderer not found';
                    const comp = COMPONENTS.find(c => c.id === renderedComp);
                    const header = '// ' + (comp ? comp.id + ': ' + comp.name : renderedComp) + '\n// Auto-exported from WizCommerce Component Lab\n\n';
                    const blob = new Blob([header + src], { type: 'text/javascript' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                    a.download = (renderedComp || 'component').toLowerCase().replace(/[^a-z0-9]/g, '_') + '.jsx';
                    a.click(); URL.revokeObjectURL(a.href);
                  }}>⬇ Download .jsx</button>
                </div>
                <pre className="dev-code-block">{RENDERERS[renderedComp] ? RENDERERS[renderedComp].toString() : '// Renderer not found'}</pre>
              </div>
            )}

            {/* Fields Tab */}
            {canvasTab === 'fields' && (
              <div className="dev-panel">
                <div className="dev-panel-header">
                  <div>
                    <div className="dev-panel-title">📚 Field Schema — {renderedComp}</div>
                    <div className="dev-panel-sub">Required and optional data fields accepted by this component</div>
                  </div>
                  <button className="dev-download-btn" onClick={() => {
                    const schema = FIELD_SCHEMAS[renderedComp] || [];
                    const comp = COMPONENTS.find(c => c.id === renderedComp);
                    const lines = ['# ' + (comp ? comp.id + ': ' + comp.name : renderedComp) + ' — Field Schema', ''];
                    lines.push('| Field | Type | Required | Description |');
                    lines.push('|-------|------|----------|-------------|');
                    schema.forEach(f => lines.push('| `' + f.field + '` | `' + f.type + '` | ' + (f.required ? '✅ Yes' : '➖ No') + ' | ' + f.desc + ' |'));
                    lines.push('', '---', 'Exported from WizCommerce Component Lab');
                    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                    a.download = (renderedComp || 'schema').toLowerCase().replace(/[^a-z0-9]/g, '_') + '_schema.md';
                    a.click(); URL.revokeObjectURL(a.href);
                  }}>⬇ Download .md</button>
                </div>
                {(FIELD_SCHEMAS[renderedComp] && FIELD_SCHEMAS[renderedComp].length > 0) ? (
                  <div className="dev-fields-table-wrap">
                    <table className="dev-fields-table">
                      <thead>
                        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
                      </thead>
                      <tbody>
                        {FIELD_SCHEMAS[renderedComp].map((f, i) => (
                          <tr key={i} className={f.required ? 'required-row' : ''}>
                            <td className="field-name">{f.field}</td>
                            <td className="field-type">{f.type}</td>
                            <td className="field-req">{f.required ? <span className="req-yes">✅ Required</span> : <span className="req-no">Optional</span>}</td>
                            <td className="field-desc">{f.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: 24, textAlign: 'center', color: '#5a6075', fontSize: 12 }}>No field schema defined for {renderedComp}</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-glyph">🧪</div>
            <div className="empty-t">Nothing rendered yet</div>
            <div className="empty-b">Follow the three steps in the sidebar to preview any component with live data.</div>
            <div className="empty-steps">
              {[['01', 'Pick a component from the grid'], ['02', 'Load or edit its JSON data'], ['03', 'Hit Render to see it live']].map(([n, t]) => (
                <div key={n} className="e-step">
                  <div className="step-n">{n}</div>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
