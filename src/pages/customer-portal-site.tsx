import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { useState, useEffect } from 'react'
import { Settings, Globe, MessageCircle, X, ChevronLeft, Save, Search, Grid3X3, Info, Database } from 'lucide-react'
import { useLocation } from 'wouter'

export default function CustomerPortalSite() {
  const [showPreview, setShowPreview] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [, setLocation] = useLocation()
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [chatInput, setChatInput] = useState('')

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

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    
    // Basic Prompt Injection Detection
    const promptInjectionPhrases = [
      'ignore previous instructions',
      'forget everything',
      'act as',
      'pretend to be',
      'roleplay as',
      'you are now',
      'system prompt',
      'override',
      'jailbreak'
    ]
    
    const containsPromptInjection = promptInjectionPhrases.some(phrase => 
      chatInput.toLowerCase().includes(phrase)
    )
    
    const response = containsPromptInjection 
      ? "🚫 Message blocked by Basic Prompt Injection Detection. Your message contains content that violates our safety guidelines. Please rephrase your request without attempting to override system instructions."
      : "Thank you for your message. I'm here to help with your customer service needs. How can I assist you today?"
    
    setChatMessages(prev => [...prev, 
      { role: 'user', content: chatInput },
      { role: 'assistant', content: response }
    ])
    setChatInput('')
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-blue-600" />
            <span className="font-medium">Customer Portal Preview</span>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Exit Preview
          </button>
        </div>

        {/* Mock Customer Portal */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          <header className="text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold mb-4">Customer Support Portal</h1>
              <p className="text-xl text-blue-100 mb-8">We're here to help you succeed</p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Get Started
                </button>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </header>

          <main className="bg-white">
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you today?</h2>
                <p className="text-lg text-gray-600">Choose from our most popular support categories</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="group bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Account Management</h3>
                  <p className="text-gray-600 mb-4">Manage your account settings, profile, and preferences with ease.</p>
                  <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className="group bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Billing & Payments</h3>
                  <p className="text-gray-600 mb-4">View invoices, payment history, and manage billing information.</p>
                  <button className="text-green-600 font-medium hover:text-green-700 flex items-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div className="group bg-white p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Technical Support</h3>
                  <p className="text-gray-600 mb-4">Get help with technical issues and troubleshooting guidance.</p>
                  <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-2">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-gray-600">Common tasks you can complete right now</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Reset Password', icon: '🔑' },
                    { name: 'Update Profile', icon: '👤' },
                    { name: 'Download Invoice', icon: '📄' },
                    { name: 'Submit Ticket', icon: '🎫' }
                  ].map((action, idx) => (
                    <button key={idx} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-all text-center">
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{action.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Live Chat Widget */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {chatOpen && (
          <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl border">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="font-medium">Customer Support</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

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
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center">
              <Globe size={24} className="text-white" />
            </div>
            <HeadingField
              text="Customer Portal Site"
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
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                    <Settings size={16} />
                    <span>Site Settings</span>
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Site Overview */}
          <CardLayout padding="MORE" showShadow={true}>
            <div className="flex items-center justify-between mb-4">
              <HeadingField text="Site Configuration" size="MEDIUM" marginBelow="NONE" />
              <div className="flex gap-2">
                <ButtonWidget
                  label="Preview Site"
                  style="OUTLINE"
                  color="ACCENT"
                  onClick={() => setShowPreview(true)}
                />
                <ButtonWidget
                  label="Publish"
                  style="SOLID"
                  color="ACCENT"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  defaultValue="Customer Support Portal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                <input
                  type="text"
                  defaultValue="https://support.company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Corporate Blue</option>
                  <option>Modern Gray</option>
                  <option>Clean White</option>
                </select>
              </div>
            </div>
          </CardLayout>

          {/* Site Pages */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Site Pages" size="MEDIUM" marginBelow="STANDARD" />
            
            <div className="space-y-3">
              {[
                { name: 'Home', url: '/', status: 'Published', lastModified: '1/20/2026 10:30 AM' },
                { name: 'Account Management', url: '/account', status: 'Published', lastModified: '1/19/2026 3:15 PM' },
                { name: 'Billing & Payments', url: '/billing', status: 'Published', lastModified: '1/19/2026 2:45 PM' },
                { name: 'Technical Support', url: '/support', status: 'Draft', lastModified: '1/18/2026 4:20 PM' },
                { name: 'Knowledge Base', url: '/kb', status: 'Draft', lastModified: '1/17/2026 11:30 AM' }
              ].map((page, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-700 hover:underline cursor-pointer">{page.name}</div>
                      <div className="text-sm text-gray-500">{page.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                    <span className="text-sm text-gray-500">{page.lastModified}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardLayout>

          {/* Live Chat Configuration */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Live Chat Configuration" size="MEDIUM" marginBelow="STANDARD" />
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enable Live Chat</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Show chat widget on all pages</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chat Position</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                  <option>Top Right</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                <input
                  type="text"
                  defaultValue="Hello! How can I help you today?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Skill Integration</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Customer Support AI Skill</option>
                  <option>General FAQ Bot</option>
                  <option>Technical Support Bot</option>
                </select>
              </div>
            </div>
          </CardLayout>

          {/* Security & Access */}
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Security & Access" size="MEDIUM" marginBelow="STANDARD" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Public Access</div>
                  <div className="text-sm text-gray-600">Allow anonymous users to access the site</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">User Registration</div>
                  <div className="text-sm text-gray-600">Allow users to create accounts</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SSL Certificate</div>
                  <div className="text-sm text-gray-600">Secure connection enabled</div>
                </div>
                <span className="text-green-600 text-sm font-medium">Active</span>
              </div>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
