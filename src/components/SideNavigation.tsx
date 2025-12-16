import { Home, Shield, CheckCircle, Eye, List, Sparkles } from 'lucide-react'

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
    label: 'Evaluate',
    icon: CheckCircle
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
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Sparkles
  }
]

export default function SideNavigation({ activeSection, onSectionChange, className = '', cardStyle = 'glass' }: SideNavigationProps) {
  const activeIndex = navigationItems.findIndex(item => item.id === activeSection)
  
  const bgStyle = cardStyle === 'glass' 
    ? { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
    : { backgroundColor: 'white' }
  
  return (
    <div className={`w-64 border-r ${cardStyle === 'glass' ? 'border-white' : 'border-gray-200'} flex flex-col h-full ${className}`} style={bgStyle}>
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
          const isInsights = item.id === 'insights'
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300
                ${isActive && !isInsights
                  ? 'text-white' 
                  : isInsights
                  ? ''
                  : 'text-gray-600 hover:text-blue-500'
                }
              `}
              style={isInsights ? {
                background: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #2322F0 0%, #E21496 57%, #FFC008 83%, #FFD948 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              } : undefined}
            >
              {isInsights ? (
                <>
                  <span className="text-purple-500">
                    <Icon size={20} />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </>
              ) : (
                <>
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
