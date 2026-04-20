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
      title={`AW stub · type:${action.actionType || 'generic'}`}>
      {action.icon && <span style={{ marginRight: 4 }}>{action.icon}</span>}
      {action.label}
    </button>
  );
};

// ── Widget Error Boundary ───────────────────────────────────────────────
class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, border: '1px solid #ef4444', borderRadius: 8, background: '#ef444410', color: '#ef4444', fontSize: 11, fontFamily: 'monospace' }}>
          <b>⚠️ {this.props.name || 'Widget'} Error</b>
          <div style={{ marginTop: 4 }}>{this.state.error?.message || String(this.state.error)}</div>
          <div style={{ fontSize: 9, opacity: 0.7, marginTop: 4 }}>{this.state.error?.stack?.split('\n').slice(0, 3).join('\n')}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Shared Sub-Components ─────────────────────────────────────────────────
const StatusBadge = ({ label, variant = 'neutral', size = 'md' }) => {
  const c = BADGE_COLORS[variant] || BADGE_COLORS.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', borderRadius: 20, fontWeight: 600,
      whiteSpace: 'nowrap', fontFamily: 'Poppins,sans-serif',
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
      fontSize: 12, fontFamily: 'Poppins,sans-serif', boxShadow: '0 8px 32px rgba(0,0,0,.5)', minWidth: 110
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
