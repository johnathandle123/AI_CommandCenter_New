import { HeadingField, RichTextDisplayField, CardLayout, ButtonWidget, DialogField, TextField, Icon, TagField } from '@pglevy/sailwind'
import { useState, useEffect, useRef } from 'react'
import { Plus, TrendingDown, TrendingUp } from 'lucide-react'
import GuardrailDetail from './guardrail-detail'

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

const getCardStyles = (cardStyle: 'white' | 'glass') => {
  const cardBg = cardStyle === 'glass' 
    ? 'background-color: rgba(255, 255, 255, 0.3) !important; backdrop-filter: blur(20px) !important; box-shadow: none !important;'
    : 'background-color: white !important;'
  
  const bodyBg = cardStyle === 'glass' ? 'body { background: transparent !important; }' : ''
  
  return `
    ${bodyBg}
    .grid div[class*="shadow-"],
    .space-y-4 div[class*="shadow-"],
    .grid div.bg-white,
    .space-y-0 div.bg-white,
    .space-y-4 div.bg-white {
      ${cardBg}
      border-radius: 4px !important;
      position: relative !important;
      border: 1px solid rgba(255,255,255,0.5) !important;
    }
    .grid div[class*="shadow-"]::before,
    .space-y-4 div[class*="shadow-"]::before,
    .grid div.bg-white::before,
    .space-y-0 div.bg-white::before,
    .space-y-4 div.bg-white::before {
      content: '' !important;
      position: absolute !important;
      inset: -1px !important;
      border-radius: 4px !important;
      padding: 1px !important;
      background: linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.1), rgba(255,255,255,0)) !important;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      -webkit-mask-composite: xor !important;
      mask-composite: exclude !important;
      pointer-events: none !important;
      z-index: -1 !important;
    }
  `
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
    background-color: transparent !important;
    backdrop-filter: blur(40px) !important;
    -webkit-backdrop-filter: blur(40px) !important;
    position: sticky !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1 !important;
    border-bottom: none !important;
    padding-left: 32px !important;
    margin: 0 !important;
  }
  .compact-tabs [role="tablist"] [role="tab"]:last-child {
    flex-grow: 1 !important;
    background: transparent !important;
    border: none !important;
    pointer-events: none !important;
  }
  /* Semi-transparent card backgrounds */
  .compact-tabs [role="tabpanel"] div[class*="shadow-"] {
    background-color: rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: none !important;
    border-radius: 16px !important;
    border: 1px solid white !important;
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
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(40px) !important;
    -webkit-backdrop-filter: blur(40px) !important;
    z-index: 1 !important;
    border-bottom: 1px solid white !important;
    transition: box-shadow 0.2s ease !important;
    padding: 16px 32px 16px 32px !important;
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
    background-color: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(40px) !important;
  }
  div[style*="position: fixed"], div[style*="z-index"] {
    z-index: 2147483645 !important;
  }
  [role="dialog"] {
    max-width: 850px !important;
    width: 850px !important;
    background-color: white !important;
    backdrop-filter: none !important;
  }
`

interface TabsInterfaceProps {
  activeSection: string
  cardStyle?: 'white' | 'glass'
}

export default function TabsInterface({ activeSection, cardStyle = 'glass' }: TabsInterfaceProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [chartHover, setChartHover] = useState<{x: number, y: number, yCoord: number, value: number} | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const performanceRef = useRef<HTMLButtonElement>(null)
  const configurationRef = useRef<HTMLButtonElement>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [timeRange, setTimeRange] = useState('1D')
  const [wizardStep, setWizardStep] = useState(1)
  const [protectTab, setProtectTab] = useState<'performance' | 'configuration'>('performance')
  const [scrollState, setScrollState] = useState({ top: true, bottom: false })
  const [protectScrolled, setProtectScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const activeRef = protectTab === 'performance' ? performanceRef : configurationRef
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [protectTab])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        setScrollState({
          top: scrollTop === 0,
          bottom: scrollTop + clientHeight >= scrollHeight - 1
        })
      }
    }

    const scrollEl = scrollRef.current
    if (scrollEl) {
      handleScroll()
      scrollEl.addEventListener('scroll', handleScroll)
      return () => scrollEl.removeEventListener('scroll', handleScroll)
    }
  }, [showModal, wizardStep])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: '',
    sensitivity: 2,
    action: '',
    actionMessage: ''
  })
  const [selectedGuardrail, setSelectedGuardrail] = useState<number | null>(null)
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
      setProtectScrolled((window.pageYOffset || document.documentElement.scrollTop) > 0)
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
      'Data Protection': { icon: 'Database' },
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
      description: guardrail.description,
      scope: guardrail.scope,
      sensitivity: ['', 'Low', 'Medium', 'High', 'Critical'].indexOf(guardrail.sensitivity),
      action: guardrail.action,
      actionMessage: ''
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
    setWizardStep(1)
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
      description: formData.description || "Description for the new guardrail.",
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
    setWizardStep(1)
    setSelectedType('')
    setFormData({
      name: '',
      description: '',
      scope: '',
      sensitivity: 2,
      action: '',
      actionMessage: ''
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div>
            <style>{getCardStyles(cardStyle)}</style>
            <RichTextDisplayField 
              value={["Welcome to the main dashboard. This is your central hub for all system operations."]} 
            />
          </div>
        )
      
      case 'protect':
        const currentTab = protectTab as 'performance' | 'configuration'
        const headerBg = cardStyle === 'glass' ? 'bg-white/50 backdrop-blur-md border-white' : 'bg-white border-gray-200'
        return (
          <div className="h-full w-full" style={{ background: 'transparent' }}>
            <style>{getCardStyles(cardStyle)}</style>
            {selectedGuardrail === null && (
            <div className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex flex-col justify-center transition-shadow duration-300 ${protectScrolled ? 'shadow-[0_8px_16px_-8px_rgba(0,0,0,0.08)]' : ''} ${cardStyle === 'glass' ? 'shadow-none' : ''}`} style={{ borderRadius: 0, minHeight: '140px' }}>
              <div className="relative flex gap-8 mb-4 border-b border-white/30">
                <button
                  ref={performanceRef}
                  onClick={() => setProtectTab('performance')}
                  className={`px-2 py-2 transition-colors font-medium ${
                    currentTab === 'performance'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Performance
                </button>
                <button
                  ref={configurationRef}
                  onClick={() => setProtectTab('configuration')}
                  className={`px-2 py-2 transition-colors font-medium ${
                    // @ts-ignore - TypeScript narrows type inside conditional
                    currentTab === 'configuration'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Configuration
                </button>
                <div 
                  className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out"
                  style={{
                    left: `${underlineStyle.left}px`,
                    width: `${underlineStyle.width}px`
                  }}
                />
              </div>
              <div className="flex justify-between items-center" style={{ minHeight: '48px' }}>
                <HeadingField text={currentTab === 'performance' ? "Guardrail Performance" : "Guardrail Configuration"} size="LARGE" marginBelow="NONE" />
                {currentTab === 'performance' ? (
                  <div className="relative flex p-1 rounded-md">
                    <div 
                      className="absolute bg-blue-900 rounded transition-all duration-300 ease-out"
                      style={{
                        left: `calc(${['1D', '1W', '1M', '1Q', '1Y'].indexOf(timeRange) * 20}% + 4px)`,
                        width: `calc(20% - 4px)`,
                        top: '4px',
                        bottom: '4px'
                      }}
                    />
                    {['1D', '1W', '1M', '1Q', '1Y'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`relative z-10 px-4 py-1 text-sm font-medium transition-colors ${
                          timeRange === range ? 'text-white' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => setShowModal(true)}
                  >
                    <Plus size={16} />
                    Add Guardrails
                  </button>
                )}
              </div>
            </div>
            )}
            {currentTab === 'performance' ? (
              <div key="performance-content" className="mt-6" style={{ background: 'transparent' }}>
                      
                      <div className="grid grid-cols-[3fr_1fr] gap-4 px-20 min-h-[calc(100vh-200px)]" style={{ background: 'transparent' }}>
                        <div className="space-y-0" style={{ background: 'transparent' }}>
                          <div className="grid grid-cols-2 gap-4 items-stretch" style={{ background: 'transparent' }}>
                        {/* Total Guardrail Hits */}
                        <CardLayout padding="MORE" showShadow={true}>
                          <div className="h-full flex items-center gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                              <Icon icon="Shield" size="MEDIUM" />
                            </div>
                            <div className="flex-1">
                          <HeadingField text="Total Guardrail Hits" size="MEDIUM" marginBelow="NONE" />
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-4xl font-bold text-black">
                              <AnimatedCounter 
                                value={timeRange === '1D' ? 1247 : timeRange === '1W' ? 8934 : timeRange === '1M' ? 34567 : timeRange === '1Q' ? 98234 : 412890}
                                duration={300}
                              />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                              <TrendingDown size={16} />
                              <span>8.2%</span>
                            </div>
                          </div>
                          <div className="text-gray-700 uppercase text-sm">
                            {timeRange === '1D' ? 'Last 24 hours' : timeRange === '1W' ? 'Last week' : timeRange === '1M' ? 'Last month' : timeRange === '1Q' ? 'Last quarter' : 'Last year'}
                          </div>
                          </div>
                          </div>
                          <svg className="w-24 h-16 flex-shrink-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="miniGreenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M0,40 L0,30 L20,24 L40,28 L60,20 L80,16 L100,10 L100,40 Z"
                              fill="url(#miniGreenGradient)"
                            />
                            <polyline
                              points="0,30 20,24 40,28 60,20 80,16 100,10"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="1"
                              opacity="0.6"
                            />
                          </svg>
                          </div>
                        </CardLayout>

                        {/* Guardrail Hit Rate */}
                        <CardLayout padding="MORE" showShadow={true}>
                          <div className="h-full flex items-center gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                              <Icon icon="TrendingUp" size="MEDIUM" />
                            </div>
                            <div className="flex-1">
                          <HeadingField text="Guardrail Hit Rate" size="MEDIUM" marginBelow="NONE" />
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-4xl font-bold text-black">
                              <AnimatedPercentage 
                                value={timeRange === '1D' ? 12.3 : timeRange === '1W' ? 14.7 : timeRange === '1M' ? 11.8 : timeRange === '1Q' ? 13.2 : 12.9}
                              />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                              <TrendingUp size={16} />
                              <span>3.5%</span>
                            </div>
                          </div>
                          <div className="text-gray-700 uppercase text-sm">
                            Of total AI requests
                          </div>
                          </div>
                          </div>
                          <svg className="w-24 h-16 flex-shrink-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="miniRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M0,40 L0,20 L20,24 L40,18 L60,26 L80,30 L100,36 L100,40 Z"
                              fill="url(#miniRedGradient)"
                            />
                            <polyline
                              points="0,20 20,24 40,18 60,26 80,30 100,36"
                              fill="none"
                              stroke="#dc2626"
                              strokeWidth="1"
                              opacity="0.6"
                            />
                          </svg>
                          </div>
                        </CardLayout>
                        </div>

                      {/* Activity Trend */}
                        <CardLayout padding="NONE" showShadow={true}>
                        <div className="p-4">
                        <div className="flex items-start gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                          <Icon icon="TrendingUp" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                        <HeadingField text="Activity Trend" size="MEDIUM" marginBelow="STANDARD" />
                        </div>
                        </div>
                        </div>
                        <div className="h-full min-h-[300px] relative group rounded-lg">
                          <svg className="w-full h-full" viewBox="0 0 100 50">
                            {/* Gradient definitions */}
                            <defs>
                              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                              </linearGradient>
                              {chartHover && (
                                <mask id="hoverMask">
                                  <rect x="0" y="0" width="100" height="50" fill="white" opacity="0.05" />
                                  <circle
                                    cx={chartHover.x}
                                    cy="25"
                                    r="35"
                                    fill="url(#radialGradient)"
                                  />
                                </mask>
                              )}
                              {chartHover && (
                                <radialGradient id="radialGradient">
                                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                                  <stop offset="40%" stopColor="white" stopOpacity="0.9" />
                                  <stop offset="70%" stopColor="white" stopOpacity="0.5" />
                                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </radialGradient>
                              )}
                            </defs>
                            
                            {/* Grid lines */}
                            <g stroke="#e2e8f0" strokeWidth="0.1" opacity="0.5">
                              {[10, 20, 30, 40].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} />
                              ))}
                            </g>
                            
                            {/* Area fill */}
                            <path
                              fill="url(#areaGradient)"
                              mask={chartHover ? "url(#hoverMask)" : undefined}
                              style={{ transition: 'd 0.3s ease-out' }}
                              d={timeRange === '1D' ? "M0,50 L0,37 C3,35 7,32 10,30 C13,28 17,32 20,35 C23,38 27,25 30,22 C33,19 37,24 40,27 C43,30 47,20 50,17 C53,14 57,18 60,21 C63,24 67,17 70,15 C73,13 77,17 80,20 C83,23 87,14 90,12 C93,10 97,12 100,12 L100,50 Z" :
                                 timeRange === '1W' ? "M0,50 L0,40 C3,38 7,34 10,32 C13,30 17,28 20,27 C23,26 27,24 30,23 C33,22 37,27 40,30 C43,33 47,23 50,20 C53,17 57,18 60,18 C63,18 67,16 70,16 C73,16 77,19 80,21 C83,23 87,13 90,11 C93,9 97,11 100,11 L100,50 Z" :
                                 timeRange === '1M' ? "M0,50 L0,35 C3,34 7,32 10,31 C13,30 17,32 20,33 C23,34 27,27 30,25 C33,23 37,26 40,28 C43,30 47,23 50,21 C53,19 57,21 60,22 C63,23 67,18 70,17 C73,16 77,17 80,18 C83,19 87,14 90,13 C93,12 97,13 100,13 L100,50 Z" :
                                 timeRange === '1Q' ? "M0,50 L0,38 C3,37 7,34 10,33 C13,32 17,31 20,31 C23,31 27,27 30,26 C33,25 37,29 40,31 C43,33 47,25 50,23 C53,21 57,20 60,20 C63,20 67,18 70,18 C73,18 77,21 80,22 C83,23 87,16 90,15 C93,14 97,15 100,15 L100,50 Z" :
                                 "M0,50 L0,36 C3,36 7,35 10,35 C13,35 17,33 20,32 C23,31 27,28 30,27 C33,26 37,29 40,30 C43,31 47,24 50,22 C53,20 57,22 60,23 C63,24 67,21 70,20 C73,19 77,20 80,21 C83,22 87,17 90,16 C93,15 97,16 100,16 L100,50 Z"}
                            />
                            
                            {/* Main line */}
                            <path
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="0.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              mask={chartHover ? "url(#hoverMask)" : undefined}
                              filter="drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2))"
                              style={{ transition: 'd 0.3s ease-out' }}
                              d={timeRange === '1D' ? "M0,37 C3,35 7,32 10,30 C13,28 17,32 20,35 C23,38 27,25 30,22 C33,19 37,24 40,27 C43,30 47,20 50,17 C53,14 57,18 60,21 C63,24 67,17 70,15 C73,13 77,17 80,20 C83,23 87,14 90,12 C93,10 97,12 100,12" :
                                 timeRange === '1W' ? "M0,40 C3,38 7,34 10,32 C13,30 17,28 20,27 C23,26 27,24 30,23 C33,22 37,27 40,30 C43,33 47,23 50,20 C53,17 57,18 60,18 C63,18 67,16 70,16 C73,16 77,19 80,21 C83,23 87,13 90,11 C93,9 97,11 100,11" :
                                 timeRange === '1M' ? "M0,35 C3,34 7,32 10,31 C13,30 17,32 20,33 C23,34 27,27 30,25 C33,23 37,26 40,28 C43,30 47,23 50,21 C53,19 57,21 60,22 C63,23 67,18 70,17 C73,16 77,17 80,18 C83,19 87,14 90,13 C93,12 97,13 100,13" :
                                 timeRange === '1Q' ? "M0,38 C3,37 7,34 10,33 C13,32 17,31 20,31 C23,31 27,27 30,26 C33,25 37,29 40,31 C43,33 47,25 50,23 C53,21 57,20 60,20 C63,20 67,18 70,18 C73,18 77,21 80,22 C83,23 87,16 90,15 C93,14 97,15 100,15" :
                                 "M0,36 C3,36 7,35 10,35 C13,35 17,33 20,32 C23,31 27,28 30,27 C33,26 37,29 40,30 C43,31 47,24 50,22 C53,20 57,22 60,23 C63,24 67,21 70,20 C73,19 77,20 80,21 C83,22 87,17 90,16 C93,15 97,16 100,16"}
                            />
                            
                            {/* Hover line and dot */}
                            {chartHover && (
                              <>
                                <line
                                  x1={chartHover.x + 0.5}
                                  y1="0"
                                  x2={chartHover.x + 0.5}
                                  y2="50"
                                  stroke="#6366f1"
                                  strokeWidth="0.2"
                                  strokeDasharray="0.5,0.5"
                                  opacity="0.4"
                                />
                                <circle
                                  cx={chartHover.x + 0.5}
                                  cy={chartHover.yCoord}
                                  r="0.6"
                                  fill="white"
                                  stroke="#6366f1"
                                  strokeWidth="0.2"
                                />
                              </>
                            )}
                            
                            {/* Transparent overlay for hover detection */}
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="50"
                              fill="transparent"
                              onMouseMove={(e) => {
                                const svg = e.currentTarget.ownerSVGElement
                                if (!svg) return
                                const rect = svg.getBoundingClientRect()
                                const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                                
                                // Get data points for current time range
                                const dataPoints = timeRange === '1D' ? [[0,37], [10,30], [20,35], [30,22], [40,27], [50,17], [60,21], [70,15], [80,20], [90,12], [100,12]] :
                                  timeRange === '1W' ? [[0,40], [10,32], [20,27], [30,23], [40,30], [50,20], [60,18], [70,16], [80,21], [90,11], [100,11]] :
                                  timeRange === '1M' ? [[0,35], [10,31], [20,33], [30,25], [40,28], [50,21], [60,22], [70,17], [80,18], [90,13], [100,13]] :
                                  timeRange === '1Q' ? [[0,38], [10,33], [20,31], [30,26], [40,31], [50,23], [60,20], [70,18], [80,22], [90,15], [100,15]] :
                                  [[0,36], [10,35], [20,32], [30,27], [40,30], [50,22], [60,23], [70,20], [80,21], [90,16], [100,16]]
                                
                                // Find the segment and use quadratic interpolation for better curve approximation
                                let leftPoint = dataPoints[0]
                                let rightPoint = dataPoints[1]
                                let segmentIndex = 0
                                
                                for (let i = 0; i < dataPoints.length - 1; i++) {
                                  if (x >= dataPoints[i][0] && x <= dataPoints[i + 1][0]) {
                                    leftPoint = dataPoints[i]
                                    rightPoint = dataPoints[i + 1]
                                    segmentIndex = i
                                    break
                                  }
                                }
                                
                                // Use quadratic interpolation with neighboring points for smoother curve
                                const t = (x - leftPoint[0]) / (rightPoint[0] - leftPoint[0])
                                
                                // Get control point influence from neighbors
                                const prevPoint = segmentIndex > 0 ? dataPoints[segmentIndex - 1] : leftPoint
                                const nextPoint = segmentIndex < dataPoints.length - 2 ? dataPoints[segmentIndex + 2] : rightPoint
                                
                                // Approximate cubic bezier with weighted interpolation
                                const cp1y = leftPoint[1] + (rightPoint[1] - prevPoint[1]) * 0.3
                                const cp2y = rightPoint[1] - (nextPoint[1] - leftPoint[1]) * 0.3
                                
                                // Cubic bezier formula
                                const interpolatedY = 
                                  Math.pow(1-t, 3) * leftPoint[1] +
                                  3 * Math.pow(1-t, 2) * t * cp1y +
                                  3 * (1-t) * Math.pow(t, 2) * cp2y +
                                  Math.pow(t, 3) * rightPoint[1]
                                
                                setChartHover({
                                  x: x,
                                  y: e.clientY,
                                  yCoord: interpolatedY,
                                  value: Math.round((50 - interpolatedY) * 10)
                                })
                              }}
                              onMouseLeave={() => setChartHover(null)}
                            />
                          </svg>
                          <div className="absolute bottom-2 left-4 text-xs text-gray-600 font-medium">
                            Guardrail hits over {timeRange === '1D' ? 'last 24 hours' : timeRange === '1W' ? 'last week' : timeRange === '1M' ? 'last month' : timeRange === '1Q' ? 'last quarter' : 'last year'}
                          </div>
                          
                          {/* Popover */}
                          {chartHover && (
                            <div 
                              className="absolute bg-white/90 backdrop-blur-lg text-black px-3 py-2 rounded-lg shadow-lg text-sm z-50 pointer-events-none border border-white/50 h-8 flex items-center"
                              style={{
                                left: `${chartHover.x}%`,
                                top: `${(chartHover.yCoord / 50) * 100}%`,
                                transform: 'translate(-50%, calc(-100% - 16px))'
                              }}
                            >
                              <div className="font-medium">{chartHover.value} hits</div>
                            </div>
                          )}
                        </div>
                      </CardLayout>
                        </div>

                        <div className="space-y-0">
                        {/* Top Violators */}
                        <CardLayout padding="MORE" showShadow={true}>
                          <div className="flex items-start gap-3 mb-4">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                              <Icon icon="Box" size="MEDIUM" />
                            </div>
                            <div className="flex-1">
                          <HeadingField text="Top Violators (Objects)" size="MEDIUM" marginBelow="STANDARD" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Icon icon="Sparkles" size="SMALL" />
                                <span className="text-sm text-gray-700">AI Skill: Document Classifier</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">342 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Icon icon="Bot" size="SMALL" />
                                <span className="text-sm text-gray-700">AI Agent: Customer Support</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">289 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Icon icon="Sparkles" size="SMALL" />
                                <span className="text-sm text-gray-700">AI Skill: Sentiment Analyzer</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">156 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Icon icon="Bot" size="SMALL" />
                                <span className="text-sm text-gray-700">AI Agent: Data Assistant</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">98 hits</span>
                            </div>
                          </div>

                          <div className="mt-6">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                              <Icon icon="Shield" size="MEDIUM" />
                            </div>
                            <div className="flex-1">
                          <HeadingField text="Top Violators (Guardrail Type)" size="MEDIUM" marginBelow="STANDARD" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: '#F2B3D1'}}>
                                  <Icon icon="Database" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Data Protection</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">456 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: '#D4B5E8'}}>
                                  <Icon icon="AlertTriangle" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Harmful Content</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">298 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: '#9DD2E8'}}>
                                  <Icon icon="MessageSquareX" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Profanity</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">187 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: '#9DDAC7'}}>
                                  <Icon icon="CheckCircle" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Compliance</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">134 hits</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: '#9BB1D6'}}>
                                  <Icon icon="Lock" size="MEDIUM" />
                                </div>
                                <span className="text-sm text-gray-700">Access Control</span>
                              </div>
                              <span className="text-sm font-medium text-red-600">89 hits</span>
                            </div>
                          </div>
                          </div>
                        </CardLayout>
                        </div>
                      </div>
                    </div>
            ) : (
              selectedGuardrail !== null ? (
                <GuardrailDetail
                  guardrail={guardrails[selectedGuardrail]}
                  onBack={() => setSelectedGuardrail(null)}
                  onSave={(data) => {
                    const updated = [...guardrails]
                    updated[selectedGuardrail] = { ...updated[selectedGuardrail], ...data }
                    setGuardrails(updated)
                    setSelectedGuardrail(null)
                  }}
                />
              ) : (
              <div key="policies-content" className="mt-6" style={{ background: 'transparent' }}>
                      <div className="space-y-4 overflow-visible px-20" style={{ background: 'transparent' }}>
                        {guardrails.map((guardrail, index) => {
                          const typeStamp = getTypeStamp(guardrail.type, index)
                          const sensitivityStamp = getSensitivityStamp(guardrail.sensitivity)
                          return (
                            <div key={index} className="overflow-visible">
                              <CardLayout padding="MORE" showShadow={true}>
                              <div className="relative cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setSelectedGuardrail(index)}>
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
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          editGuardrail(index)
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteGuardrail(index)
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3 pr-20">
                                  <div title={guardrail.type}>
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{backgroundColor: typeStamp.bg}}>
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
              )
            )}
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
    <div className={`min-h-screen w-full ${cardStyle === 'glass' ? 'bg-transparent' : 'bg-gradient-to-b from-blue-100 from-50% to-white'}`}>
      <style>{tabStyles}</style>
      <div className={`w-full ${activeSection === 'protect' ? '' : 'px-8 py-8'}`}>
        {renderContent()}
      </div>

      <DialogField
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) setWizardStep(1)
        }}
        title={editingIndex !== null ? "Edit Guardrail" : "Add Guardrail"}
      >
        <div className="flex flex-col relative" style={{ width: '800px', height: '600px' }}>
          {/* Progress Indicator */}
          <div className={`pb-6 pt-2 px-6 bg-white relative z-30 -mx-6 transition-shadow duration-300 ${!scrollState.top ? 'shadow-[0_8px_16px_-8px_rgba(0,0,0,0.08)]' : ''}`}>
            <div className="flex items-center justify-center">
            {[
              { num: 1, label: 'General' },
              { num: 2, label: 'Result' },
              { num: 3, label: 'Review' }
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    wizardStep >= step.num ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.num}
                  </div>
                  <span className={`text-xs transition-all duration-300 whitespace-nowrap ${
                    wizardStep >= step.num ? 'text-blue-500 font-semibold' : 'text-gray-500'
                  }`}>{step.label}</span>
                </div>
                {idx < 2 && <div className={`w-24 h-1 mx-4 -mt-6 transition-all duration-300 ${
                  wizardStep > step.num ? 'bg-blue-500' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-6 relative z-0">
            {/* Step 1: General */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <TextField 
                  label="Guardrail Name" 
                  placeholder="Enter guardrail name"
                  value={formData.name}
                  onChange={(value) => setFormData({...formData, name: value})}
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    placeholder="Describe what this guardrail does"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none relative z-0"
                  />
                </div>
                <div>
                  <HeadingField text="Type" size="SMALL" marginBelow="LESS" />
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'harmful', icon: 'AlertTriangle', label: 'Harmful Content' },
                      { id: 'profanity', icon: 'MessageSquareX', label: 'Profanity' },
                      { id: 'pii', icon: 'Shield', label: 'PII Exposure' },
                      { id: 'tone', icon: 'MessageCircle', label: 'Tone' },
                      { id: 'logic', icon: 'Brain', label: 'Logic' },
                      { id: 'performance', icon: 'Zap', label: 'Performance' }
                    ].map((type) => (
                      <div 
                        key={type.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedType === type.id ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <Icon icon={type.icon as any} size="MEDIUM" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Result */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <HeadingField text="Enforcement Action" size="SMALL" marginBelow="LESS" />
                <div className="space-y-3">
                  {[
                    { value: 'block', label: 'Block', desc: 'Prevent the action completely', icon: 'Ban' },
                    { value: 'warn', label: 'Warn', desc: 'Show warning but allow action', icon: 'AlertTriangle' },
                    { value: 'redirect', label: 'Redirect', desc: 'Route to alternative flow', icon: 'ArrowRight' }
                  ].map((action) => (
                    <div
                      key={action.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.action === action.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, action: action.value})}
                    >
                      <div className="flex items-start gap-3">
                        <Icon icon={action.icon as any} size="MEDIUM" />
                        <div className="flex-1">
                          <div className="font-semibold">{action.label}</div>
                          <div className="text-sm text-gray-600">{action.desc}</div>
                          
                          {formData.action === action.value && (
                            <div className="mt-3 animate-in fade-in duration-200">
                              <label className="block text-sm font-medium mb-2">Message</label>
                              <textarea 
                                placeholder="Enter the message to display when this guardrail is triggered"
                                value={formData.actionMessage}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  setFormData({...formData, actionMessage: e.target.value})
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none relative z-0"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <HeadingField text="Review Your Guardrail" size="SMALL" marginBelow="STANDARD" />
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div><span className="font-semibold">Name:</span> {formData.name || 'Not specified'}</div>
                  <div><span className="font-semibold">Description:</span> {formData.description || 'Not specified'}</div>
                  <div><span className="font-semibold">Type:</span> {selectedType || 'Not selected'}</div>
                  <div><span className="font-semibold">Action:</span> {formData.action || 'Not selected'}</div>
                  {formData.actionMessage && (
                    <div><span className="font-semibold">Message:</span> {formData.actionMessage}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className={`flex justify-between pt-4 pb-2 px-6 bg-white relative z-30 -mx-6 transition-shadow duration-300 ${!scrollState.bottom ? 'shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.08)]' : ''}`}>
            {wizardStep > 1 && (
              <ButtonWidget 
                label="Back" 
                style="OUTLINE" 
                color="SECONDARY" 
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
              />
            )}
            {wizardStep === 1 && <div />}
            {wizardStep < 3 ? (
              <ButtonWidget 
                label="Next" 
                style="SOLID" 
                color="ACCENT" 
                onClick={() => setWizardStep(wizardStep + 1)}
              />
            ) : (
              <ButtonWidget 
                label={editingIndex !== null ? "Update Guardrail" : "Create Guardrail"} 
                style="SOLID" 
                color="ACCENT" 
                onClick={addGuardrail}
              />
            )}
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
