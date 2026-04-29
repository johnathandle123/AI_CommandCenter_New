import { HeadingField } from '@pglevy/sailwind'
import { Settings, Search, Grid3X3, Paintbrush, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Activity, Palette, Trash2, Upload, Globe, Smartphone, Lock, Layout, Puzzle, Type, Key, Shield, Users, Wrench, Server, Heart, GitBranch, Award, Mail, Code, Link2, FileCode, BookOpen, Plug, CheckCircle, XCircle, AlertTriangle, ArrowUpDown, PanelLeftClose, PanelLeftOpen, Sparkles, ArrowUp, ExternalLink as LinkIcon, X, ChevronLeft, Send, BarChart3 } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'wouter'
import TabsInterface from './tabs-interface'
import { useWaffleOption, AppiaFab } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'

type NavSection = {
  title: string
  items: { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[]
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      { id: 'ai-admin', label: 'AI Admin', icon: Sparkles },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'branding', label: 'Branding', icon: Palette },
      { id: 'data-retention', label: 'Data Retention', icon: Trash2 },
      { id: 'file-upload', label: 'File Upload', icon: Upload },
      { id: 'internationalization', label: 'Internationalization', icon: Globe },
      { id: 'mobile', label: 'Mobile', icon: Smartphone },
      { id: 'permissions', label: 'Permissions', icon: Lock },
      { id: 'portals', label: 'Portals', icon: Layout },
      { id: 'plug-ins', label: 'Plug-ins', icon: Puzzle },
      { id: 'typefaces', label: 'Typefaces', icon: Type },
    ],
  },
  {
    title: 'AUTHENTICATION',
    items: [
      { id: 'appian-auth', label: 'Appian Authentication', icon: Key },
      { id: 'ldap', label: 'LDAP Authentication', icon: Shield },
      { id: 'maintenance', label: 'Maintenance Window', icon: Wrench },
      { id: 'sign-in', label: 'Sign-in Page', icon: Layout },
      { id: 'sso', label: 'Single Sign-On', icon: Link2 },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'web-api-auth', label: 'Web API Authentication', icon: Code },
    ],
  },
  {
    title: 'DEVOPS',
    items: [
      { id: 'deployment', label: 'Deployment', icon: GitBranch },
      { id: 'health-check', label: 'Health Check', icon: Heart },
      { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    ],
  },
  {
    title: 'INTEGRATION',
    items: [
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'data-sources', label: 'Data Sources', icon: Database },
      { id: 'ai-services', label: 'AI Services', icon: Brain },
      { id: 'email', label: 'Email', icon: Mail },
      { id: 'embedded', label: 'Embedded Interfaces', icon: Code },
      { id: 'http-proxy', label: 'HTTP Proxy', icon: Globe },
      { id: 'logging', label: 'Logging', icon: FileCode },
      { id: 'third-party', label: 'Third-party Credentials', icon: Key },
    ],
  },
]

export default function AdminConsole() {
  const [activeItem, setActiveItem] = useState('infrastructure')
  const [navCollapsed, setNavCollapsed] = useState(false)
  const adminNavRef = useRef<HTMLDivElement>(null)
  const [adminIndicator, setAdminIndicator] = useState<{ top: number; height: number }>({ top: 0, height: 0 })

  useEffect(() => {
    if (!adminNavRef.current) return
    const activeBtn = adminNavRef.current.querySelector(`[data-nav-id="${activeItem}"]`) as HTMLElement
    if (activeBtn) {
      setAdminIndicator({ top: activeBtn.offsetTop, height: activeBtn.offsetHeight })
    }
  }, [activeItem, navCollapsed])
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [, setLocation] = useLocation()
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option1')
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')
  const [navOption, setNavOption] = useState<'option1' | 'option2'>('option2')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [searchMode, setSearchMode] = useState<'integrated' | 'separate'>('integrated')
  const [inlineSearch, setInlineSearch] = useState('')

  const allWaffleApps = [
    { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', path: '/appian-ai', options: ['option5'] as const },
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', active: true, path: '/admin-console' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard', options: ['option1'] as const },
    { name: 'Operations Console', icon: Monitor, color: 'bg-cyan-600', path: '/dashboard', options: ['option1','option2'] as const },
    { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
    { name: 'Process HQ', icon: Activity, color: 'bg-rose-500', path: '/process-hq', options: ['option4', 'option6'] as const },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' },
  ]
  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))
  const allSites = [
    'Admin Console', 'AI Command Center', 'Appian Designer', 'Operations Console',
    'Process HQ', 'Appian RPA', 'Cloud Database', 'Connected Systems', 'Data Fabric',
    'Decision Platform', 'DevOps Infrastructure', 'Feature Flags',
    'Health Check', 'Integration Console', 'Low-Code Designer',
    'Operations Console', 'Performance Monitor', 'Portal Manager',
    'Process Mining', 'Record Manager', 'Security Console',
    'System Logs', 'Task Manager', 'User Management',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))
  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false)
      if (showSettingsMenu && !(event.target as Element).closest('.settings-menu')) setShowSettingsMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu, showSettingsMenu])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSpotlight(true) } }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Build nav sections based on layout option
  const currentNavSections = (() => {
    if (navOption === 'option1') {
      // Option 1: No AI Settings section. Integration has MCP, Security section has Guardrails
      return [
        ...navSections.map(s => {
          if (s.title === 'INTEGRATION') {
            return { ...s, items: [...s.items, { id: 'int-mcp', label: 'MCP', icon: Plug }] }
          }
          return s
        }),
        {
          title: 'SECURITY',
          items: [
            { id: 'sec-guardrails', label: 'Guardrails', icon: Shield },
          ],
        },
      ]
    }
    // Option 2: AI Settings has AI Calls, Guardrails, MCP
    return [
      ...navSections,
      {
        title: 'AI SETTINGS',
        items: [
          { id: 'ai-alt3-calls', label: 'AI Calls', icon: Brain },
          { id: 'ai-alt3-protect', label: 'Guardrails', icon: Shield },
          { id: 'ai-alt3-mcp', label: 'MCP', icon: Plug },
        ],
      },
    ]
  })()

  const filteredNavSections = currentNavSections.map(s => ({
    ...s,
    items: s.items.filter(i => i.id !== 'ai-admin' || (waffleOption === 'option4' && searchMode === 'separate'))
  })).filter(s => s.items.length > 0)

  const renderContent = () => {
    // Handle alternate layout AI sub-tabs
    if (activeItem.startsWith('ai-alt3-')) {
      const section = activeItem.replace('ai-alt3-', '')
      if (section === 'calls') {
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="AI Calls" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <AICallsPanel />
            </div>
          </div>
        )
      }
      if (section === 'protect') {
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="Guardrails" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <GuardrailsPanel />
            </div>
          </div>
        )
      }
      return (
        <div className="flex-1 overflow-auto">
          <TabsInterface activeSection={section} cardStyle="white" onSectionChange={(s) => setActiveItem(`ai-alt3-${s}`)} appMode="future" />
        </div>
      )
    }
    switch (activeItem) {
      case 'ai-admin':
        return <AIAdminChat />
      case 'infrastructure':
        return <InfrastructurePanel />
      case 'users':
        return <UsersPanel />
      case 'branding':
        return <BrandingPanel />
      case 'health-check':
        return <HealthCheckPanel />
      case 'plug-ins':
        return <PluginsPanel />
      case 'user-activity':
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="Current User Activity" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <UserActivityPanel />
            </div>
          </div>
        )
      case 'import-history':
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="Import History" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <ImportHistoryPanel />
            </div>
          </div>
        )
      case 'rule-performance':
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="Rule Performance" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <RulePerformancePanel />
            </div>
          </div>
        )
      case 'ai-calls':
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="AI Calls" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <AICallsPanel />
            </div>
          </div>
        )
      case 'sec-guardrails':
        return (
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: '80px' }}>
              <HeadingField text="Guardrails" size="LARGE" marginBelow="NONE" />
            </div>
            <div className="container mx-auto px-6 py-6 max-w-7xl">
              <GuardrailsPanel />
            </div>
          </div>
        )
      case 'int-mcp':
        return (
          <div className="flex-1 overflow-auto">
            <TabsInterface activeSection="mcp" cardStyle="white" onSectionChange={() => {}} appMode="future" />
          </div>
        )
      default:
        return <DefaultPanel activeItem={activeItem} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-green-500 rounded-lg p-3 flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <HeadingField text="Admin Console" size="LARGE" headingTag="H1" marginBelow="NONE" fontWeight="BOLD" />
          </div>
          <div className="flex items-center gap-3">
            <VersionSwitcher />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">EXPORT</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">IMPORT</button>
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors"><Search size={20} className="text-black" /></button>
            <button onClick={() => setShowSettingsMenu(!showSettingsMenu)} className="p-2 rounded-md hover:bg-white/20 transition-colors relative settings-menu">
              <Settings size={20} className={showSettingsMenu ? 'text-blue-500' : 'text-black'} />
            </button>
            <button onClick={() => setShowWaffleMenu(!showWaffleMenu)} className="p-2 rounded-md hover:bg-white/20 transition-colors relative waffle-menu">
              <Grid3X3 size={20} className={showWaffleMenu ? 'text-blue-500' : 'text-black'} />
            </button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">J</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" alt="Appian" className="h-6" />
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettingsMenu && (
        <div className="fixed top-20 right-24 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[100] settings-menu w-72">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Navigation Layout</label>
            <select value={navOption} onChange={(e) => { setNavOption(e.target.value as 'option1' | 'option2'); if (e.target.value === 'option1' && activeItem.startsWith('ai-alt3-')) setActiveItem('ai-calls'); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option1">Option 1 — Distributed</option>
              <option value="option2">Option 2 — AI Settings section</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">{navOption === 'option1' ? 'MCP in Integration, Guardrails in Security' : 'AI Calls, Guardrails, and MCP grouped under AI Settings'}</p>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search & AI</label>
            <select value={searchMode} onChange={(e) => setSearchMode(e.target.value as 'integrated' | 'separate')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="integrated">Integrated search + AI chat</option>
              <option value="separate">Separate search & AI Admin tab</option>
            </select>
          </div>
        </div>
      )}

      {/* Waffle Menu */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] waffle-menu w-80 flex flex-col" style={{ maxHeight: '600px' }}>
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
                {allSites.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No sites found</div>}
              </div>
            )}
          </div>
          {!waffleLocked ? <div className="border-t border-gray-200 p-3 sticky bottom-0 bg-white rounded-b-lg">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as 'option1' | 'option2' | 'option3' | 'option4' | 'option5')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option><option value="option3">Option 3</option><option value="option4">Option 4</option><option value="option5">Option 5</option>
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
        <div className={`${navCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          <div ref={adminNavRef} className="overflow-y-auto flex-1 relative">
          {!navCollapsed && (
            <div className="px-3 pt-3 pb-1 sticky top-0 bg-white z-[2]">
              {searchMode === 'integrated' ? (
                <button onClick={() => setShowSpotlight(true)} className="w-full flex items-center gap-2 pl-3 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-300 transition-colors text-left">
                  <Sparkles size={14} className="text-purple-400" />Search or ask anything
                  <kbd className="ml-auto text-[10px] bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-gray-400">⌘K</kbd>
                </button>
              ) : (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="text" placeholder="Search settings..." value={inlineSearch} onChange={e => setInlineSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {inlineSearch.trim() && (() => {
                    const q = inlineSearch.toLowerCase()
                    const results = spotlightItems.filter(item => item.label.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q))).slice(0, 8)
                    if (results.length === 0) return null
                    return (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                        {results.map(r => (
                          <button key={r.id} onClick={() => { setActiveItem(r.id); setInlineSearch('') }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Search size={12} className="text-gray-400" />{r.label}</span>
                            <span className="text-xs text-gray-400">{r.section}</span>
                          </button>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
          <div className="absolute left-0 right-0 bg-blue-50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none" style={{ top: adminIndicator.top, height: adminIndicator.height }} />
          {filteredNavSections.map((section) => (
            <div key={section.title} className="py-3">
              {!navCollapsed && section.title && <div className="px-4 pb-2 text-xs font-bold text-gray-400 tracking-wider relative z-[1]">{section.title}</div>}
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.id} data-nav-id={item.id} onClick={() => setActiveItem(item.id)} title={navCollapsed ? item.label : undefined} className={`relative z-[1] w-full flex items-center ${navCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5'} text-left transition-colors ${activeItem === item.id ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}>
                    <Icon size={18} />
                    {!navCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          ))}
          </div>
          <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-4 border-t border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center">
            {navCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeItem === 'ai-admin' || activeItem === 'int-mcp' || activeItem === 'ai-calls' || activeItem === 'sec-guardrails' || activeItem === 'user-activity' || activeItem === 'import-history' || activeItem === 'rule-performance' || activeItem.startsWith('ai-alt') ? renderContent() : (
            <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-6 max-w-6xl">
              {renderContent()}
            </div>
            </div>
          )}
        </div>
      </div>
      {waffleOption === 'option5' && <AppiaFab context="admin" />}
      {showSpotlight && <SpotlightSearch onClose={() => setShowSpotlight(false)} onNavigate={(id) => { setActiveItem(id); setShowSpotlight(false) }} allowChat={searchMode === 'integrated'} />}
    </div>
  )
}

/* ── Panel Components ── */

function InfrastructurePanel() {
  const environments = [
    { name: 'Development', url: 'https://dev.example.appiancloud.com', status: 'enabled', directDeploy: true, lastAction: 'Connection enabled', modifier: 'John Doe', modified: '1/15/2026 3:45 PM' },
    { name: 'Test', url: 'https://test.example.appiancloud.com', status: 'enabled', directDeploy: true, lastAction: 'Direct deploy enabled', modifier: 'Sarah Miller', modified: '1/14/2026 11:20 AM' },
    { name: 'Staging', url: 'https://staging.example.appiancloud.com', status: 'disabled-remote', directDeploy: false, lastAction: 'Disabled by remote', modifier: 'System', modified: '1/12/2026 9:00 AM' },
    { name: 'Production', url: 'https://prod.example.appiancloud.com', status: 'enabled', directDeploy: true, lastAction: 'Connection enabled', modifier: 'Alex Kim', modified: '1/10/2026 2:30 PM' },
  ]

  const statusIcon = (s: string) => {
    if (s === 'enabled') return <CheckCircle size={16} className="text-green-500" />
    if (s === 'disabled-remote') return <XCircle size={16} className="text-orange-500" />
    return <AlertTriangle size={16} className="text-red-500" />
  }

  return (
    <div>
      <div className="mb-6">
        <HeadingField text="Infrastructure" size="LARGE" marginBelow="LESS" />
        <p className="text-gray-600 text-sm">Manage connected environments and control how they interact with each other.</p>
      </div>

      {/* Environments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <HeadingField text="Environments" size="MEDIUM" marginBelow="NONE" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Add New Environment</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Environment</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Connection</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Direct Deploy</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Modified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {environments.map((env, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Server size={20} className="text-blue-600" /></div>
                    <div>
                      <div className="font-bold text-gray-900">{env.name}</div>
                      <div className="text-xs text-gray-500">{env.lastAction}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">{env.url}</td>
                <td className="px-6 py-4"><div className="flex items-center gap-2">{statusIcon(env.status)}<span className="text-sm capitalize">{env.status === 'disabled-remote' ? 'Disabled by remote' : 'Enabled'}</span></div></td>
                <td className="px-6 py-4">{env.directDeploy ? <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Enabled</span> : <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Disabled</span>}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{env.modified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* External Deployments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <HeadingField text="External Deployments" size="MEDIUM" marginBelow="NONE" />
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Enable incoming external deployments</span></label>
          <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Enable outgoing external deployments</span></label>
        </div>
      </div>

      {/* Deployment Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <HeadingField text="Deployment Settings" size="MEDIUM" marginBelow="NONE" />
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Allow deployments with plug-ins</span></label>
          <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Allow deployments with database scripts</span></label>
          <label className="flex items-center gap-3"><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Require review before deployment</span></label>
        </div>
      </div>
    </div>
  )
}

function UsersPanel() {
  const users = [
    { username: 'john.doe', name: 'John Doe', type: 'System Administrator', status: 'Active', lastLogin: '1/15/2026 3:45 PM' },
    { username: 'sarah.miller', name: 'Sarah Miller', type: 'Basic User', status: 'Active', lastLogin: '1/15/2026 2:10 PM' },
    { username: 'alex.kim', name: 'Alex Kim', type: 'Basic User', status: 'Active', lastLogin: '1/14/2026 5:30 PM' },
    { username: 'maria.garcia', name: 'Maria Garcia', type: 'Basic User', status: 'Inactive', lastLogin: '12/20/2025 9:00 AM' },
    { username: 'david.chen', name: 'David Chen', type: 'System Administrator', status: 'Active', lastLogin: '1/15/2026 1:00 PM' },
  ]
  return (
    <div>
      <div className="mb-6">
        <HeadingField text="Users" size="LARGE" marginBelow="LESS" />
        <p className="text-gray-600 text-sm">View and manage all user accounts in your environment.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64" /></div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Create User</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium hover:underline cursor-pointer">{u.username}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{u.type}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{u.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-700">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BrandingPanel() {
  return (
    <div>
      <div className="mb-6">
        <HeadingField text="Branding" size="LARGE" marginBelow="LESS" />
        <p className="text-gray-600 text-sm">Manage the name, logos, and colors that appear in your environment.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-4 bg-gray-50"><HeadingField text="Identity" size="MEDIUM" marginBelow="NONE" /></div>
        <div className="p-6 space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label><input type="text" defaultValue="Appian" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">Drop a PNG file here or click to upload</div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo Alternative Text</label><input type="text" defaultValue="Logo" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
          <label className="flex items-center gap-3"><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Display Site-Wide Banner</span></label>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50"><HeadingField text="Colors" size="MEDIUM" marginBelow="NONE" /></div>
        <div className="p-6 grid grid-cols-2 gap-6">
          {[
            { label: 'Header Bar', value: '#416b88' },
            { label: 'Navigation Labels', value: '#ffffff' },
            { label: 'Accent Color', value: '#1d659c' },
            { label: 'Wallpaper', value: '#ebf1f7' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: c.value }}></div>
              <div><div className="text-sm font-medium text-gray-700">{c.label}</div><div className="text-xs text-gray-500">{c.value}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end"><button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">SAVE CHANGES</button></div>
    </div>
  )
}

function HealthCheckPanel() {
  const runs = [
    { date: '1/15/2026 2:00 AM', type: 'Scheduled', duration: '12 min', status: 'Completed', period: '30 days' },
    { date: '1/8/2026 2:00 AM', type: 'Scheduled', duration: '11 min', status: 'Completed', period: '30 days' },
    { date: '1/3/2026 10:30 AM', type: 'Manual', duration: '13 min', status: 'Completed', period: '30 days' },
    { date: '1/1/2026 2:00 AM', type: 'Scheduled', duration: '10 min', status: 'Failed', period: '-' },
  ]
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div><HeadingField text="Health Check" size="LARGE" marginBelow="LESS" /><p className="text-gray-600 text-sm">Set up, schedule, and review Health Check reports.</p></div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">Settings</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Run Now</button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50"><HeadingField text="History" size="MEDIUM" marginBelow="NONE" /></div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Run Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Analysis Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {runs.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{r.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.type}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.duration}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{r.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PluginsPanel() {
  const plugins = [
    { name: 'PDF Utilities', version: '3.2.1', category: 'Standard', status: 'Up-to-date', installed: '12/15/2025' },
    { name: 'Excel Tools', version: '2.8.0', category: 'Standard', status: 'Update available', installed: '11/20/2025' },
    { name: 'Barcode Scanner', version: '1.5.3', category: 'Advanced', status: 'Up-to-date', installed: '10/05/2025' },
    { name: 'Email Connector', version: '4.1.0', category: 'Standard', status: 'Not listed in AppMarket', installed: '09/12/2025' },
  ]
  return (
    <div>
      <div className="mb-6">
        <HeadingField text="Plug-ins" size="LARGE" marginBelow="LESS" />
        <p className="text-gray-600 text-sm">Manage plug-ins installed in your environment.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <HeadingField text="Installed Plug-ins" size="MEDIUM" marginBelow="NONE" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">ADD NEW PLUG-INS</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Version</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Installed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plugins.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium hover:underline cursor-pointer">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.version}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.category}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Up-to-date' ? 'bg-green-100 text-green-800' : p.status === 'Update available' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.installed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



// ── AI Admin Chat ──

interface AdminChatMsg {
  id: number
  role: 'user' | 'assistant'
  content: string
  setting?: { name: string; type: string; config: Record<string, string> }
  options?: string[]
}

type AdminConvo = { step: 'idle' } | { step: 'guardrail-describe' } | { step: 'guardrail-scope'; type: string } | { step: 'guardrail-action'; type: string; scope: string }

const adminResponses: { trigger: RegExp; response: string; setting?: AdminChatMsg['setting'] }[] = [
  { trigger: /add.*guardrail.*pii|pii.*guardrail|scrub.*pii|redact.*pii/i, response: "I've created a PII Scrubbing guardrail. Here's the configuration:", setting: { name: 'PII Scrubbing — Customer Data', type: 'Guardrail', config: { 'Type': 'PII Scrubbing', 'Status': 'Active', 'Scan Depth': 'Deep — all input and output', 'Entity Types': 'SSN, Credit Card, Phone, Email, Address', 'Input Action': 'Anonymize (Masking)', 'Output Action': 'Anonymize (Masking)', 'Applied To': 'All AI Skills' } } },
  { trigger: /add.*guardrail.*toxic|toxicity.*guardrail|block.*toxic/i, response: "I've set up a Toxicity Detection guardrail:", setting: { name: 'Toxicity Filter — Standard', type: 'Guardrail', config: { 'Type': 'Toxicity Detection', 'Status': 'Active', 'Threshold': '0.7 (Medium sensitivity)', 'Action': 'Block and log', 'Categories': 'Hate speech, Harassment, Self-harm, Violence', 'Applied To': 'All AI Skills' } } },
  { trigger: /add.*guardrail.*injection|prompt.*injection|block.*injection/i, response: "I've configured a Prompt Injection guardrail:", setting: { name: 'Prompt Injection Shield', type: 'Guardrail', config: { 'Type': 'Prompt Injection Detection', 'Status': 'Active', 'Detection Method': 'Hybrid (Keyword + Semantic)', 'Action': 'Block and alert', 'Sensitivity': 'High', 'Applied To': 'All AI Skills' } } },
  { trigger: /add.*guardrail|new.*guardrail|create.*guardrail/i, response: "I've created a Content Safety guardrail:", setting: { name: 'Content Safety — General', type: 'Guardrail', config: { 'Type': 'Content Safety', 'Status': 'Active', 'Scope': 'Input and Output', 'Action': 'Flag and log', 'Sensitivity': 'Medium', 'Applied To': 'All AI Skills' } } },
  { trigger: /connect.*mcp|add.*mcp|new.*server|mcp.*server/i, response: "I've registered a new MCP server connection:", setting: { name: 'Enterprise Data MCP Server', type: 'MCP Connection', config: { 'Server Name': 'Enterprise Data MCP', 'Endpoint': 'https://mcp.internal.corp/v1', 'Auth': 'OAuth 2.0 (Service Account)', 'Status': 'Connected', 'Tools Available': '12 tools discovered', 'Applied To': 'Customer Support AI, Invoice Processing AI' } } },
  { trigger: /change.*model|switch.*model|update.*model|use.*claude|use.*gpt/i, response: "I've updated the model configuration:", setting: { name: 'Model Configuration Update', type: 'AI Skill Setting', config: { 'AI Skill': 'Customer Support AI', 'Previous Model': 'Claude 3 Haiku', 'New Model': 'Claude 3.5 Sonnet', 'Max Tokens': '4096', 'Temperature': '0.3', 'Status': 'Active' } } },
  { trigger: /add.*evaluation|new.*eval|create.*eval/i, response: "I've set up a new evaluation:", setting: { name: 'Response Quality Evaluation', type: 'Evaluation', config: { 'Name': 'Response Quality Check', 'Metrics': 'Relevance, Accuracy, Helpfulness, Clarity', 'Frequency': 'Every 100 requests', 'Threshold': '85% minimum', 'Action on Fail': 'Alert and log', 'Applied To': 'All AI Skills' } } },
]

function getAdminResponse(input: string): { response: string; setting?: AdminChatMsg['setting'] } {
  for (const r of adminResponses) {
    if (r.trigger.test(input)) return { response: r.response, setting: r.setting }
  }
  return { response: "I can help you configure your AI environment. Try asking me to:\n\n• **Add a guardrail** — PII scrubbing, toxicity detection, prompt injection\n• **Connect an MCP server** — register external tool servers\n• **Change a model** — switch AI skill model configurations\n• **Add an evaluation** — set up quality checks\n\nJust describe what you want in plain language." }
}

function AIAdminChat() {
  const [messages, setMessages] = useState<AdminChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [adminConvo, setAdminConvo] = useState<AdminConvo>({ step: 'idle' })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const suggestions = [
    'Add a PII scrubbing guardrail',
    'Set up toxicity detection',
    'Connect a new MCP server',
    'Add a response quality evaluation',
  ]

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text.trim() }])
    setInput('')
    setIsTyping(true)
    if (inputRef.current) inputRef.current.style.height = '44px'
    setTimeout(() => {
      setIsTyping(false)

      // Multi-turn guardrail flow
      if (adminConvo.step === 'guardrail-describe') {
        const type = /pii|personal|ssn|credit|email|phone/i.test(text) ? 'PII Scrubbing'
          : /toxic|hate|harass|profanity/i.test(text) ? 'Toxicity Detection'
          : /inject|jailbreak|bypass/i.test(text) ? 'Prompt Injection'
          : 'Content Safety'
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `I will set up a **${type}** guardrail. Should this apply to user input, LLM output, or both?`, options: ['User input only', 'LLM output only', 'Both (recommended)'] }])
        setAdminConvo({ step: 'guardrail-scope', type })
        return
      }
      if (adminConvo.step === 'guardrail-scope') {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Applying to **${text.toLowerCase()}**. What should happen when a match is found?`, options: ['Block the request', 'Mask/redact the content', 'Flag and log only'] }])
        setAdminConvo({ step: 'guardrail-action', type: adminConvo.type, scope: text })
        return
      }
      if (adminConvo.step === 'guardrail-action') {
        const cfg: Record<string, string> = { 'Type': adminConvo.type, 'Scope': adminConvo.scope, 'On Match': text, 'Status': 'Active', 'Applied To': 'All AI Skills' }
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Your ${adminConvo.type} guardrail is ready:`, setting: { name: adminConvo.type, type: 'Guardrail', config: cfg } }])
        setAdminConvo({ step: 'idle' })
        return
      }

      // Check if user wants a guardrail
      if (/add.*guardrail|new.*guardrail|create.*guardrail|set.*up.*guardrail|protect|guardrail/i.test(text)) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Tell me about what you need to protect against — for example, sensitive data, inappropriate content, or prompt manipulation?" }])
        setAdminConvo({ step: 'guardrail-describe' })
        return
      }

      // Default responses
      const { response, setting } = getAdminResponse(text)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: response, setting }])
    }, 800 + Math.random() * 1200)
  }, [adminConvo])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = '44px'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
        return part
      })
      return <span key={i}>{i > 0 && <br />}{parts}</span>
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* Fixed header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center" style={{ minHeight: '80px' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Admin</h2>
            <p className="text-xs text-gray-500">Configure your AI environment with natural language</p>
          </div>
        </div>
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mb-5 shadow-lg shadow-purple-200/50">
                <Sparkles size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">What would you like to configure?</h3>
              <p className="text-sm text-gray-500 mb-8">Describe changes in plain language — guardrails, connections, models, and more</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="group px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 text-left hover:border-gray-300 hover:scale-[1.02] font-medium" style={{ transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)' }}>
                    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:[-webkit-background-clip:text] group-hover:[-webkit-text-fill-color:transparent] transition-all duration-500">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex mb-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'messageIn 0.7s cubic-bezier(0.32, 0.72, 0, 1)' }}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center mr-3 mt-1">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-3xl rounded-br-lg px-5 py-3' : ''}`}>
                {msg.role === 'user' ? msg.content : (
                  <div>
                    <div className="text-gray-800 leading-relaxed text-[15px] mb-3">{renderText(msg.content)}</div>
                    {msg.options && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.options.map((opt, oi) => (
                          <button key={oi} onClick={() => sendMessage(opt)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.setting && (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{msg.setting.name}</div>
                            <div className="text-xs text-gray-500">{msg.setting.type}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">Created</span>
                        </div>
                        <div className="p-4 space-y-2">
                          {Object.entries(msg.setting.config).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-500">{key}</span>
                              <span className="font-medium text-gray-900 text-right">{val}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <LinkIcon size={12} />Review in Settings
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-5">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mr-3 relative overflow-visible">
                <Sparkles size={12} className="text-white" />
                <span className="absolute w-1.5 h-1.5 bg-blue-300/50 rounded-full" style={{ animation: 'sparkCircle 3s linear infinite', offsetPath: 'circle(17px)', offsetRotate: '0deg' }} />
                <span className="absolute w-1 h-1 bg-purple-300/50 rounded-full" style={{ animation: 'sparkCircle 4s linear infinite', animationDelay: '-1.3s', offsetPath: 'circle(17px)', offsetRotate: '0deg' }} />
                <span className="absolute w-1 h-1 bg-pink-300/50 rounded-full" style={{ animation: 'sparkCircle 3.5s linear infinite', animationDelay: '-2.5s', offsetPath: 'circle(17px)', offsetRotate: '0deg' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fixed footer input + suggestions */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 pb-4 pt-3">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end bg-gray-50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:border-blue-400 focus-within:shadow-md transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to configure..."
              rows={1}
              className="flex-1 px-5 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
              style={{ height: '44px', maxHeight: '120px' }}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()} className={`m-2 p-2 rounded-xl transition-all ${input.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}>
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EvalParametersContent() {
  const [params, setParams] = useState([
    { id: 1, name: "Relevance", type: "Percentage", description: "How well the response addresses the query", enabled: true },
    { id: 2, name: "Accuracy", type: "Percentage", description: "Factual correctness of the response", enabled: true },
    { id: 3, name: "Helpfulness", type: "Percentage", description: "Actionable guidance and clear examples", enabled: true },
    { id: 4, name: "Clarity", type: "Percentage", description: "Language clarity for target audience", enabled: true },
    { id: 5, name: "Safety", type: "Pass/Fail", description: "No harmful, biased, or inappropriate content", enabled: true },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingParam, setEditingParam] = useState<typeof params[0] | null>(null)
  const [form, setForm] = useState({ name: "", type: "Percentage", description: "" })
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [deleteParam, setDeleteParam] = useState<number | null>(null)
  // Detail view state
  const [detailName, setDetailName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [detailDescription, setDetailDescription] = useState('')
  const [detailType, setDetailType] = useState('Percentage')
  const [testMessages, setTestMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [testInput, setTestInput] = useState('')

  useEffect(() => {
    if (openMenu === null) return
    const close = (e: MouseEvent) => { if (!(e.target as Element).closest('.eval-kebab')) setOpenMenu(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [openMenu])

  const openCreate = () => { setForm({ name: "", type: "Percentage", description: "" }); setShowModal(true) }
  const openDetail = (p: typeof params[0]) => {
    setEditingParam(p); setDetailName(p.name); setDetailDescription(p.description); setDetailType(p.type); setTestMessages([]); setTestInput(''); setOpenMenu(null)
  }
  const saveNew = () => {
    if (!form.name) return
    const newParam = { id: Date.now(), ...form, enabled: true }
    setParams([...params, newParam])
    setShowModal(false)
    openDetail(newParam)
  }
  const saveDetail = () => {
    if (!editingParam) return
    setParams(params.map(p => p.id === editingParam.id ? { ...p, name: detailName, type: detailType, description: detailDescription } : p))
    setEditingParam(null)
  }
  const handleTestSend = () => {
    if (!testInput.trim()) return
    const msg = testInput.trim()
    setTestMessages(prev => [...prev, { role: 'user', content: msg }])
    setTestInput('')
    setTimeout(() => {
      const score = detailType === 'Pass/Fail'
        ? (Math.random() > 0.3 ? 'Pass' : 'Fail')
        : detailType === 'Score (1-5)'
          ? `${Math.floor(Math.random() * 3) + 3}/5`
          : `${Math.floor(Math.random() * 20) + 75}%`
      setTestMessages(prev => [...prev, { role: 'assistant', content: `${detailName} evaluation result: ${score}\n\nThe response was assessed for ${detailDescription.toLowerCase()}. ${score === 'Fail' || parseInt(score) < 80 ? 'The content did not meet the minimum threshold.' : 'The content meets the expected quality threshold.'}` }])
    }, 600)
  }

  // ── Detail / Edit View ──
  if (editingParam) {
    return (
      <div className="flex flex-col h-full">
        {/* Header — matches guardrail config */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0" style={{ minHeight: '80px' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingParam(null)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500"><ChevronLeft size={20} /></button>
            <HeadingField text={detailName} size="LARGE" marginBelow="NONE" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditingParam(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={saveDetail} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left — Configuration - scrollable */}
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="max-w-3xl space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Name</h3>
                <input type="text" value={detailName} onChange={e => setDetailName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-sm" />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Prompt</h3>
                <p className="text-xs text-gray-500 mb-3">Define how this evaluation parameter should assess AI responses.</p>
                <textarea value={detailDescription} onChange={e => setDetailDescription(e.target.value)} placeholder="Describe the criteria for evaluating this parameter..." className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none text-sm" />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Scoring Type</h3>
                <div className="space-y-2">
                  {[
                    { value: 'Percentage', label: 'Percentage', desc: '0–100% score' },
                    { value: 'Pass/Fail', label: 'Pass / Fail', desc: 'Binary pass or fail' },
                    { value: 'Score (1-5)', label: 'Score (1–5)', desc: 'Likert scale rating' },
                    { value: 'Text', label: 'Text', desc: 'Free-form qualitative feedback' },
                  ].map(opt => (
                    <div key={opt.value} onClick={() => setDetailType(opt.value)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${detailType === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div><div className="text-sm font-semibold">{opt.label}</div><div className="text-xs text-gray-500">{opt.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Threshold</h3>
                <p className="text-xs text-gray-500 mb-3">Minimum acceptable score before flagging.</p>
                {detailType === 'Percentage' ? (
                  <div className="flex items-center gap-4">
                    <input type="range" min="0" max="100" step="1" defaultValue="80" className="flex-1" />
                    <span className="text-sm font-medium text-gray-700 w-12">80%</span>
                  </div>
                ) : detailType === 'Score (1-5)' ? (
                  <select defaultValue="3" className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%236b7280%27 d=%27M2 4l4 4 4-4%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                ) : (
                  <p className="text-sm text-gray-400 italic">Not applicable for {detailType} type.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right — Test */}
          <div className="w-[360px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Test Evaluation</h3>
              <p className="text-xs text-gray-500">Enter sample text to test this parameter.</p>
              <p className="text-sm text-gray-500 mt-1">Paste an AI response to evaluate it against this parameter.</p>
            </div>
            <div className="flex-1 p-8 space-y-4 overflow-y-auto">
              {testMessages.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-sm">Send a sample AI response to test the <strong>{detailName}</strong> evaluation.</p>
                </div>
              )}
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <input type="text" value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTestSend()} placeholder="Paste an AI response to evaluate..." className="flex-1 px-4 py-2 border border-gray-300 rounded-md" />
                <button onClick={handleTestSend} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"><Send size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── List View ──
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between" style={{ minHeight: "80px" }}>
        <HeadingField text="Evaluation Parameters" size="LARGE" marginBelow="NONE" />
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Parameter</button>
      </div>
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {params.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{p.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.description}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setParams(params.map(x => x.id === p.id ? { ...x, enabled: !x.enabled } : x))} className={`relative w-9 h-5 rounded-full transition-colors ${p.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.enabled ? 'right-0.5' : 'left-0.5'}`} /></button>
                      <div className="relative eval-kebab inline-block">
                        <button onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)} className="p-1 hover:bg-gray-100 rounded">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-500"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>
                        </button>
                        {openMenu === p.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 py-1">
                            <button onClick={() => openDetail(p)} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Edit</button>
                            <button onClick={() => { setDeleteParam(p.id); setOpenMenu(null) }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">New Evaluation Parameter</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tone" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Percentage</option><option>Pass/Fail</option><option>Score (1-5)</option><option>Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What this parameter measures" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={saveNew} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteParam !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Parameter</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this evaluation parameter? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteParam(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setParams(params.filter(x => x.id !== deleteParam)); setDeleteParam(null) }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function AICallsPanel() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('All')
  const [envFilter, setEnvFilter] = useState('All')
  const [appFilter, setAppFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const perPage = 10

  const allCalls = [
    { timestamp: '4/15/2026 11:25:42 AM', callId: 'call-001-xyz', application: 'Customer Onboarding', object: 'CO_Agent_Customer_Onboarding', environment: 'Production', user: 'john.smith', status: 'Success', tokens: 1247, latency: '245ms', cost: '$0.024', guardrail: 'None' },
    { timestamp: '4/15/2026 11:24:18 AM', callId: 'call-002-abc', application: 'Document Management', object: 'DR_Agent_Document_Review', environment: 'Production', user: 'jane.doe', status: 'Success', tokens: 892, latency: '189ms', cost: '$0.018', guardrail: 'PII Scrubbing' },
    { timestamp: '4/15/2026 11:23:55 AM', callId: 'call-003-def', application: 'Customer Onboarding', object: 'CO_Agent_Customer_Onboarding', environment: 'Staging', user: 'mike.wilson', status: 'Error', tokens: 0, latency: '1.2s', cost: '$0.000', guardrail: 'None' },
    { timestamp: '4/15/2026 11:22:31 AM', callId: 'call-004-ghi', application: 'Finance', object: 'TX_Agent_Tax_Calculator', environment: 'Production', user: 'sarah.jones', status: 'Success', tokens: 1456, latency: '312ms', cost: '$0.029', guardrail: 'Toxicity Filter' },
    { timestamp: '4/15/2026 11:21:07 AM', callId: 'call-005-jkl', application: 'Document Management', object: 'DR_Agent_Document_Review', environment: 'Development', user: 'david.brown', status: 'Success', tokens: 734, latency: '156ms', cost: '$0.015', guardrail: 'None' },
    { timestamp: '4/15/2026 11:19:43 AM', callId: 'call-006-mno', application: 'Customer Onboarding', object: 'CO_Agent_Customer_Onboarding', environment: 'Test', user: 'lisa.garcia', status: 'Success', tokens: 1089, latency: '278ms', cost: '$0.021', guardrail: 'PII Scrubbing' },
    { timestamp: '4/15/2026 11:18:29 AM', callId: 'call-007-pqr', application: 'Finance', object: 'TX_Agent_Tax_Calculator', environment: 'Production', user: 'tom.anderson', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', guardrail: 'None' },
    { timestamp: '4/15/2026 11:17:15 AM', callId: 'call-008-stu', application: 'Document Management', object: 'DR_Agent_Document_Review', environment: 'Staging', user: 'amy.taylor', status: 'Success', tokens: 967, latency: '203ms', cost: '$0.019', guardrail: 'None' },
    { timestamp: '4/15/2026 11:15:02 AM', callId: 'call-009-vwx', application: 'HR Portal', object: 'HR_Agent_Benefits', environment: 'Production', user: 'chris.lee', status: 'Success', tokens: 1102, latency: '267ms', cost: '$0.022', guardrail: 'Topic Filtering' },
    { timestamp: '4/15/2026 11:13:48 AM', callId: 'call-010-yza', application: 'Customer Onboarding', object: 'CO_Agent_Verification', environment: 'Production', user: 'nina.patel', status: 'Success', tokens: 643, latency: '134ms', cost: '$0.013', guardrail: 'PII Scrubbing' },
    { timestamp: '4/15/2026 11:12:33 AM', callId: 'call-011-bcd', application: 'Finance', object: 'TX_Agent_Audit', environment: 'Staging', user: 'john.smith', status: 'Error', tokens: 0, latency: '2.1s', cost: '$0.000', guardrail: 'None' },
    { timestamp: '4/15/2026 11:11:19 AM', callId: 'call-012-efg', application: 'Document Management', object: 'DR_Agent_Summarizer', environment: 'Production', user: 'jane.doe', status: 'Success', tokens: 2034, latency: '412ms', cost: '$0.041', guardrail: 'Prompt Injection' },
    { timestamp: '4/15/2026 11:10:05 AM', callId: 'call-013-hij', application: 'HR Portal', object: 'HR_Agent_Onboarding', environment: 'Development', user: 'mike.wilson', status: 'Success', tokens: 876, latency: '198ms', cost: '$0.018', guardrail: 'None' },
    { timestamp: '4/15/2026 11:08:51 AM', callId: 'call-014-klm', application: 'Customer Onboarding', object: 'CO_Agent_Customer_Onboarding', environment: 'Production', user: 'sarah.jones', status: 'Success', tokens: 1321, latency: '289ms', cost: '$0.026', guardrail: 'Toxicity Filter' },
    { timestamp: '4/15/2026 11:07:37 AM', callId: 'call-015-nop', application: 'Finance', object: 'TX_Agent_Tax_Calculator', environment: 'Test', user: 'david.brown', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', guardrail: 'None' },
    { timestamp: '4/15/2026 11:06:23 AM', callId: 'call-016-qrs', application: 'Document Management', object: 'DR_Agent_Document_Review', environment: 'Production', user: 'lisa.garcia', status: 'Success', tokens: 1567, latency: '334ms', cost: '$0.031', guardrail: 'PII Scrubbing' },
    { timestamp: '4/15/2026 11:05:09 AM', callId: 'call-017-tuv', application: 'HR Portal', object: 'HR_Agent_Benefits', environment: 'Staging', user: 'tom.anderson', status: 'Success', tokens: 445, latency: '112ms', cost: '$0.009', guardrail: 'None' },
    { timestamp: '4/15/2026 11:03:55 AM', callId: 'call-018-wxy', application: 'Customer Onboarding', object: 'CO_Agent_Verification', environment: 'Production', user: 'amy.taylor', status: 'Error', tokens: 0, latency: '1.8s', cost: '$0.000', guardrail: 'Prompt Injection' },
    { timestamp: '4/15/2026 11:02:41 AM', callId: 'call-019-zab', application: 'Finance', object: 'TX_Agent_Audit', environment: 'Production', user: 'chris.lee', status: 'Success', tokens: 1890, latency: '378ms', cost: '$0.038', guardrail: 'None' },
    { timestamp: '4/15/2026 11:01:27 AM', callId: 'call-020-cde', application: 'Document Management', object: 'DR_Agent_Summarizer', environment: 'Development', user: 'nina.patel', status: 'Success', tokens: 723, latency: '167ms', cost: '$0.014', guardrail: 'Topic Filtering' },
    { timestamp: '4/15/2026 10:59:13 AM', callId: 'call-021-fgh', application: 'HR Portal', object: 'HR_Agent_Onboarding', environment: 'Production', user: 'john.smith', status: 'Success', tokens: 1456, latency: '301ms', cost: '$0.029', guardrail: 'PII Scrubbing' },
    { timestamp: '4/15/2026 10:57:59 AM', callId: 'call-022-ijk', application: 'Customer Onboarding', object: 'CO_Agent_Customer_Onboarding', environment: 'Staging', user: 'jane.doe', status: 'Success', tokens: 998, latency: '223ms', cost: '$0.020', guardrail: 'None' },
    { timestamp: '4/15/2026 10:56:45 AM', callId: 'call-023-lmn', application: 'Finance', object: 'TX_Agent_Tax_Calculator', environment: 'Production', user: 'mike.wilson', status: 'Success', tokens: 1678, latency: '356ms', cost: '$0.034', guardrail: 'Toxicity Filter' },
    { timestamp: '4/15/2026 10:55:31 AM', callId: 'call-024-opq', application: 'Document Management', object: 'DR_Agent_Document_Review', environment: 'Production', user: 'sarah.jones', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', guardrail: 'None' },
    { timestamp: '4/15/2026 10:54:17 AM', callId: 'call-025-rst', application: 'HR Portal', object: 'HR_Agent_Benefits', environment: 'Test', user: 'david.brown', status: 'Success', tokens: 534, latency: '128ms', cost: '$0.011', guardrail: 'None' },
  ]

  const filtered = allCalls.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (envFilter === 'All' || c.environment === envFilter) &&
    (appFilter === 'All' || c.application === appFilter) &&
    (searchQuery === '' || c.callId.toLowerCase().includes(searchQuery.toLowerCase()) || c.object.toLowerCase().includes(searchQuery.toLowerCase()) || c.user.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search calls..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Success</option><option>Error</option><option>Timeout</option></select>
          <select value={envFilter} onChange={e => { setEnvFilter(e.target.value); setPage(1) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Production</option><option>Staging</option><option>Test</option><option>Development</option></select>
          <select value={appFilter} onChange={e => { setAppFilter(e.target.value); setPage(1) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Customer Onboarding</option><option>Document Management</option><option>Finance</option><option>HR Portal</option></select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Call ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Application</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Object Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Environment</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tokens</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Latency</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((call, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{call.timestamp}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-blue-600">{call.callId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{call.application}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{call.object}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${call.environment === 'Production' ? 'bg-green-100 text-green-800' : call.environment === 'Staging' ? 'bg-yellow-100 text-yellow-800' : call.environment === 'Test' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{call.environment}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{call.user}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${call.status === 'Success' ? 'bg-green-100 text-green-800' : call.status === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{call.status}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{call.guardrail === 'None' ? <span className="text-gray-400">—</span> : <span className="text-orange-700 font-medium">{call.guardrail}</span>}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{call.tokens}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{call.latency}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{call.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const spotlightItems = [
  { id: 'ai-alt3-protect', label: 'Guardrails', section: 'AI Settings', keywords: ['ai', 'guardrail', 'protect', 'safety', 'pii', 'toxic'] },
  { id: 'ai-alt3-mcp', label: 'MCP', section: 'AI Settings', keywords: ['ai', 'mcp', 'connect', 'model context', 'server'] },
  { id: 'ai-alt3-calls', label: 'AI Calls', section: 'AI Settings', keywords: ['ai', 'calls', 'monitor', 'usage'] },
  { id: 'ai-services', label: 'AI Services', section: 'Integration', keywords: ['ai', 'services', 'model', 'provider'] },
  { id: 'ai-admin', label: 'AI Admin', section: 'AI', keywords: ['ai', 'admin', 'configure'] },
  { id: 'users', label: 'Users', section: 'Authentication', keywords: ['user', 'account', 'people'] },
  { id: 'branding', label: 'Branding', section: 'System', keywords: ['brand', 'logo', 'color', 'theme'] },
  { id: 'infrastructure', label: 'Infrastructure', section: 'DevOps', keywords: ['infra', 'environment', 'deploy'] },
  { id: 'health-check', label: 'Health Check', section: 'DevOps', keywords: ['health', 'check', 'status'] },
  { id: 'plug-ins', label: 'Plug-ins', section: 'System', keywords: ['plugin', 'plug-in', 'extension'] },
  { id: 'int-mcp', label: 'MCP', section: 'Integration', keywords: ['mcp', 'integration', 'connect'] },
  { id: 'certificates', label: 'Certificates', section: 'Integration', keywords: ['cert', 'ssl', 'tls'] },
  { id: 'data-sources', label: 'Data Sources', section: 'Integration', keywords: ['data', 'source', 'database'] },
  { id: 'sso', label: 'Single Sign-On', section: 'Authentication', keywords: ['sso', 'sign-on', 'saml', 'auth'] },
  { id: 'permissions', label: 'Permissions', section: 'System', keywords: ['permission', 'role', 'access', 'security'] },
  { id: 'ai-calls', label: 'AI Calls', section: 'Monitoring', keywords: ['ai', 'calls', 'monitor', 'log'] },
  { id: 'user-activity', label: 'Current User Activity', section: 'Monitoring', keywords: ['user', 'activity', 'session'] },
  { id: 'import-history', label: 'Import History', section: 'Monitoring', keywords: ['import', 'package', 'deploy'] },
  { id: 'rule-performance', label: 'Rule Performance', section: 'Monitoring', keywords: ['rule', 'performance', 'slow', 'speed'] },
  { id: 'sec-guardrails', label: 'Guardrails', section: 'Security', keywords: ['guardrail', 'protect', 'safety'] },
]

const spotlightChatResponses: { trigger: RegExp; response: string }[] = [
  { trigger: /guardrail|pii|toxic|safety|protect/i, response: "Here's what I know about guardrails:\n\n🛡️ You have **12 guardrails** configured across the organization. The most active are:\n• **PII Scrubbing** — 142 triggers, used in 3 apps\n• **Toxicity Filter** — 87 triggers, used in 3 apps\n• **Prompt Injection Shield** — 53 triggers, used in 2 apps\n\nWould you like me to navigate to the Guardrails settings, or help you create a new guardrail?" },
  { trigger: /ai call|call log|usage|how many call/i, response: "Here's a summary of AI calls:\n\n📊 **25 recent calls** across all environments\n• **Production** — 14 calls (56%)\n• **Staging** — 5 calls (20%)\n• **Development** — 3 calls (12%)\n• **Test** — 3 calls (12%)\n\nSuccess rate is **80%** with 3 errors and 2 timeouts." },
  { trigger: /mcp|connect|server|tool/i, response: "MCP status:\n\n🔌 **4 connected servers** with 36 tools total\n• Enterprise Data MCP — 12 tools, 892 calls/24h\n• CRM Integration MCP — 10 tools, degraded\n\nOverall error rate is 0.4%." },
  { trigger: /user|who.*logged|session|active/i, response: "Current user activity:\n\n👥 **10 active users** right now across 3 servers\n• Most recent: john.smith (1:36 PM)\n• Clients: Chrome (6), Safari (2), Edge (1), Firefox (1)" },
  { trigger: /import|package|deploy/i, response: "Recent imports:\n\n📦 **12 imports** in the last 5 days\n• **9 successful**, 1 partial, 2 failed\n• Last: Customer Onboarding v3.2.1 (today)\n• **8 automated**, 4 manual" },
  { trigger: /performance|slow|rule|speed/i, response: "Rule performance:\n\n⚡ Slowest rules:\n• **buildSearchIndex** — 3,450ms avg\n• **aggregateDashboardMetrics** — 2,340ms avg\n• **syncExternalRecords** — 1,890ms avg\n\nFastest: formatCurrencyDisplay at 12ms avg" },
]

function getSpotlightResponse(input: string): string {
  for (const r of spotlightChatResponses) if (r.trigger.test(input)) return r.response
  return "I can help you find settings or answer questions about your environment. Try asking about:\n\n• **Guardrails** — status, triggers, configuration\n• **AI Calls** — usage, errors, costs\n• **MCP** — connected servers, tools\n• **Users** — active sessions\n• **Imports** — deployment history\n• **Performance** — rule execution times"
}

function SpotlightSearch({ onClose, onNavigate, allowChat }: { onClose: () => void; onNavigate: (id: string) => void; allowChat: boolean }) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'chat'>('search')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const spotlightInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { spotlightInputRef.current?.focus() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isTyping])
  useEffect(() => { setSelectedIdx(0) }, [query])

  const isQuestion = allowChat && /\?|^(how|what|why|when|where|who|can|do|does|is|are|show|tell|explain|help|describe)/i.test(query.trim())
  const results = query.trim() && mode === 'search' ? spotlightItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) || item.keywords.some(k => k.includes(query.toLowerCase()))
  ).slice(0, 8) : []

  const handleSubmit = () => {
    if (!query.trim()) return
    if (isQuestion || mode === 'chat') {
      setMode('chat')
      const q = query.trim()
      setChatMessages(prev => [...prev, { role: 'user', content: q }])
      setQuery('')
      setIsTyping(true)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', content: getSpotlightResponse(q) }])
        setIsTyping(false)
      }, 600 + Math.random() * 800)
    } else if (results.length > 0) {
      onNavigate(results[selectedIdx].id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { if (mode === 'chat' && chatMessages.length) { setMode('search'); setChatMessages([]) } else onClose(); return }
    if (e.key === 'Enter') { handleSubmit(); return }
    if (mode === 'search' && results.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(results.length - 1, i + 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(0, i - 1)) }
    }
  }

  const renderText = (text: string) => text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g).map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
    return <span key={i}>{i > 0 && <br />}{parts}</span>
  })

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" style={{ animation: 'spotlightBgIn 0.25s ease-out' }} />
      <div className="relative w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: '60vh', animation: 'spotlightCardIn 0.35s cubic-bezier(0.32, 0.72, 0, 1)' }} onClick={e => e.stopPropagation()}>
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: '60vh' }}>
          <div className="flex items-center px-5 border-b border-gray-100">
            <Sparkles size={20} className={mode === 'chat' ? 'text-purple-500 flex-shrink-0' : 'text-purple-400 flex-shrink-0'} />
            <input
              ref={spotlightInputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'chat' ? 'Ask a follow-up question...' : 'Search or ask anything...'}
              className="flex-1 px-4 py-4 text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
            />
            {query && <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded-md"><X size={16} className="text-gray-400" /></button>}
            <kbd className="ml-2 text-[10px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">ESC</kbd>
          </div>

          {/* Search results */}
          {mode === 'search' && results.length > 0 && (
            <div className="overflow-y-auto py-2">
              {results.map((r, i) => (
                <button key={r.id} onClick={() => onNavigate(r.id)} onMouseEnter={() => setSelectedIdx(i)} className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${i === selectedIdx ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Search size={14} className={i === selectedIdx ? 'text-blue-400' : 'text-gray-400'} />
                  <span className="text-sm font-medium flex-1">{r.label}</span>
                  <span className="text-xs text-gray-400">{r.section}</span>
                </button>
              ))}
            </div>
          )}

          {/* Question hint */}
          {mode === 'search' && query.trim() && isQuestion && (
            <div className="px-5 py-3 border-t border-gray-100 bg-purple-50/50">
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Sparkles size={14} />
                <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-purple-200 rounded text-xs font-medium">Enter</kbd> to ask AI</span>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {mode === 'chat' && (
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mt-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-100 rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-gray-900' : 'text-sm text-gray-700 leading-relaxed'}`}>
                    {msg.role === 'user' ? msg.content : renderText(msg.content)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
                    <Sparkles size={12} className="text-white animate-pulse" />
                  </div>
                  <div className="flex gap-1 items-center py-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Empty state */}
          {mode === 'search' && !query.trim() && (
            <div className="px-5 py-4 text-sm text-gray-400 text-center">Type to search settings or ask a question</div>
          )}
          {mode === 'search' && query.trim() && !isQuestion && results.length === 0 && (
            <div className="px-5 py-4 text-sm text-gray-400 text-center">{allowChat ? 'No results found. Try asking a question instead.' : 'No results found.'}</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spotlightBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spotlightCardIn { from { opacity: 0; transform: scale(0.96) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  )
}

function HoverPopover({ items, label }: { items: string[]; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="text-blue-600 font-semibold cursor-pointer hover:underline">{items.length}</span>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3" style={{ animation: 'fadeSlideIn 0.15s ease-out' }}>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">{items.map((item, i) => <div key={i} className="text-sm text-gray-700">{item}</div>)}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"><div className="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -translate-y-1"></div></div>
        </div>
      )}
    </span>
  )
}

function GuardrailsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 10

  const guardrails = [
    { name: 'PII Scrubbing — Customer Data', type: 'PII Detection', status: 'Active', applications: ['Customer Onboarding', 'HR Portal', 'Document Management'], objects: ['CO_Agent_Customer_Onboarding', 'CO_Agent_Verification', 'HR_Agent_Benefits', 'HR_Agent_Onboarding', 'DR_Agent_Document_Review'], triggers: 142, lastTriggered: '4/15/2026 11:24 AM' },
    { name: 'Toxicity Filter — Standard', type: 'Toxicity Detection', status: 'Active', applications: ['Customer Onboarding', 'Finance', 'HR Portal'], objects: ['CO_Agent_Customer_Onboarding', 'TX_Agent_Tax_Calculator', 'HR_Agent_Benefits'], triggers: 87, lastTriggered: '4/15/2026 11:22 AM' },
    { name: 'Prompt Injection Shield', type: 'Prompt Injection', status: 'Active', applications: ['Document Management', 'Customer Onboarding'], objects: ['DR_Agent_Summarizer', 'DR_Agent_Document_Review', 'CO_Agent_Verification'], triggers: 53, lastTriggered: '4/15/2026 11:12 AM' },
    { name: 'Topic Filtering — Finance', type: 'Topic Restriction', status: 'Active', applications: ['Finance', 'HR Portal'], objects: ['TX_Agent_Tax_Calculator', 'TX_Agent_Audit', 'HR_Agent_Benefits'], triggers: 34, lastTriggered: '4/15/2026 11:15 AM' },
    { name: 'Hallucination Guard', type: 'Factuality Check', status: 'Active', applications: ['Document Management', 'Finance'], objects: ['DR_Agent_Summarizer', 'TX_Agent_Audit'], triggers: 21, lastTriggered: '4/15/2026 10:48 AM' },
    { name: 'Sensitive Topics — HR', type: 'Topic Restriction', status: 'Active', applications: ['HR Portal'], objects: ['HR_Agent_Benefits', 'HR_Agent_Onboarding'], triggers: 18, lastTriggered: '4/15/2026 10:32 AM' },
    { name: 'Output Length Limiter', type: 'Output Control', status: 'Active', applications: ['Customer Onboarding', 'Document Management', 'Finance', 'HR Portal'], objects: ['CO_Agent_Customer_Onboarding', 'DR_Agent_Summarizer', 'TX_Agent_Tax_Calculator', 'HR_Agent_Benefits'], triggers: 12, lastTriggered: '4/15/2026 10:15 AM' },
    { name: 'Competitor Mention Block', type: 'Content Filter', status: 'Inactive', applications: ['Customer Onboarding'], objects: ['CO_Agent_Customer_Onboarding', 'CO_Agent_Verification'], triggers: 0, lastTriggered: '—' },
    { name: 'Legal Disclaimer Enforcer', type: 'Output Control', status: 'Active', applications: ['Finance'], objects: ['TX_Agent_Tax_Calculator', 'TX_Agent_Audit'], triggers: 67, lastTriggered: '4/15/2026 11:01 AM' },
    { name: 'Data Residency Check', type: 'Compliance', status: 'Active', applications: ['Customer Onboarding', 'HR Portal', 'Finance'], objects: ['CO_Agent_Customer_Onboarding', 'HR_Agent_Onboarding', 'TX_Agent_Audit'], triggers: 9, lastTriggered: '4/15/2026 9:45 AM' },
    { name: 'Bias Detection — Hiring', type: 'Fairness', status: 'Active', applications: ['HR Portal'], objects: ['HR_Agent_Onboarding'], triggers: 5, lastTriggered: '4/15/2026 9:12 AM' },
    { name: 'Code Execution Block', type: 'Prompt Injection', status: 'Inactive', applications: ['Document Management', 'Finance'], objects: ['DR_Agent_Summarizer', 'TX_Agent_Audit'], triggers: 0, lastTriggered: '—' },
  ]

  const filtered = guardrails.filter(g =>
    (statusFilter === 'All' || g.status === statusFilter) &&
    (searchQuery === '' || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.type.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search guardrails..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Active</option><option>Inactive</option></select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applications</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Objects</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Triggers</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Triggered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((g, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{g.type}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${g.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{g.status}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><HoverPopover items={g.applications} label="Applications" /></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><HoverPopover items={g.objects} label="Objects" /></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{g.triggers}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{g.lastTriggered}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RulePerformancePanel() {
  const [sortCol, setSortCol] = useState<string>('avgTime')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const allRules = [
    { rule: 'getCustomerDetails', executions: 12450, avgTime: 842, minTime: 12, maxTime: 4521 },
    { rule: 'calculateTaxLiability', executions: 8920, avgTime: 723, minTime: 45, maxTime: 3890 },
    { rule: 'processInvoiceValidation', executions: 15230, avgTime: 654, minTime: 8, maxTime: 5120 },
    { rule: 'generateComplianceReport', executions: 3410, avgTime: 1245, minTime: 320, maxTime: 8900 },
    { rule: 'lookupEmployeeBenefits', executions: 6780, avgTime: 198, minTime: 5, maxTime: 1230 },
    { rule: 'validateDocumentSignature', executions: 9870, avgTime: 567, minTime: 23, maxTime: 3450 },
    { rule: 'routeApprovalWorkflow', executions: 4560, avgTime: 432, minTime: 15, maxTime: 2780 },
    { rule: 'syncExternalRecords', executions: 2340, avgTime: 1890, minTime: 450, maxTime: 12300 },
    { rule: 'formatCurrencyDisplay', executions: 34500, avgTime: 12, minTime: 1, maxTime: 89 },
    { rule: 'checkUserPermissions', executions: 28900, avgTime: 34, minTime: 2, maxTime: 210 },
    { rule: 'aggregateDashboardMetrics', executions: 1890, avgTime: 2340, minTime: 890, maxTime: 15600 },
    { rule: 'parseEmailAttachments', executions: 5670, avgTime: 456, minTime: 34, maxTime: 2890 },
    { rule: 'buildSearchIndex', executions: 890, avgTime: 3450, minTime: 1200, maxTime: 18900 },
    { rule: 'evaluateRiskScore', executions: 7230, avgTime: 345, minTime: 18, maxTime: 1890 },
    { rule: 'transformDataPayload', executions: 11200, avgTime: 278, minTime: 9, maxTime: 1560 },
    { rule: 'renderRecordSummary', executions: 19800, avgTime: 156, minTime: 4, maxTime: 980 },
    { rule: 'validateAddressFormat', executions: 8450, avgTime: 89, minTime: 3, maxTime: 560 },
    { rule: 'computeShippingCost', executions: 6120, avgTime: 234, minTime: 11, maxTime: 1340 },
    { rule: 'mergeContactRecords', executions: 3890, avgTime: 567, minTime: 45, maxTime: 3200 },
    { rule: 'generatePDFExport', executions: 2100, avgTime: 1678, minTime: 560, maxTime: 9800 },
  ]

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const filtered = allRules.filter(r =>
    searchQuery === '' || r.rule.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol as keyof typeof a]
    const bv = b[sortCol as keyof typeof b]
    if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const paginated = sorted.slice((page - 1) * perPage, page * perPage)

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
      <button onClick={() => { toggleSort(col); setPage(1) }} className="flex items-center gap-1 hover:text-blue-600">
        {label}
        <span className="text-gray-400">{sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search rules..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader col="rule" label="Rule" />
              <SortHeader col="executions" label="Number of Executions" />
              <SortHeader col="avgTime" label="Average Time (ms)" />
              <SortHeader col="minTime" label="Minimum Time (ms)" />
              <SortHeader col="maxTime" label="Maximum Time (ms)" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{r.rule}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.executions.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.avgTime.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.minTime.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.maxTime.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImportHistoryPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [resultFilter, setResultFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 10

  const allImports = [
    { packageName: 'Customer Onboarding v3.2.1', result: 'Success', importedBy: 'john.smith', importTime: '4/15/2026 10:30:00 AM', automated: true },
    { packageName: 'HR Portal v2.1.0', result: 'Success', importedBy: 'jane.doe', importTime: '4/15/2026 9:15:22 AM', automated: false },
    { packageName: 'Finance Module v4.0.3', result: 'Partial Success', importedBy: 'mike.wilson', importTime: '4/14/2026 4:45:10 PM', automated: true },
    { packageName: 'Document Review v1.8.0', result: 'Success', importedBy: 'sarah.jones', importTime: '4/14/2026 2:20:33 PM', automated: true },
    { packageName: 'Asset Management v2.5.1', result: 'Failed', importedBy: 'david.brown', importTime: '4/14/2026 11:05:47 AM', automated: false },
    { packageName: 'Customer Onboarding v3.2.0', result: 'Success', importedBy: 'john.smith', importTime: '4/13/2026 3:30:15 PM', automated: true },
    { packageName: 'Shared Components v1.4.2', result: 'Success', importedBy: 'lisa.garcia', importTime: '4/13/2026 1:12:08 PM', automated: false },
    { packageName: 'HR Portal v2.0.9', result: 'Success', importedBy: 'tom.anderson', importTime: '4/12/2026 5:45:30 PM', automated: true },
    { packageName: 'Finance Module v4.0.2', result: 'Failed', importedBy: 'amy.taylor', importTime: '4/12/2026 10:20:55 AM', automated: true },
    { packageName: 'Reporting Suite v3.1.0', result: 'Success', importedBy: 'chris.lee', importTime: '4/11/2026 4:00:12 PM', automated: false },
    { packageName: 'Integration Connectors v2.3.1', result: 'Success', importedBy: 'nina.patel', importTime: '4/11/2026 11:30:44 AM', automated: true },
    { packageName: 'Customer Onboarding v3.1.9', result: 'Partial Success', importedBy: 'john.smith', importTime: '4/10/2026 2:15:28 PM', automated: true },
  ]

  const filtered = allImports.filter(i =>
    (resultFilter === 'All' || i.result === resultFilter) &&
    (searchQuery === '' || i.packageName.toLowerCase().includes(searchQuery.toLowerCase()) || i.importedBy.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search packages..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={resultFilter} onChange={e => { setResultFilter(e.target.value); setPage(1) }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Success</option><option>Partial Success</option><option>Failed</option></select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Package Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Import Results</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Imported By</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Import Time</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Automated Deployment?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((imp, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{imp.packageName}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${imp.result === 'Success' ? 'bg-green-100 text-green-800' : imp.result === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{imp.result}</span></td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{imp.importedBy}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{imp.importTime}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{imp.automated ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserActivityPanel() {
  const [sortCol, setSortCol] = useState<string>('lastActivity')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const allUsers = [
    { user: 'john.smith', lastActivity: '4/15/2026 1:36:12 PM', server: 'app-prod-01', clientIp: '10.0.1.42', client: 'Chrome 124 / Windows' },
    { user: 'jane.doe', lastActivity: '4/15/2026 1:35:48 PM', server: 'app-prod-02', clientIp: '10.0.1.87', client: 'Safari 18 / macOS' },
    { user: 'mike.wilson', lastActivity: '4/15/2026 1:34:22 PM', server: 'app-prod-01', clientIp: '10.0.2.15', client: 'Edge 124 / Windows' },
    { user: 'sarah.jones', lastActivity: '4/15/2026 1:33:05 PM', server: 'app-prod-03', clientIp: '10.0.1.63', client: 'Chrome 124 / macOS' },
    { user: 'david.brown', lastActivity: '4/15/2026 1:31:47 PM', server: 'app-prod-01', clientIp: '10.0.3.21', client: 'Firefox 126 / Linux' },
    { user: 'lisa.garcia', lastActivity: '4/15/2026 1:30:19 PM', server: 'app-prod-02', clientIp: '10.0.1.94', client: 'Chrome 124 / Windows' },
    { user: 'tom.anderson', lastActivity: '4/15/2026 1:28:55 PM', server: 'app-prod-03', clientIp: '10.0.2.38', client: 'Safari 18 / iOS' },
    { user: 'amy.taylor', lastActivity: '4/15/2026 1:27:33 PM', server: 'app-prod-01', clientIp: '10.0.1.56', client: 'Chrome 124 / macOS' },
    { user: 'chris.lee', lastActivity: '4/15/2026 1:25:11 PM', server: 'app-prod-02', clientIp: '10.0.3.72', client: 'Edge 124 / Windows' },
    { user: 'nina.patel', lastActivity: '4/15/2026 1:23:44 PM', server: 'app-prod-01', clientIp: '10.0.2.89', client: 'Chrome 124 / Windows' },
  ]

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const filtered = allUsers.filter(u =>
    searchQuery === '' || u.user.toLowerCase().includes(searchQuery.toLowerCase()) || u.server.toLowerCase().includes(searchQuery.toLowerCase()) || u.clientIp.includes(searchQuery)
  )
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol as keyof typeof a] || ''
    const bv = b[sortCol as keyof typeof b] || ''
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const paginated = sorted.slice((page - 1) * perPage, page * perPage)

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
      <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-blue-600">
        {label}
        <span className="text-gray-400">{sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search users..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader col="user" label="User" />
              <SortHeader col="lastActivity" label="Last Activity" />
              <SortHeader col="server" label="Server" />
              <SortHeader col="clientIp" label="Client IP" />
              <SortHeader col="client" label="Client" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{u.user}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{u.lastActivity}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{u.server}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">{u.clientIp}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{u.client}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultPanel({ activeItem }: { activeItem: string }) {
  const label = navSections.flatMap(s => s.items).find(i => i.id === activeItem)?.label || activeItem
  return (
    <div>
      <div className="mb-6">
        <HeadingField text={label} size="LARGE" marginBelow="LESS" />
        <p className="text-gray-600 text-sm">Configure {label.toLowerCase()} settings for your environment.</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-sm">Settings for {label} will appear here. Use the controls below to configure your environment.</p>
        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" /><span className="text-sm text-gray-700">Enable {label}</span></label>
        </div>
        <div className="mt-6 flex justify-end"><button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">SAVE CHANGES</button></div>
      </div>
    </div>
  )
}
