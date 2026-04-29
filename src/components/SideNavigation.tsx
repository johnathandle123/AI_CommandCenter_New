import { useState } from 'react'
import { Home, Shield, CheckCircle, Eye, PanelLeftClose, PanelLeftOpen, Plug } from 'lucide-react'

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
  navOption?: 'option1' | 'option2'
}

const navItemsOption1: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'protect', label: 'Protect', icon: Shield },
  { id: 'mcp', label: 'Connect', icon: Plug },
  { id: 'monitor', label: 'Evaluate', icon: CheckCircle },
  { id: 'observe', label: 'Observe', icon: Eye }
]

const navItemsOption2: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'protect', label: 'Guardrails', icon: Shield },
  { id: 'mcp', label: 'MCP', icon: Plug },
  { id: 'monitor', label: 'Evaluations', icon: CheckCircle },
  { id: 'observe', label: 'Performance', icon: Eye }
]

export default function SideNavigation({ activeSection, onSectionChange, className = '', navOption = 'option1' }: SideNavigationProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigationItems = navOption === 'option2' ? navItemsOption2 : navItemsOption1

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${className}`}>
      <nav className={`flex flex-col ${collapsed ? 'p-2' : 'p-4'} space-y-1 flex-1`}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center ${collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="p-4 border-t border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center">
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>
    </div>
  )
}
