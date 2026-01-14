import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { HeadingField } from '@pglevy/sailwind'
import { Brain, Grid3X3, Paintbrush, Settings, Monitor, Database, Flag, FileText, Info, HelpCircle, Search } from 'lucide-react'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'
import Login from './pages/login'
import Loading from './pages/loading'
import Home from './pages/home'
import Protect from './pages/protect'
import Evaluate from './pages/evaluate'
import Observe from './pages/observe'
import TopicFiltering from './pages/topic-filtering'

function MainApp() {
  const [activeSection, setActiveSection] = useState('home')
  const [cardStyle, setCardStyle] = useState<'white' | 'glass' | 'greyscale'>('white')
  const [appMode, setAppMode] = useState<'v1' | 'v2' | 'future' | 'revised' | 'revised-v2' | 'revised-v3' | 'revised-v4'>('future')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)

  const waffleApps = [
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', active: true },
    { name: 'Operations Console', icon: Monitor, color: 'bg-orange-500' },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500' }
  ]

  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) {
        setShowWaffleMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu])

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${cardStyle === 'glass' ? 'bg-transparent' : 'bg-gray-50'} ${cardStyle === 'greyscale' ? 'grayscale' : ''}`}>
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
            <select 
              value={appMode}
              onChange={(e) => setAppMode(e.target.value as 'v1' | 'v2' | 'future' | 'revised' | 'revised-v2' | 'revised-v3' | 'revised-v4')}
              className="px-4 py-2 pr-8 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-black cursor-pointer"
            >
              <option value="v1" className="text-gray-900">V1</option>
              <option value="v2" className="text-gray-900">V2</option>
              <option value="future" className="text-gray-900">Future State</option>
              <option value="revised" className="text-gray-900">Revised</option>
              <option value="revised-v2" className="text-gray-900">Revised V2</option>
              <option value="revised-v3" className="text-gray-900">Revised V3</option>
              <option value="revised-v4" className="text-gray-900">Revised V4</option>
            </select>
            <select 
              value={cardStyle}
              onChange={(e) => setCardStyle(e.target.value as 'white' | 'glass' | 'greyscale')}
              className="px-4 py-2 pr-8 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-black cursor-pointer"
            >
              <option value="white" className="text-gray-900">White Cards</option>
              <option value="glass" className="text-gray-900">Glassmorphism</option>
              <option value="greyscale" className="text-gray-900">Greyscale</option>
            </select>
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors">
              <Search size={20} className="text-black" />
            </button>
            <button
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className="p-2 rounded-md hover:bg-white/20 transition-colors relative waffle-menu"
            >
              <Grid3X3 size={20} className={showWaffleMenu ? "text-blue-500" : "text-black"} />
            </button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lime-500 text-white font-medium text-sm">
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
      
      {/* Waffle Menu Dropdown - Outside header to prevent shifting */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[100] waffle-menu">
          {/* Main Apps Section */}
          <div className="grid grid-cols-3 gap-2 w-80 mb-3">
            {waffleApps.map((app, index) => {
              const Icon = app.icon
              return (
                <button
                  key={index}
                  className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left ${
                    app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'
                  }`}
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
          
          {/* Divider */}
          <div className="border-t border-gray-200 mb-3"></div>
          
          {/* Help Section */}
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
        </div>
      )}
      
      {/* Main Content Area with Side Navigation */}
      <div className={`flex-1 flex overflow-hidden ${cardStyle === 'glass' ? 'bg-slate-100' : 'bg-gray-50'} relative ${cardStyle === 'greyscale' ? 'grayscale' : ''}`}>
        {/* Glassmorphism gradient orbs */}
        {cardStyle === 'glass' && (
          <>
            <div className="absolute top-5 left-5 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/25 to-purple-400/25 rounded-full blur-[100px] z-0"></div>
            <div className="absolute top-10 right-5 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-[100px] z-0"></div>
            <div className="absolute bottom-5 left-5 w-[550px] h-[550px] bg-gradient-to-br from-purple-400/25 to-blue-400/25 rounded-full blur-[100px] z-0"></div>
            <div className="absolute bottom-5 right-5 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-[100px] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-400/18 to-purple-400/18 rounded-full blur-[100px] z-0"></div>
          </>
        )}
        
        {appMode === 'future' && (
          <SideNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            className="relative z-10"
            cardStyle={cardStyle}
          />
        )}
        <div className="flex-1 overflow-auto relative z-10">
          <TabsInterface 
            activeSection={appMode === 'v1' || appMode === 'v2' ? 'protect' : activeSection} 
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
      <Route path="/dashboard" component={MainApp} />
      <Route path="/" component={Home} />
    </Switch>
  )
}

export default App
