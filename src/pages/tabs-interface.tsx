import { TabsField, HeadingField, RichTextDisplayField, CardLayout, ButtonWidget, DialogField, TextField, DropdownField, SliderField, Icon, StampField, TagField } from '@pglevy/sailwind'
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
    position: fixed !important;
    top: 68px !important;
    left: 80px !important;
    right: 0 !important;
    z-index: 30 !important;
    border-bottom: 1px solid #e5e7eb !important;
  }
  .compact-tabs [role="tablist"] [role="tab"]:last-child {
    flex-grow: 1 !important;
    background: transparent !important;
    border: none !important;
    pointer-events: none !important;
  }
  .compact-tabs [role="tabpanel"] {
    padding-top: 180px !important;
  }
  .page-header {
    position: fixed !important;
    top: 116px !important;
    left: 80px !important;
    right: 0 !important;
    background: white !important;
    z-index: 25 !important;
    border-bottom: 1px solid #e5e7eb !important;
    transition: box-shadow 0.2s ease !important;
  }
  .page-header.scrolled {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  }
`

interface TabsInterfaceProps {
  activeSection: string
}

export default function TabsInterface({ activeSection }: TabsInterfaceProps) {
  const [showModal, setShowModal] = useState(false)
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

  const getTypeStamp = (type: string) => {
    const typeConfig = {
      'Harmful Content': { icon: 'AlertTriangle', backgroundColor: 'NEGATIVE', iconColor: 'red-500' },
      'Profanity': { icon: 'MessageSquareX', backgroundColor: 'SECONDARY', iconColor: 'purple-500' },
      'PII Exposure & Confidentiality': { icon: 'Shield', backgroundColor: 'STANDARD', iconColor: 'yellow-500' },
      'Tone': { icon: 'MessageCircle', backgroundColor: 'STANDARD', iconColor: 'red-500' },
      'Logic': { icon: 'Brain', backgroundColor: 'ACCENT', iconColor: 'blue-500' },
      'Performance': { icon: 'Zap', backgroundColor: 'SECONDARY', iconColor: 'purple-500' },
      'Data Protection': { icon: 'Shield', backgroundColor: 'ACCENT', iconColor: 'blue-500' },
      'Access Control': { icon: 'Lock', backgroundColor: 'SECONDARY', iconColor: 'orange-500' },
      'Compliance': { icon: 'CheckCircle', backgroundColor: 'POSITIVE', iconColor: 'green-500' }
    }
    return typeConfig[type as keyof typeof typeConfig] || { icon: 'Shield', backgroundColor: 'STANDARD', iconColor: 'gray-500' }
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
    setGuardrails(guardrails.filter((_, i) => i !== index))
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
                    <div key="performance-content" className="space-y-6 px-8 py-8">
                      <div className="page-header p-4">
                        <div className="flex justify-between items-center">
                          <HeadingField text="Guardrail Performance" size="LARGE" marginBelow="NONE" />
                          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                            {['1D', '1W', '1M', '1Q', '1Y'].map((period) => (
                              <button
                                key={period}
                                onClick={() => setTimeRange(period)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                  timeRange === period
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-200'
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
                        <div className="h-64 relative group">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            {/* Sample line chart data */}
                            <polyline
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              points={timeRange === '1D' ? "20,150 60,120 100,140 140,90 180,110 220,70 260,85 300,60 340,80 380,50" :
                                     timeRange === '1W' ? "20,160 60,130 100,110 140,95 180,120 220,80 260,75 300,65 340,85 380,45" :
                                     timeRange === '1M' ? "20,140 60,125 100,135 140,100 180,115 220,85 260,90 300,70 340,75 380,55" :
                                     timeRange === '1Q' ? "20,155 60,135 100,125 140,105 180,125 220,95 260,80 300,75 340,90 380,60" :
                                     "20,145 60,140 100,130 140,110 180,120 220,90 260,95 300,80 340,85 380,65"}
                            />
                            
                            {/* Data points with hover */}
                            {(timeRange === '1D' ? [[20,150], [60,120], [100,140], [140,90], [180,110], [220,70], [260,85], [300,60], [340,80], [380,50]] :
                              timeRange === '1W' ? [[20,160], [60,130], [100,110], [140,95], [180,120], [220,80], [260,75], [300,65], [340,85], [380,45]] :
                              timeRange === '1M' ? [[20,140], [60,125], [100,135], [140,100], [180,115], [220,85], [260,90], [300,70], [340,75], [380,55]] :
                              timeRange === '1Q' ? [[20,155], [60,135], [100,125], [140,105], [180,125], [220,95], [260,80], [300,75], [340,90], [380,60]] :
                              [[20,145], [60,140], [100,130], [140,110], [180,120], [220,90], [260,95], [300,80], [340,85], [380,65]]
                            ).map(([x, y], i) => (
                              <circle 
                                key={i} 
                                cx={x} 
                                cy={y} 
                                r="4" 
                                fill="#3b82f6" 
                                className="hover:r-6 cursor-pointer"
                              >
                                <title>{`Point ${i + 1}: ${Math.round((200 - y) * 2.5)} hits`}</title>
                              </circle>
                            ))}
                          </svg>
                          <div className="absolute bottom-2 left-4 text-xs text-gray-500">
                            Guardrail hits over {timeRange === '1D' ? 'last 24 hours' : timeRange === '1W' ? 'last week' : timeRange === '1M' ? 'last month' : timeRange === '1Q' ? 'last quarter' : 'last year'}
                          </div>
                        </div>
                      </CardLayout>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Top Violators (Agents) */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Top Violators (Agents)" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">gpt-4-turbo</span>
                              <span className="text-sm font-medium text-red-600">342 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">claude-3-opus</span>
                              <span className="text-sm font-medium text-red-600">289 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">gemini-pro</span>
                              <span className="text-sm font-medium text-red-600">156 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">llama-2-70b</span>
                              <span className="text-sm font-medium text-red-600">98 hits</span>
                            </div>
                          </div>
                        </CardLayout>

                        {/* Top Violators (Guardrail Type) */}
                        <CardLayout padding="STANDARD" showShadow={true}>
                          <HeadingField text="Top Violators (Guardrail Type)" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StampField 
                                  icon="Shield"
                                  backgroundColor="ACCENT"
                                  size="SMALL"
                                />
                                <span className="text-sm text-gray-700">Data Protection</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">456 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StampField 
                                  icon="AlertTriangle"
                                  backgroundColor="NEGATIVE"
                                  size="SMALL"
                                />
                                <span className="text-sm text-gray-700">Harmful Content</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">298 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StampField 
                                  icon="MessageSquareX"
                                  backgroundColor="SECONDARY"
                                  size="SMALL"
                                />
                                <span className="text-sm text-gray-700">Profanity</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">187 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StampField 
                                  icon="CheckCircle"
                                  backgroundColor="POSITIVE"
                                  size="SMALL"
                                />
                                <span className="text-sm text-gray-700">Compliance</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">134 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <StampField 
                                  icon="Lock"
                                  backgroundColor="SECONDARY"
                                  size="SMALL"
                                />
                                <span className="text-sm text-gray-700">Access Control</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">89 hits</span>
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
                    <div key="policies-content" className="space-y-4 px-8 py-8">
                      <div className="page-header p-4">
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
                          const typeStamp = getTypeStamp(guardrail.type)
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
                                  <div className={`text-${typeStamp.iconColor}`} title={guardrail.type}>
                                    <StampField 
                                      icon={typeStamp.icon}
                                      backgroundColor={typeStamp.backgroundColor}
                                      size="SMALL"
                                    />
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
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <HeadingField text="Filters" size="MEDIUM" marginBelow="STANDARD" />
              <div className="grid grid-cols-6 gap-4">
                <TextField 
                  label="Timestamp" 
                  placeholder="Filter by timestamp"
                  value={filters.timestamp}
                  onChange={(value) => setFilters({...filters, timestamp: value})}
                />
                <TextField 
                  label="Trace ID" 
                  placeholder="Filter by trace ID"
                  value={filters.traceId}
                  onChange={(value) => setFilters({...filters, traceId: value})}
                />
                <TextField 
                  label="User ID" 
                  placeholder="Filter by user ID"
                  value={filters.userId}
                  onChange={(value) => setFilters({...filters, userId: value})}
                />
                <TextField 
                  label="Model ID" 
                  placeholder="Filter by model"
                  value={filters.modelId}
                  onChange={(value) => setFilters({...filters, modelId: value})}
                />
                <TextField 
                  label="Scope" 
                  placeholder="Filter by scope"
                  value={filters.scope}
                  onChange={(value) => setFilters({...filters, scope: value})}
                />
                <TextField 
                  label="Status" 
                  placeholder="Filter by status"
                  value={filters.status}
                  onChange={(value) => setFilters({...filters, status: value})}
                />
                <TextField 
                  label="Action" 
                  placeholder="Filter by action"
                  value={filters.action}
                  onChange={(value) => setFilters({...filters, action: value})}
                />
                <TextField 
                  label="Sensitivity" 
                  placeholder="Filter by sensitivity"
                  value={filters.sensitivity}
                  onChange={(value) => setFilters({...filters, sensitivity: value})}
                />
                <TextField 
                  label="PII Found" 
                  placeholder="Yes/No"
                  value={filters.piiFound}
                  onChange={(value) => setFilters({...filters, piiFound: value})}
                />
                <div className="flex items-end">
                  <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    onClick={() => setFilters({
                      timestamp: '', traceId: '', userId: '', modelId: '', scope: '', latency: '',
                      tokenCount: '', cost: '', status: '', policyId: '', action: '', measureType: '',
                      sensitivity: '', reviewStatus: '', toxicity: '', hallucination: '', relevance: '', piiFound: ''
                    })}
                  >
                    Clear All
                  </button>
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
    </div>
  )
}
