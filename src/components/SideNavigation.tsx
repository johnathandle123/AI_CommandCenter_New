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
  cardStyle?: 'white' | 'glass'
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

export default function SideNavigation({ activeSection, onSectionChange, className = '', cardStyle = 'glass' }: SideNavigationProps) {
  const activeIndex = navigationItems.findIndex(item => item.id === activeSection)
  
  const bgStyle = cardStyle === 'glass' 
    ? { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
    : { backgroundColor: 'white' }
  
  return (
    <div className={`w-64 border-r border-white flex flex-col ${className}`} style={bgStyle}>
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
