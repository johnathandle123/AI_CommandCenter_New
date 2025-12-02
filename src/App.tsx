import { useState } from 'react'
import { HeadingField } from '@pglevy/sailwind'
import { Brain } from 'lucide-react'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'

function App() {
  const [activeSection, setActiveSection] = useState('protect')
  const [cardStyle, setCardStyle] = useState<'white' | 'glass'>('glass')

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
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
      <div className={`flex-1 flex overflow-hidden ${cardStyle === 'glass' ? 'bg-gradient-to-b from-blue-100 from-50% to-white' : 'bg-gray-50'} relative`}>
        {/* Glassmorphism gradient orbs */}
        {cardStyle === 'glass' && (
          <>
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"></div>
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
