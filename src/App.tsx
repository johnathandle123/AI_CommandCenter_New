import { useState, useEffect } from 'react'
import { Route, Switch, Link } from 'wouter'
import { HeadingField } from '@pglevy/sailwind'
import { Brain, Grid3X3, Paintbrush, Settings, Monitor, Database, Flag, FileText, Info, HelpCircle, Search, Activity, Sparkles } from 'lucide-react'
import VersionSwitcher from './components/VersionSwitcher'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'
import { useWaffleOption } from './components/appia-shared'
import Login from './pages/login'
import Loading from './pages/loading'
import Home from './pages/home'
import Protect from './pages/protect'
import Evaluate from './pages/evaluate'
import Observe from './pages/observe'
import TopicFiltering from './pages/topic-filtering'
import AppianDesigner from './pages/appian-designer'
import BuildView from './pages/build-view'
import AISkillView from './pages/ai-skill-view'
import CustomerPortalSite from './pages/customer-portal-site'
import AdminConsole from './pages/admin-console'
import AppianMonitor from './pages/appian-monitor'
import ProcessHQ from './pages/process-hq'
import AppianAI from './pages/appian-ai'

function MainApp() {
  const [activeSection, setActiveSection] = useState('home')
  const [cardStyle, setCardStyle] = useState<'white' | 'glass' | 'greyscale'>('white')
  const [appMode, setAppMode] = useState<'v1' | 'v2' | 'future' | 'revised' | 'revised-v2' | 'revised-v3' | 'revised-v4' | 'mvp'>('future')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option1')
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')
  const [navOption, setNavOption] = useState<'option1' | 'option2'>('option1')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  const allWaffleApps = [
    { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', path: '/appian-ai', options: ['option5'] as const },
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', active: true, path: '/dashboard', options: ['option1'] as const },
    { name: 'Operations Console', icon: Monitor, color: 'bg-cyan-600', path: '/dashboard', options: ['option1','option2'] as const },
    { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
    { name: 'Process HQ', icon: FileText, color: 'bg-blue-700', path: '/process-hq', options: ['option4', 'option6'] as const },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' }
  ]

  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))

  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' }
  ]

  const allSites = [
    'Admin Console', 'AI Command Center', 'Appian Designer', 'Operations Console',
    'Appian RPA', 'Cloud Database', 'Connected Systems', 'Data Fabric',
    'Decision Platform', 'DevOps Infrastructure', 'Feature Flags',
    'Health Check', 'Integration Console', 'Low-Code Designer',
    'Operations Console', 'Performance Monitor', 'Portal Manager',
    'Process Mining', 'Record Manager', 'Security Console',
    'System Logs', 'Task Manager', 'User Management',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) {
        setShowWaffleMenu(false)
      }
      if (showSettingsMenu && !(event.target as Element).closest('.settings-menu')) {
        setShowSettingsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu, showSettingsMenu])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 rounded-lg p-3 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <HeadingField
              text="AI Command Center"
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
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 rounded-md hover:bg-white/20 transition-colors relative settings-menu"
            >
              <Settings size={20} className={showSettingsMenu ? "text-blue-500" : "text-black"} />
            </button>
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
      
      {/* Settings Menu */}
      {showSettingsMenu && (
        <div className="fixed top-20 right-24 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[100] settings-menu w-72">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <select value={appMode} onChange={(e) => setAppMode(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="v1">V1</option>
                <option value="v2">V2</option>
                <option value="future">Future State</option>
                <option value="revised">Revised</option>
                <option value="revised-v2">Revised V2</option>
                <option value="revised-v3">Revised V3</option>
                <option value="revised-v4">Revised V4</option>
                <option value="mvp">MVP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Style</label>
              <select value={cardStyle} onChange={(e) => setCardStyle(e.target.value as 'white' | 'glass' | 'greyscale')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="white">White Cards</option>
                <option value="glass">Glassmorphism</option>
                <option value="greyscale">Greyscale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tab Names</label>
              <select value={navOption} onChange={(e) => setNavOption(e.target.value as 'option1' | 'option2')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Waffle Menu Dropdown - Outside header to prevent shifting */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] waffle-menu w-80 flex flex-col" style={{ maxHeight: '480px' }}>
          {/* Sticky Tabs Header */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
            <button onClick={() => setWaffleTab('favorites')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'favorites' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Favorites</button>
            <button onClick={() => setWaffleTab('all')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>All</button>
          </div>

          {/* Sticky Search for All tab */}
          {waffleTab === 'all' && (
            <div className="px-3 pt-3 pb-3 border-b border-gray-200 bg-white">
              <input type="text" placeholder="Search sites..." value={waffleSiteSearch} onChange={e => setWaffleSiteSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {waffleTab === 'favorites' ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {waffleApps.map((app, index) => {
                    const Icon = app.icon
                    return (
                      <Link key={index} href={app.path || '/dashboard'}>
                        <button className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'}`} onClick={() => setShowWaffleMenu(false)}>
                          <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
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
                      <button key={index} className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500" onClick={() => setShowWaffleMenu(false)}>
                        <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                        <span className="font-medium text-xs text-center">{app.name}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-1">
                  {allSites.map((site, i) => (
                    <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" onClick={() => setShowWaffleMenu(false)}>{site}</button>
                  ))}
                  {allSites.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No sites found</div>}
                </div>
            )}
          </div>

          {/* Sticky Footer */}
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
      
      {/* Main Content Area with Side Navigation */}
      <div className="flex h-[calc(100vh-80px)]">
        {appMode === 'future' && (
          <SideNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            cardStyle={cardStyle}
            navOption={navOption}
          />
        )}
        <div className="flex-1 overflow-auto">
          <TabsInterface 
            activeSection={appMode === 'v1' || appMode === 'v2' || appMode === 'mvp' ? 'protect' : activeSection} 
            cardStyle={cardStyle} 
            onSectionChange={setActiveSection}
            appMode={appMode}
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/loading" component={Loading} />
      <Route path="/protect" component={Protect} />
      <Route path="/evaluate" component={Evaluate} />
      <Route path="/observe" component={Observe} />
      <Route path="/topic-filtering" component={TopicFiltering} />
      <Route path="/appian-designer" component={AppianDesigner} />
      <Route path="/build-view" component={BuildView} />
      <Route path="/ai-skill-view" component={AISkillView} />
      <Route path="/customer-portal-site" component={CustomerPortalSite} />
      <Route path="/admin-console" component={AdminConsole} />
      <Route path="/appian-ai" component={AppianAI} />
      <Route path="/appian-monitor" component={AppianMonitor} />
      <Route path="/process-hq" component={ProcessHQ} />
      <Route path="/dashboard" component={MainApp} />
      <Route path="/" component={Home} />
    </Switch>
  )
}

export default App
