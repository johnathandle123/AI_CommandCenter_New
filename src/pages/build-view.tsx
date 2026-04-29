import { HeadingField } from '@pglevy/sailwind'
import { Search, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Package, Rocket, Activity, ChevronLeft, Plus, Upload, Download, Shield, GitBranch, RefreshCw, Plug, ToggleLeft, ToggleRight, Link2, ExternalLink, PanelLeftClose, PanelLeftOpen, Eye, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { MonitorPanel } from './appian-monitor'
import { useWaffleOption } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'

export default function BuildView() {
  const appName = 'Customer Portal'
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('build')
  const [activeObjectsTab, setActiveObjectsTab] = useState('all')
  const [aiSubTab, setAiSubTab] = useState<'protect' | 'mcp' | 'observe'>('protect')
  const [observeTab, setObserveTab] = useState<'metrics' | 'logs'>('metrics')
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [showAppMenu, setShowAppMenu] = useState(false)
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false)
  const [showMcpModal, setShowMcpModal] = useState(false)
  const [grPage, setGrPage] = useState(1)
  const [mcpPage, setMcpPage] = useState(1)
  const [grKebab, setGrKebab] = useState<number | null>(null)
  const [mcpKebab, setMcpKebab] = useState<number | null>(null)
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option1')
  const [, setLocation] = useLocation()

  const waffleApps = [
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', active: true, path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard' },
    { name: 'Operations Console', icon: Monitor, color: 'bg-orange-500', path: '/dashboard' },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' }
  ]

  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' }
  ]

  const objects = [
    { name: 'Customer Portal Site', type: 'Site', icon: Monitor, iconColor: 'bg-blue-500', description: 'Customer support portal with live chat', lastModified: '1/20/2026 11:45 AM', modifiedBy: 'JD' },
    { name: 'Customer Dashboard', type: 'Interface', icon: Database, iconColor: 'bg-teal-500', description: 'Main customer portal interface', lastModified: '1/15/2026 9:30 AM', modifiedBy: 'JD' },
    { name: 'Customer Support AI Skill', type: 'AI Skill', icon: Brain, iconColor: 'bg-purple-500', description: 'AI-powered customer support assistant', lastModified: '1/15/2026 9:00 AM', modifiedBy: 'JD' },
    { name: 'Customer Record Type', type: 'Record Type', icon: FileText, iconColor: 'bg-indigo-500', description: 'Customer data model', lastModified: '1/15/2026 8:15 AM', modifiedBy: 'SM' },
    { name: 'Submit Request Process', type: 'Process Model', icon: Activity, iconColor: 'bg-orange-500', description: 'Customer request workflow', lastModified: '1/14/2026 4:20 PM', modifiedBy: 'AK' },
    { name: 'Customer Data Store', type: 'Data Store', icon: Database, iconColor: 'bg-green-500', description: 'Customer database entity', lastModified: '1/14/2026 2:10 PM', modifiedBy: 'JD' },
    { name: 'Validate Customer Rule', type: 'Expression Rule', icon: Settings, iconColor: 'bg-gray-500', description: 'Customer validation logic', lastModified: '1/13/2026 11:45 AM', modifiedBy: 'SM' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false)
      if (showAppMenu && !(event.target as Element).closest('.app-menu')) setShowAppMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu, showAppMenu])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/appian-designer')} className="p-2 hover:bg-white/20 rounded-md transition-colors">
              <ChevronLeft size={24} className="text-black" />
            </button>
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center">
              <Paintbrush size={24} className="text-white" />
            </div>
            <HeadingField
              text={appName}
              size="LARGE"
              headingTag="H1"
              marginBelow="NONE"
              fontWeight="BOLD"
            />
          </div>
          <div className="flex items-center gap-3">
            <VersionSwitcher />
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors">
              <Search size={20} className="text-black" />
            </button>
            <div className="relative app-menu">
              <button onClick={() => setShowAppMenu(!showAppMenu)} className="p-2 rounded-md hover:bg-white/20 transition-colors">
                <Settings size={20} className={showAppMenu ? 'text-blue-500' : 'text-black'} />
              </button>
              {showAppMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] w-56 py-1">
                  {[
                    { label: 'Application Properties' },
                    { label: 'Application Security' },
                    { label: 'Application Documentation' },
                    { label: 'Application Actions' },
                    { label: 'Application Guardrails', action: () => { setShowGuardrailsModal(true); setGrPage(1) } },
                    { label: 'Application MCP', action: () => { setShowMcpModal(true); setMcpPage(1) } },
                    { label: 'Missing Precedents' },
                    { label: 'Security Summary' },
                    { label: 'Manage Test Cases' },
                  ].map((item, i) => (
                    <button key={i} onClick={() => { item.action?.(); setShowAppMenu(false) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{item.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className="p-2 rounded-md hover:bg-white/20 transition-colors relative waffle-menu"
            >
              <Grid3X3 size={20} className={showWaffleMenu ? "text-blue-500" : "text-black"} />
            </button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
              J
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" 
              alt="Appian" 
              className="h-6"
            />
          </div>
        </div>
      </div>

      {/* Waffle Menu */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[100] waffle-menu">
          <div className="grid grid-cols-3 gap-2 w-80 mb-3">
            {waffleApps.map((app, index) => {
              const Icon = app.icon
              return (
                <Link key={index} href={app.path || '/dashboard'}>
                  <button
                    className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${
                      app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'
                    }`}
                    onClick={() => setShowWaffleMenu(false)}
                  >
                    <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-xs text-center">{app.name}</span>
                  </button>
                </Link>
              )
            })}
          </div>
          <div className="border-t border-gray-200 mb-3"></div>
          <div className="grid grid-cols-3 gap-2">
            {helpApps.map((app, index) => {
              const Icon = app.icon
              return (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500"
                  onClick={() => setShowWaffleMenu(false)}
                >
                  <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-xs text-center">{app.name}</span>
                </button>
              )
            })}
          </div>
          {!waffleLocked ? <div className="border-t border-gray-200 mt-3 pt-3">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as 'option1' | 'option2' | 'option3' | 'option4' | 'option5')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
              <option value="option4">Option 4</option>
              <option value="option5">Option 5</option>
            </select>
          </div> : <div className="border-t border-gray-200 mt-3 pt-3">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option4">Option 1 — With Operations Console</option><option value="option6">Option 2 — Without Operations Console</option>
            </select>
          </div>}
        </div>
      )}

      {/* Main Content with Left Nav */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Navigation */}
        <div className={`${navCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          <nav className={`flex flex-col ${navCollapsed ? 'p-2' : 'p-4'} space-y-1 flex-1`}>
            {[
              { id: 'build', label: 'Build', icon: Package },
              { id: 'explore', label: 'Explore', icon: Database },
              { id: 'deploy', label: 'Deploy', icon: Rocket },
              { id: 'monitor', label: 'Monitor', icon: Activity },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={navCollapsed ? tab.label : undefined}
                  className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {!navCollapsed && <span className="font-medium">{tab.label}</span>}
                </button>
              )
            })}
            <div className={`border-t border-gray-200 ${navCollapsed ? 'mx-1' : 'mx-0'} my-2`}></div>
            <button
              onClick={() => setActiveTab('ai-command-center')}
              title={navCollapsed ? 'AI Command Center' : undefined}
              className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${
                activeTab === 'ai-command-center' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Brain size={20} />
              {!navCollapsed && <span className="font-medium">AI Command Center</span>}
            </button>
          </nav>
          <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-4 border-t border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center">
            {navCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* AI Command Center Sub-Nav */}
        {activeTab === 'ai-command-center' && (
          <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 tracking-wider">AI COMMAND CENTER</div>
            <nav className="flex flex-col px-3 space-y-1">
              {([
                { id: 'protect' as const, label: 'Protect', icon: Shield },
                { id: 'mcp' as const, label: 'Connect', icon: Plug },
                { id: 'observe' as const, label: 'Observe', icon: Eye },
              ]).map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAiSubTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                      aiSubTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'monitor' ? (
            <MonitorPanel />
          ) : (
          <div className="container mx-auto px-6 py-6 max-w-7xl">

            {activeTab === 'ai-command-center' ? (
              <div>

                {aiSubTab === 'protect' && (
                  <div>
                    <div className="mb-6">
                      <HeadingField text="Application Guardrails" size="LARGE" marginBelow="LESS" />
                      <p className="text-gray-600 text-sm">View and toggle guardrails scoped to this application. Environment-wide guardrails are managed in the Admin Console.</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                      <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HeadingField text="Environment Guardrails" size="MEDIUM" marginBelow="NONE" />
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Inherited</span>
                        </div>
                        <Link href="/dashboard"><button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">Manage in Command Center <ExternalLink size={14} /></button></Link>
                      </div>
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scope</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">App Override</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            { name: 'PII Scrubbing', type: 'Data Protection', scope: 'All Apps', overridable: false },
                            { name: 'Prompt Injection Detection', type: 'Input Protection', scope: 'All Apps', overridable: false },
                            { name: 'Toxicity Filter', type: 'Content Safety', scope: 'All Apps', overridable: true },
                          ].map((g, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><Shield size={16} className="text-green-600" /></div><span className="text-sm font-medium text-gray-900">{g.name}</span></div></td>
                              <td className="px-6 py-4 text-sm text-gray-700">{g.type}</td>
                              <td className="px-6 py-4"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{g.scope}</span></td>
                              <td className="px-6 py-4"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                              <td className="px-6 py-4 text-sm">{g.overridable ? <span className="text-orange-600 font-medium">Can disable</span> : <span className="text-gray-400">Locked</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                        <HeadingField text="Application Guardrails" size="MEDIUM" marginBelow="NONE" />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">+ Add Guardrail</button>
                      </div>
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied To</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Toggle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            { name: 'Customer Data Filter', type: 'PII Scrubbing', appliedTo: 'Customer Support AI Skill', enabled: true },
                            { name: 'Brand Voice Enforcer', type: 'Tone', appliedTo: 'All AI Skills', enabled: true },
                            { name: 'Financial Compliance', type: 'Regulatory', appliedTo: 'Invoice Processing Skill', enabled: false },
                            { name: 'Topic Restriction - HR', type: 'Topic Filtering', appliedTo: 'HR Onboarding Skill', enabled: true },
                            { name: 'Hallucination Check', type: 'Output Validation', appliedTo: 'All AI Skills', enabled: true },
                          ].map((g, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg ${g.enabled ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center`}><Shield size={16} className={g.enabled ? 'text-purple-600' : 'text-gray-400'} /></div><span className="text-sm font-medium text-gray-900">{g.name}</span></div></td>
                              <td className="px-6 py-4 text-sm text-gray-700">{g.type}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{g.appliedTo}</td>
                              <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${g.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{g.enabled ? 'Active' : 'Inactive'}</span></td>
                              <td className="px-6 py-4">{g.enabled ? <ToggleRight size={24} className="text-blue-600 cursor-pointer" /> : <ToggleLeft size={24} className="text-gray-400 cursor-pointer" />}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {aiSubTab === 'mcp' && (
                  <div>
                    <div className="mb-6">
                      <HeadingField text="Object & Tool Connections" size="LARGE" marginBelow="LESS" />
                      <p className="text-gray-600 text-sm">View and toggle object/tool connections available to AI skills within this application.</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                      <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                        <HeadingField text="Connected Objects" size="MEDIUM" marginBelow="NONE" />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">+ Connect Object</button>
                      </div>
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Object</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Used By</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Toggle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            { name: 'Customer Records', type: 'Record Type', source: 'Application', usedBy: 'Customer Support AI', enabled: true },
                            { name: 'Knowledge Base API', type: 'Integration', source: 'Application', usedBy: 'All AI Skills', enabled: true },
                            { name: 'Case Management', type: 'Process Model', source: 'Application', usedBy: 'Customer Support AI', enabled: true },
                            { name: 'Invoice Data Store', type: 'Data Store', source: 'Application', usedBy: 'Invoice Processing AI', enabled: false },
                            { name: 'Email Service', type: 'Connected System', source: 'Environment', usedBy: 'HR Onboarding AI', enabled: true },
                          ].map((obj, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg ${obj.enabled ? 'bg-indigo-100' : 'bg-gray-100'} flex items-center justify-center`}><Link2 size={16} className={obj.enabled ? 'text-indigo-600' : 'text-gray-400'} /></div><span className="text-sm font-medium text-gray-900">{obj.name}</span></div></td>
                              <td className="px-6 py-4 text-sm text-gray-700">{obj.type}</td>
                              <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obj.source === 'Environment' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{obj.source}</span></td>
                              <td className="px-6 py-4 text-sm text-gray-700">{obj.usedBy}</td>
                              <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obj.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{obj.enabled ? 'Active' : 'Inactive'}</span></td>
                              <td className="px-6 py-4">{obj.enabled ? <ToggleRight size={24} className="text-blue-600 cursor-pointer" /> : <ToggleLeft size={24} className="text-gray-400 cursor-pointer" />}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 p-4 bg-gray-50">
                        <HeadingField text="Tool Permissions" size="MEDIUM" marginBelow="NONE" />
                      </div>
                      <div className="p-6 space-y-4">
                        {[
                          { tool: 'Read Records', desc: 'Allow AI skills to query record types', enabled: true },
                          { tool: 'Write Records', desc: 'Allow AI skills to create or update records', enabled: false },
                          { tool: 'Execute Processes', desc: 'Allow AI skills to start process models', enabled: true },
                          { tool: 'Call Integrations', desc: 'Allow AI skills to invoke integration objects', enabled: true },
                          { tool: 'Access Documents', desc: 'Allow AI skills to read document content', enabled: false },
                        ].map((perm, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{perm.tool}</div>
                              <div className="text-xs text-gray-500">{perm.desc}</div>
                            </div>
                            {perm.enabled ? <ToggleRight size={24} className="text-blue-600 cursor-pointer" /> : <ToggleLeft size={24} className="text-gray-400 cursor-pointer" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {aiSubTab === 'observe' && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <HeadingField text="Observe" size="LARGE" marginBelow="LESS" />
                        <p className="text-gray-600 text-sm">Monitor AI skill usage, performance, and cost within this application.</p>
                      </div>
                      <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700">
                        <option>Last 24 hours</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>

                    {/* Inner tabs: Metrics / Logs */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                      <div className="flex border-b border-gray-200">
                        <button onClick={() => setObserveTab('metrics')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${observeTab === 'metrics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Metrics</button>
                        <button onClick={() => setObserveTab('logs')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${observeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Logs</button>
                      </div>
                    </div>

                    {observeTab === 'metrics' && (
                      <div>
                        {/* KPI Row */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          {[
                            { label: 'Total Requests', value: '3,842', change: '+12.4%', up: true },
                            { label: 'Avg Latency', value: '1.3s', change: '-8.1%', up: false },
                            { label: 'Error Rate', value: '0.9%', change: '-2.3%', up: false },
                            { label: 'Est. Cost (MTD)', value: '$247.50', change: '+5.2%', up: true },
                          ].map((kpi, i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                              <div className={`text-xs font-medium ${kpi.up ? 'text-red-500' : 'text-green-600'}`}>{kpi.change}</div>
                            </div>
                          ))}
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Requests Over Time */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="text-sm font-bold text-gray-700 mb-4">Requests Over Time</div>
                            <div className="h-40 flex items-end gap-1">
                              {[65,45,72,58,80,92,68,85,78,95,88,70,82,90,75,98,84,60,73,88,92,78,85,96].map((v, i) => (
                                <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, backgroundColor: i === 23 ? '#3b82f6' : '#dbeafe' }}></div>
                              ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span>
                            </div>
                          </div>

                          {/* Latency Distribution */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="text-sm font-bold text-gray-700 mb-4">Latency (p50 / p95 / p99)</div>
                            <div className="h-40 flex items-end gap-0.5">
                              {[
                                {p50:30,p95:55,p99:70},{p50:28,p95:50,p99:65},{p50:35,p95:60,p99:78},{p50:25,p95:48,p99:62},
                                {p50:32,p95:58,p99:75},{p50:38,p95:65,p99:82},{p50:30,p95:52,p99:68},{p50:27,p95:50,p99:66},
                                {p50:33,p95:56,p99:72},{p50:36,p95:62,p99:80},{p50:29,p95:51,p99:67},{p50:31,p95:54,p99:71},
                              ].map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                                  <div className="rounded-t bg-red-200" style={{ height: `${v.p99 - v.p95}%` }}></div>
                                  <div className="bg-orange-200" style={{ height: `${v.p95 - v.p50}%` }}></div>
                                  <div className="bg-blue-400 rounded-b" style={{ height: `${v.p50}%` }}></div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>p50</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-200"></span>p95</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200"></span>p99</span>
                            </div>
                          </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Cost Over Time */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="text-sm font-bold text-gray-700 mb-4">Cost Over Time</div>
                            <div className="h-40 relative">
                              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                                  </linearGradient>
                                </defs>
                                <path d="M0,90 C20,85 40,70 60,72 C80,74 100,60 120,55 C140,50 160,58 180,45 C200,32 220,40 240,35 C260,30 280,22 300,18" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                                <path d="M0,90 C20,85 40,70 60,72 C80,74 100,60 120,55 C140,50 160,58 180,45 C200,32 220,40 240,35 C260,30 280,22 300,18 L300,120 L0,120 Z" fill="url(#costFill)" />
                              </svg>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                            </div>
                          </div>

                          {/* Errors by Type */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="text-sm font-bold text-gray-700 mb-4">Guardrail Triggers</div>
                            <div className="space-y-3">
                              {[
                                { label: 'PII Detected', count: 42, pct: 38, color: 'bg-red-400' },
                                { label: 'Toxicity Blocked', count: 28, pct: 25, color: 'bg-orange-400' },
                                { label: 'Prompt Injection', count: 19, pct: 17, color: 'bg-yellow-400' },
                                { label: 'Topic Off-limits', count: 14, pct: 13, color: 'bg-blue-400' },
                                { label: 'Hallucination Flag', count: 8, pct: 7, color: 'bg-purple-400' },
                              ].map((item, i) => (
                                <div key={i}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-700 font-medium">{item.label}</span>
                                    <span className="text-gray-500">{item.count} ({item.pct}%)</span>
                                  </div>
                                  <div className="h-2 bg-gray-100 rounded-full">
                                    <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Per-Skill Breakdown */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="border-b border-gray-200 p-4 bg-gray-50">
                            <HeadingField text="Per-Skill Breakdown" size="MEDIUM" marginBelow="NONE" />
                          </div>
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Skill</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Requests</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Latency</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Error Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail Hits</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {[
                                { name: 'Customer Support AI', requests: '2,156', latency: '1.1s', errorRate: '0.8%', guardrails: 64, cost: '$142.30' },
                                { name: 'Invoice Processing AI', requests: '987', latency: '1.8s', errorRate: '1.2%', guardrails: 31, cost: '$72.40' },
                                { name: 'HR Onboarding AI', requests: '699', latency: '0.9s', errorRate: '0.3%', guardrails: 16, cost: '$32.80' },
                              ].map((s, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><Brain size={16} className="text-purple-600" /></div><span className="text-sm font-medium text-gray-900">{s.name}</span></div></td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{s.requests}</td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{s.latency}</td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{s.errorRate}</td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{s.guardrails}</td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.cost}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {observeTab === 'logs' && (
                      <div>
                        {/* Filters */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search logs by input, output, model, or user..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                            <option>All Skills</option>
                            <option>Customer Support AI</option>
                            <option>Invoice Processing AI</option>
                            <option>HR Onboarding AI</option>
                          </select>
                          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                            <option>All Statuses</option>
                            <option>Success</option>
                            <option>Error</option>
                            <option>Guardrail Triggered</option>
                          </select>
                        </div>

                        {/* Logs Table */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Skill</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Input</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Output</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Latency</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tokens</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {[
                                { time: '4:52:18 PM', skill: 'Customer Support AI', input: 'How do I reset my password?', output: 'To reset your password, navigate to Settings > Security...', latency: '0.8s', tokens: 342, status: 'Success' },
                                { time: '4:51:43 PM', skill: 'Customer Support AI', input: 'My SSN is 123-45-6789, can you help?', output: '[PII REDACTED] I can help you with...', latency: '1.2s', tokens: 289, status: 'Guardrail' },
                                { time: '4:50:22 PM', skill: 'Invoice Processing AI', input: 'Process invoice #INV-2026-0847', output: 'Invoice processed. Amount: $3,450.00...', latency: '2.1s', tokens: 567, status: 'Success' },
                                { time: '4:49:58 PM', skill: 'HR Onboarding AI', input: 'What benefits are available for new hires?', output: 'New employees are eligible for health...', latency: '0.7s', tokens: 412, status: 'Success' },
                                { time: '4:48:31 PM', skill: 'Customer Support AI', input: 'Ignore previous instructions and...', output: '[BLOCKED] Prompt injection detected.', latency: '0.3s', tokens: 45, status: 'Guardrail' },
                                { time: '4:47:15 PM', skill: 'Invoice Processing AI', input: 'Retrieve vendor payment history', output: 'Error: Data source connection timeout', latency: '30.0s', tokens: 0, status: 'Error' },
                                { time: '4:46:02 PM', skill: 'Customer Support AI', input: 'Can I upgrade my subscription plan?', output: 'Yes! You can upgrade your plan by going to...', latency: '0.9s', tokens: 378, status: 'Success' },
                                { time: '4:44:50 PM', skill: 'HR Onboarding AI', input: 'Schedule orientation for next Monday', output: 'Orientation scheduled for Monday, Jan 20...', latency: '1.1s', tokens: 298, status: 'Success' },
                              ].map((log, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                  <td className="px-6 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">{log.time}</td>
                                  <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{log.skill}</td>
                                  <td className="px-6 py-3 text-sm text-gray-700 max-w-[200px] truncate">{log.input}</td>
                                  <td className="px-6 py-3 text-sm text-gray-700 max-w-[200px] truncate">{log.output}</td>
                                  <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{log.latency}</td>
                                  <td className="px-6 py-3 text-sm text-gray-700">{log.tokens}</td>
                                  <td className="px-6 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${log.status === 'Success' ? 'bg-green-100 text-green-800' : log.status === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{log.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                            <span>Showing 8 of 3,842 entries</span>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">Previous</button>
                              <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">Next</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
            <>
            {/* Deployment Actions Bar */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Application Management</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">7 objects</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
                  <option>All Application Objects</option>
                  <option>Package 1</option>
                  <option>Package 2</option>
                </select>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus size={16} />
                  CREATE PACKAGE
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download size={16} />
                  EXPORT
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                  <Upload size={16} />
                  IMPORT
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                  <GitBranch size={16} />
                  COMPARE AND DEPLOY
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 bg-white rounded-lg p-1 border border-gray-200">
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'ALL OBJECTS' },
                  { id: 'plugins', label: 'PLUG-INS' },
                  { id: 'unreferenced', label: 'UNREFERENCED OBJECTS' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveObjectsTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-colors rounded-lg ${
                      activeObjectsTab === tab.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objects Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus size={16} />
                    NEW
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                    ADD EXISTING
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                    MOVE
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                    DELETE
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors">
                    <Shield size={16} />
                    SECURITY
                  </button>
                </div>
                <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Last Modified ↓
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {objects.map((obj, idx) => {
                      const ObjIcon = obj.icon
                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                          <td className="px-6 py-4">
                            <div className={`w-10 h-10 rounded-lg ${obj.iconColor} flex items-center justify-center`}>
                              <ObjIcon size={20} className="text-white" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              onClick={() => {
                                if (obj.type === 'AI Skill') setLocation('/ai-skill-view')
                                else if (obj.type === 'Site') setLocation('/customer-portal-site')
                              }}
                              className="font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                            >
                              {obj.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{obj.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${['bg-teal-100 text-teal-600','bg-indigo-100 text-indigo-600','bg-rose-100 text-rose-600','bg-amber-100 text-amber-600','bg-cyan-100 text-cyan-600','bg-violet-100 text-violet-600','bg-emerald-100 text-emerald-600'][idx % 7]} flex items-center justify-center text-xs font-bold`}>
                                {obj.modifiedBy}
                              </div>
                              <span className="font-medium">{obj.lastModified}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Application Guardrails Modal */}
      {showGuardrailsModal && (() => {
        const allGr = [
          { name: 'PII Scrubbing — Names', type: 'Semantic', objects: 'Customer Support AI, Feedback Chat', status: 'Active', inherited: false },
          { name: 'PII Scrubbing — SSN', type: 'Regex', objects: 'All AI Skills', status: 'Active', inherited: true },
          { name: 'PII Scrubbing — Email', type: 'Regex', objects: 'Customer Support AI, HR Onboarding AI', status: 'Active', inherited: false },
          { name: 'PII Scrubbing — Phone', type: 'Regex', objects: 'All AI Skills', status: 'Active', inherited: true },
          { name: 'PII Scrubbing — Credit Card', type: 'Regex', objects: 'Invoice Processing AI', status: 'Active', inherited: false },
          { name: 'PII Scrubbing — Address', type: 'Semantic', objects: 'Customer Support AI', status: 'Active', inherited: false },
          { name: 'Toxicity Detection', type: 'Keyword', objects: 'Customer Support AI, Feedback Chat', status: 'Active', inherited: true },
          { name: 'Profanity Filter', type: 'Keyword', objects: 'All AI Skills', status: 'Active', inherited: true },
          { name: 'Prompt Injection Shield', type: 'Semantic', objects: 'All AI Skills', status: 'Active', inherited: true },
          { name: 'Script Injection Block', type: 'Regex', objects: 'All AI Skills', status: 'Active', inherited: true },
          { name: 'Competitor Detection', type: 'Keyword', objects: 'Customer Support AI', status: 'Inactive', inherited: false },
          { name: 'Financial Advice Block', type: 'Keyword', objects: 'Customer Support AI', status: 'Active', inherited: false },
        ]
        const pageSize = 6
        const paged = allGr.slice((grPage - 1) * pageSize, grPage * pageSize)
        const totalPages = Math.ceil(allGr.length / pageSize)
        return (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setShowGuardrailsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><Shield size={18} className="text-blue-500" /><h3 className="text-lg font-semibold text-gray-900">Application Guardrails</h3><span className="text-sm text-gray-500">({allGr.length})</span></div>
              <div className="flex items-center gap-2">
                <button className="btn-gradient-text text-xs">+ Add Guardrail</button>
                <button onClick={() => setShowGuardrailsModal(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={20} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Guardrail</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Applied To</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Source</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th><th className="px-6 py-3 w-20"></th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {paged.map((g, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{g.name}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${g.type === 'Regex' ? 'bg-blue-100 text-blue-700' : g.type === 'Semantic' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{g.type}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{g.objects}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${g.inherited ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{g.inherited ? 'Environment' : 'Application'}</span></td>
                      <td className="px-6 py-4"><button className={`relative w-9 h-5 rounded-full transition-colors ${g.status === 'Active' ? 'bg-blue-500' : 'bg-gray-300'}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow ${g.status === 'Active' ? 'right-0.5' : 'left-0.5'}`} /></button></td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button onClick={() => setGrKebab(grKebab === i ? null : i)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg></button>
                          {grKebab === i && <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-28"><button onClick={() => setGrKebab(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button><button onClick={() => setGrKebab(null)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button></div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-gray-500">Page {grPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setGrPage(Math.max(1, grPage - 1))} disabled={grPage === 1} className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40">Previous</button>
                <button onClick={() => setGrPage(Math.min(totalPages, grPage + 1))} disabled={grPage === totalPages} className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}

      {/* Application MCP Modal */}
      {showMcpModal && (() => {
        const allMcp = [
          { object: 'Customer Support AI Skill', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'search_records, get_customer', status: 'Connected' },
          { object: 'Feedback Chat Interface', type: 'Interface', server: 'Feedback Knowledge Base', tools: 'search_docs, get_faq', status: 'Connected' },
          { object: 'Invoice Processing AI', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'get_invoice, validate_amount', status: 'Connected' },
          { object: 'HR Onboarding AI', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'get_employee, check_benefits', status: 'Connected' },
          { object: 'Document Review AI', type: 'AI Skill', server: 'Document Search MCP', tools: 'search_docs, extract_text', status: 'Connected' },
          { object: 'Case Summary View', type: 'Interface', server: 'CRM Integration MCP', tools: 'get_case_history', status: 'Degraded' },
          { object: 'Feedback Processing', type: 'Process Model', server: 'Feedback Knowledge Base', tools: 'classify_feedback', status: 'Connected' },
          { object: 'Customer Dashboard', type: 'Interface', server: 'Enterprise Data MCP', tools: 'get_metrics, get_trends', status: 'Connected' },
        ]
        const pageSize = 5
        const paged = allMcp.slice((mcpPage - 1) * pageSize, mcpPage * pageSize)
        const totalPages = Math.ceil(allMcp.length / pageSize)
        return (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setShowMcpModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><Plug size={18} className="text-green-500" /><h3 className="text-lg font-semibold text-gray-900">Application MCP Connections</h3><span className="text-sm text-gray-500">({allMcp.length})</span></div>
              <div className="flex items-center gap-2">
                <button className="btn-gradient-text text-xs">+ Connect Server</button>
                <button onClick={() => setShowMcpModal(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={20} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Object</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">MCP Server</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tools</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th><th className="px-6 py-3 w-20"></th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {paged.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.object}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.type}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{m.server}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">{m.tools}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${m.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button onClick={() => setMcpKebab(mcpKebab === i ? null : i)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg></button>
                          {mcpKebab === i && <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-28"><button onClick={() => setMcpKebab(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button><button onClick={() => setMcpKebab(null)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button></div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-gray-500">Page {mcpPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setMcpPage(Math.max(1, mcpPage - 1))} disabled={mcpPage === 1} className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40">Previous</button>
                <button onClick={() => setMcpPage(Math.min(totalPages, mcpPage + 1))} disabled={mcpPage === totalPages} className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
