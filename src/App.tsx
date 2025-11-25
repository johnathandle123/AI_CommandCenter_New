import { useState } from 'react'
import { HeadingField } from '@pglevy/sailwind'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'

function App() {
  const [activeSection, setActiveSection] = useState('protect')

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Gradient Header */}
      <div className="app-header-sail px-8 py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10">
          <HeadingField
            text="AI Command Center"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
        </div>
      </div>
      
      {/* Main Content Area with Side Navigation */}
      <div className="flex-1 flex overflow-hidden">
        <SideNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 overflow-auto">
          <TabsInterface activeSection={activeSection} />
        </div>
      </div>
    </div>
  )
}

export default App
