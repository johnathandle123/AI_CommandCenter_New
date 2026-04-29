import { HeadingField } from '@pglevy/sailwind'
import { Search, Grid3X3, Settings, Paintbrush, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Activity, Home, BarChart3, Sparkles, Clock, FileBarChart, Table2, Layers, Filter, Share2, Download, Pencil, Bot, Zap, ArrowLeft, ChevronRight, CheckCircle, XCircle, Shield, AlertTriangle, Inbox, FileCode, Cpu, ShieldCheck, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { useWaffleOption, AppiaFab } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'

const allWaffleApps = [
  { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', path: '/appian-ai', options: ['option5'] as const },
  { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', path: '/appian-designer' },
  { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
  { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard', options: ['option1'] as const },
  { name: 'Operations Console', icon: Monitor, color: 'bg-cyan-600', path: '/dashboard', options: ['option1','option2'] as const },
  { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
  { name: 'Process HQ', icon: BarChart3, color: 'bg-rose-500', active: true, path: '/process-hq', options: ['option4', 'option6'] as const },
  { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
  { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
  { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' },
]
const helpApps = [
  { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
  { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' },
]

const recentReports = [
  { name: 'Monthly Sales Summary', type: 'Report', viewedAt: '2 hours ago' },
  { name: 'Customer Onboarding Funnel', type: 'Dashboard', viewedAt: '4 hours ago' },
  { name: 'Q1 Process Efficiency', type: 'Report', viewedAt: 'Yesterday' },
  { name: 'Active Cases Overview', type: 'Dashboard', viewedAt: 'Yesterday' },
]

const allReports = [
  { name: 'Monthly Sales Summary', type: 'Report', owner: 'john.smith', lastModified: '4/15/2026 10:30 AM', views: 342 },
  { name: 'Customer Onboarding Funnel', type: 'Dashboard', owner: 'jane.doe', lastModified: '4/14/2026 3:15 PM', views: 218 },
  { name: 'Q1 Process Efficiency', type: 'Report', owner: 'mike.wilson', lastModified: '4/13/2026 11:00 AM', views: 156 },
  { name: 'Active Cases Overview', type: 'Dashboard', owner: 'sarah.jones', lastModified: '4/12/2026 4:45 PM', views: 489 },
  { name: 'Invoice Processing Times', type: 'Report', owner: 'david.brown', lastModified: '4/11/2026 2:20 PM', views: 97 },
  { name: 'HR Onboarding Metrics', type: 'Dashboard', owner: 'lisa.garcia', lastModified: '4/10/2026 9:30 AM', views: 134 },
  { name: 'Vendor Payment Tracker', type: 'Report', owner: 'tom.anderson', lastModified: '4/9/2026 1:15 PM', views: 78 },
  { name: 'Support Ticket Volume', type: 'Dashboard', owner: 'amy.taylor', lastModified: '4/8/2026 5:00 PM', views: 267 },
  { name: 'Compliance Audit Trail', type: 'Report', owner: 'chris.lee', lastModified: '4/7/2026 10:45 AM', views: 45 },
  { name: 'Resource Utilization', type: 'Dashboard', owner: 'nina.patel', lastModified: '4/6/2026 3:30 PM', views: 189 },
]

const processes = [
  { name: 'Customer Onboarding', model: 'CO_Onboarding_v3', activeInstances: 142, completedToday: 89, errorRate: '1.2%', avgDuration: '4.2 hrs', owner: 'john.smith' },
  { name: 'Invoice Processing', model: 'INV_Process_v2', activeInstances: 67, completedToday: 234, errorRate: '0.8%', avgDuration: '12 min', owner: 'jane.doe' },
  { name: 'Document Review', model: 'DR_Review_v2', activeInstances: 34, completedToday: 56, errorRate: '3.1%', avgDuration: '2.1 hrs', owner: 'mike.wilson' },
  { name: 'HR Review', model: 'HR_Review_v1', activeInstances: 12, completedToday: 45, errorRate: '0.2%', avgDuration: '1.5 hrs', owner: 'sarah.jones' },
  { name: 'Asset Transfer', model: 'AT_Transfer_v1', activeInstances: 8, completedToday: 23, errorRate: '0.5%', avgDuration: '3.8 hrs', owner: 'david.brown' },
  { name: 'Help Desk Ticket', model: 'HD_Ticket_v4', activeInstances: 89, completedToday: 312, errorRate: '0.3%', avgDuration: '45 min', owner: 'lisa.garcia' },
  { name: 'Vendor Onboarding', model: 'VO_Onboard_v2', activeInstances: 15, completedToday: 18, errorRate: '1.8%', avgDuration: '6.5 hrs', owner: 'tom.anderson' },
  { name: 'Expense Approval', model: 'EA_Approve_v3', activeInstances: 45, completedToday: 178, errorRate: '0.1%', avgDuration: '25 min', owner: 'amy.taylor' },
]

const recordTypes = [
  { name: 'Customer', source: 'Database', fields: 42, records: '45,230', lastSync: '4/16/2026 10:55 AM', status: 'Synced' },
  { name: 'Invoice', source: 'Database', fields: 28, records: '128,450', lastSync: '4/16/2026 10:50 AM', status: 'Synced' },
  { name: 'Employee', source: 'Salesforce', fields: 35, records: '12,890', lastSync: '4/16/2026 10:30 AM', status: 'Failed' },
  { name: 'Case', source: 'Database', fields: 51, records: '890,000', lastSync: '4/16/2026 10:45 AM', status: 'Warning' },
  { name: 'Asset', source: 'Web Service', fields: 19, records: '5,670', lastSync: '4/16/2026 10:40 AM', status: 'Synced' },
  { name: 'Vendor', source: 'Database', fields: 24, records: '3,450', lastSync: '4/16/2026 10:52 AM', status: 'Synced' },
  { name: 'Document', source: 'Database', fields: 31, records: '67,800', lastSync: '4/16/2026 10:48 AM', status: 'Synced' },
  { name: 'Task', source: 'Database', fields: 22, records: '234,500', lastSync: '4/16/2026 10:53 AM', status: 'Synced' },
  { name: 'Product', source: 'Web Service', fields: 38, records: '8,920', lastSync: '4/16/2026 10:35 AM', status: 'Synced' },
  { name: 'Contract', source: 'Database', fields: 45, records: '15,670', lastSync: '4/16/2026 10:47 AM', status: 'Synced' },
]

export default function ProcessHQ() {
  const [activeTab, setActiveTab] = useState<'home' | 'process-insights' | 'data-catalog' | 'ai-insights'>('home')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option2')
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<'home' | 'process-insights' | 'data-catalog' | 'ai-insights'>('home')
  const [selectedAiObject, setSelectedAiObject] = useState<string | null>(null)
  const [aiTimeframe, setAiTimeframe] = useState('This Month')
  const [runsPage, setRunsPage] = useState(0)

  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))
  const allSites = [
    'Admin Console', 'AI Command Center', 'Appian Designer', 'Operations Console',
    'Process HQ', 'Cloud Database', 'Feature Flags', 'System Logs',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))

  useEffect(() => {
    const h = (e: MouseEvent) => { if (showWaffleMenu && !(e.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showWaffleMenu])

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'process-insights' as const, label: 'Process Insights', icon: Layers },
    { id: 'ai-insights' as const, label: 'AI Usage Insights', icon: Sparkles },
    { id: 'data-catalog' as const, label: 'Data Catalog', icon: Table2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 rounded-lg p-3 flex items-center justify-center"><BarChart3 size={24} className="text-white" /></div>
            <HeadingField text="Process HQ" size="LARGE" headingTag="H1" marginBelow="NONE" fontWeight="BOLD" />
          </div>
          <div className="flex items-center gap-3">
            <VersionSwitcher />
            <button className="p-2 rounded-md hover:bg-white/20"><Search size={20} className="text-black" /></button>
            <button onClick={() => setShowWaffleMenu(!showWaffleMenu)} className="p-2 rounded-md hover:bg-white/20 waffle-menu"><Grid3X3 size={20} className={showWaffleMenu ? 'text-blue-500' : 'text-black'} /></button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">J</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" alt="Appian" className="h-6" />
          </div>
        </div>
      </div>

      {/* Waffle Menu */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] waffle-menu w-80 flex flex-col" style={{ maxHeight: '480px' }}>
          <div className="flex border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
            <button onClick={() => setWaffleTab('favorites')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'favorites' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Favorites</button>
            <button onClick={() => setWaffleTab('all')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>All</button>
          </div>
          {waffleTab === 'all' && (
            <div className="px-3 pt-3 pb-3 border-b border-gray-200 bg-white">
              <input type="text" placeholder="Search sites..." value={waffleSiteSearch} onChange={e => setWaffleSiteSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3">
            {waffleTab === 'favorites' ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {waffleApps.map((app, i) => { const Icon = app.icon; return (
                    <Link key={i} href={app.path}><button className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'}`} onClick={() => setShowWaffleMenu(false)}>
                      <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                      <span className="font-medium text-xs text-center">{app.name}</span>
                    </button></Link>
                  )})}
                </div>
                <div className="border-t border-gray-200 mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                  {helpApps.map((app, i) => { const Icon = app.icon; return (
                    <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500" onClick={() => setShowWaffleMenu(false)}>
                      <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                      <span className="font-medium text-xs text-center">{app.name}</span>
                    </button>
                  )})}
                </div>
              </>
            ) : (
              <div className="space-y-1">
                {allSites.map((site, i) => (<button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" onClick={() => setShowWaffleMenu(false)}>{site}</button>))}
              </div>
            )}
          </div>
          {!waffleLocked ? <div className="border-t border-gray-200 p-3 sticky bottom-0 bg-white rounded-b-lg">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option1">Option 1</option><option value="option2">Option 2</option><option value="option3">Option 3</option><option value="option4">Option 4</option><option value="option5">Option 5</option>
            </select>
          </div> : <div className="border-t border-gray-200 p-3 sticky bottom-0 bg-white rounded-b-lg">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option4">Option 1 — With Operations Console</option><option value="option6">Option 2 — Without Operations Console</option>
            </select>
          </div>}
        </div>
      )}

      {/* Body */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Nav */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <nav className="flex flex-col p-3 space-y-1">
            {(selectedDashboard ? tabs : tabs).map(tab => {
              const Icon = tab.icon
              const isActive = selectedDashboard ? detailTab === tab.id : activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => { if (selectedDashboard) setDetailTab(tab.id); else { setActiveTab(tab.id); setSearchQuery('') } }} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
                  <Icon size={18} /><span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
            <div>
              {selectedDashboard && !selectedAiObject && (
                <button onClick={() => { setSelectedDashboard(null); setSelectedAiObject(null) }} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-1"><ArrowLeft size={12} />Back to Process HQ</button>
              )}
              {selectedAiObject && (
                <button onClick={() => setSelectedAiObject(null)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-1"><ArrowLeft size={12} />{selectedDashboard ? 'Back to AI objects' : 'Back to all AI objects'}</button>
              )}
              <HeadingField text={selectedAiObject || selectedDashboard || tabs.find(t => t.id === activeTab)?.label || ''} size="LARGE" marginBelow="NONE" />
            </div>
            {selectedDashboard && !selectedAiObject && (
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Pencil size={14} />Edit</button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Filter size={14} />Filter</button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Share2 size={14} />Share</button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Download size={14} />Export</button>
              </div>
            )}
            {((activeTab === 'ai-insights' && !selectedDashboard) || (detailTab === 'ai-insights' && selectedDashboard)) && (
              <div className="flex items-center gap-2">
                <select value={aiTimeframe} onChange={e => setAiTimeframe(e.target.value)} className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 7 Days</option><option>Last 14 Days</option><option>This Month</option><option>Last 3 Months</option><option>This Quarter</option><option>This Year</option><option>All Time</option>
                </select>
              </div>
            )}
          </div>
          {selectedDashboard ? (
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            {detailTab === 'home' && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Cost Savings', value: '$284,500', change: '+32.4%', sub: 'vs. manual processing' },
                    { label: 'Time Saved', value: '12,450 hrs', change: '+28.1%', sub: 'across all AI skills' },
                    { label: 'AI Skill Invocations', value: '45,230', change: '+18.7%', sub: 'this quarter' },
                    { label: 'Avg Processing Time', value: '1.2 min', change: '-45.3%', sub: 'down from 2.2 min' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                      <div className={`text-xs font-medium ${kpi.change.startsWith('-') || kpi.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>{kpi.change}</div>
                      <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="text-sm font-bold text-gray-700 mb-4">Cost Savings by AI Skill</div>
                    <div className="space-y-3">
                      {[
                        { skill: 'Invoice Processing AI', savings: '$98,200', pct: 35 },
                        { skill: 'Customer Onboarding AI', savings: '$72,400', pct: 25 },
                        { skill: 'Document Review AI', savings: '$56,800', pct: 20 },
                        { skill: 'HR Benefits AI', savings: '$34,100', pct: 12 },
                        { skill: 'Tax Calculator AI', savings: '$23,000', pct: 8 },
                      ].map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1"><span className="text-gray-700 font-medium">{s.skill}</span><span className="text-gray-500">{s.savings}</span></div>
                          <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full" style={{ width: `${s.pct}%` }}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="text-sm font-bold text-gray-700 mb-4">Time Savings Trend (Monthly)</div>
                    <div className="h-48 flex items-end gap-2">
                      {[820, 950, 1100, 1280, 1450, 1620, 1780, 1950, 2100, 2280, 2400, 2545].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-t bg-green-400" style={{ height: `${(v / 2545) * 100}%` }}></div>
                          <span className="text-[9px] text-gray-400">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-4 bg-gray-50"><span className="text-sm font-bold text-gray-700">AI Skill Impact Summary</span></div>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Skill</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Invocations</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Time (AI)</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Time (Manual)</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time Saved</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost Saved</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { skill: 'Invoice Processing AI', invocations: '15,230', aiTime: '45s', manualTime: '12 min', timeSaved: '4,820 hrs', costSaved: '$98,200' },
                        { skill: 'Customer Onboarding AI', invocations: '12,450', aiTime: '1.2 min', manualTime: '8 min', timeSaved: '3,540 hrs', costSaved: '$72,400' },
                        { skill: 'Document Review AI', invocations: '9,870', aiTime: '30s', manualTime: '6 min', timeSaved: '2,190 hrs', costSaved: '$56,800' },
                        { skill: 'HR Benefits AI', invocations: '4,560', aiTime: '20s', manualTime: '5 min', timeSaved: '1,120 hrs', costSaved: '$34,100' },
                        { skill: 'Tax Calculator AI', invocations: '3,120', aiTime: '15s', manualTime: '4 min', timeSaved: '780 hrs', costSaved: '$23,000' },
                      ].map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{r.skill}</td><td className="px-4 py-3 text-sm text-gray-700">{r.invocations}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{r.aiTime}</td><td className="px-4 py-3 text-sm text-gray-500">{r.manualTime}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{r.timeSaved}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{r.costSaved}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {detailTab === 'process-insights' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Process</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI-Assisted Runs</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Manual Runs</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Completion Rate</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg AI Duration</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Manual Duration</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Efficiency Gain</th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { process: 'Invoice Approval', aiRuns: '8,450', manualRuns: '1,230', completionRate: '97.2%', aiDuration: '2 min', manualDuration: '18 min', gain: '89%' },
                      { process: 'Customer Verification', aiRuns: '6,780', manualRuns: '890', completionRate: '95.8%', aiDuration: '45s', manualDuration: '10 min', gain: '92%' },
                      { process: 'Document Classification', aiRuns: '12,340', manualRuns: '560', completionRate: '98.1%', aiDuration: '8s', manualDuration: '3 min', gain: '96%' },
                      { process: 'Benefits Enrollment', aiRuns: '3,210', manualRuns: '1,450', completionRate: '91.4%', aiDuration: '1.5 min', manualDuration: '12 min', gain: '88%' },
                      { process: 'Tax Calculation', aiRuns: '2,890', manualRuns: '340', completionRate: '99.3%', aiDuration: '12s', manualDuration: '8 min', gain: '98%' },
                    ].map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-blue-600">{p.process}</td><td className="px-4 py-3 text-sm text-gray-700">{p.aiRuns}</td><td className="px-4 py-3 text-sm text-gray-500">{p.manualRuns}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{p.completionRate}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{p.aiDuration}</td><td className="px-4 py-3 text-sm text-gray-500">{p.manualDuration}</td><td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">{p.gain}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {detailTab === 'data-catalog' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Record Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Skills Using</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Records Processed by AI</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Accuracy Rate</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost per Record (AI)</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost per Record (Manual)</th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { record: 'Invoice', aiSkills: 3, processed: '128,450', accuracy: '99.2%', aiCost: '$0.02', manualCost: '$4.50' },
                      { record: 'Customer', aiSkills: 2, processed: '45,230', accuracy: '97.8%', aiCost: '$0.05', manualCost: '$6.20' },
                      { record: 'Document', aiSkills: 4, processed: '67,800', accuracy: '98.5%', aiCost: '$0.03', manualCost: '$3.80' },
                      { record: 'Employee', aiSkills: 2, processed: '12,890', accuracy: '96.4%', aiCost: '$0.08', manualCost: '$8.50' },
                      { record: 'Case', aiSkills: 1, processed: '890,000', accuracy: '94.1%', aiCost: '$0.01', manualCost: '$2.30' },
                      { record: 'Contract', aiSkills: 2, processed: '15,670', accuracy: '97.9%', aiCost: '$0.06', manualCost: '$12.00' },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-blue-600">{r.record}</td><td className="px-4 py-3 text-sm text-gray-700">{r.aiSkills}</td><td className="px-4 py-3 text-sm text-gray-700">{r.processed}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{r.accuracy}</td><td className="px-4 py-3 text-sm text-green-600 font-medium">{r.aiCost}</td><td className="px-4 py-3 text-sm text-gray-500">{r.manualCost}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {detailTab === 'ai-insights' && !selectedAiObject && (() => {
              const dashAiObjects = [
                { name: 'Data Summarization', type: 'Skill' as const, invocations: '3,420', avgLatency: '1.8s', errorRate: '0.5%', cost: '$289', timeSaved: '780 hrs', status: 'Healthy' as const },
                { name: 'Anomaly Detection', type: 'Skill' as const, invocations: '2,180', avgLatency: '2.4s', errorRate: '1.2%', cost: '$412', timeSaved: '540 hrs', status: 'Healthy' as const },
                { name: 'Predictive Scoring', type: 'Skill' as const, invocations: '1,540', avgLatency: '3.1s', errorRate: '0.8%', cost: '$567', timeSaved: '420 hrs', status: 'Healthy' as const },
                { name: 'Dashboard Insights Agent', type: 'Agent' as const, invocations: '890', avgLatency: '5.6s', errorRate: '2.1%', cost: '$1,230', timeSaved: '1,120 hrs', status: 'Warning' as const },
              ]
              return (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'AI Objects Used', value: String(dashAiObjects.length), change: '+1', sub: 'this dashboard' },
                    { label: 'Total Runs', value: '8,030', change: '+15.2%', sub: 'this month' },
                    { label: 'Avg Latency', value: '2.1s', change: '-8.4%', sub: 'across objects' },
                    { label: 'Error Rate', value: '0.9%', change: '-0.3%', sub: 'below threshold' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                      <div className="text-xs font-medium text-green-600">{kpi.change}</div>
                      <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Runs</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time Saved</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashAiObjects.map((obj, i) => (
                        <tr key={i} onClick={() => setSelectedAiObject(obj.name)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="px-4 py-3 text-sm font-medium text-blue-600 flex items-center gap-2">
                            {obj.type === 'Skill' ? <Bot size={14} className="text-purple-500 flex-shrink-0" /> : <Zap size={14} className="text-orange-500 flex-shrink-0" />}
                            {obj.name}
                          </td>
                          <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${obj.type === 'Skill' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{obj.type === 'Skill' ? 'AI Skill' : 'AI Agent'}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">{obj.invocations}</td>
                          <td className="px-4 py-3 text-sm text-green-600 font-medium">{obj.timeSaved}</td>
                          <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${obj.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{obj.status === 'Healthy' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}{obj.status}</span></td>
                          <td className="px-4 py-3 text-gray-400"><ChevronRight size={14} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
              )
            })()}
            {detailTab === 'ai-insights' && selectedAiObject && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                  <div className="text-sm font-bold text-gray-700 mb-4">Execution Flow</div>
                  <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
                    {[
                      { step: 'Input Received', avg: '15ms', color: 'bg-blue-500', icon: Inbox },
                      { step: 'Guardrail Check', avg: '40ms', color: 'bg-blue-500', icon: Shield },
                      { step: 'Model Inference', avg: '1.6s', color: 'bg-red-500', icon: Cpu },
                      { step: 'Output Guardrail', avg: '35ms', color: 'bg-blue-500', icon: ShieldCheck },
                      { step: 'Response', avg: '12ms', color: 'bg-blue-500', icon: Send },
                    ].map((s, i, arr) => { const Icon = s.icon; return (
                      <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center min-w-[110px]">
                          <div className={`w-9 h-9 rounded-full ${s.color} flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                          <div className="text-xs font-medium text-gray-900 mt-2 text-center">{s.step}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">avg {s.avg}</div>
                        </div>
                        {i < arr.length - 1 && <div className="w-6 h-0.5 bg-gray-300 flex-shrink-0 -mt-4"></div>}
                      </div>
                    )})}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Cost', value: '$289', change: '+5.1%' },
                    { label: 'Number of Runs', value: '3,420', change: '+12.1%' },
                    { label: 'Time Saved', value: '780 hrs', change: '+18.6%' },
                    { label: 'Error Rate', value: '0.5%', change: '-0.2%' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                      <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                      <div className="text-xs font-medium text-green-600">{kpi.change}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-4 bg-gray-50"><span className="text-sm font-bold text-gray-700">Recent Runs</span></div>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Run ID</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tokens</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Latency</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { id: 'RUN-71023', time: '12:56 PM', tokens: '980 / 240', latency: '1.6s', status: 'Success' },
                        { id: 'RUN-71022', time: '12:51 PM', tokens: '1,200 / 310', latency: '2.1s', status: 'Success' },
                        { id: 'RUN-71021', time: '12:47 PM', tokens: '750 / 0', latency: '0.4s', status: 'Guardrail Blocked' },
                        { id: 'RUN-71020', time: '12:42 PM', tokens: '1,100 / 280', latency: '1.5s', status: 'Success' },
                      ].map((inv, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-blue-600">{inv.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{inv.time}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{inv.tokens}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{inv.latency}</td>
                          <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${inv.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{inv.status === 'Success' ? <CheckCircle size={10} /> : <Shield size={10} />}{inv.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          ) : (
          <div className="container mx-auto px-6 py-6 max-w-7xl">
        {activeTab === 'home' && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Recently Viewed</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentReports.map((r, i) => (
                  <div key={i} onClick={() => { setSelectedDashboard(r.name); setDetailTab('home') }} className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      {r.type === 'Report' ? <FileBarChart size={16} className="text-blue-500" /> : <BarChart3 size={16} className="text-purple-500" />}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.type === 'Report' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{r.type}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{r.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{r.viewedAt}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex items-center gap-2">
                <div className="relative flex-1 max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search reports & dashboards..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Modified</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allReports.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r, i) => (
                    <tr key={i} onClick={() => { setSelectedDashboard(r.name); setDetailTab('home') }} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.name}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${r.type === 'Report' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{r.type}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.owner}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.lastModified}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'process-insights' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <div className="relative flex-1 max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search processes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Process Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Active Instances</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Completed Today</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Error Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processes.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{p.model}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.activeInstances}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.completedToday}</td>
                    <td className="px-4 py-3 text-sm"><span className={`font-medium ${parseFloat(p.errorRate) > 2 ? 'text-red-600' : parseFloat(p.errorRate) > 1 ? 'text-yellow-600' : 'text-green-600'}`}>{p.errorRate}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.avgDuration}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'data-catalog' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <div className="relative flex-1 max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search record types..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Record Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fields</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Records</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Sync</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recordTypes.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.fields}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.records}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.lastSync}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${r.status === 'Synced' ? 'bg-green-100 text-green-800' : r.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ai-insights' && !selectedAiObject && (() => {
          const aiObjects = [
            { name: 'Invoice Processing AI', type: 'Skill' as const, invocations: '15,230', timeSaved: '4,820 hrs', status: 'Healthy' as const },
            { name: 'Customer Support AI', type: 'Skill' as const, invocations: '12,450', timeSaved: '3,540 hrs', status: 'Healthy' as const },
            { name: 'Document Classification', type: 'Skill' as const, invocations: '18,420', timeSaved: '1,230 hrs', status: 'Healthy' as const },
            { name: 'Fraud Detection', type: 'Skill' as const, invocations: '3,210', timeSaved: '890 hrs', status: 'Warning' as const },
            { name: 'HR Benefits AI', type: 'Skill' as const, invocations: '4,560', timeSaved: '1,120 hrs', status: 'Healthy' as const },
            { name: 'Support Triage Agent', type: 'Agent' as const, invocations: '8,920', timeSaved: '6,240 hrs', status: 'Healthy' as const },
            { name: 'Onboarding Agent', type: 'Agent' as const, invocations: '2,340', timeSaved: '2,890 hrs', status: 'Warning' as const },
            { name: 'Compliance Review Agent', type: 'Agent' as const, invocations: '1,890', timeSaved: '3,450 hrs', status: 'Healthy' as const },
          ]
          const Src = ({ tag, tip }: { tag: string; tip: string }) => {
            const colors: Record<string, string> = { 'Process Analytics': 'bg-blue-100 text-blue-700', 'Config Table': 'bg-amber-100 text-amber-700', 'Calculated': 'bg-purple-100 text-purple-700', 'Groups + Query': 'bg-teal-100 text-teal-700', 'Manual Assessment': 'bg-gray-200 text-gray-600' }
            return <span title={tip} className={`inline-flex px-1.5 py-0.5 text-[9px] font-medium rounded cursor-help ${colors[tag] || 'bg-gray-100 text-gray-500'}`}>{tag}</span>
          }
          return (
          <>
            {/* Data source legend */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Data sources:</span>
              {[['Process Analytics', 'a!queryProcessAnalytics()'], ['Config Table', 'Manual reference tables'], ['Calculated', 'Expression rules'], ['Groups + Query', 'Appian Groups + task queries'], ['Manual Assessment', 'Business judgment']].map(([tag, tip]) => (
                <Src key={tag} tag={tag} tip={tip} />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-0.5"><div className="text-[10px] text-gray-500 uppercase tracking-wider">Total AI Cost</div><Src tag="Config Table" tip="AI platform licensing + compute costs from manual config table" /></div>
                <div className="text-xl font-bold text-gray-900">$24,914</div>
                <div className="text-xs font-medium text-green-600">+12.4% <span className="text-gray-400 font-normal">this month</span></div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-0.5"><div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Time Saved</div><Src tag="Calculated" tip="(baseline_duration − ai_duration) × execution_count, summed across AI skills" /></div>
                <div className="text-xl font-bold text-gray-900">24,180 hrs</div>
                <div className="text-xs font-medium text-green-600">+28.1% <span className="text-gray-400 font-normal">across all objects</span></div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-0.5"><div className="text-[10px] text-gray-500 uppercase tracking-wider">Headcount Equivalent</div><Src tag="Calculated" tip="total_hours_saved / 1,950 standard annual work hours" /></div>
                <div className="text-xl font-bold text-gray-900">12.4 FTEs</div>
                <div className="text-xs text-gray-500">work handled by AI</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-0.5"><div className="text-[10px] text-gray-500 uppercase tracking-wider">Annual ROI</div><Src tag="Calculated" tip="(time_saved × hourly_rate − ai_costs) / ai_costs" /></div>
                <div className="text-xl font-bold text-green-600">842%</div>
                <div className="text-xs text-gray-500">$2.5M net savings</div>
              </div>
            </div>

            {/* Adoption & Coverage */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-gray-700">AI Adoption</div>
                  <div className="text-lg font-bold text-gray-900">68%</div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mb-3"><div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div></div>
                <div className="flex gap-4 text-xs text-gray-500 mb-1">
                  <span><span className="font-semibold text-gray-900">17/25</span> processes <Src tag="Process Analytics" tip="AI-tagged process models with active executions via a!queryProcessAnalytics()" /></span>
                  <span><span className="font-semibold text-gray-900">342/480</span> users <Src tag="Groups + Query" tip="Distinct users in AI-enabled process task instances via a!queryEntity()" /></span>
                </div>
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 mt-3">Top expansion opportunities <Src tag="Manual Assessment" tip="Business judgment + volume data from process analytics" /></div>
                <div className="space-y-1">
                  {[['Contract Review', '~3,200 hrs/yr', 'High'], ['Vendor Onboarding', '~2,100 hrs/yr', 'High'], ['Expense Reporting', '~1,400 hrs/yr', 'Med']].map(([p, s, imp], i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                      <span className="text-xs text-gray-900">{p}</span>
                      <div className="flex items-center gap-2"><span className="text-[10px] text-gray-500">{s}</span><span className={`text-[10px] font-semibold ${imp === 'High' ? 'text-purple-600' : 'text-blue-600'}`}>{imp}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-gray-700">Team Adoption</div>
                  <Src tag="Groups + Query" tip="users_in_dept_using_AI / total_users_in_dept — departments from Appian Groups or HR data store" />
                </div>
                <div className="space-y-2">
                  {[
                    { team: 'Customer Service', users: 89, total: 95 },
                    { team: 'Finance', users: 62, total: 78 },
                    { team: 'HR', users: 45, total: 68 },
                    { team: 'Legal & Compliance', users: 28, total: 52 },
                    { team: 'Operations', users: 118, total: 187 },
                  ].map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5"><span className="text-gray-700">{t.team}</span><span className="text-gray-500">{Math.round(t.users/t.total*100)}%</span></div>
                      <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${(t.users / t.total) * 100}%` }}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How this data is sourced */}
            <details className="mb-4">
              <summary className="text-[11px] text-gray-500 cursor-pointer hover:text-gray-700 select-none">ℹ️ How is this data sourced?</summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1.5">
                <div><span className="font-semibold text-gray-700">Process execution counts & durations</span> — native via <code className="text-[10px] bg-gray-200 px-1 rounded">a!queryProcessAnalytics()</code></div>
                <div><span className="font-semibold text-gray-700">Active users per process</span> — native via process/task instance queries</div>
                <div><span className="font-semibold text-gray-700">Baseline (pre-AI) durations</span> — captured before AI rollout, stored in config table</div>
                <div><span className="font-semibold text-gray-700">Cost assumptions (hourly rates)</span> — manual config table</div>
                <div><span className="font-semibold text-gray-700">AI licensing/platform costs</span> — manual config table</div>
                <div><span className="font-semibold text-gray-700">ROI, FTE equivalents, time saved</span> — calculated expression rules</div>
                <div><span className="font-semibold text-gray-700">Opportunity scoring</span> — business judgment + volume data</div>
                <div><span className="font-semibold text-gray-700">Team adoption %</span> — Appian Groups cross-referenced with AI process participation</div>
              </div>
            </details>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex items-center gap-2">
                <div className="relative flex-1 max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search AI objects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <Src tag="Process Analytics" tip="Execution counts and status from a!queryProcessAnalytics()" />
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Runs</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time Saved</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aiObjects.filter(o => !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase())).map((obj, i) => (
                    <tr key={i} onClick={() => setSelectedAiObject(obj.name)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600 flex items-center gap-2">
                        {obj.type === 'Skill' ? <Bot size={14} className="text-purple-500 flex-shrink-0" /> : <Zap size={14} className="text-orange-500 flex-shrink-0" />}
                        {obj.name}
                      </td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${obj.type === 'Skill' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{obj.type === 'Skill' ? 'AI Skill' : 'AI Agent'}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{obj.invocations}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{obj.timeSaved}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${obj.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{obj.status === 'Healthy' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}{obj.status}</span></td>
                      <td className="px-4 py-3 text-gray-400"><ChevronRight size={14} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          )
        })()}

        {activeTab === 'ai-insights' && selectedAiObject && (
          <>
            {/* Pinned KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Cost', value: '$1,245', change: '+8.2%', sub: 'this month' },
                { label: 'Time Saved', value: '4,820 hrs', change: '+32.4%', sub: 'vs. manual processing' },
                { label: 'Number of Runs', value: '15,230', change: '+18.7%', sub: 'this month' },
                { label: 'Error Rate', value: '0.8%', change: '-0.4%', sub: 'below 1% target' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                  <div className={`text-xs font-medium ${kpi.change.startsWith('-') ? 'text-green-600' : 'text-green-600'}`}>{kpi.change}</div>
                  <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Projected Cost & Time Saved */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm font-bold text-gray-700 mb-1">Projected Annual Cost</div>
                <div className="text-xs text-gray-500 mb-4">Based on current usage trends</div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-3xl font-bold text-gray-900">$14,940</div>
                  <div className="text-sm text-gray-500 mb-1">/ year at current rate</div>
                </div>
                <svg viewBox="0 0 300 100" className="w-full h-28 mb-2">
                  {[980,1050,1120,1100,1180,1245].map((v, i, a) => i > 0 ? <line key={`a${i}`} x1={(i-1)*27.3+10} y1={90-(a[i-1]/1600)*80} x2={i*27.3+10} y2={90-(v/1600)*80} stroke="#3b82f6" strokeWidth="2" /> : null)}
                  {[1245,1300,1350,1400,1440,1480,1520].map((v, i, a) => i > 0 ? <line key={`p${i}`} x1={(i-1+5)*27.3+10} y1={90-(a[i-1]/1600)*80} x2={(i+5)*27.3+10} y2={90-(v/1600)*80} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" /> : null)}
                  {[1245,1200,1150,1100,1060,1020,980].map((v, i, a) => i > 0 ? <line key={`r${i}`} x1={(i-1+5)*27.3+10} y1={90-(a[i-1]/1600)*80} x2={(i+5)*27.3+10} y2={90-(v/1600)*80} stroke="#8b5cf6" strokeWidth="2" /> : null)}
                  {[980,1050,1120,1100,1180,1245].map((v, i) => <circle key={`ad${i}`} cx={i*27.3+10} cy={90-(v/1600)*80} r="2.5" fill="#3b82f6" />)}
                  {[1245,1300,1350,1400,1440,1480,1520].map((v, i) => <circle key={`pd${i}`} cx={(i+5)*27.3+10} cy={90-(v/1600)*80} r="2" fill="#3b82f6" opacity="0.5" />)}
                  {[1245,1200,1150,1100,1060,1020,980].map((v, i) => <circle key={`rd${i}`} cx={(i+5)*27.3+10} cy={90-(v/1600)*80} r="2" fill="#8b5cf6" />)}
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => <text key={m+i} x={i*27.3+10} y={99} textAnchor="middle" className="text-[7px] fill-gray-400">{m}</text>)}
                </svg>
                <div className="flex items-center gap-4"><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-blue-500 rounded"></span>Actual</span><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-blue-500 rounded opacity-50" style={{backgroundImage:'repeating-linear-gradient(90deg,#3b82f6 0 3px,transparent 3px 6px)'}}></span>Projected</span><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-purple-500 rounded"></span>Recommendation</span></div>
                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs font-medium text-purple-800 mb-2">💡 Switch to batch processing for low-priority runs to save an estimated <span className="font-bold">$3,200/year</span> (21% reduction)</div>
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">Enable Batch Processing</button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm font-bold text-gray-700 mb-1">Projected Annual Time Saved</div>
                <div className="text-xs text-gray-500 mb-4">Hours saved vs. manual processing</div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-3xl font-bold text-green-600">57,840 hrs</div>
                  <div className="text-sm text-gray-500 mb-1">/ year projected</div>
                </div>
                <svg viewBox="0 0 300 100" className="w-full h-28 mb-2">
                  {[3800,4100,4400,4500,4700,4820].map((v, i, a) => i > 0 ? <line key={`a${i}`} x1={(i-1)*27.3+10} y1={90-((a[i-1]-3500)/3000)*80} x2={i*27.3+10} y2={90-((v-3500)/3000)*80} stroke="#22c55e" strokeWidth="2" /> : null)}
                  {[4820,5000,5150,5300,5400,5500,5600].map((v, i, a) => i > 0 ? <line key={`p${i}`} x1={(i-1+5)*27.3+10} y1={90-((a[i-1]-3500)/3000)*80} x2={(i+5)*27.3+10} y2={90-((v-3500)/3000)*80} stroke="#22c55e" strokeWidth="2" strokeDasharray="4 3" /> : null)}
                  {[4820,5200,5600,6000,6400,6800,7200].map((v, i, a) => i > 0 ? <line key={`r${i}`} x1={(i-1+5)*27.3+10} y1={90-((Math.min(a[i-1],6500)-3500)/3000)*80} x2={(i+5)*27.3+10} y2={90-((Math.min(v,6500)-3500)/3000)*80} stroke="#8b5cf6" strokeWidth="2" /> : null)}
                  {[3800,4100,4400,4500,4700,4820].map((v, i) => <circle key={`ad${i}`} cx={i*27.3+10} cy={90-((v-3500)/3000)*80} r="2.5" fill="#22c55e" />)}
                  {[4820,5000,5150,5300,5400,5500,5600].map((v, i) => <circle key={`pd${i}`} cx={(i+5)*27.3+10} cy={90-((v-3500)/3000)*80} r="2" fill="#22c55e" opacity="0.5" />)}
                  {[4820,5200,5600,6000,6400,6500,6500].map((v, i) => <circle key={`rd${i}`} cx={(i+5)*27.3+10} cy={90-((v-3500)/3000)*80} r="2" fill="#8b5cf6" />)}
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => <text key={m+i} x={i*27.3+10} y={99} textAnchor="middle" className="text-[7px] fill-gray-400">{m}</text>)}
                </svg>
                <div className="flex items-center gap-4"><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-green-500 rounded"></span>Actual</span><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-green-500 rounded opacity-50" style={{backgroundImage:'repeating-linear-gradient(90deg,#22c55e 0 3px,transparent 3px 6px)'}}></span>Projected</span><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-0.5 bg-purple-500 rounded"></span>Recommendation</span></div>
                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs font-medium text-purple-800 mb-2">💡 Enabling auto-classification for 3 more document types could save an additional <span className="font-bold">8,400 hrs/year</span></div>
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">Configure Auto-Classification</button>
                </div>
              </div>
            </div>

            {/* Explore Data — collapsible for granular detail */}
            <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-gray-700 hover:bg-gray-50 select-none">Explore Data</summary>
              <div className="border-t border-gray-200 p-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Execution Flow</div>
                <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4 mb-4">
                  {[
                    { step: 'Input', avg: '12ms', color: 'bg-blue-500', icon: Inbox },
                    { step: 'Guardrail', avg: '45ms', color: 'bg-blue-500', icon: Shield },
                    { step: 'Prompt', avg: '28ms', color: 'bg-blue-500', icon: FileCode },
                    { step: 'Inference', avg: '980ms', color: 'bg-red-500', icon: Cpu },
                    { step: 'Output Check', avg: '38ms', color: 'bg-blue-500', icon: ShieldCheck },
                    { step: 'Response', avg: '15ms', color: 'bg-blue-500', icon: Send },
                  ].map((s, i, arr) => { const Icon = s.icon; return (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div className={`w-9 h-9 rounded-full ${s.color} flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                        <div className="text-[11px] font-medium text-gray-900 mt-1.5">{s.step}</div>
                        <div className="text-[10px] text-gray-500">{s.avg}</div>
                      </div>
                      {i < arr.length - 1 && <div className="w-6 h-0.5 bg-gray-300 flex-shrink-0 -mt-4"></div>}
                    </div>
                  )})}
                </div>
                <div className="p-4 mb-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-amber-900 mb-1">⚡ Model Inference is your bottleneck</div>
                      <div className="text-xs text-amber-800 mb-2">The inference step averages <span className="font-bold">980ms</span> — accounting for 85% of total latency. This has impacted <span className="font-bold">15,180 runs</span> this month.</div>
                      <div className="text-xs text-amber-700">Switching to a smaller model for simple queries (estimated 40% of traffic) could reduce avg latency to <span className="font-bold">620ms</span> and save <span className="font-bold">$4,100/year</span>.</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">Review Change</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50">Dismiss</button>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Runs</div>
                {(() => {
                  const PER = 10
                  const statuses = ['Success','Success','Success','Success','Success','Success','Success','Guardrail Blocked','Success','Error'] as const
                  const latencies = ['0.8s','1.1s','1.3s','0.9s','1.8s','2.4s','0.7s','0.3s','1.5s','4.2s','1.0s','1.2s','0.6s','3.1s','1.4s']
                  const runs = Array.from({ length: 80 }, (_, i) => ({
                    id: `RUN-${48291 - i}`,
                    time: `${12 - Math.floor(i / 6) >= 1 ? 12 - Math.floor(i / 6) : 12 + 12 - Math.floor(i / 6)}:${String(58 - (i % 6) * 10).padStart(2, '0')} ${Math.floor(i / 6) < 12 ? 'PM' : 'AM'}`,
                    latency: latencies[i % latencies.length],
                    status: statuses[i % statuses.length],
                  }))
                  const paged = runs.slice(runsPage * PER, (runsPage + 1) * PER)
                  const totalPages = Math.ceil(runs.length / PER)
                  return (<>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Run ID</th><th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th><th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Latency</th><th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {paged.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-2 text-sm font-mono text-blue-600">{r.id}</td><td className="px-4 py-2 text-sm text-gray-700">{r.time}</td><td className="px-4 py-2 text-sm text-gray-700">{r.latency}</td><td className="px-4 py-2"><span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${r.status === 'Success' ? 'bg-green-100 text-green-800' : r.status === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">{runsPage * PER + 1}–{Math.min((runsPage + 1) * PER, runs.length)} of {runs.length}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setRunsPage(Math.max(0, runsPage - 1))} disabled={runsPage === 0} className="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-30">Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i).filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - runsPage) <= 1).map((i, idx, arr) => (<span key={i}>{idx > 0 && arr[idx - 1] !== i - 1 && <span className="px-1 text-xs text-gray-400">…</span>}<button onClick={() => setRunsPage(i)} className={`w-7 h-7 rounded text-xs font-medium ${i === runsPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button></span>))}
                    <button onClick={() => setRunsPage(Math.min(totalPages - 1, runsPage + 1))} disabled={runsPage === totalPages - 1} className="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-30">Next</button>
                  </div>
                </div>
                  </>)
                })()}
              </div>
            </details>
          </>
        )}
          </div>
          )}
        </div>
      </div>
      {waffleOption === 'option5' && <AppiaFab context="admin" />}
    </div>
  )
}
