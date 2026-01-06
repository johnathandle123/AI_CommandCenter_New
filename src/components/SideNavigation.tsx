import { Home, Shield, CheckCircle, Eye, Sparkles } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface SideNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  className?: string
  cardStyle?: 'white' | 'glass' | 'greyscale'
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
    id: 'insights',
    label: 'Insights',
    icon: Sparkles
  }
]

export default function SideNavigation({ activeSection, onSectionChange, className = '', cardStyle = 'glass' }: SideNavigationProps) {
  const bgStyle = cardStyle === 'glass' 
    ? { backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
    : { backgroundColor: 'white' }
  
  return (
    <div className={`w-64 border-r ${cardStyle === 'glass' ? 'border-white' : 'border-gray-200'} flex flex-col h-full ${className} ${cardStyle === 'greyscale' ? 'grayscale' : ''}`} style={bgStyle}>
      <nav className="relative flex flex-col p-4 space-y-2">
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
                ${isActive
                  ? isInsights 
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-blue-100 text-blue-500'
                  : isInsights
                  ? ''
                  : 'text-gray-600 hover:text-blue-500'
                }
              `}
              style={isInsights && !isActive ? {
                background: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #2322F0 0%, #E21496 57%, #FFC008 83%, #FFD948 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              } : undefined}
            >
              {isInsights ? (
                <>
                  <span className={isActive ? "text-blue-500" : "text-purple-500"}>
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
