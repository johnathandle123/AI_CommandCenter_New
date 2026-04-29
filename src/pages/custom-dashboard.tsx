import { useState, useCallback, useRef, useEffect } from 'react'
import { buildRows, repack, detectDropZone, applyDrop, getPositions, type LayoutCard, type DropZone } from '../components/dashboard-engine'
import { HeadingField } from '@pglevy/sailwind'
import { Plus, Settings, Trash2, GripVertical, BarChart3, TrendingUp, PieChart, Hash, Table, Activity, ChevronRight, ChevronDown, Search, X, Upload, Database, Globe, FileText, GitBranch, Check } from 'lucide-react'
import { Link } from 'wouter'


type ChartType = 'bar' | 'line' | 'pie' | 'kpi' | 'table' | 'heatmap'
type CardConfig = {
  id: string
  title: string
  chartType: ChartType
  dataSource: string
  dataField: string
  color: string
}

const chartIcons: Record<ChartType, React.ReactNode> = {
  bar: <BarChart3 size={16} />, line: <TrendingUp size={16} />, pie: <PieChart size={16} />,
  kpi: <Hash size={16} />, table: <Table size={16} />, heatmap: <Activity size={16} />,
}

const chartColors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316','#6366f1']

const appianObjects = [
  { type: 'Records', icon: <Database size={14} />, items: ['Customer','Invoice','Employee','Case','Asset','Vendor','Order','Product'] },
  { type: 'Process Models', icon: <GitBranch size={14} />, items: ['CO_Onboarding_v3','INV_Process_v2','HR_Review_v1','HD_Ticket_v4','EX_Approval_v1'] },
  { type: 'Reports', icon: <FileText size={14} />, items: ['Monthly Revenue','Active Cases','Employee Headcount','SLA Compliance','Cost Analysis'] },
  { type: 'AI Usage', icon: <Activity size={14} />, items: ['AI Calls Summary','AI Cost by Skill','Guardrail Triggers','Model Latency','Token Usage'] },
  { type: 'MCP', icon: <Globe size={14} />, items: ['Tool Call Volume','Server Status','Error Rate by Server','Response Times','Available Tools'] },
]

const fieldsBySource: Record<string, string[]> = {
  Customer: ['Total Count','New This Month','By Region','By Status','Avg Lifetime Value','Churn Rate'],
  Invoice: ['Total Amount','Pending Count','Overdue','Avg Processing Time','By Status','Monthly Trend'],
  Employee: ['Headcount','New Hires','Turnover Rate','By Department','Avg Tenure','Open Positions'],
  Case: ['Open Cases','Resolved Today','Avg Resolution Time','By Priority','SLA Compliance','Backlog'],
  'AI Calls Summary': ['Total Calls','By Skill','By Status','Avg Latency','Error Rate','Cost MTD'],
  'AI Cost by Skill': ['Monthly Trend','By Skill','Top 5 Costliest','Cost per Request','Budget vs Actual'],
  'Guardrail Triggers': ['Total Triggers','By Type','PII Detections','Toxicity Blocks','Trend'],
  'Tool Call Volume': ['Total Calls','By Server','By Tool','Trend','Peak Hours'],
  'Server Status': ['Connected Count','Error Rate','Avg Response Time','By Server','Uptime'],
  default: ['Count','Sum','Average','Min','Max','Trend','Distribution','Top 10'],
}

const homeCards: CardConfig[] = [
  // Health Summary row (4 cards)
  { id: 'h1', title: 'Process Activity', chartType: 'kpi', dataSource: 'Case', dataField: 'Open Cases', color: '#3b82f6' },
  { id: 'h2', title: 'Record Response Times', chartType: 'kpi', dataSource: 'Case', dataField: 'Avg Resolution Time', color: '#f59e0b' },
  { id: 'h3', title: 'Security Warnings', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Error Rate', color: '#ef4444' },
  { id: 'h4', title: 'Test Health', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Uptime', color: '#10b981' },
  // Key Metrics row (3 KPIs)
  { id: 'h5', title: 'Requests/sec', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#3b82f6' },
  { id: 'h6', title: 'Avg Latency', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Avg Latency', color: '#f59e0b' },
  { id: 'h7', title: 'Error Rate', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Error Rate', color: '#ef4444' },
  // Throughput & Latency (2 wide charts)
  { id: 'h8', title: 'Throughput (req/s)', chartType: 'line', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#3b82f6' },
  { id: 'h9', title: 'Latency (p50 / p95 / p99)', chartType: 'line', dataSource: 'AI Calls Summary', dataField: 'Avg Latency', color: '#f59e0b' },
  // Errors & Active Sessions (2 wide)
  { id: 'h10', title: 'Error Rate Over Time', chartType: 'line', dataSource: 'AI Calls Summary', dataField: 'Error Rate', color: '#ef4444' },
  { id: 'h11', title: 'Active Sessions', chartType: 'line', dataSource: 'Server Status', dataField: 'Connected Count', color: '#8b5cf6' },
  // Appian Runtime (4 cards)
  { id: 'h12', title: 'CPU Usage', chartType: 'line', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#8b5cf6' },
  { id: 'h13', title: 'JVM Heap', chartType: 'line', dataSource: 'Server Status', dataField: 'Uptime', color: '#06b6d4' },
  { id: 'h14', title: 'Thread Pool', chartType: 'line', dataSource: 'Server Status', dataField: 'Connected Count', color: '#10b981' },
  { id: 'h15', title: 'GC Pauses', chartType: 'line', dataSource: 'Server Status', dataField: 'Error Rate', color: '#ec4899' },
  // Infrastructure (3 cards)
  { id: 'h16', title: 'Disk I/O', chartType: 'line', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#f97316' },
  { id: 'h17', title: 'Network Throughput', chartType: 'line', dataSource: 'Server Status', dataField: 'Connected Count', color: '#6366f1' },
  { id: 'h18', title: 'DB Connections', chartType: 'bar', dataSource: 'Server Status', dataField: 'Connected Count', color: '#06b6d4' },
  // Service Throughput & Top Endpoints (2 wide)
  { id: 'h19', title: 'Service Throughput', chartType: 'bar', dataSource: 'Tool Call Volume', dataField: 'By Server', color: '#f97316' },
  { id: 'h20', title: 'Top Endpoints', chartType: 'table', dataSource: 'Tool Call Volume', dataField: 'By Tool', color: '#6366f1' },
]
const homeLayouts = { lg: [
  { i: 'h1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'h2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'h3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'h4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  { i: 'h5', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2 }, { i: 'h6', x: 4, y: 2, w: 4, h: 2, minW: 2, minH: 2 }, { i: 'h7', x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
  { i: 'h8', x: 0, y: 4, w: 6, h: 3, minW: 2, minH: 2 }, { i: 'h9', x: 6, y: 4, w: 6, h: 3, minW: 2, minH: 2 },
  { i: 'h10', x: 0, y: 7, w: 6, h: 3, minW: 2, minH: 2 }, { i: 'h11', x: 6, y: 7, w: 6, h: 3, minW: 2, minH: 2 },
  { i: 'h12', x: 0, y: 10, w: 3, h: 3, minW: 2, minH: 2 }, { i: 'h13', x: 3, y: 10, w: 3, h: 3, minW: 2, minH: 2 }, { i: 'h14', x: 6, y: 10, w: 3, h: 3, minW: 2, minH: 2 }, { i: 'h15', x: 9, y: 10, w: 3, h: 3, minW: 2, minH: 2 },
  { i: 'h16', x: 0, y: 13, w: 4, h: 3, minW: 2, minH: 2 }, { i: 'h17', x: 4, y: 13, w: 4, h: 3, minW: 2, minH: 2 }, { i: 'h18', x: 8, y: 13, w: 4, h: 3, minW: 2, minH: 2 },
  { i: 'h19', x: 0, y: 16, w: 6, h: 3, minW: 2, minH: 2 }, { i: 'h20', x: 6, y: 16, w: 6, h: 3, minW: 2, minH: 2 },
]}

// AI Usage dashboard - mirrors AI > Observe tab
const aiCards: CardConfig[] = [
  // KPI row (4 cards)
  { id: 'a1', title: 'Total Requests', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Total Calls', color: '#3b82f6' },
  { id: 'a2', title: 'Avg Latency', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Avg Latency', color: '#f59e0b' },
  { id: 'a3', title: 'Error Rate', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Error Rate', color: '#ef4444' },
  { id: 'a4', title: 'Est. Cost (MTD)', chartType: 'kpi', dataSource: 'AI Cost by Skill', dataField: 'Budget vs Actual', color: '#8b5cf6' },
  // Charts row (2 wide)
  { id: 'a5', title: 'Requests Over Time', chartType: 'bar', dataSource: 'AI Calls Summary', dataField: 'Total Calls', color: '#3b82f6' },
  { id: 'a6', title: 'Latency (p50 / p95 / p99)', chartType: 'line', dataSource: 'AI Calls Summary', dataField: 'Avg Latency', color: '#f59e0b' },
  // Cost & Guardrails (2 wide)
  { id: 'a7', title: 'Cost Over Time', chartType: 'line', dataSource: 'AI Cost by Skill', dataField: 'Monthly Trend', color: '#8b5cf6' },
  { id: 'a8', title: 'Guardrail Triggers', chartType: 'bar', dataSource: 'Guardrail Triggers', dataField: 'By Type', color: '#ef4444' },
  // Per-Skill Breakdown (full width table)
  { id: 'a9', title: 'Per-Skill Breakdown', chartType: 'table', dataSource: 'AI Calls Summary', dataField: 'By Skill', color: '#3b82f6' },
  // MCP Server (4 KPIs)
  { id: 'a10', title: 'MCP Tool Calls', chartType: 'kpi', dataSource: 'Tool Call Volume', dataField: 'Total Calls', color: '#3b82f6' },
  { id: 'a11', title: 'MCP Avg Response', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#f59e0b' },
  { id: 'a12', title: 'MCP Error Rate', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Error Rate', color: '#ef4444' },
  { id: 'a13', title: 'MCP Available Tools', chartType: 'kpi', dataSource: 'Tool Call Volume', dataField: 'By Tool', color: '#10b981' },
]
const aiLayouts = { lg: [
  { i: 'a1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  { i: 'a5', x: 0, y: 2, w: 6, h: 3, minW: 2, minH: 2 }, { i: 'a6', x: 6, y: 2, w: 6, h: 3, minW: 2, minH: 2 },
  { i: 'a7', x: 0, y: 5, w: 6, h: 3, minW: 2, minH: 2 }, { i: 'a8', x: 6, y: 5, w: 6, h: 3, minW: 2, minH: 2 },
  { i: 'a9', x: 0, y: 8, w: 12, h: 3, minW: 2, minH: 2 },
  { i: 'a10', x: 0, y: 11, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a11', x: 3, y: 11, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a12', x: 6, y: 11, w: 3, h: 2, minW: 2, minH: 2 }, { i: 'a13', x: 9, y: 11, w: 3, h: 2, minW: 2, minH: 2 },
]}


// ── Chart Renderers ──

function BarChartWidget({ color }: { color: string }) {
  const data = [{l:'Mon',v:65},{l:'Tue',v:45},{l:'Wed',v:80},{l:'Thu',v:55},{l:'Fri',v:90},{l:'Sat',v:70},{l:'Sun',v:85}]
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-end gap-1 flex-1 px-2 pb-1">
        {data.map((d, i) => <div key={i} className="flex-1 flex flex-col items-center gap-0.5"><span className="text-[8px] text-gray-500">{d.v}</span><div className="w-full rounded-t transition-all hover:opacity-80" style={{ height: `${d.v}%`, backgroundColor: i === 4 ? color : `${color}40` }} /></div>)}
      </div>
      <div className="flex justify-between px-2 text-[8px] text-gray-400">{data.map(d => <span key={d.l}>{d.l}</span>)}</div>
    </div>
  )
}

function LineChartWidget({ color }: { color: string }) {
  const points = [30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95]
  const max = 100, h = 100, w = 100
  const coords = points.map((p, i) => ({ x: (i / (points.length - 1)) * w, y: h - (p / max) * h }))
  // Smooth cubic bezier path
  const path = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`
    const prev = coords[i - 1]
    const cpx1 = prev.x + (pt.x - prev.x) * 0.4
    const cpx2 = pt.x - (pt.x - prev.x) * 0.4
    return `${acc} C${cpx1},${prev.y} ${cpx2},${pt.y} ${pt.x},${pt.y}`
  }, '')
  const gradId = `lg-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col justify-between text-[8px] text-gray-400 pr-1 py-1"><span>100</span><span>50</span><span>0</span></div>
        <div className="flex-1 min-w-0">
          <svg className="w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
            <path d={`${path} L${w},${h} L0,${h} Z`} fill={`url(#${gradId})`} />
            <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      <div className="flex justify-between text-[8px] text-gray-400 pl-6"><span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>Now</span></div>
    </div>
  )
}

function PieChartWidget({ color }: { color: string }) {
  const segments = [{l:'Group A',v:35},{l:'Group B',v:25},{l:'Group C',v:20},{l:'Group D',v:12},{l:'Other',v:8}]
  const colors = [color, `${color}cc`, `${color}99`, `${color}66`, `${color}33`]
  let cumulative = 0
  return (
    <div className="flex items-center h-full gap-2">
      <svg className="w-1/2 h-full" viewBox="0 0 100 100">
        {segments.map((seg, i) => {
          const start = cumulative * 3.6, end = (cumulative + seg.v) * 3.6
          cumulative += seg.v
          const r = 40, cx = 50, cy = 50
          const x1 = cx + r * Math.cos((start - 90) * Math.PI / 180), y1 = cy + r * Math.sin((start - 90) * Math.PI / 180)
          const x2 = cx + r * Math.cos((end - 90) * Math.PI / 180), y2 = cy + r * Math.sin((end - 90) * Math.PI / 180)
          const large = seg.v > 50 ? 1 : 0
          return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={colors[i]} className="hover:opacity-80 transition-opacity" />
        })}
      </svg>
      <div className="space-y-1 text-[9px]">{segments.map((s, i) => <div key={i} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:colors[i]}} /><span className="text-gray-600">{s.l}</span><span className="text-gray-400 ml-auto">{s.v}%</span></div>)}</div>
    </div>
  )
}

function KPIWidget({ title, color }: { title: string; color: string }) {
  const values: Record<string, { value: string; change: string; up: boolean }> = {
    'Active Cases': { value: '247', change: '+12%', up: true },
    'SLA Compliance': { value: '94.2%', change: '+2.1%', up: true },
    default: { value: '1,847', change: '+8.3%', up: true },
  }
  const kpi = values[title] || values.default
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-3xl font-bold" style={{ color }}>{kpi.value}</div>
      <div className={`text-xs font-medium mt-1 ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>{kpi.change} vs last period</div>
    </div>
  )
}

function TableWidget() {
  const rows = [
    { name: 'Pending', count: 142, pct: '38%' }, { name: 'Approved', count: 98, pct: '26%' },
    { name: 'In Review', count: 67, pct: '18%' }, { name: 'Rejected', count: 45, pct: '12%' },
    { name: 'Draft', count: 23, pct: '6%' },
  ]
  return (
    <table className="w-full text-xs">
      <thead><tr className="border-b border-gray-200"><th className="text-left py-1.5 px-2 text-gray-500 font-medium">Status</th><th className="text-right py-1.5 px-2 text-gray-500 font-medium">Count</th><th className="text-right py-1.5 px-2 text-gray-500 font-medium">%</th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-gray-100 hover:bg-gray-50"><td className="py-1.5 px-2 text-gray-900">{r.name}</td><td className="text-right py-1.5 px-2 text-gray-700">{r.count}</td><td className="text-right py-1.5 px-2 text-gray-500">{r.pct}</td></tr>)}</tbody>
    </table>
  )
}

function HeatmapWidget({ color }: { color: string }) {
  return (
    <div className="grid grid-cols-7 gap-0.5 h-full p-1">
      {Array.from({ length: 35 }, (_, i) => {
        const opacity = Math.random() * 0.8 + 0.1
        return <div key={i} className="rounded-sm" style={{ backgroundColor: color, opacity }} />
      })}
    </div>
  )
}

function renderChart(card: CardConfig) {
  switch (card.chartType) {
    case 'bar': return <BarChartWidget color={card.color} />
    case 'line': return <LineChartWidget color={card.color} />
    case 'pie': return <PieChartWidget color={card.color} />
    case 'kpi': return <KPIWidget title={card.title} color={card.color} />
    case 'table': return <TableWidget />
    case 'heatmap': return <HeatmapWidget color={card.color} />
  }
}

// ── Data Source Picker ──

function DataSourcePicker({ value, field, sourceType, onSelect }: { value: string; field: string; sourceType: 'appian' | 'external'; onSelect: (source: string, field: string) => void }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Records']))
  const [selectedSource, setSelectedSource] = useState(value)
  const [selectedField, setSelectedField] = useState(field)

  const toggle = (type: string) => setExpanded(prev => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n })
  const fields = fieldsBySource[selectedSource] || fieldsBySource.default

  return (
    <div className="space-y-3">
      {sourceType === 'appian' && (
        <>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search data sources..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            {appianObjects.filter(g => !search || g.items.some(i => i.toLowerCase().includes(search.toLowerCase()))).map(group => (
              <div key={group.type}>
                <button onClick={() => toggle(group.type)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                  {expanded.has(group.type) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}{group.icon}{group.type}
                </button>
                {expanded.has(group.type) && group.items.filter(i => !search || i.toLowerCase().includes(search.toLowerCase())).map(item => (
                  <button key={item} onClick={() => { setSelectedSource(item); setSelectedField('') }} className={`w-full text-left pl-9 pr-3 py-1.5 text-xs transition-colors ${selectedSource === item ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {item} {selectedSource === item && <Check size={10} className="inline ml-1" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {selectedSource && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Field / Metric</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-32 overflow-y-auto">
                {fields.map(f => (
                  <button key={f} onClick={() => { setSelectedField(f); onSelect(selectedSource, f) }} className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${selectedField === f ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {f} {selectedField === f && <Check size={10} className="inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {sourceType === 'external' && (
        <div className="space-y-2">
          {[
            { name: 'REST API', desc: 'Connect to any API endpoint', icon: <Globe size={14} /> },
            { name: 'CSV Upload', desc: 'Upload a spreadsheet file', icon: <Upload size={14} /> },
            { name: 'Database', desc: 'Connect to SQL database', icon: <Database size={14} /> },
            { name: 'Google Sheets', desc: 'Import from Google Sheets', icon: <FileText size={14} /> },
          ].map(s => (
            <button key={s.name} className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-left">
              <div className="text-gray-400">{s.icon}</div>
              <div><div className="text-sm font-medium text-gray-900">{s.name}</div><div className="text-xs text-gray-500">{s.desc}</div></div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Card Edit Panel ──

function CardEditPanel({ card, onSave, onClose }: { card: CardConfig; onSave: (c: CardConfig) => void; onClose: () => void }) {
  const [config, setConfig] = useState(card)
  const [sourceType, setSourceType] = useState<'appian' | 'external'>('appian')
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">{card.id.startsWith('new') ? 'New Card' : 'Edit Card'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Data Source Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setSourceType('appian')} className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors ${sourceType === 'appian' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}><Database size={14} />Appian Data</button>
              <button onClick={() => setSourceType('external')} className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors ${sourceType === 'external' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}><Globe size={14} />External Source</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Data Source</label>
            <DataSourcePicker value={config.dataSource} field={config.dataField} sourceType={sourceType} onSelect={(s, f) => setConfig({ ...config, dataSource: s, dataField: f })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
            <div className="flex gap-2">
              {chartColors.map(c => (
                <button key={c} onClick={() => setConfig({ ...config, color: c })} className={`w-7 h-7 rounded-full transition-all ${config.color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Chart Type</label>
            {(() => {
              const fieldLower = (config.dataField || '').toLowerCase()
              const recommended: ChartType[] =
                /count|total|rate|compliance|headcount|avg|average/.test(fieldLower) ? ['kpi','bar'] :
                /trend|monthly|over time/.test(fieldLower) ? ['line','bar'] :
                /by (region|status|department|priority)|distribution/.test(fieldLower) ? ['pie','bar'] :
                /top|backlog|open|list/.test(fieldLower) ? ['table','bar'] :
                /min|max/.test(fieldLower) ? ['heatmap','kpi'] :
                []
              return (
                <>
                  {recommended.length > 0 && <p className="text-[10px] text-blue-600 mb-2">✦ Recommended for "{config.dataField}" based on data type</p>}
                  <div className="grid grid-cols-3 gap-2">
                    {(['bar','line','pie','kpi','table','heatmap'] as ChartType[]).sort((a, b) => {
                      const ai = recommended.indexOf(a), bi = recommended.indexOf(b)
                      if (ai !== -1 && bi === -1) return -1
                      if (ai === -1 && bi !== -1) return 1
                      return 0
                    }).map(t => (
                      <button key={t} onClick={() => setConfig({ ...config, chartType: t })} className={`relative flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${config.chartType === t ? 'border-blue-400 bg-blue-50 text-blue-700' : recommended.includes(t) ? 'border-blue-200 bg-blue-50/30 text-gray-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {chartIcons[t]}{t.charAt(0).toUpperCase() + t.slice(1)}
                        {recommended.indexOf(t) === 0 && <span className="absolute -top-1.5 -right-1.5 px-1 py-0 bg-blue-600 text-white text-[8px] rounded-full font-bold">Best</span>}
                      </button>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(config); onClose() }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard Tab Bar ──

type TabBarProps = { tabs: any[]; activeTab: string; setActiveTab: (id: string) => void; editingTabName: string | null; setEditingTabName: (id: string | null) => void; renameTab: (id: string, name: string) => void; addTab: () => void; deleteTab: (id: string) => void; addCard: () => void }

function DashTabs({ tabs, activeTab, setActiveTab, editingTabName, setEditingTabName, renameTab, addTab, deleteTab, addCard }: TabBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8">
      <div className="flex items-center justify-between pt-5 pb-2">
        <HeadingField text="Dashboard" size="LARGE" marginBelow="NONE" />
      </div>
      <div className="flex gap-0">
        {tabs.map(tab => (
          <div key={tab.id} className="relative group">
            {editingTabName === tab.id ? (
              <input autoFocus defaultValue={tab.name} onBlur={e => renameTab(tab.id, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') renameTab(tab.id, (e.target as HTMLInputElement).value) }} className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 bg-transparent focus:outline-none w-32" />
            ) : (
              <button onClick={() => setActiveTab(tab.id)} onDoubleClick={() => setEditingTabName(tab.id)} className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <span className={tabs.length > 1 ? "group-hover:opacity-60 transition-opacity" : ""}>{tab.name}</span>{tabs.length > 1 && <span onClick={e => { e.stopPropagation(); deleteTab(tab.id) }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs cursor-pointer">×</span>}
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} className="px-3 py-3 text-sm text-gray-400 hover:text-gray-600 border-b-2 border-transparent"><Plus size={14} /></button>
      </div>
    </div>
  )
}

function DashHeader({ tabs, activeTab, setActiveTab, editingTabName, setEditingTabName, renameTab, addTab, deleteTab, addCard }: TabBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8">
      <div className="flex items-center justify-between pt-5 pb-2">
        <div><Link href="/" className="text-xs text-blue-600 hover:underline mb-0.5 inline-block">← Back</Link><h1 className="text-xl font-semibold text-gray-900">Dashboard</h1></div>
      </div>
      <div className="flex gap-0">
        {tabs.map(tab => (
          <div key={tab.id} className="relative group">
            {editingTabName === tab.id ? (
              <input autoFocus defaultValue={tab.name} onBlur={e => renameTab(tab.id, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') renameTab(tab.id, (e.target as HTMLInputElement).value) }} className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 bg-transparent focus:outline-none w-32" />
            ) : (
              <button onClick={() => setActiveTab(tab.id)} onDoubleClick={() => setEditingTabName(tab.id)} className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <span className={tabs.length > 1 ? "group-hover:opacity-60 transition-opacity" : ""}>{tab.name}</span>{tabs.length > 1 && <span onClick={e => { e.stopPropagation(); deleteTab(tab.id) }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs cursor-pointer">×</span>}
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} className="px-3 py-3 text-sm text-gray-400 hover:text-gray-600 border-b-2 border-transparent"><Plus size={14} /></button>
      </div>
    </div>
  )
}

// ── Main Dashboard ──

export default function CustomDashboard({ embedded = false }: { embedded?: boolean }) {
  type DashboardTab = { id: string; name: string; cards: CardConfig[]; layout: LayoutCard[] }

  const toLayoutCards = (lgItems: any[]): LayoutCard[] => lgItems.map((item: any, i: number) => ({ id: item.i, row: Math.floor(item.y / 3), col: i, w: item.w, h: item.h || 2 }))

  const [tabs, setTabs] = useState<DashboardTab[]>([
    { id: 't1', name: 'Overview', cards: homeCards, layout: toLayoutCards(homeLayouts.lg) },
    { id: 't2', name: 'AI Usage', cards: aiCards, layout: toLayoutCards(aiLayouts.lg) },
  ])
  const [activeTab, setActiveTab] = useState('t1')
  const [editingTabName, setEditingTabName] = useState<string | null>(null)
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]
  const cards = currentTab.cards
  const layout = currentTab.layout
  const setCards = (fn: (prev: CardConfig[]) => CardConfig[]) => setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, cards: fn(t.cards) } : t))
  const setLayout = (fn: (prev: LayoutCard[]) => LayoutCard[]) => setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, layout: fn(t.layout) } : t))
  const [editingCard, setEditingCard] = useState<CardConfig | null>(null)

  // ── Custom Layout Engine ──
  const ROW_HEIGHT = 80
  const GAP = 12
  const gridRef = useRef<HTMLDivElement>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [currentZone, setCurrentZone] = useState<DropZone | null>(null)
  const zoneRef = useRef<DropZone | null>(null)

  const rows = buildRows(layout)
  const { positions, totalHeight } = getPositions(rows, ROW_HEIGHT, GAP)

  const handleDragStart = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setDraggedId(id)
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return
    const frozenRows = buildRows(layout)

    const onMove = (ev: MouseEvent) => {
      const mx = (ev.clientX - rect.left) / rect.width
      const my = ev.clientY - rect.top
      setDragPos({ x: ev.clientX - e.clientX, y: ev.clientY - e.clientY })
      const zone = detectDropZone(frozenRows, id, mx, my, ROW_HEIGHT, GAP)
      setCurrentZone(zone)
      zoneRef.current = zone
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const zone = zoneRef.current
      if (zone) {
        setLayout(() => applyDrop(frozenRows, id, zone))
      }
      setDraggedId(null)
      setDragPos(null)
      setCurrentZone(null)
      zoneRef.current = null
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [layout])


  const addTab = () => {
    const id = `t${Date.now()}`
    setTabs(prev => [...prev, { id, name: `Dashboard ${prev.length + 1}`, cards: [], layout: [] }])
    setActiveTab(id)
  }

  const deleteTab = (id: string) => {
    if (tabs.length <= 1) return
    setTabs(prev => prev.filter(t => t.id !== id))
    if (activeTab === id) setActiveTab(tabs[0].id)
  }

  const renameTab = (id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t))
    setEditingTabName(null)
  }

  const addCard = () => {
    const id = `c${Date.now()}`
    const newCard: CardConfig = { id, title: 'New Card', chartType: 'bar', dataSource: '', dataField: '', color: chartColors[cards.length % chartColors.length] }
    setCards(prev => [...prev, newCard])
    setLayout(prev => {
      const newLayout: LayoutCard = { id, row: 999, col: 0, w: 4, h: 2 }
      return repack([...prev, newLayout])
    })
    setEditingCard(newCard)
  }

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
    setLayout(prev => repack(prev.filter(l => l.id !== id)))
  }

  const saveCard = (updated: CardConfig) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  const [onboardStep, setOnboardStep] = useState<'idle' | 'pick-cards'>('idle')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set())

  const roleTemplates: Record<string, CardConfig[]> = {
    'System Admin': [
      { id: 'ta1', title: 'Thread Usage', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Avg Response Time', color: '#3b82f6' },
      { id: 'ta2', title: 'Error Rate Trend', chartType: 'line', dataSource: 'AI Calls Summary', dataField: 'Error Rate', color: '#ef4444' },
      { id: 'ta3', title: 'Process Errors', chartType: 'bar', dataSource: 'Case', dataField: 'By Priority', color: '#f59e0b' },
      { id: 'ta4', title: 'Sync Status', chartType: 'table', dataSource: 'Employee', dataField: 'By Status', color: '#10b981' },
      { id: 'ta5', title: 'JVM Heap', chartType: 'kpi', dataSource: 'Server Status', dataField: 'Uptime', color: '#8b5cf6' },
      { id: 'ta6', title: 'Integration Health', chartType: 'heatmap', dataSource: 'Tool Call Volume', dataField: 'By Server', color: '#06b6d4' },
    ],
    'Analyst': [
      { id: 'tb1', title: 'Active Cases', chartType: 'kpi', dataSource: 'Case', dataField: 'Open Cases', color: '#3b82f6' },
      { id: 'tb2', title: 'Revenue Trend', chartType: 'line', dataSource: 'Invoice', dataField: 'Monthly Trend', color: '#10b981' },
      { id: 'tb3', title: 'Cases by Priority', chartType: 'pie', dataSource: 'Case', dataField: 'By Priority', color: '#8b5cf6' },
      { id: 'tb4', title: 'SLA Compliance', chartType: 'kpi', dataSource: 'Case', dataField: 'SLA Compliance', color: '#06b6d4' },
      { id: 'tb5', title: 'Invoice Status', chartType: 'bar', dataSource: 'Invoice', dataField: 'By Status', color: '#f59e0b' },
      { id: 'tb6', title: 'Customer Growth', chartType: 'line', dataSource: 'Customer', dataField: 'New This Month', color: '#ec4899' },
    ],
    'Developer': [
      { id: 'tc1', title: 'AI Cost MTD', chartType: 'kpi', dataSource: 'AI Cost by Skill', dataField: 'Budget vs Actual', color: '#3b82f6' },
      { id: 'tc2', title: 'Guardrail Triggers', chartType: 'bar', dataSource: 'Guardrail Triggers', dataField: 'By Type', color: '#ef4444' },
      { id: 'tc3', title: 'MCP Tool Calls', chartType: 'line', dataSource: 'Tool Call Volume', dataField: 'Trend', color: '#8b5cf6' },
      { id: 'tc4', title: 'AI Calls by Skill', chartType: 'pie', dataSource: 'AI Calls Summary', dataField: 'By Skill', color: '#f59e0b' },
      { id: 'tc5', title: 'Model Latency', chartType: 'line', dataSource: 'AI Calls Summary', dataField: 'Avg Latency', color: '#10b981' },
      { id: 'tc6', title: 'Token Usage', chartType: 'kpi', dataSource: 'AI Calls Summary', dataField: 'Total Calls', color: '#06b6d4' },
    ],
  }

  const startTemplate = (role: string) => {
    setSelectedRole(role)
    const tmplCards = roleTemplates[role] || []
    setSelectedCardIds(new Set(tmplCards.map(c => c.id)))
    setOnboardStep('pick-cards')
  }

  const applyTemplate = () => {
    if (!selectedRole) return
    const tmplCards = (roleTemplates[selectedRole] || []).filter(c => selectedCardIds.has(c.id))
    const layoutCards: LayoutCard[] = tmplCards.map((c, i) => ({ id: c.id, row: Math.floor(i / 3), col: i % 3, w: 4, h: 2 }))
    setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, cards: tmplCards, layout: repack(layoutCards) } : t))
    setOnboardStep('idle')
  }

  const toggleCard = (id: string) => setSelectedCardIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  if (cards.length === 0) {
    return (
      <div className={embedded ? '' : 'min-h-screen bg-gray-50'}>
        {!embedded && <DashHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} editingTabName={editingTabName} setEditingTabName={setEditingTabName} renameTab={renameTab} addTab={addTab} deleteTab={deleteTab} addCard={addCard} />}
        {embedded && <DashTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} editingTabName={editingTabName} setEditingTabName={setEditingTabName} renameTab={renameTab} addTab={addTab} deleteTab={deleteTab} addCard={addCard} />}
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"><BarChart3 size={28} className="text-gray-400" /></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Get started with a template</h2>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">Choose a template based on your role, or start from scratch.</p>
          <div className="flex gap-3 mb-4">
            {[
              { role: 'System Admin', icon: <Settings size={16} className="text-blue-500" />, desc: 'Server health, errors, sync' },
              { role: 'Analyst', icon: <TrendingUp size={16} className="text-green-500" />, desc: 'KPIs, trends, SLA' },
              { role: 'Developer', icon: <Activity size={16} className="text-purple-500" />, desc: 'AI, MCP, guardrails' },
            ].map(r => (
              <button key={r.role} onClick={() => startTemplate(r.role)} className="w-44 text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                <div className="mb-2">{r.icon}</div>
                <div className="text-sm font-medium text-gray-900">{r.role}</div>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={addCard} className="text-sm text-gray-500 hover:text-blue-600">or start from scratch</button>
        </div>

        {/* Card selection modal */}
        {onboardStep === 'pick-cards' && selectedRole && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[520px] h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">Choose your cards</h3>
                <button onClick={() => setOnboardStep('idle')} className="p-1 hover:bg-gray-100 rounded"><X size={16} className="text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
                <p className="text-sm text-gray-500 mb-3">Deselect any cards you don't need. You can always add more later.</p>
                {(roleTemplates[selectedRole] || []).map(card => (
                  <label key={card.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedCardIds.has(card.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50 opacity-60'}`}>
                    <input type="checkbox" checked={selectedCardIds.has(card.id)} onChange={() => toggleCard(card.id)} className="rounded border-gray-300 text-blue-600" />
                    <div className="flex items-center gap-2 flex-1">
                      <div style={{ color: card.color }}>{chartIcons[card.chartType]}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{card.title}</div>
                        <div className="text-xs text-gray-500">{card.dataSource} · {card.dataField}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 capitalize">{card.chartType}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0">
                <button onClick={() => setOnboardStep('idle')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">← Back</button>
                <button onClick={applyTemplate} disabled={selectedCardIds.size === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">Create Dashboard ({selectedCardIds.size} cards)</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={embedded ? '' : 'min-h-screen bg-gray-50'}>
      {!embedded && <DashHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} editingTabName={editingTabName} setEditingTabName={setEditingTabName} renameTab={renameTab} addTab={addTab} deleteTab={deleteTab} addCard={addCard} />}
      {embedded && <DashTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} editingTabName={editingTabName} setEditingTabName={setEditingTabName} renameTab={renameTab} addTab={addTab} deleteTab={deleteTab} addCard={addCard} />}

      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="flex justify-end mb-4">
          <button onClick={addCard} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Plus size={14} />Add Card</button>
        </div>
        <div ref={gridRef} className="relative" style={{ minHeight: totalHeight || 200 }}>
          {/* Drop zone: swap highlight */}
          {draggedId && currentZone?.type === 'swap' && positions[currentZone.targetId] && (
            <div className="pointer-events-none absolute z-20 transition-all duration-150" style={{
              left: `${positions[currentZone.targetId].x * 100}%`,
              top: positions[currentZone.targetId].y,
              width: `${positions[currentZone.targetId].w * 100}%`,
              height: positions[currentZone.targetId].h,
              padding: `0 ${GAP / 2}px`,
            }}><div className="w-full h-full border-2 border-blue-400 bg-blue-100/40 rounded-lg" /></div>
          )}

          {/* Drop zone: between cards (vertical bar) */}
          {draggedId && currentZone?.type === 'between' && (() => {
            const row = rows[currentZone.rowIndex]
            if (!row) return null
            let xFrac = 0
            for (let i = 0; i < Math.min(currentZone.insertAt, row.cards.length); i++) {
              if (row.cards[i].id !== draggedId) xFrac += row.cards[i].w / 12
            }
            let yOffset = 0
            for (let i = 0; i < currentZone.rowIndex; i++) yOffset += rows[i].height * ROW_HEIGHT + GAP
            return <div className="pointer-events-none absolute z-20" style={{ left: `calc(${xFrac * 100}% - 2px)`, top: yOffset + 4, height: row.height * ROW_HEIGHT - 8 }}><div className="w-1 h-full bg-blue-500 rounded-full" /></div>
          })()}

          {/* Drop zone: above/below row (horizontal bar) */}
          {draggedId && (currentZone?.type === 'above-row' || currentZone?.type === 'below-row') && (() => {
            let yPos = 0
            for (let i = 0; i < currentZone.rowIndex; i++) yPos += rows[i].height * ROW_HEIGHT + GAP
            if (currentZone.type === 'below-row') yPos += (rows[currentZone.rowIndex]?.height || 0) * ROW_HEIGHT + GAP / 2
            else yPos -= GAP / 2
            return <div className="pointer-events-none absolute z-20 left-2 right-2" style={{ top: yPos }}><div className="h-1 bg-blue-500 rounded-full" /></div>
          })()}

          {/* Cards */}
          {cards.map(card => {
            const pos = positions[card.id]
            if (!pos) return null
            const isDragged = draggedId === card.id
            const isSwapTarget = currentZone?.type === 'swap' && currentZone.targetId === card.id
            return (
              <div
                key={card.id}
                className={`absolute transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isDragged ? 'z-50 opacity-80 scale-[1.02] shadow-2xl' : ''}`}
                style={{
                  left: `${pos.x * 100}%`,
                  top: pos.y,
                  width: `${pos.w * 100}%`,
                  height: pos.h,
                  padding: `0 ${GAP / 2}px`,
                  ...(isDragged && dragPos ? { transform: `translate(${dragPos.x}px, ${dragPos.y}px) scale(1.02)`, transition: 'none' } : {}),
                }}
              >
                <div className={`h-full bg-white rounded-lg border shadow-sm hover:shadow-md transition-all overflow-hidden group ${isSwapTarget ? 'border-blue-400 ring-2 ring-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center min-w-0">
                      <div onMouseDown={e => handleDragStart(card.id, e)} className="drag-handle cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-gray-100 text-gray-400 w-0 opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all overflow-hidden"><GripVertical size={14} /></div>
                      <span className="text-xs font-semibold text-gray-800 truncate">{card.title}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingCard(card)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings size={12} /></button>
                      <button onClick={() => deleteCard(card.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="p-2" style={{ height: 'calc(100% - 37px)' }}>
                    {renderChart(card)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {editingCard && <CardEditPanel card={editingCard} onSave={saveCard} onClose={() => setEditingCard(null)} />}
    </div>
  )
}
