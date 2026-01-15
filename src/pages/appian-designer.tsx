import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { Search, Filter, ExternalLink, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Package, Rocket, Activity, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'

export default function AppianDesigner() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')
  const [, setLocation] = useLocation()

  const waffleApps = [
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', active: true, path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/dashboard' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard' },
    { name: 'Operations Console', icon: Monitor, color: 'bg-orange-500', path: '/dashboard' },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' }
  ]

  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) {
        setShowWaffleMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu])

  const recentApps = [
    { name: 'Customer Portal', editor: 'JD', lastModified: '2 hours ago', description: 'Customer-facing portal application' },
    { name: 'HR Onboarding', editor: 'SM', lastModified: '5 hours ago', description: 'Employee onboarding workflow' },
    { name: 'Invoice Processing', editor: 'AK', lastModified: 'Yesterday', description: 'Automated invoice approval system' }
  ]

  const applications = [
    { name: 'Customer Portal', description: 'Customer-facing portal application', lastModified: '1/15/2026 7:45 AM', modifiedBy: 'John Doe' },
    { name: 'HR Onboarding', description: 'Employee onboarding workflow', lastModified: '1/15/2026 4:30 AM', modifiedBy: 'Sarah Miller' },
    { name: 'Invoice Processing', description: 'Automated invoice approval system', lastModified: '1/14/2026 3:20 PM', modifiedBy: 'Alex Kim' },
    { name: 'Asset Management', description: 'Track and manage company assets', lastModified: '1/14/2026 11:15 AM', modifiedBy: 'Maria Garcia' },
    { name: 'Help Desk', description: 'IT support ticket management', lastModified: '1/13/2026 2:45 PM', modifiedBy: 'David Chen' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center">
              <Paintbrush size={24} className="text-white" />
            </div>
            <HeadingField
              text="Appian Designer"
              size="LARGE"
              headingTag="H1"
              marginBelow="NONE"
              fontWeight="BOLD"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors">
              <Search size={20} className="text-black" />
            </button>
            <button
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className="p-2 rounded-md hover:bg-white/20 transition-colors relative waffle-menu"
            >
              <Grid3X3 size={20} className={showWaffleMenu ? "text-blue-500" : "text-black"} />
            </button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lime-500 text-white font-medium text-sm">
              J
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" 
              alt="Appian" 
              className="h-6"
            />
          </div>
        </div>
      </div>

      {/* Waffle Menu Dropdown */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[100] waffle-menu">
          <div className="grid grid-cols-3 gap-2 w-80 mb-3">
            {waffleApps.map((app, index) => {
              const Icon = app.icon
              return (
                <Link key={index} href={app.path || '/dashboard'}>
                  <button
                    className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${
                      app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'
                    }`}
                    onClick={() => setShowWaffleMenu(false)}
                  >
                    <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-xs text-center">{app.name}</span>
                  </button>
                </Link>
              )
            })}
          </div>
          
          <div className="border-t border-gray-200 mb-3"></div>
          
          <div className="grid grid-cols-3 gap-2">
            {helpApps.map((app, index) => {
              const Icon = app.icon
              return (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500"
                  onClick={() => setShowWaffleMenu(false)}
                >
                  <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-xs text-center">{app.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content with Left Nav */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Navigation - Styled like AI Command Center */}
        <div 
          className="w-64 border-r border-gray-200 flex flex-col"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <nav className="relative flex flex-col p-4 space-y-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'applications' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Package size={20} />
              <span className="font-medium">Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('objects')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'objects' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Database size={20} />
              <span className="font-medium">Objects</span>
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'deploy' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Rocket size={20} />
              <span className="font-medium">Deploy</span>
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'monitor' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Activity size={20} />
              <span className="font-medium">Monitor</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'users' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Users</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100 relative">
          {/* Glassmorphism gradient orbs */}
          <div className="absolute top-5 left-5 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/25 to-purple-400/25 rounded-full blur-[100px] z-0"></div>
          <div className="absolute top-10 right-5 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-[100px] z-0"></div>
          <div className="absolute bottom-5 left-5 w-[550px] h-[550px] bg-gradient-to-br from-purple-400/25 to-blue-400/25 rounded-full blur-[100px] z-0"></div>
          <div className="absolute bottom-5 right-5 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-[100px] z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-400/18 to-purple-400/18 rounded-full blur-[100px] z-0"></div>
          
      <div className="container mx-auto px-6 py-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="col-span-9">
            {/* Page Header - Styled like "Hello Alex" */}
            <div className="mb-6">
              <HeadingField text="Let's get started" size="LARGE" marginBelow="NONE" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <ButtonWidget label="NEW APPLICATION" style="SOLID" color="ACCENT" />
              <ButtonWidget label="IMPORT" style="OUTLINE" color="SECONDARY" />
            </div>

            {/* Recent Applications */}
            <div className="mb-6">
              <HeadingField text="Recent Applications" size="MEDIUM" marginBelow="STANDARD" />
              <div className="grid grid-cols-3 gap-4">
                {recentApps.map((app, idx) => (
                  <CardLayout key={idx} padding="STANDARD" showShadow={true}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        onClick={() => setLocation('/build-view')}
                        className="font-semibold text-blue-700 hover:underline cursor-pointer"
                      >
                        {app.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        {app.editor}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                    <p className="text-xs text-gray-500">{app.lastModified}</p>
                  </CardLayout>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <CardLayout padding="NONE" showShadow={true}>
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
                    <Filter className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700">
                    EXPORT
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700">
                    SECURITY
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700">
                    DELETE
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                        Last Modified ↓
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            onClick={() => setLocation('/build-view')}
                            className="text-blue-700 hover:underline cursor-pointer font-medium"
                          >
                            {app.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.lastModified}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardLayout>
          </div>

          {/* Right Sidebar - Learn More */}
          <div className="col-span-3">
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Learn More" size="MEDIUM" marginBelow="STANDARD" />
              
              <div className="space-y-3">
                <button className="w-full p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">Release Notes</div>
                  <div className="text-xs text-gray-600">View latest updates</div>
                </button>

                <button className="w-full p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">About This Environment</div>
                  <div className="text-xs text-gray-600">Version and data sources</div>
                </button>
              </div>

              <div className="mt-6">
                <HeadingField text="Community" size="SMALL" marginBelow="STANDARD" />
                <div className="space-y-2">
                  {[
                    { title: 'Discuss', desc: 'Collaborate with developers' },
                    { title: 'Learn', desc: 'Appian Academy & Certifications' },
                    { title: 'Success', desc: 'Best practices with Appian Max' },
                    { title: 'Support', desc: 'Browse support articles' },
                    { title: 'Documentation', desc: 'Tutorials and references' },
                    { title: 'AppMarket', desc: 'Browse plug-ins and utilities' }
                  ].map((item, idx) => (
                    <button key={idx} className="w-full p-2 text-left border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-500 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-600">{item.desc}</div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardLayout>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}
