import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { HeadingField } from '@pglevy/sailwind'
import { Brain, Grid3X3, Paintbrush, Settings } from 'lucide-react'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'
import Login from './pages/login'
import Home from './pages/home'
import Protect from './pages/protect'
import Evaluate from './pages/evaluate'
import Observe from './pages/observe'

function MainApp() {
  const [activeSection, setActiveSection] = useState('protect')
  const [cardStyle, setCardStyle] = useState<'white' | 'glass'>('glass')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)

  const waffleApps = [
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', active: true }
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
    <div className={`h-screen flex flex-col overflow-hidden ${cardStyle === 'glass' ? 'bg-transparent' : 'bg-gray-50'}`}>
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
            />
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={cardStyle}
              onChange={(e) => setCardStyle(e.target.value as 'white' | 'glass')}
              className="px-4 py-2 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white cursor-pointer"
            >
              <option value="white" className="text-gray-900">White Cards</option>
              <option value="glass" className="text-gray-900">Glassmorphism</option>
            </select>
            <button
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className={`p-2 rounded-md transition-colors relative waffle-menu ${
                showWaffleMenu ? 'bg-blue-500' : 'hover:bg-white/20'
              }`}
            >
              <Grid3X3 size={20} className={showWaffleMenu ? "text-white" : "text-black"} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Waffle Menu Dropdown - Outside header to prevent shifting */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-[100] waffle-menu">
          <div className="flex flex-col gap-1 w-64">
            {waffleApps.map((app, index) => {
              const Icon = app.icon
              return (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                    app.active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                  }`}
                  onClick={() => setShowWaffleMenu(false)}
                >
                  <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-medium">{app.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Main Content Area with Side Navigation */}
      <div className={`flex-1 flex overflow-hidden ${cardStyle === 'glass' ? 'bg-slate-100' : 'bg-gray-50'} relative`}>
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
        
        <SideNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          className="relative z-10"
          cardStyle={cardStyle}
        />
        <div className="flex-1 overflow-auto relative z-10">
          <TabsInterface activeSection={activeSection} cardStyle={cardStyle} onSectionChange={setActiveSection} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/protect" component={Protect} />
      <Route path="/evaluate" component={Evaluate} />
      <Route path="/observe" component={Observe} />
      <Route path="/dashboard" component={MainApp} />
      <Route path="/" component={Home} />
    </Switch>
  )
}

export default App
