import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { Search, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Package, Rocket, Activity, ChevronLeft, Plus, Upload, Download, Shield, GitBranch, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'

export default function BuildView() {
  const appName = 'Customer Portal'
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('build')
  const [activeObjectsTab, setActiveObjectsTab] = useState('all')
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

  const objects = [
    { name: 'Customer Dashboard', type: 'Interface', icon: '📱', description: 'Main customer portal interface', lastModified: '1/15/2026 9:30 AM', modifiedBy: 'JD' },
    { name: 'Customer Record Type', type: 'Record Type', icon: '📋', description: 'Customer data model', lastModified: '1/15/2026 8:15 AM', modifiedBy: 'SM' },
    { name: 'Submit Request Process', type: 'Process Model', icon: '⚙️', description: 'Customer request workflow', lastModified: '1/14/2026 4:20 PM', modifiedBy: 'AK' },
    { name: 'Customer Data Store', type: 'Data Store', icon: '🗄️', description: 'Customer database entity', lastModified: '1/14/2026 2:10 PM', modifiedBy: 'JD' },
    { name: 'Validate Customer Rule', type: 'Expression Rule', icon: '📐', description: 'Customer validation logic', lastModified: '1/13/2026 11:45 AM', modifiedBy: 'SM' }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/appian-designer')} className="p-2 hover:bg-white/20 rounded-md transition-colors">
              <ChevronLeft size={24} className="text-black" />
            </button>
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center">
              <Paintbrush size={24} className="text-white" />
            </div>
            <HeadingField
              text={appName}
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

      {/* Waffle Menu */}
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
        {/* Left Navigation */}
        <div 
          className="w-64 border-r border-gray-200 flex flex-col"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <nav className="relative flex flex-col p-4 space-y-2">
            <button
              onClick={() => setActiveTab('build')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'build' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Package size={20} />
              <span className="font-medium">Build</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'explore' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Database size={20} />
              <span className="font-medium">Explore</span>
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
              onClick={() => setActiveTab('settings')}
              className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left duration-300 ${
                activeTab === 'settings' ? 'bg-blue-100 text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100 relative">
          {/* Glassmorphism gradient orbs */}
          <div className="absolute top-5 left-5 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/25 to-purple-400/25 rounded-full blur-[100px] z-0"></div>
          <div className="absolute top-10 right-5 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-[100px] z-0"></div>
          
          <div className="container mx-auto px-6 py-6 max-w-7xl relative z-10">
            {/* Deployment Actions Bar */}
            <div className="mb-6 flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white">
                <option>All Application Objects</option>
                <option>Package 1</option>
                <option>Package 2</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                <Plus size={16} />
                CREATE PACKAGE
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                <Download size={16} />
                EXPORT
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                <Upload size={16} />
                IMPORT
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                <GitBranch size={16} />
                COMPARE AND DEPLOY
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4 border-b border-gray-300">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveObjectsTab('all')}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeObjectsTab === 'all' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'
                  }`}
                >
                  ALL OBJECTS
                </button>
                <button
                  onClick={() => setActiveObjectsTab('plugins')}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeObjectsTab === 'plugins' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'
                  }`}
                >
                  PLUG-INS
                </button>
                <button
                  onClick={() => setActiveObjectsTab('unreferenced')}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeObjectsTab === 'unreferenced' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'
                  }`}
                >
                  UNREFERENCED OBJECTS
                </button>
              </div>
            </div>

            {/* Objects Grid */}
            <CardLayout padding="NONE" showShadow={true}>
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16} />
                    NEW
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium">
                    ADD EXISTING
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium">
                    MOVE
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium">
                    DELETE
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium flex items-center gap-2">
                    <Shield size={16} />
                    SECURITY
                  </button>
                </div>
                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
                  <RefreshCw size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                        Last Modified ↓
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {objects.map((obj, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3 text-xl">{obj.icon}</td>
                        <td className="px-4 py-3">
                          <span className="text-blue-700 hover:underline cursor-pointer font-medium">{obj.name}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{obj.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                              {obj.modifiedBy}
                            </div>
                            <span>{obj.lastModified}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardLayout>
          </div>
        </div>
      </div>
    </div>
  )
}
