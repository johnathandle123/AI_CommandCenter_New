import { useState } from 'react'
import { HeadingField } from '@pglevy/sailwind'
import SideNavigation from './components/SideNavigation'
import TabsInterface from './pages/tabs-interface'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="app-header-sail border-b border-gray-200">
        <div className="px-8 py-4">
          <HeadingField
            text="AI Command Center"
            size="LARGE"
            headingTag="H1"
            marginBelow="NONE"
          />
        </div>
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
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
