import { Home, Shield, Monitor, Eye, List } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface SideNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  className?: string
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home
  },
  {
    id: 'protect',
    label: 'Protect',
    icon: Shield
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: Monitor
  },
  {
    id: 'observe',
    label: 'Observe',
    icon: Eye
  },
  {
    id: 'events',
    label: 'Events',
    icon: List
  }
]

export default function SideNavigation({ activeSection, onSectionChange, className = '' }: SideNavigationProps) {
  const activeIndex = navigationItems.findIndex(item => item.id === activeSection)
  
  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      <nav className="relative flex flex-col p-4 space-y-2">
        <div 
          className="absolute left-4 right-4 bg-blue-500 rounded-md transition-all duration-300 ease-out"
          style={{
            top: `${16 + activeIndex * 56}px`,
            height: '48px'
          }}
        />
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-blue-500'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
