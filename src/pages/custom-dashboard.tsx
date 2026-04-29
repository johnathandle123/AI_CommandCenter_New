import { useState, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Plus, Settings, Trash2, GripVertical, BarChart3, TrendingUp, PieChart, Hash, Table, Activity, ChevronRight, ChevronDown, Search, X, Upload, Database, Globe, FileText, Layers, GitBranch, Link2, FolderOpen, Check } from 'lucide-react'
import { Link } from 'wouter'

const ResponsiveGridLayout = WidthProvider(Responsive)

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
  { type: 'Interfaces', icon: <Layers size={14} />, items: ['Customer Dashboard','Invoice Detail','HR Portal','Vendor Registration','Claims Intake'] },
  { type: 'Integrations', icon: <Link2 size={14} />, items: ['SAP_Finance','Salesforce_CRM','DocuSign','Twilio_SMS','AWS_S3'] },
  { type: 'Data Stores', icon: <FolderOpen size={14} />, items: ['Primary DB','Analytics Warehouse','Archive Store','Staging DB'] },
]

const fieldsBySource: Record<string, string[]> = {
  Customer: ['Total Count','New This Month','By Region','By Status','Avg Lifetime Value','Churn Rate'],
  Invoice: ['Total Amount','Pending Count','Overdue','Avg Processing Time','By Status','Monthly Trend'],
  Employee: ['Headcount','New Hires','Turnover Rate','By Department','Avg Tenure','Open Positions'],
  Case: ['Open Cases','Resolved Today','Avg Resolution Time','By Priority','SLA Compliance','Backlog'],
  default: ['Count','Sum','Average','Min','Max','Trend','Distribution','Top 10'],
}

const defaultCards: CardConfig[] = [
  { id: 'c1', title: 'Active Cases', chartType: 'kpi', dataSource: 'Case', dataField: 'Open Cases', color: '#3b82f6' },
  { id: 'c2', title: 'Monthly Revenue', chartType: 'line', dataSource: 'Invoice', dataField: 'Monthly Trend', color: '#10b981' },
  { id: 'c3', title: 'Cases by Priority', chartType: 'bar', dataSource: 'Case', dataField: 'By Priority', color: '#8b5cf6' },
  { id: 'c4', title: 'Employee Distribution', chartType: 'pie', dataSource: 'Employee', dataField: 'By Department', color: '#f59e0b' },
  { id: 'c5', title: 'Invoice Status', chartType: 'table', dataSource: 'Invoice', dataField: 'By Status', color: '#ec4899' },
  { id: 'c6', title: 'SLA Compliance', chartType: 'kpi', dataSource: 'Case', dataField: 'SLA Compliance', color: '#06b6d4' },
]

const defaultLayouts = {
  lg: [
    { i: 'c1', x: 0, y: 0, w: 3, h: 2 }, { i: 'c2', x: 3, y: 0, w: 5, h: 4 },
    { i: 'c3', x: 8, y: 0, w: 4, h: 4 }, { i: 'c4', x: 0, y: 2, w: 3, h: 4 },
    { i: 'c5', x: 3, y: 4, w: 5, h: 4 }, { i: 'c6', x: 8, y: 4, w: 4, h: 2 },
  ]
}

// ── Chart Renderers ──

function BarChartWidget({ color }: { color: string }) {
  const bars = [65, 45, 80, 55, 90, 70, 85]
  return (
    <div className="flex items-end gap-1 h-full px-2 pb-1">
      {bars.map((v, i) => <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{ height: `${v}%`, backgroundColor: i === 4 ? color : `${color}40` }} />)}
    </div>
  )
}

function LineChartWidget({ color }: { color: string }) {
  const points = [30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95]
  const max = 100, h = 100
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 100},${h - (p / max) * h}`).join(' ')
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id={`lg-${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <polyline points={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <polygon points={`0,${h} ${path} 100,${h}`} fill={`url(#lg-${color})`} />
    </svg>
  )
}

function PieChartWidget({ color }: { color: string }) {
  const segments = [35, 25, 20, 12, 8]
  const colors = [color, `${color}cc`, `${color}99`, `${color}66`, `${color}33`]
  let cumulative = 0
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      {segments.map((seg, i) => {
        const start = cumulative * 3.6, end = (cumulative + seg) * 3.6
        cumulative += seg
        const r = 40, cx = 50, cy = 50
        const x1 = cx + r * Math.cos((start - 90) * Math.PI / 180), y1 = cy + r * Math.sin((start - 90) * Math.PI / 180)
        const x2 = cx + r * Math.cos((end - 90) * Math.PI / 180), y2 = cy + r * Math.sin((end - 90) * Math.PI / 180)
        const large = seg > 50 ? 1 : 0
        return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={colors[i]} className="hover:opacity-80 transition-opacity" />
      })}
    </svg>
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

function DataSourcePicker({ value, field, onSelect }: { value: string; field: string; onSelect: (source: string, field: string) => void }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Records']))
  const [tab, setTab] = useState<'appian' | 'external'>('appian')
  const [selectedSource, setSelectedSource] = useState(value)
  const [selectedField, setSelectedField] = useState(field)

  const toggle = (type: string) => setExpanded(prev => { const n = new Set(prev); n.has(type) ? n.delete(type) : n.add(type); return n })
  const fields = fieldsBySource[selectedSource] || fieldsBySource.default

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
        <button onClick={() => setTab('appian')} className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'appian' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Appian Data</button>
        <button onClick={() => setTab('external')} className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'external' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>External</button>
      </div>

      {tab === 'appian' && (
        <>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search objects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
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

      {tab === 'external' && (
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
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Chart Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['bar','line','pie','kpi','table','heatmap'] as ChartType[]).map(t => (
                <button key={t} onClick={() => setConfig({ ...config, chartType: t })} className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${config.chartType === t ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {chartIcons[t]}{t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
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
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Data Source</label>
            <DataSourcePicker value={config.dataSource} field={config.dataField} onSelect={(s, f) => setConfig({ ...config, dataSource: s, dataField: f })} />
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

// ── Main Dashboard ──

export default function CustomDashboard() {
  const [cards, setCards] = useState<CardConfig[]>(defaultCards)
  const [layouts, setLayouts] = useState(defaultLayouts)
  const [editingCard, setEditingCard] = useState<CardConfig | null>(null)
  const [showEmpty] = useState(false)

  const onLayoutChange = useCallback((_: any, allLayouts: any) => { setLayouts(allLayouts) }, [])

  const addCard = () => {
    const id = `c${Date.now()}`
    const newCard: CardConfig = { id, title: 'New Card', chartType: 'bar', dataSource: '', dataField: '', color: chartColors[cards.length % chartColors.length] }
    setCards(prev => [...prev, newCard])
    setLayouts((prev: any) => ({ ...prev, lg: [...(prev.lg || []), { i: id, x: 0, y: Infinity, w: 4, h: 4 }] }))
    setEditingCard(newCard)
  }

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
    setLayouts((prev: any) => ({ ...prev, lg: (prev.lg || []).filter((l: any) => l.i !== id) }))
  }

  const saveCard = (updated: CardConfig) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c))
  }

  if (showEmpty || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div><Link href="/" className="text-xs text-blue-600 hover:underline mb-1 inline-block">← Back</Link><h1 className="text-xl font-semibold text-gray-900">Dashboard</h1></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4"><BarChart3 size={28} className="text-gray-400" /></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Build your dashboard</h2>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">Add cards to visualize your Appian data. Drag to rearrange, resize by pulling edges, and connect any data source.</p>
          <button onClick={addCard} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Plus size={16} />Add your first card</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-8 flex items-center" style={{ minHeight: '64px' }}>
        <div className="flex items-center justify-between w-full">
          <div><Link href="/" className="text-xs text-blue-600 hover:underline mb-0.5 inline-block">← Back</Link><h1 className="text-xl font-semibold text-gray-900">Dashboard</h1></div>
          <button onClick={addCard} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Plus size={14} />Add Card</button>
        </div>
      </div>

      <div className="px-6 py-4">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          isResizable={true}
          isDraggable={true}
          compactType="vertical"
          margin={[12, 12]}
          useCSSTransforms={true}
        >
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="drag-handle cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={14} /></div>
                  <span className="text-xs font-semibold text-gray-800 truncate">{card.title}</span>
                  <span className="text-[9px] text-gray-400">{card.dataSource}{card.dataField ? ` · ${card.dataField}` : ''}</span>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingCard(card)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><Settings size={12} /></button>
                  <button onClick={() => deleteCard(card.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="p-2 flex-1" style={{ height: 'calc(100% - 37px)' }}>
                {renderChart(card)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {editingCard && <CardEditPanel card={editingCard} onSave={saveCard} onClose={() => setEditingCard(null)} />}
    </div>
  )
}
