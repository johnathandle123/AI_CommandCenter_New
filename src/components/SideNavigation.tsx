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
  return (
    <div className={`w-20 bg-gray-100 border-r border-gray-200 pt-4 shrink-0 ${className}`}>
      <nav className="space-y-2 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                flex flex-col items-center justify-center w-full py-3 gap-1 rounded-md transition-colors
                ${isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-200 hover:text-blue-500'
                }
              `}
              title={item.label}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
