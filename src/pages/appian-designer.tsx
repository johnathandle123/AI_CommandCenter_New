import { HeadingField } from '@pglevy/sailwind'
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
    { name: 'Customer Portal', editor: 'JD', lastModified: '2 hours ago', description: 'Customer-facing portal application', icon: '🏢', color: 'from-blue-500 to-blue-600' },
    { name: 'HR Onboarding', editor: 'SM', lastModified: '5 hours ago', description: 'Employee onboarding workflow', icon: '👥', color: 'from-green-500 to-green-600' },
    { name: 'Invoice Processing', editor: 'AK', lastModified: 'Yesterday', description: 'Automated invoice approval system', icon: '📄', color: 'from-purple-500 to-purple-600' }
  ]

  const applications = [
    { name: 'Customer Portal', description: 'Customer-facing portal application', lastModified: '1/15/2026 7:45 AM', modifiedBy: 'John Doe', icon: '🏢', color: 'from-blue-500 to-blue-600' },
    { name: 'HR Onboarding', description: 'Employee onboarding workflow', lastModified: '1/15/2026 4:30 AM', modifiedBy: 'Sarah Miller', icon: '👥', color: 'from-green-500 to-green-600' },
    { name: 'Invoice Processing', description: 'Automated invoice approval system', lastModified: '1/14/2026 3:20 PM', modifiedBy: 'Alex Kim', icon: '📄', color: 'from-purple-500 to-purple-600' },
    { name: 'Asset Management', description: 'Track and manage company assets', lastModified: '1/14/2026 11:15 AM', modifiedBy: 'Maria Garcia', icon: '📦', color: 'from-orange-500 to-orange-600' },
    { name: 'Help Desk', description: 'IT support ticket management', lastModified: '1/13/2026 2:45 PM', modifiedBy: 'David Chen', icon: '🎫', color: 'from-teal-500 to-teal-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 flex items-center justify-center shadow-lg">
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
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 text-white font-medium text-sm shadow-md">
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

      {/* Enhanced Waffle Menu */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-[100] waffle-menu">
          <div className="grid grid-cols-3 gap-3 w-80 mb-4">
            {waffleApps.map((app, index) => {
              const Icon = app.icon
              return (
                <Link key={index} href={app.path || '/dashboard'}>
                  <button
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-left w-full hover:scale-105 ${
                      app.active ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                    }`}
                    onClick={() => setShowWaffleMenu(false)}
                  >
                    <div className={`${app.color} rounded-xl p-3 flex items-center justify-center shadow-lg`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-xs text-center">{app.name}</span>
                  </button>
                </Link>
              )
            })}
          </div>
          
          <div className="border-t border-gray-200/50 mb-4"></div>
          
          <div className="grid grid-cols-3 gap-3">
            {helpApps.map((app, index) => {
              const Icon = app.icon
              return (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-left text-gray-700 hover:text-blue-600 hover:bg-white/50 hover:scale-105"
                  onClick={() => setShowWaffleMenu(false)}
                >
                  <div className={`${app.color} rounded-xl p-3 flex items-center justify-center shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-xs text-center">{app.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Enhanced gradient orbs */}
        <div className="absolute top-10 left-10 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/15 via-cyan-400/10 to-purple-400/15 rounded-full blur-[120px] z-0 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-pink-400/10 via-orange-400/8 to-yellow-400/10 rounded-full blur-[100px] z-0 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-green-400/8 to-teal-400/10 rounded-full blur-[80px] z-0 animate-pulse" style={{animationDelay: '4s'}}></div>

        {/* Left Navigation */}
        <div 
          className="w-64 border-r border-white/20 flex flex-col relative z-10"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <nav className="relative flex flex-col p-4 space-y-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left duration-300 ${
                activeTab === 'applications' ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Package size={20} />
              <span className="font-medium">Applications</span>
            </button>
            <button
              onClick={() => setActiveTab('objects')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left duration-300 ${
                activeTab === 'objects' ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Database size={20} />
              <span className="font-medium">Objects</span>
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left duration-300 ${
                activeTab === 'deploy' ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Rocket size={20} />
              <span className="font-medium">Deploy</span>
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left duration-300 ${
                activeTab === 'monitor' ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Activity size={20} />
              <span className="font-medium">Monitor</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left duration-300 ${
                activeTab === 'users' ? 'bg-blue-100/80 text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Users</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto relative z-10">
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            <div className="grid grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="col-span-9">
                {/* Enhanced Page Header */}
                <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <HeadingField text="Let's get started" size="LARGE" marginBelow="STANDARD" />
                  <p className="text-gray-600 mb-6">Build powerful applications with Appian's low-code platform</p>
                  
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                      <Package size={18} />
                      NEW APPLICATION
                    </button>
                    <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md font-medium flex items-center gap-2 transition-all">
                      <ExternalLink size={18} />
                      IMPORT
                    </button>
                  </div>
                </div>

                {/* Enhanced Recent Applications */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <HeadingField text="Recent Applications" size="MEDIUM" marginBelow="NONE" />
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {recentApps.map((app, idx) => (
                      <div key={idx} className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {app.icon}
                          </div>
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${app.color} text-white flex items-center justify-center text-sm font-bold shadow-md`}>
                            {app.editor}
                          </div>
                        </div>
                        <h3 
                          onClick={() => setLocation('/build-view')}
                          className="font-bold text-gray-900 hover:text-blue-700 cursor-pointer mb-2 group-hover:text-blue-700 transition-colors"
                        >
                          {app.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                        <p className="text-xs text-gray-500 font-medium">{app.lastModified}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Applications List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/40 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <HeadingField text="All Applications" size="MEDIUM" marginBelow="NONE" />
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                        <button className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all">
                          <Filter className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50/90 to-blue-50/50 backdrop-blur-sm border-b border-gray-200/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <input type="checkbox" className="rounded border-gray-300 shadow-sm" />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Modified</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                        {applications.map((app, idx) => (
                          <tr key={idx} className="hover:bg-white/80 hover:shadow-sm transition-all">
                            <td className="px-6 py-4">
                              <input type="checkbox" className="rounded border-gray-300 shadow-sm" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl shadow-lg`}>
                                  {app.icon}
                                </div>
                                <span 
                                  onClick={() => setLocation('/build-view')}
                                  className="text-blue-700 hover:text-blue-800 hover:underline cursor-pointer font-bold transition-colors"
                                >
                                  {app.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{app.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">{app.lastModified}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-3">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-6">
                  <HeadingField text="Learn More" size="MEDIUM" marginBelow="STANDARD" />
                  
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-md hover:border-blue-300 transition-all group">
                      <div className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">Release Notes</div>
                      <div className="text-xs text-gray-600">View latest updates</div>
                    </button>

                    <button className="w-full p-4 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-md hover:border-blue-300 transition-all group">
                      <div className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">About This Environment</div>
                      <div className="text-xs text-gray-600">Version and data sources</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                  <HeadingField text="Community" size="MEDIUM" marginBelow="STANDARD" />
                  <div className="space-y-2">
                    {[
                      { title: 'Discuss', desc: 'Collaborate with developers', icon: '💬' },
                      { title: 'Learn', desc: 'Appian Academy & Certifications', icon: '🎓' },
                      { title: 'Success', desc: 'Best practices with Appian Max', icon: '🏆' },
                      { title: 'Support', desc: 'Browse support articles', icon: '🛟' },
                      { title: 'Documentation', desc: 'Tutorials and references', icon: '📚' },
                      { title: 'AppMarket', desc: 'Browse plug-ins and utilities', icon: '🏪' }
                    ].map((item, idx) => (
                      <button key={idx} className="w-full p-3 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white hover:shadow-md hover:border-blue-300 transition-all group">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</div>
                            <div className="text-xs text-gray-600">{item.desc}</div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
