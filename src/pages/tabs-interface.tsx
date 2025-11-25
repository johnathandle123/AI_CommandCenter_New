import { TabsField, HeadingField, RichTextDisplayField, CardLayout, ButtonWidget, DialogField, TextField, DropdownField, SliderField, Icon, TagField } from '@pglevy/sailwind'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

const AnimatedCounter = ({ value, duration = 600 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(value)
  const [prevValue, setPrevValue] = useState(value)

  useEffect(() => {
    if (value === prevValue) return

    const startValue = displayValue
    const difference = value - startValue
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayValue(Math.floor(startValue + (easeOutExpo * difference)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setPrevValue(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, displayValue, prevValue])

  return <span>{displayValue.toLocaleString()}</span>
}

const AnimatedPercentage = ({ value, duration = 800 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(value)
  const [prevValue, setPrevValue] = useState(value)

  useEffect(() => {
    if (value === prevValue) return

    const startValue = displayValue
    const difference = value - startValue
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(startValue + (easeOutCubic * difference))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setPrevValue(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, displayValue, prevValue])

  return <span>{displayValue.toFixed(1)}%</span>
}

const tabStyles = `
  .compact-tabs [role="tablist"] [role="tab"]:not(:last-child) {
    width: auto !important;
    min-width: auto !important;
    padding: 8px 16px !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
  }
  .compact-tabs [role="tablist"] {
    width: 100% !important;
    display: flex !important;
    background-color: white !important;
    position: sticky !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1 !important;
    border-bottom: 1px solid #e5e7eb !important;
    padding-left: 32px !important;
    margin: 0 !important;
  }
  .compact-tabs [role="tablist"] [role="tab"]:last-child {
    flex-grow: 1 !important;
    background: transparent !important;
    border: none !important;
    pointer-events: none !important;
  }
  .compact-tabs [role="tabpanel"] {
    padding-top: 0 !important;
  }
  .compact-tabs [role="tabpanel"] > div:first-child {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  .page-header {
    position: sticky !important;
    top: 48px !important;
    left: 0 !important;
    right: 0 !important;
    background: white !important;
    z-index: 1 !important;
    border-bottom: 1px solid #e5e7eb !important;
    transition: box-shadow 0.2s ease !important;
    padding: 0 32px 16px 32px !important;
    margin: 0 -32px 0 -32px !important;
  }
  .page-header.scrolled {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  }
  .page-header + * {
    margin-top: 24px !important;
  }
  [role="dialog"], [data-radix-dialog-overlay], [data-radix-dialog-content] {
    z-index: 2147483647 !important;
  }
  [data-radix-dialog-overlay], .dialog-overlay, .modal-backdrop, .scrim, [data-state="open"] {
    z-index: 2147483646 !important;
  }
  div[style*="position: fixed"], div[style*="z-index"] {
    z-index: 2147483645 !important;
  }
`

interface TabsInterfaceProps {
  activeSection: string
}

export default function TabsInterface({ activeSection }: TabsInterfaceProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, value: number, index: number} | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const [timeRange, setTimeRange] = useState('1D')
  const [formData, setFormData] = useState({
    name: '',
    scope: '',
    sensitivity: 2,
    action: '',
    notification: ''
  })
  const [filters, setFilters] = useState({
    timestamp: '',
    traceId: '',
    userId: '',
    modelId: '',
    scope: '',
    latency: '',
    tokenCount: '',
    cost: '',
    status: '',
    policyId: '',
    action: '',
    measureType: '',
    sensitivity: '',
    reviewStatus: '',
    toxicity: '',
    hallucination: '',
    relevance: '',
    piiFound: ''
  })

  const [eventsData] = useState([
    {
      timestamp: '2024-11-21 18:42:15',
      traceId: 'trace-001-abc',
      userId: 'user-12345',
      modelId: 'gpt-4-turbo',
      scope: 'Global',
      latency: '1,250',
      tokenCount: '2,847',
      cost: '$0.0425',
      status: '200 - Success',
      policyId: 'policy-001',
      action: 'Allow',
      measureType: 'Content Filter',
      sensitivity: 'Medium',
      reviewStatus: 'Not Required',
      toxicity: '0.02',
      hallucination: '0.01',
      relevance: '0.95',
      piiFound: 'Yes'
    },
    {
      timestamp: '2024-11-21 18:41:32',
      traceId: 'trace-002-def',
      userId: 'user-67890',
      modelId: 'claude-3-opus',
      scope: 'Department',
      latency: '890',
      tokenCount: '1,523',
      cost: '$0.0287',
      status: '403 - Blocked',
      policyId: 'policy-002',
      action: 'Block',
      measureType: 'PII Detection',
      sensitivity: 'High',
      reviewStatus: 'Pending',
      toxicity: '0.85',
      hallucination: '0.12',
      relevance: '0.78',
      piiFound: 'Yes'
    },
    {
      timestamp: '2024-11-21 18:40:18',
      traceId: 'trace-003-ghi',
      userId: 'user-11111',
      modelId: 'gemini-pro',
      scope: 'Project',
      latency: '2,100',
      tokenCount: '3,456',
      cost: '$0.0612',
      status: '200 - Success',
      policyId: 'policy-003',
      action: 'Warn',
      measureType: 'Toxicity Check',
      sensitivity: 'Low',
      reviewStatus: 'Not Required',
      toxicity: '0.15',
      hallucination: '0.03',
      relevance: '0.92',
      piiFound: 'No'
    }
  ])

  const filteredEvents = eventsData.filter(event => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true
      const eventValue = event[key as keyof typeof event]?.toLowerCase() || ''
      return eventValue.includes(value.toLowerCase())
    })
  })

  const [guardrails, setGuardrails] = useState([
    {
      name: "Data Privacy Policy",
      description: "Ensures all data handling complies with privacy regulations and company standards.",
      type: "Data Protection",
      scope: "Global",
      sensitivity: "High",
      action: "Block"
    },
    {
      name: "Access Control Policy", 
      description: "Defines user permissions and access levels for system resources.",
      type: "Access Control",
      scope: "Department", 
      sensitivity: "Medium",
      action: "Warn"
    },
    {
      name: "Security Compliance Policy",
      description: "Maintains security standards and compliance requirements across all operations.",
      type: "Compliance",
      scope: "Global",
      sensitivity: "Critical", 
      action: "Block"
    }
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const openMenus = document.querySelectorAll('.dropdown-menu:not(.hidden)')
      openMenus.forEach(menu => {
        const button = menu.previousElementSibling
        if (!menu.contains(event.target as Node) && !button?.contains(event.target as Node)) {
          menu.classList.add('hidden')
        }
      })
    }

    const handleScroll = () => {
      const headers = document.querySelectorAll('.page-header')
      headers.forEach(header => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        if (scrollTop > 0) {
          header.classList.add('scrolled')
        } else {
          header.classList.remove('scrolled')
        }
      })
    }

    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const getSensitivityStamp = (sensitivity: string) => {
    const config = {
      'Low': { backgroundColor: 'green-50', color: 'green-500' },
      'Medium': { backgroundColor: 'yellow-50', color: 'yellow-500' },
      'High': { backgroundColor: 'orange-50', color: 'orange-500' },
      'Critical': { backgroundColor: 'red-50', color: 'red-500' }
    }
    return config[sensitivity as keyof typeof config] || { backgroundColor: 'gray-50', color: 'gray-500' }
  }

  const getTypeStamp = (type: string, index: number = 0) => {
    const colors = [
      { bg: '#F2B3D1', color: '#FFFFFF' }, // Light Pink
      { bg: '#D4B5E8', color: '#FFFFFF' }, // Light Purple  
      { bg: '#9DD2E8', color: '#FFFFFF' }, // Light Blue
      { bg: '#9DDAC7', color: '#FFFFFF' }, // Light Green
      { bg: '#9BB1D6', color: '#FFFFFF' }  // Light Dark Blue
    ]
    
    const typeConfig = {
      'Harmful Content': { icon: 'AlertTriangle' },
      'Profanity': { icon: 'MessageSquareX' },
      'PII Exposure & Confidentiality': { icon: 'Shield' },
      'Tone': { icon: 'MessageCircle' },
      'Logic': { icon: 'Brain' },
      'Performance': { icon: 'Zap' },
      'Data Protection': { icon: 'Shield' },
      'Access Control': { icon: 'Lock' },
      'Compliance': { icon: 'CheckCircle' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || { icon: 'Shield' }
    const colorScheme = colors[index % colors.length]
    
    return { ...config, ...colorScheme }
  }

  const editGuardrail = (index: number) => {
    const guardrail = guardrails[index]
    setEditingIndex(index)
    setFormData({
      name: guardrail.name,
      scope: guardrail.scope,
      sensitivity: ['', 'Low', 'Medium', 'High', 'Critical'].indexOf(guardrail.sensitivity),
      action: guardrail.action,
      notification: ''
    })
    const typeMap = {
      'Harmful Content': 'harmful',
      'Profanity': 'profanity',
      'PII Exposure & Confidentiality': 'pii',
      'Tone': 'tone',
      'Logic': 'logic',
      'Performance': 'performance',
      'Data Protection': 'data',
      'Access Control': 'access',
      'Compliance': 'compliance'
    }
    setSelectedType(typeMap[guardrail.type as keyof typeof typeMap] || '')
    setShowModal(true)
  }

  const deleteGuardrail = (index: number) => {
    setDeleteIndex(index)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setGuardrails(guardrails.filter((_, i) => i !== deleteIndex))
      setDeleteIndex(null)
    }
    setShowDeleteModal(false)
  }

  const addGuardrail = () => {
    const typeLabels = {
      'harmful': 'Harmful Content',
      'profanity': 'Profanity', 
      'pii': 'PII Exposure & Confidentiality',
      'tone': 'Tone',
      'logic': 'Logic',
      'performance': 'Performance'
    }
    
    const sensitivityLabels = ['', 'Low', 'Medium', 'High', 'Critical']
    
    const newGuardrail = {
      name: formData.name || "New Guardrail",
      description: "Description for the new guardrail.",
      type: typeLabels[selectedType as keyof typeof typeLabels] || "Harmful Content",
      scope: formData.scope || "Global",
      sensitivity: sensitivityLabels[formData.sensitivity] || "Medium",
      action: formData.action || "Block"
    }

    if (editingIndex !== null) {
      const updatedGuardrails = [...guardrails]
      updatedGuardrails[editingIndex] = newGuardrail
      setGuardrails(updatedGuardrails)
      setEditingIndex(null)
    } else {
      setGuardrails([...guardrails, newGuardrail])
    }
    
    setShowModal(false)
    setSelectedType('')
    setFormData({
      name: '',
      scope: '',
      sensitivity: 2,
      action: '',
      notification: ''
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <RichTextDisplayField 
            value={["Welcome to the main dashboard. This is your central hub for all system operations."]} 
          />
        )
      
      case 'protect':
        return (
          <div className="compact-tabs h-full w-full">
            <TabsField
              tabs={[
                {
                  label: "Performance",
                  value: "performance",
                  content: [
                    <div key="performance-content" className="mt-0">
                      <div className="page-header">
                        <div className="flex justify-between items-center">
                          <HeadingField text="Guardrail Performance" size="LARGE" marginBelow="NONE" />
                          <div className="relative flex bg-gray-100 p-1 rounded-md">
                            <div 
                              className="absolute bg-blue-500 rounded transition-all duration-300 ease-out"
                              style={{
                                left: `calc(${['1D', '1W', '1M', '1Q', '1Y'].indexOf(timeRange) * 20}% + 4px)`,
                                width: `calc(20% - 4px)`,
                                top: '4px',
                                bottom: '4px'
                              }}
                            />
                            {['1D', '1W', '1M', '1Q', '1Y'].map((period) => (
                              <button
                                key={period}
                                onClick={() => setTimeRange(period)}
                                className={`relative z-10 flex-1 px-3 py-1 text-sm rounded transition-colors duration-300 ${
                                  timeRange === period
                                    ? 'text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                {period}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* Total Guardrail Hits */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Total Guardrail Hits" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-4xl font-bold text-black mb-2">
                            <AnimatedCounter 
                              value={timeRange === '1D' ? 1247 : timeRange === '1W' ? 8934 : timeRange === '1M' ? 34567 : timeRange === '1Q' ? 98234 : 412890}
                            />
                          </div>
                          <RichTextDisplayField value={[timeRange === '1D' ? 'Last 24 hours' : timeRange === '1W' ? 'Last week' : timeRange === '1M' ? 'Last month' : timeRange === '1Q' ? 'Last quarter' : 'Last year']} />
                        </CardLayout>

                        {/* Guardrail Hit Rate */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Guardrail Hit Rate" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-4xl font-bold text-orange-600 mb-2">
                            <AnimatedPercentage 
                              value={timeRange === '1D' ? 12.3 : timeRange === '1W' ? 14.7 : timeRange === '1M' ? 11.8 : timeRange === '1Q' ? 13.2 : 12.9}
                            />
                          </div>
                          <RichTextDisplayField value={["Of total AI requests"]} />
                        </CardLayout>
                      </div>

                      {/* Activity Trend */}
                      <CardLayout padding="STANDARD" showShadow={true}>
                        <HeadingField text="Activity Trend" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="h-64 relative group bg-white rounded-lg">
                          <svg className="w-full h-full" viewBox="0 0 100 50">
                            {/* Gradient definitions */}
                            <defs>
                              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                              </linearGradient>
                            </defs>
                            
                            {/* Grid lines */}
                            <g stroke="#e2e8f0" strokeWidth="0.1" opacity="0.5">
                              {[10, 20, 30, 40].map(y => (
                                <line key={y} x1="5" y1={y} x2="95" y2={y} />
                              ))}
                            </g>
                            
                            {/* Area fill */}
                            <polygon
                              fill="url(#areaGradient)"
                              points={`5,50 ${timeRange === '1D' ? "5,37 15,30 25,35 35,22 45,27 55,17 65,21 75,15 85,20 95,12" :
                                     timeRange === '1W' ? "5,40 15,32 25,27 35,23 45,30 55,20 65,18 75,16 85,21 95,11" :
                                     timeRange === '1M' ? "5,35 15,31 25,33 35,25 45,28 55,21 65,22 75,17 85,18 95,13" :
                                     timeRange === '1Q' ? "5,38 15,33 25,31 35,26 45,31 55,23 65,20 75,18 85,22 95,15" :
                                     "5,36 15,35 25,32 35,27 45,30 55,22 65,23 75,20 85,21 95,16"} 95,50`}
                              style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            />
                            
                            {/* Main line */}
                            <polyline
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              filter="drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2))"
                              points={timeRange === '1D' ? "5,37 15,30 25,35 35,22 45,27 55,17 65,21 75,15 85,20 95,12" :
                                     timeRange === '1W' ? "5,40 15,32 25,27 35,23 45,30 55,20 65,18 75,16 85,21 95,11" :
                                     timeRange === '1M' ? "5,35 15,31 25,33 35,25 45,28 55,21 65,22 75,17 85,18 95,13" :
                                     timeRange === '1Q' ? "5,38 15,33 25,31 35,26 45,31 55,23 65,20 75,18 85,22 95,15" :
                                     "5,36 15,35 25,32 35,27 45,30 55,22 65,23 75,20 85,21 95,16"}
                              style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            />
                            
                            {/* Data points */}
                            {(timeRange === '1D' ? [[5,37], [15,30], [25,35], [35,22], [45,27], [55,17], [65,21], [75,15], [85,20], [95,12]] :
                              timeRange === '1W' ? [[5,40], [15,32], [25,27], [35,23], [45,30], [55,20], [65,18], [75,16], [85,21], [95,11]] :
                              timeRange === '1M' ? [[5,35], [15,31], [25,33], [35,25], [45,28], [55,21], [65,22], [75,17], [85,18], [95,13]] :
                              timeRange === '1Q' ? [[5,38], [15,33], [25,31], [35,26], [45,31], [55,23], [65,20], [75,18], [85,22], [95,15]] :
                              [[5,36], [15,35], [25,32], [35,27], [45,30], [55,22], [65,23], [75,20], [85,21], [95,16]]
                            ).map(([x, y], i) => (
                              <g key={i}>
                                <circle 
                                  cx={x} 
                                  cy={y} 
                                  r="1.5" 
                                  fill="white" 
                                  stroke="#6366f1"
                                  strokeWidth="0.8"
                                  className="hover:r-2 cursor-pointer"
                                  filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                                  style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    setHoveredPoint({
                                      x: rect.left + rect.width / 2,
                                      y: rect.top,
                                      value: Math.round((50 - y) * 10),
                                      index: i
                                    })
                                  }}
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />
                              </g>
                            ))}
                          </svg>
                          <div className="absolute bottom-2 left-4 text-xs text-gray-600 font-medium">
                            Guardrail hits over {timeRange === '1D' ? 'last 24 hours' : timeRange === '1W' ? 'last week' : timeRange === '1M' ? 'last month' : timeRange === '1Q' ? 'last quarter' : 'last year'}
                          </div>
                          
                          {/* Popover */}
                          {hoveredPoint && (
                            <div 
                              className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50 pointer-events-none"
                              style={{
                                left: hoveredPoint.x - 50,
                                top: hoveredPoint.y - 40,
                                transform: 'translateX(-50%)'
                              }}
                            >
                              <div className="font-medium">{hoveredPoint.value} hits</div>
                              <div className="text-gray-300 text-xs">Point {hoveredPoint.index + 1}</div>
                            </div>
                          )}
                        </div>
                      </CardLayout>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Top Violators (Agents) */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Top Violators (Agents)" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">gpt-4-turbo</span>
                              <span className="text-sm font-medium text-black underline">342 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">claude-3-opus</span>
                              <span className="text-sm font-medium text-black underline">289 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">gemini-pro</span>
                              <span className="text-sm font-medium text-black underline">156 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">llama-2-70b</span>
                              <span className="text-sm font-medium text-black underline">98 hits</span>
                            </div>
                          </div>
                        </CardLayout>

                        {/* Top Violators (Guardrail Type) */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Top Violators (Guardrail Type)" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: '#F2B3D1', color: '#FFFFFF'}}>
                                  <Icon icon="Shield" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Data Protection</span>
                              </div>
                              <span className="text-sm font-medium text-black underline">456 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: '#D4B5E8', color: '#FFFFFF'}}>
                                  <Icon icon="AlertTriangle" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Harmful Content</span>
                              </div>
                              <span className="text-sm font-medium text-black underline">298 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: '#9DD2E8', color: '#FFFFFF'}}>
                                  <Icon icon="MessageSquareX" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Profanity</span>
                              </div>
                              <span className="text-sm font-medium text-black underline">187 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: '#9DDAC7', color: '#FFFFFF'}}>
                                  <Icon icon="CheckCircle" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Compliance</span>
                              </div>
                              <span className="text-sm font-medium text-black underline">134 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: '#9BB1D6', color: '#FFFFFF'}}>
                                  <Icon icon="Lock" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Access Control</span>
                              </div>
                              <span className="text-sm font-medium text-black underline">89 hits</span>
                            </div>
                          </div>
                        </CardLayout>
                      </div>
                    </div>
                  ]
                },
                {
                  label: "Configuration",
                  value: "guardrails",
                  content: [
                    <div key="policies-content" className="mt-0">
                      <div className="page-header">
                        <div className="flex justify-between items-center">
                          <HeadingField text="Guardrail Configuration" size="LARGE" marginBelow="NONE" />
                          <button 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => setShowModal(true)}
                          >
                            <Plus size={16} />
                            Add Guardrails
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4 overflow-visible">
                        {guardrails.map((guardrail, index) => {
                          const typeStamp = getTypeStamp(guardrail.type, index)
                          const sensitivityStamp = getSensitivityStamp(guardrail.sensitivity)
                          return (
                            <div key={index} className="overflow-visible">
                              <CardLayout padding="STANDARD" showShadow={true}>
                              <div className="relative">
                                <div className="absolute top-0 right-0 flex items-center gap-2">
                                  <div title={`Sensitivity: ${guardrail.sensitivity}`}>
                                    <TagField 
                                      tags={[{
                                        text: guardrail.sensitivity,
                                        backgroundColor: sensitivityStamp.backgroundColor
                                      }]}
                                      size="SMALL"
                                      marginBelow="NONE"
                                    />
                                  </div>
                                  <div className="relative">
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => {
                                      e.stopPropagation()
                                      const menu = e.currentTarget.nextElementSibling as HTMLElement
                                      const rect = e.currentTarget.getBoundingClientRect()
                                      menu.style.top = `${rect.bottom + 4}px`
                                      menu.style.left = `${rect.right - 96}px`
                                      menu.classList.toggle('hidden')
                                    }}>
                                      <Icon icon="MoreVertical" size="SMALL" />
                                    </button>
                                    <div className="dropdown-menu hidden fixed bg-white border-gray-300 border rounded shadow-lg z-50 min-w-24" style={{top: '0px', left: '0px'}}>
                                      <button 
                                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                        onClick={() => editGuardrail(index)}
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
                                        onClick={() => deleteGuardrail(index)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3 pr-20">
                                  <div title={guardrail.type}>
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: typeStamp.bg, color: typeStamp.color}}>
                                      <Icon icon={typeStamp.icon} size="MEDIUM" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <HeadingField text={guardrail.name} size="MEDIUM" marginBelow="LESS" />
                                    <RichTextDisplayField value={[guardrail.description]} />
                                  </div>
                                </div>
                              </div>
                            </CardLayout>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ]
                },
                {
                  label: "",
                  value: "spacer",
                  disabled: true,
                  content: [
                    <div key="spacer-content" className="w-full"></div>
                  ]
                }
              ]}
            />
          </div>
        )
      
      case 'monitor':
        return (
          <RichTextDisplayField 
            value={["This is the monitor tab with system monitoring information."]} 
          />
        )
      
      case 'observe':
        return (
          <RichTextDisplayField 
            value={["This is the observe tab for system insights and analytics."]} 
          />
        )
      
      case 'events':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <HeadingField text="Events" size="LARGE" marginBelow="NONE" />
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                  </div>
                  <HeadingField text="Filters" size="MEDIUM" marginBelow="NONE" />
                </div>
                <button 
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setFilters({
                    timestamp: '', traceId: '', userId: '', modelId: '', scope: '', latency: '',
                    tokenCount: '', cost: '', status: '', policyId: '', action: '', measureType: '',
                    sensitivity: '', reviewStatus: '', toxicity: '', hallucination: '', relevance: '', piiFound: ''
                  })}
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <input
                    type="text"
                    placeholder="Filter by timestamp"
                    value={filters.timestamp}
                    onChange={(e) => setFilters({...filters, timestamp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trace ID</label>
                  <input
                    type="text"
                    placeholder="Filter by trace ID"
                    value={filters.traceId}
                    onChange={(e) => setFilters({...filters, traceId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <input
                    type="text"
                    placeholder="Filter by user ID"
                    value={filters.userId}
                    onChange={(e) => setFilters({...filters, userId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Model</label>
                  <select
                    value={filters.modelId}
                    onChange={(e) => setFilters({...filters, modelId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Models</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="success">Success</option>
                    <option value="blocked">Blocked</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sensitivity</label>
                  <select
                    value={filters.sensitivity}
                    onChange={(e) => setFilters({...filters, sensitivity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">PII Found</label>
                  <select
                    value={filters.piiFound}
                    onChange={(e) => setFilters({...filters, piiFound: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <input
                    type="text"
                    placeholder="Filter by action"
                    value={filters.action}
                    onChange={(e) => setFilters({...filters, action: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Trace ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Initiating User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">AI Agent / Model ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Application Scope</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Total Latency (ms)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Token Count (Total)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Cost (USD)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Error Code / Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Guardrail Policy ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Enforcement Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Measure Type (Trigger)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Config Sensitivity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Human Review Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Eval Score: Toxicity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Eval Score: Hallucination</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Eval Score: Relevance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">PII Found Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.timestamp}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.traceId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.modelId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.scope}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.latency}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.tokenCount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.cost}</td>
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${event.status.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>{event.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.policyId}</td>
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${event.action === 'Allow' ? 'text-gray-900' : event.action === 'Block' ? 'text-red-600' : 'text-yellow-600'}`}>{event.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.measureType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.sensitivity}</td>
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${event.reviewStatus === 'Pending' ? 'text-orange-600' : 'text-gray-900'}`}>{event.reviewStatus}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.toxicity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.hallucination}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{event.relevance}</td>
                      <td className={`px-4 py-3 text-sm whitespace-nowrap ${event.piiFound === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>{event.piiFound}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      default:
        return (
          <RichTextDisplayField 
            value={["Select a section from the navigation."]} 
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      <style>{tabStyles}</style>
      <div className={`w-full ${activeSection === 'protect' ? '' : 'px-8 py-8'}`}>
        {renderContent()}
      </div>

      <DialogField
        open={showModal}
        onOpenChange={setShowModal}
        title={editingIndex !== null ? "Edit Guardrail" : "Add Guardrail"}
      >
        <div className="space-y-4">
          <TextField 
            label="Guardrail Name" 
            placeholder="Enter guardrail name"
            value={formData.name}
            onChange={(value) => setFormData({...formData, name: value})}
          />
          
          <div>
            <HeadingField text="Type" size="SMALL" marginBelow="LESS" />
            <div className="grid grid-cols-3 gap-3">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'harmful' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('harmful')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="AlertTriangle" size="MEDIUM" />
                  <span className="text-sm font-medium">Harmful Content</span>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'profanity' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('profanity')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="MessageSquareX" size="MEDIUM" />
                  <span className="text-sm font-medium">Profanity</span>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'pii' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('pii')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="Shield" size="MEDIUM" />
                  <span className="text-sm font-medium">PII Exposure</span>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'tone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('tone')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="MessageCircle" size="MEDIUM" />
                  <span className="text-sm font-medium">Tone</span>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'logic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('logic')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="Brain" size="MEDIUM" />
                  <span className="text-sm font-medium">Logic</span>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedType === 'performance' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType('performance')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon icon="Zap" size="MEDIUM" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownField 
            label="Application Scope" 
            placeholder="Select scope"
            choiceLabels={["Global", "Department", "Project", "User"]}
            choiceValues={["global", "department", "project", "user"]}
            value={formData.scope}
            onChange={(value) => setFormData({...formData, scope: value})}
          />
          <SliderField 
            label="Sensitivity Level"
            min={1}
            max={4}
            step={1}
            value={formData.sensitivity}
            onChange={(value) => setFormData({...formData, sensitivity: Array.isArray(value) ? value[0] : value})}
          />
          <RichTextDisplayField value={["1 = Low, 2 = Medium, 3 = High, 4 = Critical"]} />
          <DropdownField 
            label="Enforcement Action" 
            placeholder="Select action"
            choiceLabels={["Block", "Warn", "Log", "Redirect"]}
            choiceValues={["block", "warn", "log", "redirect"]}
            value={formData.action}
            onChange={(value) => setFormData({...formData, action: value})}
          />
          <DropdownField 
            label="User Notification" 
            placeholder="Select notification"
            choiceLabels={["None", "Email", "In-App", "Both"]}
            choiceValues={["none", "email", "app", "both"]}
            value={formData.notification}
            onChange={(value) => setFormData({...formData, notification: value})}
          />
          <div className="flex justify-end mt-6">
            <ButtonWidget label={editingIndex !== null ? "Update Guardrail" : "Create Guardrail"} style="SOLID" color="ACCENT" onClick={addGuardrail} />
          </div>
        </div>
      </DialogField>

      <DialogField
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Guardrail"
      >
        <div className="space-y-4">
          <RichTextDisplayField value={["Are you sure you want to delete this guardrail? This action cannot be undone."]} />
          <div className="flex justify-end gap-2">
            <ButtonWidget 
              label="Cancel" 
              style="OUTLINE" 
              color="SECONDARY" 
              onClick={() => setShowDeleteModal(false)} 
            />
            <ButtonWidget 
              label="Delete" 
              style="SOLID" 
              color="NEGATIVE" 
              onClick={confirmDelete} 
            />
          </div>
        </div>
      </DialogField>
    </div>
  )
}
