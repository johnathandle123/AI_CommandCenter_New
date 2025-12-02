import { useState } from 'react'
import { HeadingField } from '@pglevy/sailwind'
import { Brain } from 'lucide-react'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'

function App() {
  const [activeSection, setActiveSection] = useState('protect')
  const [cardStyle, setCardStyle] = useState<'white' | 'glass'>('glass')

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
          <select 
            value={cardStyle}
            onChange={(e) => setCardStyle(e.target.value as 'white' | 'glass')}
            className="px-4 py-2 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white cursor-pointer"
          >
            <option value="white" className="text-gray-900">White Cards</option>
            <option value="glass" className="text-gray-900">Glassmorphism</option>
          </select>
        </div>
      </div>
      
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
          <TabsInterface activeSection={activeSection} cardStyle={cardStyle} />
        </div>
      </div>
    </div>
  )
}

export default App
