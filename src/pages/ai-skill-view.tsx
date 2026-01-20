import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { Search, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, ChevronLeft, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'

export default function AISkillView() {
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showGuardrailModal, setShowGuardrailModal] = useState(false)
  const [wizardStep, setWizardStep] = useState<'select' | 'type' | 'configure'>('select')
  const [selectedGuardrailType, setSelectedGuardrailType] = useState<string | null>(null)
  const [guardrailSearch, setGuardrailSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'settings' | 'guardrails'>('settings')
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
      if (showSettingsMenu && !(event.target as Element).closest('.settings-menu')) {
        setShowSettingsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu, showSettingsMenu])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/build-view')} className="p-2 hover:bg-white/20 rounded-md transition-colors">
              <ChevronLeft size={24} className="text-black" />
            </button>
            <div className="bg-purple-500 rounded-lg p-3 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <HeadingField
              text="Customer Support AI Skill"
              size="LARGE"
              headingTag="H1"
              marginBelow="NONE"
              fontWeight="BOLD"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} />
              Save
            </button>
            <div className="relative settings-menu">
              <button 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 rounded-md hover:bg-white/20 transition-colors"
              >
                <Settings size={20} className="text-black" />
              </button>
              
              {showSettingsMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-50">
                  <button 
                    onClick={() => {
                      setShowSettingsMenu(false)
                      setShowGuardrailModal(true)
                      setWizardStep('select')
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    <span>Guardrails</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                    <Info size={16} />
                    <span>Properties</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                    <Database size={16} />
                    <span>Version History</span>
                  </button>
                </div>
              )}
            </div>
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

      {/* Guardrail Modal Wizard */}
      {showGuardrailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {wizardStep === 'select' && 'Manage Guardrails'}
                {wizardStep === 'type' && 'Select Guardrail Type'}
                {wizardStep === 'configure' && 'Configure Guardrail'}
              </h2>
              <button onClick={() => setShowGuardrailModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {wizardStep === 'select' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">Select existing guardrails or create a new one</p>
                    <button 
                      onClick={() => setWizardStep('type')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      + Create New Guardrail
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search guardrails..."
                      value={guardrailSearch}
                      onChange={(e) => setGuardrailSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Guardrails List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[
                      { name: 'PII Scrubbing', type: 'Input Protection', enabled: true },
                      { name: 'Toxicity Filter', type: 'Content Safety', enabled: true },
                      { name: 'Hallucination Detection', type: 'Output Validation', enabled: false },
                      { name: 'Prompt Injection Guard', type: 'Input Protection', enabled: true },
                      { name: 'Topic Filter - Medical', type: 'Content Filtering', enabled: false },
                      { name: 'Topic Filter - Financial', type: 'Content Filtering', enabled: false },
                      { name: 'Custom Regex Filter', type: 'Custom', enabled: true },
                      { name: 'Sentiment Analysis', type: 'Content Safety', enabled: false }
                    ]
                      .filter(g => 
                        guardrailSearch === '' || 
                        g.name.toLowerCase().includes(guardrailSearch.toLowerCase()) ||
                        g.type.toLowerCase().includes(guardrailSearch.toLowerCase())
                      )
                      .map((guardrail, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked={guardrail.enabled} className="rounded" />
                            <div>
                              <div className="font-medium">{guardrail.name}</div>
                              <div className="text-sm text-gray-600">{guardrail.type}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {wizardStep === 'type' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">Choose the type of guardrail you want to create</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { type: 'Prompt Injection Detection', icon: '🛡️', description: 'Detect and block prompt injection attacks' },
                      { type: 'PII Scrubbing', icon: '🔒', description: 'Automatically redact sensitive information' },
                      { type: 'Toxicity Filter', icon: '⚠️', description: 'Block inappropriate or harmful content' },
                      { type: 'Hallucination Detection', icon: '✓', description: 'Verify responses against knowledge base' },
                      { type: 'Topic Filtering', icon: '🚫', description: 'Restrict conversations to allowed topics' },
                      { type: 'Custom Guardrail', icon: '⚙️', description: 'Create a custom guardrail rule' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedGuardrailType(item.type)
                          setWizardStep('configure')
                        }}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="font-medium mb-1">{item.type}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 'configure' && selectedGuardrailType && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="font-medium text-blue-900">Creating: {selectedGuardrailType}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardrail Name</label>
                    <input 
                      type="text" 
                      placeholder={`My ${selectedGuardrailType}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      placeholder="Describe what this guardrail does..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                    />
                  </div>

                  {selectedGuardrailType === 'PII Scrubbing' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Entity Types</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>Email Addresses</option>
                          <option>Phone Numbers</option>
                          <option>Social Security Numbers</option>
                          <option>Credit Card Numbers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity Threshold</label>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.5" className="w-full" />
                      </div>
                    </>
                  )}

                  {selectedGuardrailType === 'Toxicity Filter' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>Low - Block only extreme content</option>
                          <option>Medium - Block moderate toxicity</option>
                          <option>High - Block all negative content</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
              {wizardStep !== 'select' && (
                <>
                  <button 
                    onClick={() => {
                      if (wizardStep === 'configure') setWizardStep('type')
                      else if (wizardStep === 'type') setWizardStep('select')
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-auto"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (wizardStep === 'configure') {
                        setShowGuardrailModal(false)
                        setWizardStep('select')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {wizardStep === 'configure' ? 'Create Guardrail' : 'Next'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Column - Prompt Configuration */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {/* Sticky Tabs */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-2">
            <div className="max-w-3xl mx-auto">
              <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
                <button 
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'settings' 
                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
                <button 
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'guardrails' 
                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('guardrails')}
                >
                  Guardrails
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {activeTab === 'settings' && (
              <>
                <CardLayout padding="MORE" showShadow={true}>
                  <HeadingField text="Prompt" size="MEDIUM" marginBelow="STANDARD" />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
                      <textarea 
                        placeholder="You are a helpful customer support assistant..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="dynamic-prompt" className="rounded" />
                      <label htmlFor="dynamic-prompt" className="text-sm text-gray-700">Enable dynamic prompt optimization</label>
                    </div>
                  </div>
                </CardLayout>

                <CardLayout padding="MORE" showShadow={true}>
                  <HeadingField text="Examples" size="MEDIUM" marginBelow="STANDARD" />
                  <p className="text-sm text-gray-600 mb-4">Provide example inputs and outputs to help the model understand your expectations</p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
                          <textarea 
                            placeholder="Customer question or request..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Output</label>
                          <textarea 
                            placeholder="Ideal response..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                      <span>+ Add Another Example</span>
                    </button>
                  </div>
                </CardLayout>

                <CardLayout padding="MORE" showShadow={true}>
                  <div className="flex items-center justify-between mb-4">
                    <HeadingField text="Guardrails" size="MEDIUM" marginBelow="NONE" />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      + Add Guardrail
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Select existing guardrails or create new ones to protect your AI skill</p>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search and select guardrails..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute right-2 top-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">Selected Guardrails:</div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Corporate Policy Enforcer</td>
                            <td className="px-4 py-2 text-gray-600">Policy Compliance</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center"></td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">GDPR Compliance Filter</td>
                            <td className="px-4 py-2 text-gray-600">Regulatory Compliance</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center"></td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Financial Data Protection</td>
                            <td className="px-4 py-2 text-gray-600">Data Protection</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center"></td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Brand Safety Monitor</td>
                            <td className="px-4 py-2 text-gray-600">Brand Protection</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Inactive
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center"></td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Enterprise Security Suite</td>
                            <td className="px-4 py-2 text-gray-600">Security Framework</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center"></td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Customer Support PII Filter</td>
                            <td className="px-4 py-2 text-gray-600">PII Scrubbing</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Basic Prompt Injection v2.1</td>
                            <td className="px-4 py-2 text-gray-600">Prompt Injection</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Advanced Toxicity Filter</td>
                            <td className="px-4 py-2 text-gray-600">Toxicity Detection</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Topic Filtering - Customer Service</td>
                            <td className="px-4 py-2 text-gray-600">Topic Filtering</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Inactive
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">Hallucination Detection v3.0</td>
                            <td className="px-4 py-2 text-gray-600">Hallucination Check</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardLayout>

                <CardLayout padding="MORE" showShadow={true}>
                  <HeadingField text="Test Prompt" size="MEDIUM" marginBelow="STANDARD" />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Input</label>
                      <textarea 
                        placeholder="Enter sample text to test your prompt..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 text-sm"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      TEST
                    </button>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Output</label>
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-md h-32 bg-gray-50 text-sm text-gray-500">
                        Test results will appear here...
                      </div>
                    </div>
                  </div>
                </CardLayout>
              </>
            )}

            {activeTab === 'guardrails' && (
              <>
                <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Prompt" size="MEDIUM" marginBelow="STANDARD" />
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you want the skill to do
                  </label>
                  <textarea 
                    defaultValue="You are a helpful customer support assistant. Answer questions clearly and professionally based on the customer's inquiry. If you don't know the answer, direct the customer to a human agent."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 text-sm"
                    placeholder="Tell the model what you want it to do using plain language..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Use plain language to describe what you're going to send the model and what you expect in response.</p>
                </div>
              </div>
            </CardLayout>

            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Examples" size="MEDIUM" marginBelow="STANDARD" />
              <p className="text-sm text-gray-600 mb-4">Provide example inputs and outputs to help the model understand your expectations</p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Example Input</label>
                    <textarea 
                      defaultValue="How do I reset my password?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-16 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Example Output</label>
                    <textarea 
                      defaultValue="To reset your password, click on 'Forgot Password' on the login page and follow the instructions sent to your email."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-16 text-sm"
                    />
                  </div>
                </div>
                
                <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                  <span>+ Add Another Example</span>
                </button>
              </div>
            </CardLayout>

            <CardLayout padding="MORE" showShadow={true}>
              <div className="flex items-center justify-between mb-4">
                <HeadingField text="Guardrails" size="MEDIUM" marginBelow="NONE" />
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  + Add Guardrail
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Select existing guardrails or create new ones to protect your AI skill</p>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search and select guardrails..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-2 top-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">Selected Guardrails:</div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Corporate Policy Enforcer</td>
                        <td className="px-4 py-2 text-gray-600">Policy Compliance</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center"></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">GDPR Compliance Filter</td>
                        <td className="px-4 py-2 text-gray-600">Regulatory Compliance</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center"></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Financial Data Protection</td>
                        <td className="px-4 py-2 text-gray-600">Data Protection</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center"></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Brand Safety Monitor</td>
                        <td className="px-4 py-2 text-gray-600">Brand Protection</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Inactive
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center"></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Enterprise Security Suite</td>
                        <td className="px-4 py-2 text-gray-600">Security Framework</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center"></td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Customer Support PII Filter</td>
                        <td className="px-4 py-2 text-gray-600">PII Scrubbing</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Basic Prompt Injection v2.1</td>
                        <td className="px-4 py-2 text-gray-600">Prompt Injection</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Advanced Toxicity Filter</td>
                        <td className="px-4 py-2 text-gray-600">Toxicity Detection</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Topic Filtering - Customer Service</td>
                        <td className="px-4 py-2 text-gray-600">Topic Filtering</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Inactive
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">Hallucination Detection v3.0</td>
                        <td className="px-4 py-2 text-gray-600">Hallucination Check</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardLayout>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Settings, Details, Usage */}
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Selection</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Claude 3.5 Sonnet</option>
                    <option>GPT-4 Turbo</option>
                    <option>Claude 3 Opus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="flex-1" />
                    <span className="text-sm text-gray-600 w-8">0.7</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Controlled</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                  <input 
                    type="number" 
                    defaultValue="2000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Type</div>
                  <div className="font-medium">Prompt Builder</div>
                </div>
                <div>
                  <div className="text-gray-600">Created</div>
                  <div className="font-medium">1/10/2026</div>
                </div>
                <div>
                  <div className="text-gray-600">Last Modified</div>
                  <div className="font-medium">1/15/2026 9:00 AM</div>
                </div>
                <div>
                  <div className="text-gray-600">Modified By</div>
                  <div className="font-medium">John Doe</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Usage</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Invocations</div>
                  <div className="text-2xl font-bold text-blue-700">1,247</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold text-blue-700">1.2s</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                  <div className="text-2xl font-bold text-green-700">98.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
