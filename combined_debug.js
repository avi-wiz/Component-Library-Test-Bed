// ── Palette & Constants ───────────────────────────────────────────────────
const COLORS = ['#5b6af0', '#22c78a', '#f59e0b', '#ef4444', '#a78bfa', '#38bdf8', '#fb923c', '#e879f9'];
const BADGE_COLORS = {
  success: { bg: 'rgba(34,199,138,.1)', text: '#22c78a', border: 'rgba(34,199,138,.2)' },
  warning: { bg: 'rgba(245,158,11,.1)', text: '#f59e0b', border: 'rgba(245,158,11,.2)' },
  danger: { bg: 'rgba(239,68,68,.1)', text: '#ef4444', border: 'rgba(239,68,68,.2)' },
  info: { bg: 'rgba(56,189,248,.1)', text: '#38bdf8', border: 'rgba(56,189,248,.2)' },
  neutral: { bg: 'rgba(139,146,168,.1)', text: '#8b92a8', border: 'rgba(139,146,168,.2)' },
  special: { bg: 'rgba(167,139,250,.1)', text: '#a78bfa', border: 'rgba(167,139,250,.2)' },
};

// ── AW-* Action Widget Stub ── v1.0 ──────────────────────────────────────
// Each action: { label, variant:'primary'|'secondary'|'danger'|'ghost', actionType?, href?, icon? }
// To expand: add new cases keyed on actionType in this function.
// Replace the disabled <button> stub with a real handler per actionType when AW library ships.
const renderAction = (action, key) => {
  const variant = action.variant || 'secondary';
  return (
    <button key={key} className={`action-btn ${variant}`}
      title={`AW stub · type:${action.actionType || 'generic'} — see DECISIONS.md`}>
      {action.icon && <span style={{ marginRight: 4 }}>{action.icon}</span>}
      {action.label}
    </button>
  );
};

// ── Shared Sub-Components ─────────────────────────────────────────────────
const StatusBadge = ({ label, variant = 'neutral', size = 'md' }) => {
  const c = BADGE_COLORS[variant] || BADGE_COLORS.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', borderRadius: 20, fontWeight: 600,
      whiteSpace: 'nowrap', fontFamily: 'Manrope,sans-serif',
      padding: size === 'sm' ? '2px 7px' : '3px 10px',
      fontSize: size === 'sm' ? 10 : 11,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`
    }}>{label}</span>
  );
};

const SparklineInline = ({ data, color = '#5b6af0', height = 32, showEndDot = true }) => {
  if (!data?.length) return null;
  const vals = data.map(v => parseFloat(v) || 0);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const W = 120;
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * W,
    height - ((v - min) / range * height * 0.85) - height * 0.075
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg width={W} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
      {showEndDot && <circle cx={last[0]} cy={last[1]} r={3} fill={color} />}
    </svg>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#181b23', border: '1px solid #252935', borderRadius: 8, padding: '9px 13px',
      fontSize: 12, fontFamily: 'Manrope,sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,.5)', minWidth: 110
    }}>
      {label && <div style={{ color: '#8b92a8', marginBottom: 5, fontSize: 10.5, fontFamily: 'JetBrains Mono,monospace' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: '#8b92a8' }}>{(p.name || p.dataKey) + ': '}</span>
          <span style={{ color: '#e8eaf0', fontWeight: 600 }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const formatVal = (val, fmt) => {
  if (fmt === 'currency') return '$' + (parseFloat(val) || 0).toLocaleString();
  if (fmt === 'percent') return (parseFloat(val) || 0) + '%';
  if (fmt === 'count' || fmt === 'number') return (parseFloat(val) || 0).toLocaleString();
  return val;
};

const SectionDivider = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
    <div style={{
      fontSize: 10, fontWeight: 600, color: '#5a6075', textTransform: 'uppercase',
      letterSpacing: '.8px', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap'
    }}>{title}</div>
    <div style={{ flex: 1, height: '1px', background: '#252935' }} />
  </div>
);

// ── Component Definitions ─────────────────────────────────────────────────
const COMPONENTS = [
  { id: 'CH-001', icon: '📈', name: 'Line Chart', cat: 'CHARTS', desc: 'Trends over time' },
  { id: 'CH-002', icon: '📊', name: 'Bar Chart', cat: 'CHARTS', desc: 'Category comparisons' },
  { id: 'CH-003', icon: '🍩', name: 'Donut / Pie', cat: 'CHARTS', desc: 'Composition breakdown' },
  { id: 'CH-004', icon: '🗺️', name: 'Geographic Map', cat: 'CHARTS', desc: 'Regional distribution' },
  { id: 'CH-005', icon: '🔻', name: 'Funnel Chart', cat: 'CHARTS', desc: 'Pipeline conversion' },
  { id: 'CH-006', icon: '🎚️', name: 'Progress / Gauge', cat: 'CHARTS', desc: 'Value vs target' },
  { id: 'CH-007', icon: '⚡', name: 'Sparkline', cat: 'CHARTS', desc: 'Inline mini-trend' },
  { id: 'CH-008', icon: '🗓️', name: 'Calendar Heatmap', cat: 'CHARTS', desc: 'Activity intensity' },
  { id: 'CH-009', icon: '🌊', name: 'Stacked Area', cat: 'CHARTS', desc: 'Composition over time' },
  { id: 'CH-010', icon: '💧', name: 'Waterfall', cat: 'CHARTS', desc: 'Sequential contributions' },
  { id: 'CH-011', icon: '🏆', name: 'Horizontal Leaderboard', cat: 'CHARTS', desc: 'Ranked bars' },
  { id: 'UW-001', icon: '🎯', name: 'Metric Card', cat: 'WIDGETS', desc: 'Single KPI + trend' },
  { id: 'UW-002', icon: '📋', name: 'Metric Card Row', cat: 'WIDGETS', desc: '3–6 KPIs horizontal' },
  { id: 'UW-003', icon: '🗂️', name: 'Entity Detail Card', cat: 'WIDGETS', desc: 'Full entity view' },
  { id: 'UW-004', icon: '📑', name: 'Data Table', cat: 'WIDGETS', desc: 'Sortable + paginated' },
  { id: 'UW-005', icon: '🗃️', name: 'Kanban Board', cat: 'WIDGETS', desc: 'Pipeline stage columns' },
  { id: 'UW-006', icon: '🏷️', name: 'Status Badge', cat: 'WIDGETS', desc: 'Colored pill label' },
  { id: 'UW-007', icon: '👤', name: 'Customer 360°', cat: 'WIDGETS', desc: 'Full customer profile' },
  { id: 'UW-008', icon: '📦', name: 'Product Card', cat: 'WIDGETS', desc: 'Product + price + stock' },
  { id: 'UW-009', icon: '🛍️', name: 'Product Card Grid', cat: 'WIDGETS', desc: 'Responsive grid' },
  { id: 'UW-010', icon: '⏱️', name: 'Timeline / Audit', cat: 'WIDGETS', desc: 'Chronological events' },
  { id: 'UW-011', icon: '📝', name: 'Compact List', cat: 'WIDGETS', desc: 'Sidebar-friendly list' },
  { id: 'UW-012', icon: '🛒', name: 'Cart Summary', cat: 'WIDGETS', desc: 'Cart + container fill' },
  { id: 'UW-013', icon: '🔍', name: 'Filter Chip Bar', cat: 'WIDGETS', desc: 'Active filter chips' },
  { id: 'UW-014', icon: '🤖', name: 'Agent Reasoning', cat: 'WIDGETS', desc: 'Thinking + data sources' },
  { id: 'UW-015', icon: '⚖️', name: 'Comparison Card', cat: 'WIDGETS', desc: 'Side-by-side metrics' },
  { id: 'UW-016', icon: '🔔', name: 'Alert Banner', cat: 'WIDGETS', desc: 'Time-sensitive notice' },
  { id: 'UW-017', icon: '📄', name: 'File Preview Card', cat: 'WIDGETS', desc: 'File metadata + thumb' },
  { id: 'UW-018', icon: '🔐', name: 'Permission Matrix', cat: 'WIDGETS', desc: 'Role permissions' },
  { id: 'UW-019', icon: '⬆️', name: 'Import/Export Progress', cat: 'WIDGETS', desc: 'Operation status' },
  { id: 'UW-020', icon: '🎛️', name: 'Segment Definition', cat: 'WIDGETS', desc: 'Include/exclude rules' },
  { id: 'UW-021', icon: '💸', name: 'Discount Summary', cat: 'WIDGETS', desc: 'Discount configuration' },
  { id: 'UW-022', icon: '⚙️', name: 'Workflow Status', cat: 'WIDGETS', desc: 'Pipeline node chain' },
  { id: 'UW-023', icon: '🔄', name: 'Recurring Payment', cat: 'WIDGETS', desc: 'Billing schedule' },
];

// ── Presets ───────────────────────────────────────────────────────────────
const PRESETS = {
  'CH-001': '{"series":[{"name":"Revenue","data":[{"x":"Jan","y":142000},{"x":"Feb","y":158000},{"x":"Mar","y":171000},{"x":"Apr","y":165000},{"x":"May","y":189000},{"x":"Jun","y":202000}],"color":"#5b6af0"},{"name":"Target","data":[{"x":"Jan","y":130000},{"x":"Feb","y":145000},{"x":"Mar","y":160000},{"x":"Apr","y":155000},{"x":"May","y":175000},{"x":"Jun","y":190000}],"color":"#22c78a"}],"xAxis":{"label":"Month","type":"category"},"yAxis":{"label":"Revenue","format":"currency"},"annotations":[{"x":"Mar","label":"Trade Show"}]}',
  'CH-002': '{"data":[{"category":"Alice Chen","value":204000},{"category":"Bob Kumar","value":152000},{"category":"Carol White","value":219000},{"category":"David Park","value":168000},{"category":"Emma Torres","value":231000}],"orientation":"vertical","yAxis":{"label":"Revenue","format":"currency"}}',
  'CH-003': '{"segments":[{"label":"Confirmed","value":892,"color":"#22c78a"},{"label":"Draft","value":341,"color":"#8b92a8"},{"label":"Pending","value":124,"color":"#f59e0b"},{"label":"Cancelled","value":67,"color":"#ef4444"}],"centerLabel":{"value":"1,424","subtitle":"Total Orders"},"showLegend":true}',
  'CH-004': '{"regions":[{"regionName":"California","value":892000},{"regionName":"Texas","value":743000},{"regionName":"New York","value":534000},{"regionName":"Florida","value":412000},{"regionName":"Illinois","value":389000},{"regionName":"Georgia","value":267000},{"regionName":"Ohio","value":198000}],"metric":"Revenue","colorScale":{"min":"#1a2060","max":"#7c8fff"},"mapType":"state"}',
  'CH-005': '{"stages":[{"name":"Website Leads","value":2840},{"name":"Qualified","value":891,"conversionRate":31.4},{"name":"Demo Scheduled","value":412,"conversionRate":46.2},{"name":"Proposal Sent","value":198,"conversionRate":48.1},{"name":"Closed Won","value":43,"conversionRate":21.7}],"metric":"Leads"}',
  'CH-006': '{"value":68,"max":100,"label":"Sales Quota Attainment","format":"percent","thresholds":[{"value":0,"color":"#ef4444","label":"Below Target"},{"value":50,"color":"#f59e0b","label":"On Track"},{"value":75,"color":"#22c78a","label":"Exceeding"}]}',
  'CH-007': '{"data":[42000,45000,41000,48000,52000,49000,55000,58000,54000,62000,67000,71000],"color":"#5b6af0","height":40,"showEndDot":true}',
  'CH-008': '{"data":[{"date":"2026-04-01","value":12},{"date":"2026-04-02","value":5},{"date":"2026-04-03","value":8},{"date":"2026-04-06","value":15},{"date":"2026-04-07","value":22},{"date":"2026-04-08","value":18},{"date":"2026-04-09","value":9},{"date":"2026-04-10","value":14},{"date":"2026-04-13","value":0},{"date":"2026-04-14","value":24},{"date":"2026-04-15","value":31}],"colorScale":{"min":"#1a2060","max":"#5b6af0"},"period":"month"}',
  'CH-009': '{"series":[{"name":"Electronics","data":[{"x":"Jan","y":45000},{"x":"Feb","y":51000},{"x":"Mar","y":48000},{"x":"Apr","y":56000},{"x":"May","y":62000},{"x":"Jun","y":71000}],"color":"#5b6af0"},{"name":"Apparel","data":[{"x":"Jan","y":31000},{"x":"Feb","y":28000},{"x":"Mar","y":35000},{"x":"Apr","y":38000},{"x":"May","y":41000},{"x":"Jun","y":45000}],"color":"#22c78a"},{"name":"Home","data":[{"x":"Jan","y":19000},{"x":"Feb","y":22000},{"x":"Mar","y":18000},{"x":"Apr","y":25000},{"x":"May","y":27000},{"x":"Jun","y":30000}],"color":"#f59e0b"}],"xAxis":{"label":"Month","type":"category"},"yAxis":{"label":"Revenue","format":"currency"}}',
  'CH-010': '{"steps":[{"label":"Q1 Revenue","value":892000,"type":"total"},{"label":"New Customers","value":124000,"type":"increase"},{"label":"Upsells","value":67000,"type":"increase"},{"label":"Churn","value":-89000,"type":"decrease"},{"label":"Discounts","value":-42000,"type":"decrease"},{"label":"Q2 Revenue","value":952000,"type":"total"}],"format":"currency"}',
  'CH-011': '{"entries":[{"rank":1,"label":"Emma Torres","value":231000,"meta":"56 deals"},{"rank":2,"label":"Carol White","value":219000,"meta":"52 deals"},{"rank":3,"label":"Alice Chen","value":204000,"meta":"47 deals"},{"rank":4,"label":"David Park","value":168000,"meta":"41 deals"},{"rank":5,"label":"Bob Kumar","value":152000,"meta":"38 deals"}],"metric":"Revenue","format":"currency"}',
  'UW-001': '{"label":"Confirmed Order Amount","value":16203440,"format":"currency","trend":{"direction":"up","percent":12.4,"period":"vs last quarter"},"comparison":{"label":"Last Quarter","value":"$14.1M"},"sparkline":[42,45,41,48,52,49,55,58,54,62,67,71]}',
  'UW-002': '{"title":"Sales Snapshot — Q2 2026","cards":[{"label":"Total Revenue","value":16203440,"format":"currency","trend":{"direction":"up","percent":12.4,"period":"vs Q1"}},{"label":"Order Count","value":1247,"format":"count","trend":{"direction":"up","percent":8.2,"period":"vs Q1"}},{"label":"Avg Order Value","value":12993,"format":"currency","trend":{"direction":"down","percent":2.1,"period":"vs Q1"}},{"label":"Active Customers","value":342,"format":"count","trend":{"direction":"up","percent":15.3,"period":"vs Q1"}}]}',
  'UW-003': '{"entityType":"order","header":{"id":"ORD-5829","title":"Order from Acme Corp","status":{"label":"Confirmed","variant":"success"}},"sections":[{"title":"Customer Details","fields":[{"key":"Customer","value":"Acme Corp"},{"key":"Sales Rep","value":"Alice Chen"},{"key":"Price List","value":"Wholesale 2025"}]},{"title":"Order Details","fields":[{"key":"Order Value","value":"$24,500"},{"key":"Payment Status","value":"Paid"},{"key":"Created On","value":"Apr 15, 2026"},{"key":"PO Number","value":"PO-2026-0041"}]}],"actions":[{"label":"Edit Order","variant":"primary"},{"label":"Download PDF","variant":"secondary"},{"label":"Cancel","variant":"danger"}]}',
  'UW-004': '{"columns":[{"key":"orderId","label":"Order ID","type":"string","sortable":true},{"key":"customer","label":"Customer","type":"string","sortable":true},{"key":"status","label":"Status","type":"badge","sortable":false},{"key":"value","label":"Value","type":"currency","sortable":true},{"key":"date","label":"Date","type":"date","sortable":true}],"rows":[{"orderId":"ORD-5829","customer":"Acme Corp","status":{"label":"Confirmed","variant":"success"},"value":24500,"date":"Apr 15, 2026"},{"orderId":"ORD-5830","customer":"Beta Industries","status":{"label":"Pending Approval","variant":"warning"},"value":18200,"date":"Apr 14, 2026"},{"orderId":"ORD-5831","customer":"Gamma LLC","status":{"label":"Draft","variant":"neutral"},"value":9800,"date":"Apr 13, 2026"},{"orderId":"ORD-5832","customer":"Delta Co","status":{"label":"Confirmed","variant":"success"},"value":31400,"date":"Apr 12, 2026"},{"orderId":"ORD-5833","customer":"Echo Partners","status":{"label":"Cancelled","variant":"danger"},"value":7200,"date":"Apr 11, 2026"}],"pagination":{"page":1,"pageSize":10,"total":1247},"emptyState":"No orders found"}',
  'UW-005': '{"stages":[{"id":"new","name":"New","count":12,"color":"#5b6af0"},{"id":"prospect","name":"Prospect","count":8,"color":"#f59e0b"},{"id":"almost","name":"Almost Done","count":5,"color":"#a78bfa"},{"id":"won","name":"Won","count":3,"color":"#22c78a"}],"cards":[{"id":"L-001","stageId":"new","title":"Acme Corp","subtitle":"Manufacturing · $45K","badges":[{"label":"Hot","variant":"danger"}],"meta":{"assignedTo":"Alice Chen","lastActivity":"2 hours ago"}},{"id":"L-002","stageId":"new","title":"Beta Industries","subtitle":"Retail · $28K","badges":[{"label":"Warm","variant":"warning"}],"meta":{"assignedTo":"Bob Kumar","lastActivity":"1 day ago"}},{"id":"L-003","stageId":"prospect","title":"Gamma LLC","subtitle":"Tech · $67K","badges":[{"label":"Hot","variant":"danger"}],"meta":{"assignedTo":"Carol White","lastActivity":"3 hours ago"}},{"id":"L-004","stageId":"almost","title":"Delta Corp","subtitle":"Pharma · $112K","badges":[{"label":"Warm","variant":"warning"}],"meta":{"assignedTo":"Emma Torres","lastActivity":"Yesterday"}},{"id":"L-005","stageId":"won","title":"Echo Systems","subtitle":"SaaS · $89K","badges":[{"label":"Won","variant":"success"}],"meta":{"assignedTo":"David Park","lastActivity":"2 days ago"}}]}',
  'UW-006': '{"label":"Confirmed","variant":"success","size":"md"}',
  'UW-007': '{"profile":{"name":"Acme Corp","customerId":"CUST-1029","type":"Wholesale","salesRep":"Alice Chen","priceList":"Wholesale 2025","territory":"Northeast","contacts":[{"name":"John Smith","role":"Buyer","email":"john@acme.com"}]},"metrics":{"cards":[{"label":"Total Orders","value":47},{"label":"Total Revenue","value":892000,"format":"currency"},{"label":"Avg Order Value","value":18979,"format":"currency"},{"label":"Last Order","value":"Apr 15, 2026"}]},"salesTrend":[42000,45000,38000,51000,67000,58000,72000,68000,81000,89000,76000,92000],"recentOrders":[{"id":"ORD-5829","date":"Apr 15","value":24500,"status":{"label":"Confirmed","variant":"success"}},{"id":"ORD-5801","date":"Mar 28","value":18200,"status":{"label":"Confirmed","variant":"success"}}],"openTasks":[{"title":"Follow up on Q3 renewal","due":"Apr 22"},{"title":"Send updated catalog","due":"Apr 25"}],"riskIndicator":{"level":"healthy","reason":"Consistent ordering, no overdue payments"}}',
  'UW-008': '{"skuId":"SKU-12345","name":"Premium Leather Crossbody Bag","price":{"base":299,"sale":249,"currency":"USD"},"availability":{"inStock":24,"status":"in_stock","backorderAllowed":false},"labels":["New Arrival","Best Seller"],"actions":[{"label":"Add to Cart","variant":"primary"},{"label":"Wishlist","variant":"secondary"}]}',
  'UW-009': '{"products":[{"skuId":"SKU-001","name":"Premium Leather Bag","price":{"base":299,"sale":249,"currency":"USD"},"availability":{"inStock":24,"status":"in_stock"},"labels":["New"]},{"skuId":"SKU-002","name":"Canvas Tote","price":{"base":89,"currency":"USD"},"availability":{"inStock":5,"status":"low_stock"},"labels":[]},{"skuId":"SKU-003","name":"Crossbody Sling","price":{"base":149,"currency":"USD"},"availability":{"inStock":0,"status":"out_of_stock"},"labels":["Sale"]},{"skuId":"SKU-004","name":"Weekend Duffel","price":{"base":189,"currency":"USD"},"availability":{"inStock":12,"status":"in_stock"},"labels":["Popular"]},{"skuId":"SKU-005","name":"Mini Backpack","price":{"base":129,"sale":109,"currency":"USD"},"availability":{"inStock":3,"status":"low_stock"},"labels":["Sale"]},{"skuId":"SKU-006","name":"Travel Wallet","price":{"base":59,"currency":"USD"},"availability":{"inStock":38,"status":"in_stock"},"labels":[]}],"layout":"grid","total":48,"pagination":{"page":1,"pageSize":12,"total":48}}',
  'UW-010': '{"entries":[{"timestamp":"2026-04-15T14:32:00Z","actor":"Alice Chen","action":"Order Confirmed","detail":"Confirmed ORD-5829 for $24,500"},{"timestamp":"2026-04-15T14:20:00Z","actor":"System","action":"Payment Received","detail":"Full payment of $24,500 processed via Visa *4242"},{"timestamp":"2026-04-14T09:15:00Z","actor":"Bob Kumar","action":"Order Submitted","detail":"Quote QUO-1209 converted to order"},{"timestamp":"2026-04-13T16:00:00Z","actor":"Bob Kumar","action":"Draft Created","detail":"Draft order created from catalog"}],"orientation":"vertical"}',
  'UW-011': '{"items":[{"title":"ORD-5829 · Acme Corp","subtitle":"Apr 15, 2026","badge":{"label":"Confirmed","variant":"success"},"meta":"$24,500"},{"title":"ORD-5801 · Acme Corp","subtitle":"Mar 28, 2026","badge":{"label":"Confirmed","variant":"success"},"meta":"$18,200"},{"title":"ORD-5774 · Beta Industries","subtitle":"Feb 12, 2026","badge":{"label":"Confirmed","variant":"success"},"meta":"$31,800"},{"title":"ORD-5723 · Gamma LLC","subtitle":"Jan 8, 2026","badge":{"label":"Cancelled","variant":"danger"},"meta":"$9,400"},{"title":"ORD-5690 · Delta Co","subtitle":"Dec 20, 2025","badge":{"label":"Confirmed","variant":"success"},"meta":"$44,100"}],"maxVisible":5,"emptyState":"No items to display"}',
  'UW-012': '{"customer":{"name":"Acme Corp","id":"CUST-1029"},"priceList":"Wholesale 2025","items":[{"sNo":1,"skuId":"SKU-001","name":"Premium Leather Bag","price":249,"qty":10,"total":2490,"cft":12.5},{"sNo":2,"skuId":"SKU-002","name":"Canvas Tote","price":89,"qty":25,"total":2225,"cft":8.2},{"sNo":3,"skuId":"SKU-004","name":"Weekend Duffel","price":189,"qty":8,"total":1512,"cft":18.6}],"container":{"skuCapacity":500,"cftCapacity":100,"totalCft":73.5,"fillPercent":73.5},"summary":{"orderTotal":6227,"units":43,"discount":300,"shipping":180,"total":6107},"actions":[{"label":"Create Order","variant":"primary"},{"label":"Save Draft","variant":"secondary"}]}',
  'UW-013': '{"filters":[{"field":"Status","operator":"is","value":"Confirmed","removable":true},{"field":"Order Value","operator":">","value":"$10,000","removable":true},{"field":"Sales Rep","operator":"is","value":"Alice Chen","removable":true},{"field":"Date Range","operator":"is","value":"Apr 2026","removable":false}]}',
  'UW-014': '{"summary":"Filtered 1,247 orders by status=Confirmed and value > $10K. Found 89 matching orders totalling $2.1M.","steps":[{"stepNumber":1,"action":"Applied status filter","detail":"status = Confirmed","dataSource":"orders_table"},{"stepNumber":2,"action":"Applied value filter","detail":"order_value > 10000","dataSource":"orders_table"},{"stepNumber":3,"action":"Aggregated results","detail":"COUNT=89, SUM=$2,108,450","dataSource":"orders_table"}],"dataAccessed":["orders_table","customers_table"],"timestamp":"2026-04-20T10:32:00Z","expandable":true}',
  'UW-015': '{"items":[{"label":"Q1 2026","metrics":[{"key":"Revenue","value":"$14.1M"},{"key":"Orders","value":"1,089"},{"key":"Avg Order","value":"$12,938"},{"key":"New Customers","value":"42"}]},{"label":"Q2 2026","metrics":[{"key":"Revenue","value":"$16.2M"},{"key":"Orders","value":"1,247"},{"key":"Avg Order","value":"$12,993"},{"key":"New Customers","value":"58"}]}],"highlightWinner":true}',
  'UW-016': '{"type":"warning","title":"3 Customers at Churn Risk","body":"Acme Corp, Beta Industries, and Delta Co have not placed orders in 90+ days. Proactive outreach is recommended.","dismissible":true}',
  'UW-017': '{"fileName":"Q2_Product_Catalog_2026.pdf","fileType":"pdf","fileSize":"4.2 MB","uploadedDate":"2026-04-10T09:00:00Z","actions":[{"label":"Download","variant":"primary"},{"label":"Copy Link","variant":"secondary"}]}',
  'UW-018': '{"roleName":"Field Sales Rep","modules":[{"moduleName":"Orders","permissions":[{"name":"View Orders","enabled":true},{"name":"Create Orders","enabled":true},{"name":"Edit Orders","enabled":true},{"name":"Delete Orders","enabled":false},{"name":"Approve Orders","enabled":false}]},{"moduleName":"Customers","permissions":[{"name":"View Customers","enabled":true},{"name":"Create Customers","enabled":false},{"name":"Edit Customers","enabled":true}]},{"moduleName":"Reports","permissions":[{"name":"View Sales Reports","enabled":true},{"name":"View Team Reports","enabled":false},{"name":"Export Reports","enabled":false}]}]}',
  'UW-019': '{"operation":"import","entity":"Products","status":"in_progress","progress":67,"details":{"totalRows":1247,"processedRows":835,"errorCount":3,"fileName":"products_batch_april.csv"},"errors":["Row 124: Invalid SKU format","Row 389: Missing required field price","Row 891: Duplicate SKU ID"]}',
  'UW-020': '{"segmentName":"Gold Tier Customers","segmentType":"customer","includeRules":[{"condition":"Total Orders","operator":">=","values":["10"]},{"condition":"Annual Revenue","operator":">","values":["$50,000"]}],"excludeRules":[{"condition":"Customer Status","operator":"is","values":["Inactive","At Risk"]}],"matchMode":"all","memberCount":128}',
  'UW-021': '{"name":"Spring Volume Discount","type":"product","status":{"label":"Active","variant":"success"},"application":"automatic","channels":["WizOrder","WizShop"],"customerEligibility":"Gold Tier Customers","productEligibility":"All","discountValue":{"type":"percent","value":15,"tiers":[{"minQty":10,"maxQty":24,"value":10},{"minQty":25,"maxQty":49,"value":15},{"minQty":50,"maxQty":null,"value":20}]},"schedule":{"start":"2026-04-01","end":"2026-06-30","timezone":"America/New_York"},"campaignLimit":"No limit"}',
  'UW-022': '{"workflowName":"Nightly Product Sync","status":{"label":"Running","variant":"warning"},"startTime":"2026-04-20T02:00:00Z","nodes":[{"name":"Fetch Data","type":"source","status":"completed"},{"name":"Transform","type":"transform","status":"completed"},{"name":"Validate","type":"validate","status":"running"},{"name":"Write to DB","type":"destination","status":"pending"},{"name":"Notify","type":"notification","status":"pending"}]}',
  'UW-023': '{"name":"Monthly Retainer — Acme Corp","customer":"Acme Corp","status":{"label":"Active","variant":"success"},"amount":{"payable":5000,"recurring":5000,"currency":"USD"},"frequency":"Monthly","dates":{"start":"2026-01-01","nextBilling":"2026-05-01","end":"2026-12-31"},"paymentMethod":"Visa ending 4242"}',
};

// ── Component-specific config options ─────────────────────────────────────
const COMP_CONFIGS = {
  'CH-002': [{ key: 'orientation', label: 'Orientation', type: 'select', opts: ['vertical', 'horizontal'], def: 'vertical' }],
  'CH-004': [{ key: 'mapType', label: 'Map Type', type: 'select', opts: ['state', 'region'], def: 'state' }],
  'CH-006': [{ key: 'gaugeStyle', label: 'Style', type: 'select', opts: ['semicircle', 'bar'], def: 'semicircle' }],
  'CH-009': [{ key: 'stacked', label: 'Stacked areas', type: 'toggle', def: true }],
};
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
    const from = colorScale?.min || '#1a2060', to = colorScale?.max || '#7c8fff';
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
    (usMap.objects.states.geometries || []).forEach(g => { nameById[g.id] = g.properties?.name; });
    svg.selectAll('path').data(features).join('path')
      .attr('d', path)
      .attr('fill', d => { const n = nameById[d.id] || d.properties?.name; return lookup[n] != null ? getColor(lookup[n]) : '#1e2130'; })
      .attr('stroke', '#252935').attr('stroke-width', 0.5)
      .append('title').text(d => { const n = nameById[d.id] || ''; return lookup[n] != null ? `${n}: ${formatVal(lookup[n], 'currency')}` : n; });
  }, [usMap, regions, mapType]);

  if (mapType === 'region') {
    const W = 600, H = 360;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: 360 }}>
        <rect width={W} height={H} rx={8} fill="#12141c" />
        <text x={W / 2} y={26} textAnchor="middle" fill="#5a6075" fontSize={11} fontFamily="JetBrains Mono">Region Bubble Map — {metric}</text>
        {regions.map((r, i) => {
          const pos = REGION_POS[r.regionName] || { cx: 0.5, cy: 0.5 };
          const cx = pos.cx * W, cy = pos.cy * H;
          const t = maxV === minV ? 0.5 : (r.value - minV) / (maxV - minV);
          const radius = 12 + t * 38;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={radius} fill={getColor(r.value)} fillOpacity={0.8} stroke="#252935" strokeWidth={1} />
              <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={Math.max(8, radius * 0.38)} fontWeight={600} fontFamily="Manrope">{r.regionName}</text>
              <text x={cx} y={cy + radius + 13} textAnchor="middle" fill="#8b92a8" fontSize={9.5} fontFamily="JetBrains Mono">{formatVal(r.value, 'currency')}</text>
            </g>
          );
        })}
      </svg>
    );
  }
  if (loading) return <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6075', fontSize: 12 }}>Loading US map data…</div>;
  if (mapErr) return <div style={{ padding: 16, color: '#fca5a5', fontSize: 12, fontFamily: 'JetBrains Mono', background: 'rgba(239,68,68,.07)', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)' }}>{mapErr}</div>;
  return (
    <div>
      <svg ref={svgRef} viewBox="0 0 600 380" style={{ width: '100%', maxHeight: 380, display: 'block' }} />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10, fontSize: 10.5, fontFamily: 'JetBrains Mono', color: '#8b92a8' }}>
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
    const row = { x }; series.forEach(s => { const pt = s.data.find(d => d.x === x); row[s.name] = pt?.y; }); return row;
  });
  const fmtY = v => yAxis?.format === 'currency' ? `$${(v / 1000).toFixed(0)}K` : yAxis?.format === 'percent' ? `${v}%` : v?.toLocaleString?.() ?? v;
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
  const orientation = cfg?.orientation || data.orientation || 'vertical';
  const fmtY = v => yAxis?.format === 'currency' ? `$${(v / 1000).toFixed(0)}K` : v?.toLocaleString?.() ?? v;
  if (orientation === 'horizontal') return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={bd} layout="vertical" margin={{ top: 5, right: 50, left: 90, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={fmtY} />
        <YAxis dataKey="category" type="category" width={85} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        {series ? series.map((s, i) => <Bar key={i} dataKey={s.name} fill={s.color || COLORS[i]} radius={[0, 4, 4, 0]} />)
          : <Bar dataKey="value" radius={[0, 4, 4, 0]}>{bd.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />)}<LabelList dataKey="value" position="right" formatter={v => fmtY(v)} style={{ fill: '#8b92a8', fontSize: 10.5 }} /></Bar>}
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
          : <Bar dataKey="value" radius={[4, 4, 0, 0]}>{bd.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />)}<LabelList dataKey="value" position="top" formatter={v => fmtY(v)} style={{ fill: '#8b92a8', fontSize: 10.5 }} /></Bar>}
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── CH-003: Donut / Pie ───────────────────────────────────────────────────
const renderDonut = (data) => {
  let { segments = [], centerLabel, showLegend = true } = data;
  if (segments.length > 6) {
    const top5 = segments.slice(0, 5), rest = segments.slice(5);
    segments = [...top5, { label: 'Other', value: rest.reduce((s, d) => s + d.value, 0), color: '#5a6075' }];
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
            <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 20, fontWeight: 800, color: '#e8eaf0', lineHeight: 1 }}>{centerLabel.value}</div>
            <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>{centerLabel.subtitle}</div>
          </div>
        )}
      </div>
      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segments.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color || COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#8b92a8', minWidth: 80 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf0', fontFamily: 'JetBrains Mono,monospace' }}>{((s.value / total) * 100).toFixed(1)}%</span>
              <span style={{ fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>({s.value.toLocaleString()})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── CH-004: Geographic Map (wrapper) ──────────────────────────────────────
const renderGeoMap = (data, cfg) => <GeoMap {...data} mapType={cfg?.mapType || data.mapType || 'state'} />;

// ── CH-005: Funnel Chart ──────────────────────────────────────────────────
const renderFunnel = (data) => {
  const { stages = [], metric } = data;
  const maxV = Math.max(...stages.map(s => s.value));
  return (
    <div style={{ padding: '0 20px' }}>
      {stages.map((s, i) => (
        <div key={i}>
          {i > 0 && <div style={{ textAlign: 'center', fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', margin: '4px 0' }}>↓ {s.conversionRate ? `${s.conversionRate}% conversion` : ''}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <div style={{ width: `${Math.max((s.value / maxV) * 100, 18)}%`, background: `linear-gradient(135deg,${COLORS[i % COLORS.length]}bb,${COLORS[i % COLORS.length]})`, borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{s.name}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>{s.value.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 10 }}>Unit: {metric}</div>
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
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${la} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };
  const startA = -180, totalA = 179.9, fillA = startA + pct * totalA;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let fillColor = COLORS[0];
  for (const t of sorted) { if ((value || 0) >= t.value) fillColor = t.color; }
  const fv = v => formatVal(v, format);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={300} height={150} viewBox="0 0 300 150" style={{ overflow: 'visible' }}>
        <path d={arc(-180, 0)} fill="none" stroke="#252935" strokeWidth={sw} strokeLinecap="round" />
        {sorted.map((t, i) => {
          const nv = sorted[i + 1]?.value ?? max, ta1 = startA + (t.value / max) * totalA, ta2 = startA + (nv / max) * totalA;
          return <path key={i} d={arc(ta1, ta2)} fill="none" stroke={t.color + '25'} strokeWidth={sw} />;
        })}
        <path d={arc(-180, fillA)} fill="none" stroke={fillColor} strokeWidth={sw} strokeLinecap="round" />
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#e8eaf0" fontSize={26} fontWeight={800} fontFamily="Satoshi,sans-serif">{fv(value)}</text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill="#5a6075" fontSize={10.5} fontFamily="JetBrains Mono,monospace">{label}</text>
        <text x={35} y={cy + 10} textAnchor="middle" fill="#5a6075" fontSize={10}>{fv(0)}</text>
        <text x={265} y={cy + 10} textAnchor="middle" fill="#5a6075" fontSize={10}>{fv(max)}</text>
      </svg>
      {thresholds.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
          {sorted.map((t, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8b92a8' }}>
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
        {[{ l: 'Current', v: last, c: '#e8eaf0' }, { l: 'Peak', v: max, c: '#22c78a' }, { l: 'Trough', v: min, c: '#ef4444' }, { l: 'Trend', v: last >= first ? '▲ Up' : '▼ Down', c: last >= first ? '#22c78a' : '#ef4444' }].map((s, i) => (
          <div key={i} style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 20, fontWeight: 800, color: s.c }}>{typeof s.v === 'number' ? s.v.toLocaleString() : s.v}</div>
            <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px', background: '#181b23', borderRadius: 10, border: '1px solid #252935' }}>
        <SparklineInline data={nums} color={color} height={80} showEndDot={showEndDot} />
      </div>
      <div style={{ fontSize: 10.5, color: '#5a6075', marginTop: 8, fontFamily: 'JetBrains Mono,monospace', textAlign: 'center' }}>
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
          {dayLabels.map((d, i) => <div key={i} style={{ height: 16, fontSize: 9, color: '#5a6075', textAlign: 'center', lineHeight: '16px', fontFamily: 'JetBrains Mono,monospace' }}>{i % 2 === 0 ? d : ''}</div>)}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 14 }} />
            {week.map((d, di) => (
              <div key={di} title={d ? `${d}: ${lookup[d] || 0}` : ''} style={{ width: 16, height: 16, borderRadius: 3, background: d ? getC(lookup[d]) : '#181b23', border: '1px solid #252935', opacity: d ? 1 : 0.25, cursor: d ? 'pointer' : 'default' }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
        Less {[0, .2, .4, .6, .8, 1].map((v, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 2, background: `rgba(91,106,240,${0.1 + v * 0.85})` }} />)} More
      </div>
    </div>
  );
};

// ── CH-009: Stacked Area ──────────────────────────────────────────────────
const renderStackedArea = (data, cfg) => {
  const { series = [], yAxis } = data;
  const stacked = cfg?.stacked !== false;
  const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
  const chartData = allX.map(x => { const row = { x }; series.forEach(s => { const pt = s.data.find(d => d.x === x); row[s.name] = pt?.y; }); return row; });
  const fmtY = v => yAxis?.format === 'currency' ? `$${(v / 1000).toFixed(0)}K` : v?.toLocaleString?.() ?? v;
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
  const fmtY = v => format === 'currency' ? `$${(v / 1000).toFixed(0)}K` : v?.toLocaleString?.() ?? v;
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={cd} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10.5 }} /><YAxis tickFormatter={fmtY} />
        <Tooltip content={({ active, payload, label }) => {
          if (!active || !payload?.length) return null;
          const d = cd.find(c => c.name === label);
          return <div style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 8, padding: '9px 13px', fontSize: 12 }}>
            <div style={{ color: '#8b92a8', marginBottom: 4 }}>{label}</div>
            <div style={{ color: '#e8eaf0', fontWeight: 600 }}>{fmtY(d?.raw)}</div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>
        <span>Rank · Name</span><span>{metric}</span>
      </div>
      {entries.map((e, i) => {
        const pct = maxV ? (e.value || 0) / maxV * 100 : 0, intensity = 1 - i / (entries.length - 1 || 1) * 0.5;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `rgba(91,106,240,${0.15 + i * 0.02})`, border: '1px solid rgba(91,106,240,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: '#7c8fff', fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{e.rank || i + 1}</div>
            <div style={{ width: 100, fontSize: 11.5, color: '#8b92a8', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.label}</div>
            <div style={{ flex: 1, height: 28, background: '#181b23', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `rgba(91,106,240,${intensity})`, borderRadius: 6, transition: 'width .6s ease' }} />
              <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 11, color: '#e8eaf0', fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{fv(e.value)}</div>
            </div>
            {e.meta && <div style={{ fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{e.meta}</div>}
          </div>
        );
      })}
    </div>
  );
};
// ── UW-001: Metric Card ───────────────────────────────────────────────────
const renderMetricCard = (data) => {
  const { label, value, format, trend, comparison, sparkline } = data;
  const tc = trend?.direction === 'up' ? '#22c78a' : trend?.direction === 'down' ? '#ef4444' : '#8b92a8';
  const arr = trend?.direction === 'up' ? '▲' : trend?.direction === 'down' ? '▼' : '→';
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
      {title && <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{title}</div>}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {cards.map((c, i) => {
          const tc = c.trend?.direction === 'up' ? '#22c78a' : c.trend?.direction === 'down' ? '#ef4444' : '#8b92a8';
          const arr = c.trend?.direction === 'up' ? '▲' : c.trend?.direction === 'down' ? '▼' : '→';
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
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#5a6075', marginBottom: 3 }}>{data.entityType?.toUpperCase()}</div>
          <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 16, fontWeight: 700 }}>{header?.title}</div>
          <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginTop: 2 }}>{header?.id}</div>
        </div>
        {header?.status && <StatusBadge {...header.status} />}
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
  const renderCell = (col, row) => { const v = row[col.key]; if (col.type === 'badge' && v?.label) return <StatusBadge {...v} size="sm" />; if (col.type === 'currency') return <span style={{ fontFamily: 'JetBrains Mono,monospace' }}>${(parseFloat(v) || 0).toLocaleString()}</span>; return <span>{String(v ?? '')}</span>; };
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
        {pagination && <div className="tbl-footer">
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
  const rc = riskColors[riskIndicator?.level] || '#8b92a8';
  return (
    <div>
      {riskIndicator && <div style={{ background: rc + '15', border: `1px solid ${rc}40`, borderRadius: 8, padding: '9px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 14 }}>{riskIndicator.level === 'healthy' ? '✅' : riskIndicator.level === 'watch' ? '⚠️' : '❌'}</span>
        <div><div style={{ fontSize: 12, fontWeight: 700, color: rc, textTransform: 'capitalize' }}>{riskIndicator.level?.replace('_', ' ')} Customer</div>
          <div style={{ fontSize: 11.5, color: '#8b92a8', marginTop: 2 }}>{riskIndicator.reason}</div></div>
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 2 }}>{profile?.name}</div>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#5a6075', marginBottom: 10 }}>{profile?.customerId} · {profile?.type}</div>
          {[['Sales Rep', profile?.salesRep], ['Price List', profile?.priceList], ['Territory', profile?.territory]].map(([k, v]) => (
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
        {(metrics?.cards || []).map((c, i) => (
          <div key={i} style={{ background: '#181b23', border: '1px solid #252935', borderRadius: 8, padding: '10px 14px', flex: '1 1 120px' }}>
            <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', marginBottom: 4, textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 17, fontWeight: 800, color: '#e8eaf0' }}>{c.format ? formatVal(c.value, c.format) : c.value}</div>
          </div>
        ))}
      </div>
      <SectionDivider title="Recent Orders" />
      {(recentOrders || []).map((o, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', borderBottom: '1px solid #1e2130' }}>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#5b6af0' }}>{o.id}</span>
          <span style={{ fontSize: 11, color: '#5a6075', flex: 1 }}>{o.date}</span>
          <StatusBadge {...o.status} size="sm" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e8eaf0', fontFamily: 'JetBrains Mono,monospace' }}>${o.value?.toLocaleString()}</span>
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
  const sc = { in_stock: '#22c78a', low_stock: '#f59e0b', out_of_stock: '#ef4444' }[availability?.status] || '#8b92a8';
  const sl = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' }[availability?.status] || 'Unknown';
  return (
    <div className="product-card" style={{ maxWidth: 240 }}>
      <div className="product-img" style={{ background: '#1a1d26' }}>🛍️</div>
      <div className="product-body">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>{labels.map((l, i) => <StatusBadge key={i} label={l} variant="info" size="sm" />)}</div>
        <div className="product-name">{name}</div>
        <div className="product-sku">{skuId}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          <div className="product-price">${(price?.sale || price?.base || 0).toLocaleString()}</div>
          {price?.sale && <div className="product-price-orig">${price.base?.toLocaleString()}</div>}
        </div>
        <div style={{ fontSize: 11, color: sc, marginBottom: 10, fontWeight: 600 }}>{sl}{availability?.inStock > 0 ? ` · ${availability.inStock} units` : ''}</div>
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
              {p.labels?.length > 0 && <StatusBadge label={p.labels[0]} variant="info" size="sm" />}
              <div className="product-name" style={{ marginTop: 4 }}>{p.name}</div>
              <div className="product-sku">{p.skuId}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 14, fontWeight: 800 }}>${(p.price?.sale || p.price?.base || 0).toLocaleString()}</div>
                {p.price?.sale && <div style={{ fontSize: 10.5, color: '#5a6075', textDecoration: 'line-through' }}>${p.price.base}</div>}
              </div>
              <div style={{ fontSize: 10, color: sc[p.availability?.status] || '#8b92a8', fontWeight: 600 }}>{sl[p.availability?.status]}</div>
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
        <div><div style={{ fontSize: 10.5, color: '#5a6075', marginBottom: 2 }}>Customer</div><div style={{ fontSize: 13, fontWeight: 700 }}>{customer?.name}</div></div>
        <div><div style={{ fontSize: 10.5, color: '#5a6075', marginBottom: 2 }}>Price List</div><div style={{ fontSize: 12, color: '#e8eaf0' }}>{priceList}</div></div>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 14, borderRadius: 8, border: '1px solid #252935' }}>
        <table className="tbl">
          <thead><tr>{['#', 'SKU', 'Name', 'Price', 'Qty', 'Total', 'CFT'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{items.map((it, i) => (
            <tr key={i}>
              <td>{it.sNo}</td><td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5 }}>{it.skuId}</td>
              <td>{it.name}</td><td>${it.price?.toLocaleString()}</td><td>{it.qty}</td>
              <td style={{ fontWeight: 600 }}>${it.total?.toLocaleString()}</td>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, padding: '8px 0', fontFamily: 'Satoshi,sans-serif' }}>
              <span>Total</span><span>${summary.total?.toLocaleString()}</span>
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
  const metrics = items[0]?.metrics?.map(m => m.key) || [];
  const getBestIdx = key => {
    const vals = items.map(item => { const m = item.metrics?.find(m => m.key === key); return parseFloat(String(m?.value || '').replace(/[^0-9.]/g, '')) || 0; });
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
              const m = item.metrics?.find(m => m.key === key);
              const isWinner = highlightWinner && getBestIdx(key) === ci;
              return <div key={mi} className="cmp-metric-row"><span className={`cmp-metric-val ${isWinner ? 'winner' : ''}`}>{isWinner && '🏆 '}{m?.value}</span></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
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
          <span>{fileType?.toUpperCase()}</span>
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
          <div style={{ fontSize: 11, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>{details?.fileName}</div>
        </div>
        <StatusBadge label={statusLabel[status] || status} variant={statusVariant[status] || 'neutral'} size="md" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 6 }}>
          <span style={{ color: '#8b92a8' }}>{details?.processedRows?.toLocaleString()} / {details?.totalRows?.toLocaleString()} rows</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="prog-bar-wrap">
          <div className={`prog-bar-fill ${status === 'in_progress' ? 'animated' : ''}`} style={{ width: `${progress}%`, background: barColor }} />
        </div>
      </div>
      {details?.errorCount > 0 && (
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
          <div style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 24, fontWeight: 800, color: '#5b6af0' }}>{memberCount?.toLocaleString()}</div>
          <div style={{ fontSize: 9.5, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace' }}>MEMBERS</div>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontSize: 11, color: '#5a6075' }}>
        Match <b style={{ color: '#e8eaf0' }}>{matchMode?.toUpperCase()}</b> of the following conditions
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
      <Row label="Schedule" value={`${schedule?.start}  →  ${schedule?.end}`} mono />
      <Row label="Campaign Limit" value={campaignLimit} />
      {discountValue?.tiers?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: '#5a6075', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>Tiered Discount Structure</div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #252935' }}>
            <table className="tbl">
              <thead><tr><th>Min Qty</th><th>Max Qty</th><th>Discount</th></tr></thead>
              <tbody>
                {discountValue.tiers.map((t, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{t.minQty}</td>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{t.maxQty ?? '∞'}</td>
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
  const start = new Date(dates?.start), next = new Date(dates?.nextBilling), end = new Date(dates?.end);
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
          { lbl: 'Payable Amount', v: `$${amount?.payable?.toLocaleString()} ${amount?.currency}`, big: true },
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
        <span>{fmtDate(dates?.start)}</span>
        <span style={{ color: '#f59e0b' }}>{fmtDate(dates?.nextBilling)}</span>
        <span>{fmtDate(dates?.end)}</span>
      </div>
    </div>
  );
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
  const fileRef = useRef();

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
          {renderedComp && <span className="canvas-badge">{activeComp?.id} · {activeComp?.name}</span>}
          <div style={{ flex: 1 }} />
          {renderedComp && (
            <span className="canvas-meta">{activeComp?.cat} · {renderedComp}</span>
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
          <div className="chart-frame">
            <div className={`chart-wrap ${canvasSize} fade-in`}>
              {(chartTitle || chartSub) && (
                <div className="chart-hdr">
                  {chartTitle && <div className="chart-title">{chartTitle}</div>}
                  {chartSub && <div className="chart-sub">{chartSub}</div>}
                </div>
              )}
              {RENDERERS[renderedComp]
                ? RENDERERS[renderedComp](renderedData, renderedCfg)
                : <div style={{ color: '#5a6075', textAlign: 'center', padding: 24 }}>Renderer not found for {renderedComp}</div>
              }
            </div>
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
