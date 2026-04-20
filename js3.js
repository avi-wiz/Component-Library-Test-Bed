// ── UW-001: Metric Card ───────────────────────────────────────────────────
const renderMetricCard = (data) => {
  const { label, value, format, trend, comparison, sparkline } = data;
  const tc = (trend && trend.direction === 'up') ? '#22c78a' : (trend && trend.direction === 'down') ? '#ef4444' : '#8b92a8';
  const arr = (trend && trend.direction === 'up') ? '▲' : (trend && trend.direction === 'down') ? '▼' : '→';
  return (
    <div className="metric-card" style={{ maxWidth: 300 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${COLORS[0]},${COLORS[4]})`, borderRadius: '10px 10px 0 0' }} />
      <div className="metric-lbl">{label}</div>
      <div className="metric-val">{formatVal(value, format)}</div>
      {trend && <div className="metric-trend" style={{ color: tc }}>{arr} {Math.abs(trend.percent)}% <span style={{ color: '#5a6075', fontWeight: 400, fontSize: 10.5 }}>{trend.period}</span></div>}
      {comparison && <div className="metric-cmp">{comparison.label}: {comparison.value}</div>}
      {sparkline && <div style={{ marginTop: 10 }}><SparklineInline data={sparkline} color={COLORS[0]} height={30} /></div>}
    </div>
  );
};

// ── UW-002: Metric Card Row ───────────────────────────────────────────────
const renderMetricCardRow = (data) => {
  const { title, cards = [] } = data;
  return (
    <div>
      {title && <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{title}</div>}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {cards.map((c, i) => {
          const tc = (c.trend && c.trend.direction === 'up') ? '#22c78a' : (c.trend && c.trend.direction === 'down') ? '#ef4444' : '#8b92a8';
          const arr = (c.trend && c.trend.direction === 'up') ? '▲' : (c.trend && c.trend.direction === 'down') ? '▼' : '→';
          return (
            <div key={i} className="metric-card" style={{ flex: '1 1 160px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: COLORS[i % COLORS.length], borderRadius: '10px 10px 0 0' }} />
              <div className="metric-lbl">{c.label}</div>
              <div className="metric-val" style={{ fontSize: 22 }}>{formatVal(c.value, c.format)}</div>
              {c.trend && <div className="metric-trend" style={{ color: tc, fontSize: 11 }}>{arr} {Math.abs(c.trend.percent)}% <span style={{ color: '#5a6075', fontWeight: 400, fontSize: 10 }}>{c.trend.period}</span></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── UW-003: Entity Detail Card ────────────────────────────────────────────
const renderEntityCard = (data) => {
  const { header, sections = [], actions = [] } = data;
  const [collapsed, setCollapsed] = useState({});
  return (
    <div style={{ border: '1px solid #252935', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#181b23', padding: '14px 16px', borderBottom: '1px solid #252935', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#5a6075', marginBottom: 3 }}>{(data.entityType ? data.entityType.toUpperCase() : '')}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700 }}>{(header && header.title)}</div>
          <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 2 }}>{(header && header.id)}</div>
        </div>
        {(header && header.status) && <StatusBadge {...header.status} />}
      </div>
      {sections.map((sec, si) => (
        <div key={si} style={{ borderBottom: '1px solid #1e2130' }}>
          <div onClick={() => setCollapsed(c => ({ ...c, [si]: !c[si] }))} style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#8b92a8', textTransform: 'uppercase', letterSpacing: '.6px' }}>{sec.title}</span>
            <span style={{ color: '#5a6075', fontSize: 12 }}>{collapsed[si] ? '›' : '⌄'}</span>
          </div>
          {!collapsed[si] && <div style={{ padding: '0 16px 12px' }}>
            {(sec.fields || []).map((f, fi) => (
              <div key={fi} style={{ display: 'flex', gap: 12, padding: '5px 0', borderBottom: fi < sec.fields.length - 1 ? '1px solid #1a1d26' : 'none' }}>
                <span style={{ fontSize: 11.5, color: '#5a6075', minWidth: 130, flexShrink: 0 }}>{f.key}</span>
                <span style={{ fontSize: 11.5, color: '#e8eaf0' }}>{f.value}</span>
              </div>
            ))}
          </div>}
        </div>
      ))}
      {actions.length > 0 && <div style={{ padding: '12px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', background: '#181b23' }}>{actions.map((a, i) => renderAction(a, i))}</div>}
    </div>
  );
};

// ── UW-004: Data Table ────────────────────────────────────────────────────
const renderDataTable = (data) => {
  const { columns = [], rows = [], pagination, emptyState } = data;
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const handleSort = key => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  const sorted = sortKey ? [...rows].sort((a, b) => { const av = a[sortKey], bv = b[sortKey], cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv)); return sortDir === 'asc' ? cmp : -cmp; }) : rows;
  const renderCell = (col, row) => { const v = row[col.key]; if (col.type === 'badge' && (v && v.label)) return <StatusBadge {...v} size="sm" />; if (col.type === 'currency') return <span style={{ fontFamily: 'JetBrains Mono,monospace' }}>${(parseFloat(v) || 0).toLocaleString()}</span>; return <span>{String(v != null ? v : '')}</span>; };
  return (
    <div>
      <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #252935' }}>
        <table className="tbl">
          <thead><tr>{columns.map(c => <th key={c.key} onClick={() => c.sortable && handleSort(c.key)}>{c.label} {c.sortable && (sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕')}</th>)}</tr></thead>
          <tbody>
            {sorted.length === 0 ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#5a6075', padding: 24 }}>{emptyState}</td></tr>
              : sorted.map((row, i) => <tr key={i}>{columns.map(c => <td key={c.key}>{renderCell(c, row)}</td>)}</tr>)}
          </tbody>
        </table>
        {pagination && pagination.total != null && <div className="tbl-footer">
          <span className="tbl-footer-stat">Showing <b>{rows.length}</b> of <b>{pagination.total.toLocaleString()}</b> records</span>
          <span className="tbl-footer-stat">Page <b>{pagination.page}</b> · {pagination.pageSize} per page</span>
        </div>}
      </div>
    </div>
  );
};

// ── UW-005: Kanban Board (read-only) ─────────────────────────────────────
const renderKanban = (data) => {
  const { stages = [], cards = [] } = data;
  return (
    <div className="kb-board">
      {stages.map(stage => {
        const sc = cards.filter(c => c.stageId === stage.id);
        return (
          <div key={stage.id} className="kb-col">
            <div className="kb-col-hdr">
              <div className="kb-col-name" style={{ color: stage.color || '#e8eaf0' }}>{stage.name}</div>
              <div className="kb-count">{stage.count}</div>
            </div>
            <div className="kb-cards">
              {sc.map(card => (
                <div key={card.id} className="kb-card">
                  <div className="kb-card-title">{card.title}</div>
                  <div className="kb-card-sub">{card.subtitle}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>{(card.badges || []).map((b, i) => <StatusBadge key={i} {...b} size="sm" />)}</div>
                  {card.meta && <div className="kb-meta"><span>👤 {card.meta.assignedTo}</span><span>{card.meta.lastActivity}</span></div>}
                </div>
              ))}
              {sc.length === 0 && <div style={{ fontSize: 11, color: '#5a6075', textAlign: 'center', padding: 12 }}>No cards</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── UW-006: Status Badge ──────────────────────────────────────────────────
const renderStatusBadge = (data) => {
  const { label, variant, size } = data;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['success', 'warning', 'danger', 'info', 'neutral', 'special'].map(v => (
          <StatusBadge key={v} label={v === variant ? label : v.charAt(0).toUpperCase() + v.slice(1)} variant={v} size="md" />
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
        Selected: variant="{variant}" size="{size}" label="{label}"
      </div>
    </div>
  );
};

// ── UW-007: Customer 360° (flat layout) ───────────────────────────────────
const renderCustomer360 = (data) => {
  const { profile, metrics, salesTrend, recentOrders, openTasks, riskIndicator } = data;
  const riskColors = { healthy: '#22c78a', watch: '#f59e0b', at_risk: '#ef4444', churned: '#8b92a8' };
  const rc = (riskIndicator && riskColors[riskIndicator.level]) || '#8b92a8';
  return (
    <div>
      {riskIndicator && <div style={{ background: rc + '15', border: `1px solid ${rc}40`, borderRadius: 8, padding: '9px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 14 }}>{riskIndicator.level === 'healthy' ? '✅' : riskIndicator.level === 'watch' ? '⚠️' : '❌'}</span>
        <div><div style={{ fontSize: 12, fontWeight: 700, color: rc, textTransform: 'capitalize' }}>{(riskIndicator.level ? riskIndicator.level.replace('_', ' ') : '')} Customer</div>
          <div style={{ fontSize: 11.5, color: '#8b92a8', marginTop: 2 }}>{riskIndicator.reason}</div></div>
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 2 }}>{(profile && profile.name)}</div>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#5a6075', marginBottom: 10 }}>{(profile && profile.customerId)} · {(profile && profile.type)}</div>
          {[['Sales Rep', (profile && profile.salesRep)], ['Price List', (profile && profile.priceList)], ['Territory', (profile && profile.territory)]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: '#5a6075', minWidth: 80 }}>{k}</span><span style={{ color: '#e8eaf0' }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .8 }}>Revenue Trend</div>
          <SparklineInline data={salesTrend || []} color={COLORS[0]} height={50} showEndDot />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {metrics && metrics.cards && metrics.cards.map((c, i) => (
          <div key={i} style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 8, padding: '10px 14px', flex: '1 1 120px' }}>
            <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginBottom: 4, textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 800, color: '#e8eaf0' }}>{c.format ? formatVal(c.value, c.format) : c.value}</div>
          </div>
        ))}
      </div>
      <SectionDivider title="Recent Orders" />
      {(recentOrders || []).map((o, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', borderBottom: '1px solid #1e2130' }}>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#5b6af0' }}>{o.id}</span>
          <span style={{ fontSize: 11, color: '#5a6075', flex: 1 }}>{o.date}</span>
          <StatusBadge {...o.status} size="sm" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf0', fontFamily: 'JetBrains Mono,monospace' }}>${(o.value ? o.value.toLocaleString() : '0')}</span>
        </div>
      ))}
      <SectionDivider title="Open Tasks" />
      {(openTasks || []).map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #1e2130', fontSize: 12 }}>
          <span style={{ color: '#e8eaf0' }}>{t.title}</span>
          <span style={{ color: '#5a6075', marginLeft: 'auto', fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5 }}>Due {t.due}</span>
        </div>
      ))}
    </div>
  );
};

// ── UW-008: Product Card ──────────────────────────────────────────────────
const renderProductCard = (data) => {
  const { skuId, name, price, availability, labels = [], actions = [] } = data;
  const sc = { in_stock: '#22c78a', low_stock: '#f59e0b', out_of_stock: '#ef4444' }[(availability && availability.status)] || '#8b92a8';
  const sl = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' }[(availability && availability.status)] || 'Unknown';
  return (
    <div className="product-card" style={{ maxWidth: 240 }}>
      <div className="product-img" style={{ background: '#1a1d26' }}>🛍️</div>
      <div className="product-body">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>{labels.map((l, i) => <StatusBadge key={i} label={l} variant="info" size="sm" />)}</div>
        <div className="product-name">{name}</div>
        <div className="product-sku">{skuId}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          <div className="product-price">${((price && (price.sale || price.base)) || 0).toLocaleString()}</div>
          {(price && price.sale) && <div className="product-price-orig">${(price.base ? price.base.toLocaleString() : '0')}</div>}
        </div>
        <div style={{ fontSize: 11, color: sc, marginBottom: 10, fontWeight: 600 }}>{sl}{(availability && availability.inStock > 0) ? ` · ${availability.inStock} units` : ''}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{actions.map((a, i) => renderAction(a, i))}</div>
      </div>
    </div>
  );
};

// ── UW-009: Product Card Grid ─────────────────────────────────────────────
const renderProductGrid = (data) => {
  const { products = [], total, pagination } = data;
  const sc = { in_stock: '#22c78a', low_stock: '#f59e0b', out_of_stock: '#ef4444' };
  const sl = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <div className="product-img" style={{ background: '#1a1d26', fontSize: 24 }}>📦</div>
            <div className="product-body">
              {(p.labels && p.labels.length > 0) && <StatusBadge label={p.labels[0]} variant="info" size="sm" />}
              <div className="product-name" style={{ marginTop: 4 }}>{p.name}</div>
              <div className="product-sku">{p.skuId}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 800 }}>${((p.price && (p.price.sale || p.price.base)) || 0).toLocaleString()}</div>
                {(p.price && p.price.sale) && <div style={{ fontSize: 10.5, color: '#5a6075', textDecoration: 'line-through' }}>${p.price.base}</div>}
              </div>
              <div style={{ fontSize: 10, color: (p.availability && sc[p.availability.status]) || '#8b92a8', fontWeight: 600 }}>{(p.availability && sl[p.availability.status]) || ''}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
        <span>{products.length} of {total} products</span>
        {pagination && <span>Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}</span>}
      </div>
    </div>
  );
};

// ── UW-010: Timeline / Audit Trail ───────────────────────────────────────
const renderTimeline = (data) => {
  const { entries = [] } = data;
  const fmtDate = d => { try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };
  return (
    <div className="timeline-wrap">
      <div className="tl-line" />
      {entries.map((e, i) => (
        <div key={i} className="tl-item">
          <div className="tl-dot" />
          <div className="tl-time">{fmtDate(e.timestamp)}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
            <span className="tl-actor">{e.actor}</span>
            <span style={{ color: '#5a6075', fontSize: 11 }}>—</span>
            <span className="tl-action">{e.action}</span>
          </div>
          {e.detail && <div className="tl-detail">{e.detail}</div>}
        </div>
      ))}
    </div>
  );
};

// ── UW-011: Compact List ──────────────────────────────────────────────────
const renderCompactList = (data) => {
  const { items = [], maxVisible = 5, emptyState = 'No items' } = data;
  const [expanded, setExpanded] = useState(false);
  if (!items.length) return <div style={{ textAlign: 'center', color: '#5a6075', fontSize: 12, padding: 16 }}>{emptyState}</div>;
  const visible = expanded ? items : items.slice(0, maxVisible);
  return (
    <div>
      <div className="compact-list">
        {visible.map((item, i) => (
          <div key={i} className="cl-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="cl-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
              {item.subtitle && <div className="cl-sub">{item.subtitle}</div>}
            </div>
            {item.badge && <StatusBadge {...item.badge} size="sm" />}
            {item.meta && <div className="cl-meta">{item.meta}</div>}
          </div>
        ))}
      </div>
      {items.length > maxVisible && (
        <div onClick={() => setExpanded(e => !e)} style={{ textAlign: 'center', fontSize: 11.5, color: '#5b6af0', cursor: 'pointer', marginTop: 8, textDecoration: 'underline' }}>
          {expanded ? 'Show less' : `Show ${items.length - maxVisible} more`}
        </div>
      )}
    </div>
  );
};

// ── UW-012: Cart Summary ──────────────────────────────────────────────────
const renderCartSummary = (data) => {
  const { customer, priceList, items = [], container, summary, actions = [] } = data;
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 10.5, color: '#5a6075', marginBottom: 2 }}>Customer</div><div style={{ fontSize: 13, fontWeight: 700 }}>{(customer && customer.name)}</div></div>
        <div><div style={{ fontSize: 10.5, color: '#5a6075', marginBottom: 2 }}>Price List</div><div style={{ fontSize: 12, color: '#e8eaf0' }}>{priceList}</div></div>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 14, borderRadius: 8, border: '1px solid #252935' }}>
        <table className="tbl">
          <thead><tr>{['#', 'SKU', 'Name', 'Price', 'Qty', 'Total', 'CFT'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{items.map((it, i) => (
            <tr key={i}>
              <td>{it.sNo}</td><td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5 }}>{it.skuId}</td>
              <td>{it.name}</td><td>${(it.price ? it.price.toLocaleString() : '0')}</td><td>{it.qty}</td>
              <td style={{ fontWeight: 600 }}>${(it.total ? it.total.toLocaleString() : '0')}</td>
              <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{it.cft}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {container && (
        <div style={{ marginBottom: 14, background: '#181b23', border: '1px solid #252935', borderRadius: 8, padding: '11px 14px' }}>
          <div style={{ fontSize: 10.5, color: '#5a6075', marginBottom: 8, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8 }}>Container Fill</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 6 }}>
            <span style={{ color: '#8b92a8' }}>{container.totalCft} / {container.cftCapacity} CFT</span>
            <span style={{ color: container.fillPercent > 90 ? '#ef4444' : container.fillPercent > 70 ? '#f59e0b' : '#22c78a', fontWeight: 700 }}>{container.fillPercent}%</span>
          </div>
          <div className="prog-bar-wrap"><div className="prog-bar-fill" style={{ width: `${container.fillPercent}%`, background: container.fillPercent > 90 ? '#ef4444' : container.fillPercent > 70 ? '#f59e0b' : '#22c78a' }} /></div>
        </div>
      )}
      {summary && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 220 }}>
            {[['Subtotal', summary.orderTotal], ['Discount', summary.discount ? -summary.discount : null], ['Shipping', summary.shipping]].filter(([, v]) => v != null).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid #1e2130', color: '#8b92a8' }}>
                <span>{k}</span><span style={{ color: v < 0 ? '#22c78a' : '#e8eaf0' }}>{v < 0 ? '-' : ''}${Math.abs(v).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, padding: '8px 0', fontFamily: 'Syne,sans-serif' }}>
              <span>Total</span><span>${(summary.total ? summary.total.toLocaleString() : '0')}</span>
            </div>
          </div>
        </div>
      )}
      {actions.length > 0 && <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>{actions.map((a, i) => renderAction(a, i))}</div>}
    </div>
  );
};

// ── UW-013: Filter Chip Bar ───────────────────────────────────────────────
const renderFilterChipBar = (data) => {
  const { filters = [] } = data;
  const [chips, setChips] = useState(filters);
  return (
    <div>
      <div className="chip-bar">
        {chips.map((f, i) => (
          <div key={i} className="filter-chip">
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5 }}>{f.field}: {f.operator} <b>{f.value}</b></span>
            {f.removable && <span className="chip-x" onClick={() => setChips(c => c.filter((_, j) => j !== i))}>×</span>}
          </div>
        ))}
        {chips.length > 0 && <span className="chip-clear" onClick={() => setChips([])}>Clear all</span>}
        {chips.length === 0 && <span style={{ fontSize: 12, color: '#5a6075' }}>No active filters</span>}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
        {chips.length} active filter(s) — click × to remove, "Clear all" to reset
      </div>
    </div>
  );
};

// ── UW-014: Agent Reasoning Card ─────────────────────────────────────────
const renderAgentReasoning = (data) => {
  const { summary, steps = [], dataAccessed = [], timestamp, expandable = true } = data;
  const [expanded, setExpanded] = useState(false);
  const fmtTs = d => { try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };
  return (
    <div className="reasoning-card">
      <div className="rc-header" onClick={() => expandable && setExpanded(e => !e)}>
        <div>
          <div style={{ fontSize: 9.5, color: '#7c8fff', fontFamily: 'JetBrains Mono,monospace', marginBottom: 4, textTransform: 'uppercase', letterSpacing: .8 }}>🤖 Agent Reasoning · {fmtTs(timestamp)}</div>
          <div className="rc-summary">{summary}</div>
        </div>
        {expandable && <span className="rc-chevron" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>›</span>}
      </div>
      {expanded && (
        <div className="rc-body">
          {steps.map((s, i) => (
            <div key={i} className="rc-step">
              <div className="rc-step-num">{s.stepNumber}</div>
              <div className="rc-step-body">
                <div className="rc-step-action">{s.action}</div>
                {s.detail && <div className="rc-step-detail">{s.detail}</div>}
                {s.dataSource && <div className="rc-step-src">source: {s.dataSource}</div>}
              </div>
            </div>
          ))}
          {dataAccessed.length > 0 && <div className="rc-accessed">Data accessed: {dataAccessed.join(', ')}</div>}
        </div>
      )}
    </div>
  );
};

// ── UW-015: Comparison Card ───────────────────────────────────────────────
const renderComparisonCard = (data) => {
  const { items = [], highlightWinner = true } = data;
  if (!items.length) return null;
  const metrics = (items[0] && items[0].metrics ? items[0].metrics.map(m => m.key) : []);
  const getBestIdx = key => {
    const vals = items.map(item => { const m = (item.metrics && item.metrics.find(mx => mx.key === key)); return parseFloat(String((m && m.value) || '').replace(/[^0-9.]/g, '')) || 0; });
    return vals.indexOf(Math.max(...vals));
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: 1 }}>
        <div style={{ width: 120, flexShrink: 0 }}>
          <div style={{ height: 44 }} />
          {metrics.map(key => <div key={key} className="cmp-metric-row"><span className="cmp-metric-key">{key}</span></div>)}
        </div>
        {items.map((item, ci) => (
          <div key={ci} className="cmp-card">
            <div className="cmp-col-hdr" style={{ borderTop: `3px solid ${COLORS[ci % COLORS.length]}` }}>{item.label}</div>
            {metrics.map((key, mi) => {
              const m = item.metrics && item.metrics.find(m => m.key === key);
              const isWinner = highlightWinner && getBestIdx(key) === ci;
              return <div key={mi} className="cmp-metric-row"><span className={`cmp-metric-val ${isWinner ? 'winner' : ''}`}>{isWinner && '🏆 '}{(m && m.value)}</span></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
