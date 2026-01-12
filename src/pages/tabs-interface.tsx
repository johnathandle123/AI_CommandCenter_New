import { HeadingField, RichTextDisplayField, CardLayout, ButtonWidget, DialogField, TextField, Icon, TagField } from '@pglevy/sailwind'
import { useState, useEffect, useRef } from 'react'
import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

const getCardStyles = (cardStyle: 'white' | 'glass' | 'greyscale') => {
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

function DraggableCard({ id, title, data, color, unit, change, getPerformanceStamp }: {
  id: string
  title: string
  data: number[][]
  color: string
  unit: string
  change: number
  getPerformanceStamp: (title: string) => { icon: string; bg: string }
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const stamp = getPerformanceStamp(title)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardLayout padding="NONE" showShadow={true}>
        <div className="p-4 cursor-grab active:cursor-grabbing">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white flex-shrink-0">
                <Icon icon={stamp.icon} size="MEDIUM" />
              </div>
              <div className="flex-1">
                <HeadingField text={title} size="MEDIUM" marginBelow="NONE" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-gray-900">
                {Math.round((50 - data[data.length - 1][1]) * 10)}{unit}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↗' : '↘'}
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-32 relative group">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <defs>
              <linearGradient id={`lineGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id={`areaGradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <g stroke="#e2e8f0" strokeWidth="0.1" opacity="0.5">
              {[10, 20, 30, 40].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} />
              ))}
              {[20, 40, 60, 80].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="50" />
              ))}
            </g>
            
            {/* Area under curve */}
            <path
              d={`M ${data.map(([x, y]) => `${x},${y}`).join(' L ')} L 100,50 L 0,50 Z`}
              fill={`url(#areaGradient-${id})`}
            />
            
            {/* Line */}
            <path
              d={`M ${data.map(([x, y]) => `${x},${y}`).join(' L ')}`}
              stroke={`url(#lineGradient-${id})`}
              strokeWidth="1.5"
              fill="none"
            />
            
            {/* Data points */}
            {data.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            ))}
          </svg>
        </div>
      </CardLayout>
    </div>
  )
}

function PerformanceDashboard() {
  const generateLineData = (trend: 'up' | 'down') => {
    const baseData = Array.from({ length: 11 }, (_, i) => [i * 10, 0])
    
    if (trend === 'up') {
      // Upward trending line
      return baseData.map(([x], i) => [
        x,
        35 - (i * 2) + Math.random() * 4 - 2 // Start high, trend down (inverted Y axis)
      ])
    } else {
      // Downward trending line  
      return baseData.map(([x], i) => [
        x,
        15 + (i * 2) + Math.random() * 4 - 2 // Start low, trend up (inverted Y axis)
      ])
    }
  }

  const getPerformanceStamp = (title: string) => {
    const stampConfig = {
      'Cost': { icon: 'DollarSign', bg: '#F2B3D1' },
      'Latency': { icon: 'Clock', bg: '#D4B5E8' },
      'Requests': { icon: 'Activity', bg: '#9DD2E8' },
      'API Failures': { icon: 'AlertTriangle', bg: '#9DDAC7' },
      'Input Tokens': { icon: 'ArrowDown', bg: '#9BB1D6' },
      'Output Tokens': { icon: 'ArrowUp', bg: '#F2B3D1' },
      'Uncertainty': { icon: 'HelpCircle', bg: '#D4B5E8' }
    }
    
    return stampConfig[title as keyof typeof stampConfig] || { icon: 'BarChart3', bg: '#9DD2E8' }
  }

  const blueColor = '#6366f1'

  const initialCards = [
    { id: 'cost', title: 'Cost', data: generateLineData('up'), color: blueColor, unit: '$', change: 5.2 },
    { id: 'latency', title: 'Latency', data: generateLineData('down'), color: blueColor, unit: 'ms', change: -3.1 },
    { id: 'requests', title: 'Requests', data: generateLineData('up'), color: blueColor, unit: 'req/min', change: 8.7 },
    { id: 'api-failures', title: 'API Failures', data: generateLineData('down'), color: blueColor, unit: '%', change: -2.4 },
    { id: 'input-tokens', title: 'Input Tokens', data: generateLineData('up'), color: blueColor, unit: 'tokens', change: 12.3 },
    { id: 'output-tokens', title: 'Output Tokens', data: generateLineData('up'), color: blueColor, unit: 'tokens', change: 7.8 },
    { id: 'uncertainty', title: 'Uncertainty', data: generateLineData('down'), color: blueColor, unit: '%', change: -1.9 }
  ]

  const [cards, setCards] = useState(initialCards)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              title={card.title}
              data={card.data}
              color={card.color}
              unit={card.unit}
              change={card.change}
              getPerformanceStamp={getPerformanceStamp}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}


interface TabsInterfaceProps {
  activeSection: string
  cardStyle?: 'white' | 'glass' | 'greyscale'
  onSectionChange?: (section: string) => void
  appMode?: 'v1' | 'v2' | 'future' | 'revised' | 'revised-v2'
}

export default function TabsInterface({ activeSection, cardStyle = 'glass', onSectionChange, appMode = 'future' }: TabsInterfaceProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [chartHover, setChartHover] = useState<{x: number, y: number, yCoord: number, value: number} | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const performanceRef = useRef<HTMLButtonElement>(null)
  const configurationRef = useRef<HTMLButtonElement>(null)
  const observePerformanceRef = useRef<HTMLButtonElement>(null)
  const observeEventsRef = useRef<HTMLButtonElement>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [observeUnderlineStyle, setObserveUnderlineStyle] = useState({ left: 0, width: 0 })
  const [timeRange, setTimeRange] = useState('1D')
  const [wizardStep, setWizardStep] = useState(1)
  const [protectTab, setProtectTab] = useState<'performance' | 'configuration'>('configuration')
  const [observeTab, setObserveTab] = useState<'performance' | 'events'>('performance')
  const [evaluateCallTab, setEvaluateCallTab] = useState<'general' | 'evals'>('general')
  const [selectedRevisedGuardrail, setSelectedRevisedGuardrail] = useState<string | null>(null)
  const [selectedRevisedV1Guardrail, setSelectedRevisedV1Guardrail] = useState<string | null>(null)
  const [scrollState, setScrollState] = useState({ top: true, bottom: false })
  const [protectScrolled, setProtectScrolled] = useState(false)
  const [observeScrolled, setObserveScrolled] = useState(false)
  const [selectedCall, setSelectedCall] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const activeRef = protectTab === 'performance' ? performanceRef : configurationRef
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [protectTab])

  useEffect(() => {
    const activeRef = observeTab === 'performance' ? observePerformanceRef : observeEventsRef
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current
      setObserveUnderlineStyle({ left: offsetLeft, width: offsetWidth })
    }
  }, [observeTab])

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
      setObserveScrolled((window.pageYOffset || document.documentElement.scrollTop) > 0)
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
    // In V1/V2 mode, force to protect section
    const currentSection = appMode === 'v1' || appMode === 'v2' ? 'protect' : activeSection
    
    switch (currentSection) {
      case 'home':
        const homeHeaderBg = cardStyle === 'glass' ? 'bg-white/50 backdrop-blur-md border-white' : 'bg-white border-gray-200'
        return (
          <div className="h-full w-full" style={{ background: 'transparent' }}>
            <style>{getCardStyles(cardStyle)}</style>
            <div className={`sticky top-0 z-10 ${homeHeaderBg} border-b px-8 py-4 flex flex-col justify-center transition-shadow duration-300 ${cardStyle === 'glass' ? 'shadow-none' : ''}`} style={{ borderRadius: 0, minHeight: '140px' }}>
              <div className="flex justify-between items-center" style={{ minHeight: '48px' }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👋</span>
                  <h1 className="text-2xl font-bold text-left mt-0 mb-0 text-black">
                    Hello Alex
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="mt-6 px-20">
              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 bg-transparent opacity-100 border-0">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg p-3 flex items-center justify-center border border-white" style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)'
                      }}>
                        <Icon icon="DollarSign" size="MEDIUM" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-normal text-left mt-0 mb-0 text-white">Cost</h3>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="text-4xl font-bold text-white">$12,450</div>
                          <div className="bg-blue-900 px-2 py-1 rounded-md flex items-center gap-1">
                            <TrendingDown size={14} className="text-white" />
                            <span className="text-white text-sm font-medium">8.2%</span>
                          </div>
                        </div>
                        <div className="text-white uppercase text-sm tracking-wider">Current Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,45 C20,38 30,32 50,30 C70,28 80,22 100,20 C120,18 130,16 150,18 C170,20 180,8 200,5" 
                            fill="none" stroke="white" strokeWidth="2" />
                      <path d="M0,45 C20,38 30,32 50,30 C70,28 80,22 100,20 C120,18 130,16 150,18 C170,20 180,8 200,5 L200,60 L0,60 Z" 
                            fill="url(#costGradient)" />
                    </svg>
                  </div>
                </div>
                
                <div className="bg-orange-500 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 bg-transparent opacity-100 border-0">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg p-3 flex items-center justify-center border border-white" style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)'
                      }}>
                        <Icon icon="Shield" size="MEDIUM" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-normal text-left mt-0 mb-0 text-white">Guardrail Hits</h3>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="text-4xl font-bold text-white">247</div>
                          <div className="bg-orange-800 px-2 py-1 rounded-md flex items-center gap-1">
                            <TrendingDown size={14} className="text-white" />
                            <span className="text-white text-sm font-medium">12.5%</span>
                          </div>
                        </div>
                        <div className="text-white uppercase text-sm tracking-wider">Last 24 Hours</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="guardrailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,35 C25,28 35,22 50,20 C65,18 75,12 100,15 C125,18 135,28 150,30 C175,32 185,28 200,25" 
                            fill="none" stroke="white" strokeWidth="2" />
                      <path d="M0,35 C25,28 35,22 50,20 C65,18 75,12 100,15 C125,18 135,28 150,30 C175,32 185,28 200,25 L200,60 L0,60 Z" 
                            fill="url(#guardrailGradient)" />
                    </svg>
                  </div>
                </div>
                
                <div className="bg-teal-500 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 bg-transparent opacity-100 border-0">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg p-3 flex items-center justify-center border border-white" style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)'
                      }}>
                        <Icon icon="FileText" size="MEDIUM" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-normal text-left mt-0 mb-0 text-white">Requirements</h3>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="text-4xl font-bold text-white">18</div>
                          <div className="bg-teal-900 px-2 py-1 rounded-md flex items-center gap-1">
                            <TrendingDown size={14} className="text-white" />
                            <span className="text-white text-sm font-medium">3.1%</span>
                          </div>
                        </div>
                        <div className="text-white uppercase text-sm tracking-wider">Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="requirementsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,40 C25,37 35,34 50,32 C70,30 80,27 100,25 C120,23 130,21 150,20 C170,19 180,17 200,15" 
                            fill="none" stroke="white" strokeWidth="2" />
                      <path d="M0,40 C25,37 35,34 50,32 C70,30 80,27 100,25 C120,23 130,21 150,20 C170,19 180,17 200,15 L200,60 L0,60 Z" 
                            fill="url(#requirementsGradient)" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Navigation Cards */}
              <div className="space-y-4">
                <div 
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg shadow-md p-6 relative group"
                  onClick={() => onSectionChange?.('protect')}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                      background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.1) 100%)',
                      borderColor: '#22c55e'
                    }}>
                      <Icon icon="Shield" size="MEDIUM" />
                    </div>
                    <div className="flex-1">
                      <HeadingField text="Protect" size="MEDIUM" marginBelow="LESS" />
                      <p className="text-gray-700">Safeguard your AI systems with comprehensive security measures and guardrails to prevent unauthorized access and misuse.</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
                        Go to Protect
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg shadow-md p-6 relative group"
                  onClick={() => onSectionChange?.('monitor')}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                      background: 'linear-gradient(to bottom, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0.1) 100%)',
                      borderColor: '#a855f7'
                    }}>
                      <Icon icon="CheckCircle" size="MEDIUM" />
                    </div>
                    <div className="flex-1">
                      <HeadingField text="Evaluate" size="MEDIUM" marginBelow="LESS" />
                      <p className="text-gray-700">Assess and measure AI model performance, accuracy, and compliance with established standards and requirements.</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
                        Go to Evaluate
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg shadow-md p-6 relative group"
                  onClick={() => onSectionChange?.('observe')}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                      background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.1) 100%)',
                      borderColor: '#ef4444'
                    }}>
                      <Icon icon="Eye" size="MEDIUM" />
                    </div>
                    <div className="flex-1">
                      <HeadingField text="Observe" size="MEDIUM" marginBelow="LESS" />
                      <p className="text-gray-700">Monitor AI system behavior in real-time, track metrics, and gain insights into usage patterns and anomalies.</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
                        Go to Observe
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'protect':
        const headerBg = cardStyle === 'glass' ? 'bg-white/50 backdrop-blur-md border-white' : 'bg-white border-gray-200'
        return (
          <div className="h-full w-full" style={{ background: 'transparent' }}>
            <style>{getCardStyles(cardStyle)}</style>
            {selectedGuardrail === null && (
            <div className={`sticky top-0 z-10 ${headerBg} border-b px-8 py-4 flex flex-col justify-center transition-shadow duration-300 ${protectScrolled ? 'shadow-[0_8px_16px_-8px_rgba(0,0,0,0.08)]' : ''} ${cardStyle === 'glass' ? 'shadow-none' : ''}`} style={{ borderRadius: 0, minHeight: '140px' }}>
              {appMode === 'v2' && (
                <div className="relative flex gap-8 mb-4 border-b border-white/30">
                  <button
                    ref={performanceRef}
                    onClick={() => setProtectTab('performance')}
                    className={`px-2 py-2 transition-colors font-medium ${
                      protectTab === 'performance'
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
                      protectTab === 'configuration'
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
              )}
              <div className="flex justify-between items-center" style={{ minHeight: '48px' }}>
                <HeadingField text={(appMode === 'v1' || appMode === 'future' || protectTab === 'configuration') ? "Guardrail Configuration" : "Guardrail Performance"} size="LARGE" marginBelow="NONE" />
                {protectTab === 'performance' && appMode === 'v2' ? (
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
                ) : (appMode === 'v1' || protectTab === 'configuration') ? (
                  <ButtonWidget
                    label="+ Add Guardrails"
                    style="SOLID"
                    color="ACCENT"
                    size="STANDARD"
                    onClick={() => setShowModal(true)}
                  />
                ) : null}
              </div>
            </div>
            )}
            {protectTab === 'performance' && appMode === 'v2' ? (
              <div key="performance-content" className="mt-6" style={{ background: 'transparent' }}>
                      
                      <div className="grid grid-cols-[3fr_1fr] gap-4 px-20 min-h-[calc(100vh-200px)]" style={{ background: 'transparent' }}>
                        <div className="space-y-0" style={{ background: 'transparent' }}>
                          <div className="grid grid-cols-2 gap-4 items-stretch" style={{ background: 'transparent' }}>
                        {/* Total Guardrail Hits */}
                        <CardLayout padding="MORE" showShadow={true}>
                          <div className="h-full flex items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
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
                          <div className="flex items-center gap-3 flex-1">
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
                        <div className="flex items-center gap-3">
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
                          <div className="flex items-center gap-3 mb-4">
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
                          <div className="flex items-center gap-3 mb-4">
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
              // V1/Future: only configuration, V2: show based on selected tab, Revised: show new guardrail config
              (appMode === 'v1' || appMode === 'future' || protectTab === 'configuration') && appMode !== 'revised' ? (
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
            ) : appMode === 'revised' ? (
              <div key="revised-config" className="mt-6 px-20" style={{ background: 'transparent' }}>
                <div className="space-y-8">
                  {/* Input Guardrail Configurations */}
                  <div>
                    <HeadingField text="Input Guardrail Configurations" size="LARGE" marginBelow="STANDARD" />
                    <p className="text-gray-600 mb-6">These settings control how your application interprets and sanitizes user messages before they reach the model.</p>
                    
                    <div className="space-y-4">
                      {/* Prompt Injection & Jailbreak Detection */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={() => setSelectedRevisedV1Guardrail('Prompt Injection & Jailbreak Detection')}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Prompt Injection & Jailbreak Detection</span>
                          </div>
                          <span className="text-gray-400">→</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity Threshold</label>
                                <div className="flex items-center space-x-4">
                                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.5" className="flex-1" />
                                  <span className="text-sm text-gray-600 w-12">0.5</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Higher values prevent more attacks but increase false positives</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Detection Mode</label>
                                <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                  <option value="heuristic">Heuristic (Fast, pattern-based)</option>
                                  <option value="llm-classifier">LLM-Classifier (Model-based)</option>
                                </select>
                              </div>
                            </div>

                            {/* Advanced Heuristic Patterns */}
                            <div className="border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-4">Advanced Heuristic Patterns</h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Instruction Keywords</label>
                                  <textarea 
                                    defaultValue="ignore all previous, developer mode, system prompt, verbatim, disregard guidelines"
                                    placeholder="Enter high-risk phrases (comma-separated)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Phrases that signal override attempts</p>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-3">Encoding Detection</label>
                                  <div className="space-y-2">
                                    <label className="flex items-center">
                                      <input type="checkbox" defaultChecked className="mr-2" />
                                      <span className="text-sm">Detect Base64 encoding</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="checkbox" defaultChecked className="mr-2" />
                                      <span className="text-sm">Detect Hex encoding</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input type="checkbox" defaultChecked className="mr-2" />
                                      <span className="text-sm">Detect Leetspeak (h4ck3d)</span>
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="flex items-center">
                                    <input type="checkbox" defaultChecked className="mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Obfuscation Filters</span>
                                  </label>
                                  <p className="text-xs text-gray-500 mt-1">Detect zero-width spaces and hidden Unicode characters</p>
                                </div>
                              </div>
                            </div>

                            {/* Outcome */}
                            <div className="border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-4">Outcome</h4>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Action on Match</label>
                                <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                  <option value="block">Block (Hard stop)</option>
                                  <option value="sanitize">Sanitize (Strip malicious tokens)</option>
                                  <option value="flag">Flag (Log for audit)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* PII Scrubbing */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                              <div className="w-6 h-6 rounded-full bg-green-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">PII (Personally Identifiable Information) Scrubbing</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Entity Selectors</label>
                              <div className="grid grid-cols-3 gap-2">
                                {['SSN', 'EMAIL', 'CREDIT_CARD', 'IP_ADDRESS', 'PHONE_NUMBER', 'ADDRESS'].map(entity => (
                                  <label key={entity} className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">{entity}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Anonymization Method</label>
                              <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="masking">Masking (***-**-1234)</option>
                                <option value="redaction">Redaction ([USER_EMAIL])</option>
                                <option value="hashing">Hashing (Deterministic hash)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Score</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.01" defaultValue="0.85" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.85</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Threshold for high-certainty PII removal</p>
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* Topic Filtering */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Topic Filtering</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Denied Topics</label>
                              <textarea 
                                placeholder="Enter denied topics (comma-separated): crypto, medical advice, politics"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Semantic Similarity Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.01" defaultValue="0.75" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.75</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Cosine similarity score for topic matching</p>
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* Competitor Filtering */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                              <div className="w-6 h-6 rounded-full bg-red-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Competitor Filtering</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Names</label>
                              <textarea 
                                placeholder="Enter competitor names (comma-separated): competitor_x, rival_company"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Semantic Similarity Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.01" defaultValue="0.80" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.80</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Cosine similarity score for competitor matching</p>
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* Profanity Filtering */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                              <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Profanity Filtering</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                              <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="low">Low (Basic profanity)</option>
                                <option value="medium">Medium (Moderate profanity)</option>
                                <option value="high">High (All profanity)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Action on Match</label>
                              <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="block">Block (Hard stop)</option>
                                <option value="replace">Replace with asterisks</option>
                                <option value="flag">Flag (Log for audit)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Word List</label>
                              <textarea 
                                placeholder="Enter additional words to filter (comma-separated)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-16"
                              />
                            </div>
                          </div>
                        </div>
                      </CardLayout>
                    </div>
                  </div>

                  {/* Output Guardrail Configurations */}
                  <div>
                    <HeadingField text="Output Guardrail Configurations" size="LARGE" marginBelow="STANDARD" />
                    <p className="text-gray-600 mb-6">These ensure the model's response adheres to your business rules and safety standards.</p>
                    
                    <div className="space-y-4">
                      {/* Hallucination & Grounding Checks */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                              <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Hallucination & Grounding Checks (RAG)</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Grounding Threshold</label>
                              <input type="number" min="0" max="1" step="0.1" defaultValue="0.7" className="w-32 px-3 py-2 border border-gray-300 rounded-md" />
                              <p className="text-xs text-gray-500 mt-1">Score representing answer support by retrieved documents</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">NLI Logic</label>
                              <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="entails">Entails (Proves)</option>
                                <option value="neutral">Neutral</option>
                                <option value="contradicts">Contradicts</option>
                              </select>
                            </div>
                            <div>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm font-medium text-gray-700">Citations Requirement</span>
                              </label>
                              <p className="text-xs text-gray-500 mt-1">Force model to provide source links for every claim</p>
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* Toxicity & Sentiment Enforcement */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100">
                              <div className="w-6 h-6 rounded-full bg-pink-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Toxicity & Sentiment Enforcement</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Levels</label>
                              <div className="grid grid-cols-2 gap-4">
                                {['Hate', 'Sexual', 'Violence', 'Self-Harm'].map(category => (
                                  <div key={category}>
                                    <label className="block text-sm text-gray-600 mb-1">{category}</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Target Tone</label>
                              <select className="w-48 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="neutral">Neutral</option>
                                <option value="positive">Positive</option>
                                <option value="professional">Professional</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tolerance Range</label>
                              <input type="number" min="0" max="1" step="0.1" defaultValue="0.2" className="w-32 px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </CardLayout>

                      {/* Structural & Format Validation */}
                      <CardLayout padding="MORE" showShadow={true}>
                        <button 
                          className="w-full text-left flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling as HTMLElement
                            const icon = e.currentTarget.querySelector('.expand-icon') as HTMLElement
                            content.classList.toggle('hidden')
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100">
                              <div className="w-6 h-6 rounded-full bg-teal-500"></div>
                            </div>
                            <span className="font-medium text-gray-900">Structural & Format Validation</span>
                          </div>
                          <span className="expand-icon transition-transform duration-200">▶</span>
                        </button>
                        <div className="hidden pt-4 border-t border-gray-100 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Schema Enforcement</label>
                              <textarea 
                                placeholder="Enter JSON Schema or validation rules"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 font-mono text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Retry Limit</label>
                              <input type="number" min="1" max="10" defaultValue="3" className="w-32 px-3 py-2 border border-gray-300 rounded-md" />
                              <p className="text-xs text-gray-500 mt-1">Number of retry attempts for failed validation</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Token Limit</label>
                                <input type="number" min="1" defaultValue="10" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Token Limit</label>
                                <input type="number" min="1" defaultValue="2000" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardLayout>
                    </div>
                  </div>
                </div>
              </div>
            ) : appMode === 'revised-v2' ? (
              selectedRevisedGuardrail ? (
                <div key="revised-v2-detail" className="mt-6" style={{ background: 'transparent' }}>
                  <div className="grid grid-cols-[1fr_1fr] gap-6 px-20 min-h-[calc(100vh-200px)]">
                    {/* Left Pane - Configuration */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-6">
                        <button 
                          onClick={() => setSelectedRevisedGuardrail(null)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          ← Back to Guardrails
                        </button>
                        <HeadingField text={selectedRevisedGuardrail} size="LARGE" marginBelow="NONE" />
                      </div>
                      
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Configuration" size="MEDIUM" marginBelow="STANDARD" />
                        {selectedRevisedGuardrail === 'Prompt Injection & Jailbreak Detection' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.5" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.5</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Detection Mode</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="heuristic">Heuristic (Fast, pattern-based)</option>
                                <option value="llm-classifier">LLM-Classifier (Model-based)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Action on Match</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="block">Block (Hard stop)</option>
                                <option value="sanitize">Sanitize (Strip malicious tokens)</option>
                                <option value="flag">Flag (Log for audit)</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'PII Scrubbing' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Entity Selectors</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['SSN', 'EMAIL', 'CREDIT_CARD', 'IP_ADDRESS', 'PHONE_NUMBER', 'ADDRESS'].map(entity => (
                                  <label key={entity} className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">{entity}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Anonymization Method</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="masking">Masking (***-**-1234)</option>
                                <option value="redaction">Redaction ([USER_EMAIL])</option>
                                <option value="hashing">Hashing (Deterministic hash)</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Topic Filtering' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Denied Topics</label>
                              <textarea 
                                placeholder="Enter denied topics (comma-separated): crypto, medical advice, politics"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Semantic Similarity Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.01" defaultValue="0.75" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.75</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Competitor Filtering' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Names</label>
                              <textarea 
                                placeholder="Enter competitor names (comma-separated): competitor_x, rival_company"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Semantic Similarity Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.01" defaultValue="0.80" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.80</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Profanity Filtering' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="low">Low (Basic profanity)</option>
                                <option value="medium">Medium (Moderate profanity)</option>
                                <option value="high">High (All profanity)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Action on Match</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="block">Block (Hard stop)</option>
                                <option value="replace">Replace with asterisks</option>
                                <option value="flag">Flag (Log for audit)</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Hallucination & Grounding Checks' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Grounding Threshold</label>
                              <div className="flex items-center space-x-4">
                                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="flex-1" />
                                <span className="text-sm text-gray-600 w-12">0.7</span>
                              </div>
                            </div>
                            <div>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm font-medium text-gray-700">Citations Requirement</span>
                              </label>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Toxicity & Sentiment Enforcement' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Levels</label>
                              <div className="grid grid-cols-2 gap-4">
                                {['Hate', 'Sexual', 'Violence', 'Self-Harm'].map(category => (
                                  <div key={category}>
                                    <label className="block text-sm text-gray-600 mb-1">{category}</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedRevisedGuardrail === 'Structural & Format Validation' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Schema Enforcement</label>
                              <textarea 
                                placeholder="Enter JSON Schema or validation rules"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 font-mono text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Retry Limit</label>
                              <input type="number" min="1" max="10" defaultValue="3" className="w-32 px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                          </div>
                        )}
                        {/* Add other guardrail configurations as needed */}
                      </CardLayout>
                    </div>
                    
                    {/* Right Pane - Testing */}
                    <div className="space-y-6">
                      <HeadingField text="Test Configuration" size="LARGE" marginBelow="STANDARD" />
                      
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Input Test" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Test Input</label>
                            <textarea 
                              placeholder="Enter test input to validate against this guardrail..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                            />
                          </div>
                          <ButtonWidget
                            label="Test Guardrail"
                            style="SOLID"
                            color="ACCENT"
                            size="STANDARD"
                          />
                        </div>
                      </CardLayout>
                      
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Test Results" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="bg-gray-50 rounded-lg p-4 min-h-32">
                          <p className="text-gray-500 text-sm">Test results will appear here...</p>
                        </div>
                      </CardLayout>
                    </div>
                  </div>
                </div>
              ) : (
                <div key="revised-v2-cards" className="mt-6 px-20" style={{ background: 'transparent' }}>
                  <div className="space-y-8">
                    {/* Input Guardrail Configurations */}
                    <div>
                      <HeadingField text="Input Guardrail Configurations" size="LARGE" marginBelow="STANDARD" />
                      <p className="text-gray-600 mb-6">These settings control how your application interprets and sanitizes user messages before they reach the model.</p>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'Prompt Injection & Jailbreak Detection', description: 'Detect and prevent prompt injection attacks and jailbreak attempts', color: 'blue' },
                          { name: 'PII Scrubbing', description: 'Identify and anonymize personally identifiable information', color: 'green' },
                          { name: 'Topic Filtering', description: 'Filter content based on denied topics and themes', color: 'purple' },
                          { name: 'Competitor Filtering', description: 'Block mentions of competitor names and brands', color: 'orange' },
                          { name: 'Profanity Filtering', description: 'Detect and handle profane language and inappropriate content', color: 'red' }
                        ].map((guardrail, index) => (
                          <CardLayout key={index} padding="MORE" showShadow={true}>
                            <div 
                              className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
                              onClick={() => setSelectedRevisedGuardrail(guardrail.name)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${guardrail.color}-100`}>
                                  <div className={`w-6 h-6 rounded-full bg-${guardrail.color}-500`}></div>
                                </div>
                                <div className="flex-1">
                                  <HeadingField text={guardrail.name} size="MEDIUM" marginBelow="LESS" />
                                  <p className="text-gray-600">{guardrail.description}</p>
                                </div>
                                <div className="text-gray-400">
                                  →
                                </div>
                              </div>
                            </div>
                          </CardLayout>
                        ))}
                      </div>
                    </div>

                    {/* Output Guardrail Configurations */}
                    <div>
                      <HeadingField text="Output Guardrail Configurations" size="LARGE" marginBelow="STANDARD" />
                      <p className="text-gray-600 mb-6">These ensure the model's response adheres to your business rules and safety standards.</p>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'Hallucination & Grounding Checks', description: 'Verify model responses against source documents and prevent hallucinations', color: 'indigo' },
                          { name: 'Toxicity & Sentiment Enforcement', description: 'Monitor and control response tone and toxicity levels', color: 'pink' },
                          { name: 'Structural & Format Validation', description: 'Ensure responses meet structural and formatting requirements', color: 'teal' }
                        ].map((guardrail, index) => (
                          <CardLayout key={index} padding="MORE" showShadow={true}>
                            <div 
                              className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
                              onClick={() => setSelectedRevisedGuardrail(guardrail.name)}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${guardrail.color}-100`}>
                                  <div className={`w-6 h-6 rounded-full bg-${guardrail.color}-500`}></div>
                                </div>
                                <div className="flex-1">
                                  <HeadingField text={guardrail.name} size="MEDIUM" marginBelow="LESS" />
                                  <p className="text-gray-600">{guardrail.description}</p>
                                </div>
                                <div className="text-gray-400">
                                  →
                                </div>
                              </div>
                            </div>
                          </CardLayout>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : null
            )}
          </div>
        )
      
      case 'monitor':
        const evaluateHeaderBg = cardStyle === 'glass' ? 'bg-white/50 backdrop-blur-md border-white' : 'bg-white border-gray-200'
        return (
          <div className="h-full w-full" style={{ background: 'transparent' }}>
            <style>{getCardStyles(cardStyle)}</style>
            <div className={`sticky top-0 z-10 ${evaluateHeaderBg} border-b px-8 py-4 flex flex-col justify-center transition-shadow duration-300 ${observeScrolled ? 'shadow-[0_8px_16px_-8px_rgba(0,0,0,0.08)]' : ''} ${cardStyle === 'glass' ? 'shadow-none' : ''}`} style={{ borderRadius: 0, minHeight: '140px' }}>
              {selectedCall && (
                <div className="mb-2">
                  <button 
                    onClick={() => setSelectedCall(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    ← Back to AI Calls
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ minHeight: '48px' }}>
                <div className="flex items-center gap-3">
                  <HeadingField text={selectedCall ? selectedCall.callId : "System Events"} size="LARGE" marginBelow="NONE" />
                  {selectedCall && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedCall.status === 'Success' ? 'bg-green-100 text-green-800' :
                      selectedCall.status === 'Error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCall.status}
                    </span>
                  )}
                </div>
                {!selectedCall && (
                  <ButtonWidget
                    label="+ Add Evaluation Metric"
                    style="SOLID"
                    color="ACCENT"
                    size="STANDARD"
                  />
                )}
              </div>
              {selectedCall && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <TagField
                    tags={[{ text: "Relevance: 85%", backgroundColor: "SECONDARY" }]}
                    size="SMALL"
                    marginBelow="NONE"
                  />
                  <TagField
                    tags={[{ text: "Accuracy: 94%", backgroundColor: "SECONDARY" }]}
                    size="SMALL"
                    marginBelow="NONE"
                  />
                  <TagField
                    tags={[{ text: "Helpfulness: 90%", backgroundColor: "SECONDARY" }]}
                    size="SMALL"
                    marginBelow="NONE"
                  />
                  <TagField
                    tags={[{ text: "Clarity: 88%", backgroundColor: "SECONDARY" }]}
                    size="SMALL"
                    marginBelow="NONE"
                  />
                  <TagField
                    tags={[{ text: "Safety: Pass", backgroundColor: "POSITIVE" }]}
                    size="SMALL"
                    marginBelow="NONE"
                  />
                </div>
              )}
              {selectedCall && (
                <div className="relative flex gap-8 border-b border-white/30 -mb-4 pb-0">
                  <button
                    onClick={() => setEvaluateCallTab('general')}
                    className={`px-2 py-2 transition-colors font-medium ${
                      evaluateCallTab === 'general'
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setEvaluateCallTab('evals')}
                    className={`px-2 py-2 transition-colors font-medium ${
                      evaluateCallTab === 'evals'
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Evals
                  </button>
                  <div 
                    className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out"
                    style={{
                      left: evaluateCallTab === 'general' ? '8px' : '88px',
                      width: evaluateCallTab === 'general' ? '56px' : '40px'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="px-20 py-6">
              {selectedCall ? (
                evaluateCallTab === 'general' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                      {/* Input/Output Panel */}
                      <div className="space-y-6">
                        <CardLayout padding="MORE" showShadow={true}>
                          <HeadingField text="Input" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                            {selectedCall.input}
                          </div>
                        </CardLayout>
                        
                        <CardLayout padding="MORE" showShadow={true}>
                          <HeadingField text="Output" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                            {selectedCall.output}
                          </div>
                        </CardLayout>
                      </div>
                      
                      {/* Call Data Panel */}
                      <div className="space-y-4">
                        <CardLayout padding="MORE" showShadow={true}>
                          <HeadingField text="Call Metrics" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Latency:</span>
                              <span className="font-medium">{selectedCall.latency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cost:</span>
                              <span className="font-medium">{selectedCall.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tokens:</span>
                              <span className="font-medium">{selectedCall.tokens}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accuracy:</span>
                              <span className="font-medium">{(selectedCall.accuracy * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </CardLayout>
                        
                        <CardLayout padding="MORE" showShadow={true}>
                          <HeadingField text="Content Analysis" size="MEDIUM" marginBelow="STANDARD" />
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Input Toxicity:</span>
                              <span className="font-medium">{(selectedCall.inputToxicity * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Output Toxicity:</span>
                              <span className="font-medium">{(selectedCall.outputToxicity * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Input PII:</span>
                              <span className="font-medium">{selectedCall.inputPII}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Output PII:</span>
                              <span className="font-medium">{selectedCall.outputPII}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Input Tone:</span>
                              <span className="font-medium">{selectedCall.inputTone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Output Tone:</span>
                              <span className="font-medium">{selectedCall.outputTone}</span>
                            </div>
                          </div>
                        </CardLayout>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <HeadingField text="Evaluation Metrics" size="MEDIUM" marginBelow="NONE" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Metric</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI Value</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI Explanation</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actual Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { metric: 'Relevance', aiValue: '85%', explanation: 'Response directly addresses the user query with comprehensive information', actualValue: '' },
                              { metric: 'Accuracy', aiValue: '94%', explanation: 'Information provided is factually correct based on training data', actualValue: '' },
                              { metric: 'Helpfulness', aiValue: '90%', explanation: 'Response provides actionable guidance and clear examples', actualValue: '' },
                              { metric: 'Clarity', aiValue: '88%', explanation: 'Language is clear and appropriate for the target audience', actualValue: '' },
                              { metric: 'Safety', aiValue: 'Pass', explanation: 'No harmful, biased, or inappropriate content detected', actualValue: '' }
                            ].map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.metric}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.aiValue}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{row.explanation}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {row.metric === 'Safety' ? (
                                    <select className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                      <option value="">Select value</option>
                                      <option value="pass">Pass</option>
                                      <option value="fail">Fail</option>
                                    </select>
                                  ) : (
                                    <div className="flex items-center">
                                      <input 
                                        type="number" 
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        placeholder="Enter percentage"
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <span className="ml-1 text-gray-500">%</span>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {/* Evaluation Metrics Overview */}
                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                          background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.1) 100%)',
                          borderColor: '#22c55e'
                        }}>
                          <Icon icon="Target" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                          <HeadingField text="Relevance" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-2xl font-bold text-gray-900">88%</div>
                          <p className="text-gray-600 text-sm">AI Accuracy</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.1) 100%)',
                          borderColor: '#3b82f6'
                        }}>
                          <Icon icon="CheckCircle" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                          <HeadingField text="Accuracy" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-2xl font-bold text-gray-900">92%</div>
                          <p className="text-gray-600 text-sm">AI Accuracy</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                          background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0.1) 100%)',
                          borderColor: '#8b5cf6'
                        }}>
                          <Icon icon="Heart" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                          <HeadingField text="Helpfulness" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-2xl font-bold text-gray-900">97%</div>
                          <p className="text-gray-600 text-sm">AI Accuracy</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                          background: 'linear-gradient(to bottom, rgba(249, 115, 22, 0.6) 0%, rgba(249, 115, 22, 0.1) 100%)',
                          borderColor: '#f97316'
                        }}>
                          <Icon icon="Eye" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                          <HeadingField text="Clarity" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-2xl font-bold text-gray-900">93%</div>
                          <p className="text-gray-600 text-sm">AI Accuracy</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 flex items-center justify-center border" style={{
                          background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.1) 100%)',
                          borderColor: '#ef4444'
                        }}>
                          <Icon icon="Shield" size="MEDIUM" />
                        </div>
                        <div className="flex-1">
                          <HeadingField text="Safety" size="MEDIUM" marginBelow="LESS" />
                          <div className="text-2xl font-bold text-gray-900">98%</div>
                          <p className="text-gray-600 text-sm">AI Accuracy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <HeadingField text="AI Calls" size="MEDIUM" marginBelow="NONE" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Call ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Object</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Tokens</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Latency</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Cost</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Evals</th>                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { 
                              timestamp: '2024-12-18 13:25:42', 
                              callId: 'call-001-xyz', 
                              model: 'CO_Agent_Customer_Onboarding', 
                              user: 'john.smith', 
                              status: 'Success', 
                              tokens: 1247, 
                              latency: '245ms', 
                              cost: '$0.024',
                              input: 'Can you help me write a professional email to schedule a meeting with our client about the quarterly review?',
                              output: 'I\'d be happy to help you write a professional email for scheduling a client meeting. Here\'s a draft:\n\nSubject: Quarterly Review Meeting - [Client Name]\n\nDear [Client Name],\n\nI hope this email finds you well. As we approach the end of the quarter, I would like to schedule our quarterly review meeting to discuss your account performance, upcoming initiatives, and address any questions you may have.\n\nWould you be available for a meeting during the week of [Date Range]? I\'m flexible with timing and can accommodate your schedule. The meeting should take approximately 60 minutes and can be conducted either in-person at your office or via video conference, whichever you prefer.\n\nPlease let me know your availability, and I\'ll send a calendar invitation with the agenda.\n\nThank you for your continued partnership.\n\nBest regards,\n[Your Name]',
                              accuracy: 0.94,
                              inputToxicity: 0.02,
                              outputToxicity: 0.01,
                              inputPII: 'None',
                              outputPII: 'Template placeholders',
                              inputTone: 'Professional',
                              outputTone: 'Professional'
                            },
                            { 
                              timestamp: '2024-12-18 13:24:18', 
                              callId: 'call-002-abc', 
                              model: 'DR_Agent_Document_Review', 
                              user: 'jane.doe', 
                              status: 'Success', 
                              tokens: 892, 
                              latency: '189ms', 
                              cost: '$0.018',
                              input: 'Explain the concept of machine learning in simple terms for a beginner.',
                              output: 'Machine learning is like teaching a computer to recognize patterns and make predictions, similar to how humans learn from experience.\n\nImagine you\'re learning to recognize different dog breeds. At first, you might not know the difference between a Golden Retriever and a Labrador. But after seeing many examples of each breed with their names, you start to notice patterns - Golden Retrievers tend to have longer, fluffier coats, while Labs have shorter, denser fur.\n\nMachine learning works similarly:\n\n1. **Training**: We show the computer thousands of examples (like photos of dogs with breed labels)\n2. **Pattern Recognition**: The computer finds patterns in the data that humans might miss\n3. **Prediction**: When shown a new photo, the computer can predict the breed based on learned patterns\n\nThis same principle applies to many applications: email spam detection, recommendation systems, voice recognition, and medical diagnosis. The computer learns from data to make intelligent decisions without being explicitly programmed for every possible scenario.',
                              accuracy: 0.97,
                              inputToxicity: 0.01,
                              outputToxicity: 0.00,
                              inputPII: 'None',
                              outputPII: 'None',
                              inputTone: 'Neutral',
                              outputTone: 'Educational'
                            },
                            { timestamp: '2024-12-18 13:23:55', callId: 'call-003-def', model: 'CO_Agent_Customer_Onboarding', user: 'mike.wilson', status: 'Error', tokens: 0, latency: '1.2s', cost: '$0.000', input: 'Error occurred', output: 'N/A', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
                            { timestamp: '2024-12-18 13:22:31', callId: 'call-004-ghi', model: 'TX_Agent_Tax_Calculator', user: 'sarah.jones', status: 'Success', tokens: 1456, latency: '312ms', cost: '$0.029', input: 'Sample input', output: 'Sample output', accuracy: 0.89, inputToxicity: 0.03, outputToxicity: 0.02, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'Informative' },
                            { timestamp: '2024-12-18 13:21:07', callId: 'call-005-jkl', model: 'DR_Agent_Document_Review', user: 'david.brown', status: 'Success', tokens: 734, latency: '156ms', cost: '$0.015', input: 'Sample input', output: 'Sample output', accuracy: 0.92, inputToxicity: 0.01, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Professional', outputTone: 'Professional' },
                            { timestamp: '2024-12-18 13:19:43', callId: 'call-006-mno', model: 'CO_Agent_Customer_Onboarding', user: 'lisa.garcia', status: 'Success', tokens: 1089, latency: '278ms', cost: '$0.021', input: 'Sample input', output: 'Sample output', accuracy: 0.95, inputToxicity: 0.02, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Casual', outputTone: 'Friendly' },
                            { timestamp: '2024-12-18 13:18:29', callId: 'call-007-pqr', model: 'TX_Agent_Tax_Calculator', user: 'tom.anderson', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', input: 'Timeout occurred', output: 'N/A', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
                            { timestamp: '2024-12-18 13:17:15', callId: 'call-008-stu', model: 'DR_Agent_Document_Review', user: 'amy.taylor', status: 'Success', tokens: 967, latency: '203ms', cost: '$0.019', input: 'Sample input', output: 'Sample output', accuracy: 0.91, inputToxicity: 0.01, outputToxicity: 0.00, inputPII: 'None', outputPII: 'None', inputTone: 'Technical', outputTone: 'Explanatory' }
                          ].map((call, index) => (
                            <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCall(call)}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.timestamp}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{call.callId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.model}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.user}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  call.status === 'Success' ? 'bg-green-100 text-green-800' :
                                  call.status === 'Error' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {call.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{call.tokens}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{call.latency}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{call.cost}</td>
                              <td className="px-6 py-4 text-sm">
                                <div className="flex flex-wrap gap-1">
                                  <TagField tags={[{ text: "Relevance: 85%", backgroundColor: "POSITIVE" }]} size="SMALL" marginBelow="NONE" />
                                  <TagField tags={[{ text: "Accuracy: 94%", backgroundColor: "ACCENT" }]} size="SMALL" marginBelow="NONE" />
                                  <TagField tags={[{ text: "Helpfulness: 90%", backgroundColor: "ACCENT" }]} size="SMALL" marginBelow="NONE" />
                                  <TagField tags={[{ text: "Clarity: 88%", backgroundColor: "STANDARD" }]} size="SMALL" marginBelow="NONE" />
                                  <TagField tags={[{ text: "Safety: Pass", backgroundColor: "NEGATIVE" }]} size="SMALL" marginBelow="NONE" />
                                </div>
                              </td>                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'observe':
        const observeCurrentTab = observeTab as 'performance' | 'events'
        const observeHeaderBg = cardStyle === 'glass' ? 'bg-white/50 backdrop-blur-md border-white' : 'bg-white border-gray-200'
        return (
          <div className="h-full w-full" style={{ background: 'transparent' }}>
            <style>{getCardStyles(cardStyle)}</style>
            <div className={`sticky top-0 z-10 ${observeHeaderBg} border-b px-8 py-4 flex flex-col justify-center transition-shadow duration-300 ${observeScrolled ? 'shadow-[0_8px_16px_-8px_rgba(0,0,0,0.08)]' : ''} ${cardStyle === 'glass' ? 'shadow-none' : ''}`} style={{ borderRadius: 0, minHeight: '140px' }}>
              <div className="relative flex gap-8 mb-4 border-b border-white/30">
                <button
                  ref={observePerformanceRef}
                  onClick={() => setObserveTab('performance')}
                  className={`px-2 py-2 transition-colors font-medium ${
                    observeCurrentTab === 'performance'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Performance
                </button>
                <button
                  ref={observeEventsRef}
                  onClick={() => setObserveTab('events')}
                  className={`px-2 py-2 transition-colors font-medium ${
                    observeCurrentTab === 'events'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Events
                </button>
                <div 
                  className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out"
                  style={{
                    left: `${observeUnderlineStyle.left}px`,
                    width: `${observeUnderlineStyle.width}px`
                  }}
                />
              </div>
              {selectedCall && (
                <div className="mb-2">
                  <button 
                    onClick={() => setSelectedCall(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    ← Back to AI Calls
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ minHeight: '48px' }}>
                <div className="flex items-center gap-3">
                  <HeadingField text={selectedCall ? selectedCall.callId : (observeCurrentTab === 'performance' ? "System Performance" : "System Events")} size="LARGE" marginBelow="NONE" />
                  {selectedCall && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedCall.status === 'Success' ? 'bg-green-100 text-green-800' :
                      selectedCall.status === 'Error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCall.status}
                    </span>
                  )}
                </div>
                {observeCurrentTab === 'performance' && !selectedCall && (
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
                )}
              </div>
            </div>
            <div className="px-20 py-6">
              {observeCurrentTab === 'performance' ? (
                <PerformanceDashboard />
              ) : selectedCall ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-[2fr_1fr] gap-6">
                    {/* Input/Output Panel */}
                    <div className="space-y-6">
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Input" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                          {selectedCall.input}
                        </div>
                      </CardLayout>
                      
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Output" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                          {selectedCall.output}
                        </div>
                      </CardLayout>
                    </div>
                    
                    {/* Call Data Panel */}
                    <div className="space-y-4">
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Call Metrics" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Latency:</span>
                            <span className="font-medium">{selectedCall.latency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-medium">{selectedCall.cost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tokens:</span>
                            <span className="font-medium">{selectedCall.tokens}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accuracy:</span>
                            <span className="font-medium">{(selectedCall.accuracy * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardLayout>
                      
                      <CardLayout padding="MORE" showShadow={true}>
                        <HeadingField text="Content Analysis" size="MEDIUM" marginBelow="STANDARD" />
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Input Toxicity:</span>
                            <span className="font-medium">{(selectedCall.inputToxicity * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Output Toxicity:</span>
                            <span className="font-medium">{(selectedCall.outputToxicity * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Input PII:</span>
                            <span className="font-medium">{selectedCall.inputPII}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Output PII:</span>
                            <span className="font-medium">{selectedCall.outputPII}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Input Tone:</span>
                            <span className="font-medium">{selectedCall.inputTone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Output Tone:</span>
                            <span className="font-medium">{selectedCall.outputTone}</span>
                          </div>
                        </div>
                      </CardLayout>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <HeadingField text="AI Calls" size="MEDIUM" marginBelow="NONE" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Call ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Object</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Tokens</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Latency</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { 
                              timestamp: '2024-12-18 13:25:42', 
                              callId: 'call-001-xyz', 
                              model: 'CO_Agent_Customer_Onboarding', 
                              user: 'john.smith', 
                              status: 'Success', 
                              tokens: 1247, 
                              latency: '245ms', 
                              cost: '$0.024',
                              input: 'Can you help me write a professional email to schedule a meeting with our client about the quarterly review?',
                              output: 'I\'d be happy to help you write a professional email for scheduling a client meeting. Here\'s a draft:\n\nSubject: Quarterly Review Meeting - [Client Name]\n\nDear [Client Name],\n\nI hope this email finds you well. As we approach the end of the quarter, I would like to schedule our quarterly review meeting to discuss your account performance, upcoming initiatives, and address any questions you may have.\n\nWould you be available for a meeting during the week of [Date Range]? I\'m flexible with timing and can accommodate your schedule. The meeting should take approximately 60 minutes and can be conducted either in-person at your office or via video conference, whichever you prefer.\n\nPlease let me know your availability, and I\'ll send a calendar invitation with the agenda.\n\nThank you for your continued partnership.\n\nBest regards,\n[Your Name]',
                              accuracy: 0.94,
                              inputToxicity: 0.02,
                              outputToxicity: 0.01,
                              inputPII: 'None',
                              outputPII: 'Template placeholders',
                              inputTone: 'Professional',
                              outputTone: 'Professional'
                            },
                            { 
                              timestamp: '2024-12-18 13:24:18', 
                              callId: 'call-002-abc', 
                              model: 'DR_Agent_Document_Review', 
                              user: 'jane.doe', 
                              status: 'Success', 
                              tokens: 892, 
                              latency: '189ms', 
                              cost: '$0.018',
                              input: 'Explain the concept of machine learning in simple terms for a beginner.',
                              output: 'Machine learning is like teaching a computer to recognize patterns and make predictions, similar to how humans learn from experience.\n\nImagine you\'re learning to recognize different dog breeds. At first, you might not know the difference between a Golden Retriever and a Labrador. But after seeing many examples of each breed with their names, you start to notice patterns - Golden Retrievers tend to have longer, fluffier coats, while Labs have shorter, denser fur.\n\nMachine learning works similarly:\n\n1. **Training**: We show the computer thousands of examples (like photos of dogs with breed labels)\n2. **Pattern Recognition**: The computer finds patterns in the data that humans might miss\n3. **Prediction**: When shown a new photo, the computer can predict the breed based on learned patterns\n\nThis same principle applies to many applications: email spam detection, recommendation systems, voice recognition, and medical diagnosis. The computer learns from data to make intelligent decisions without being explicitly programmed for every possible scenario.',
                              accuracy: 0.97,
                              inputToxicity: 0.01,
                              outputToxicity: 0.00,
                              inputPII: 'None',
                              outputPII: 'None',
                              inputTone: 'Neutral',
                              outputTone: 'Educational'
                            },
                            { timestamp: '2024-12-18 13:23:55', callId: 'call-003-def', model: 'CO_Agent_Customer_Onboarding', user: 'mike.wilson', status: 'Error', tokens: 0, latency: '1.2s', cost: '$0.000', input: 'Error occurred', output: 'N/A', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
                            { timestamp: '2024-12-18 13:22:31', callId: 'call-004-ghi', model: 'TX_Agent_Tax_Calculator', user: 'sarah.jones', status: 'Success', tokens: 1456, latency: '312ms', cost: '$0.029', input: 'Sample input', output: 'Sample output', accuracy: 0.89, inputToxicity: 0.03, outputToxicity: 0.02, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'Informative' },
                            { timestamp: '2024-12-18 13:21:07', callId: 'call-005-jkl', model: 'DR_Agent_Document_Review', user: 'david.brown', status: 'Success', tokens: 734, latency: '156ms', cost: '$0.015', input: 'Sample input', output: 'Sample output', accuracy: 0.92, inputToxicity: 0.01, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Professional', outputTone: 'Professional' },
                            { timestamp: '2024-12-18 13:19:43', callId: 'call-006-mno', model: 'CO_Agent_Customer_Onboarding', user: 'lisa.garcia', status: 'Success', tokens: 1089, latency: '278ms', cost: '$0.021', input: 'Sample input', output: 'Sample output', accuracy: 0.95, inputToxicity: 0.02, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Casual', outputTone: 'Friendly' },
                            { timestamp: '2024-12-18 13:18:29', callId: 'call-007-pqr', model: 'TX_Agent_Tax_Calculator', user: 'tom.anderson', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', input: 'Timeout occurred', output: 'N/A', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
                            { timestamp: '2024-12-18 13:17:15', callId: 'call-008-stu', model: 'DR_Agent_Document_Review', user: 'amy.taylor', status: 'Success', tokens: 967, latency: '203ms', cost: '$0.019', input: 'Sample input', output: 'Sample output', accuracy: 0.91, inputToxicity: 0.01, outputToxicity: 0.00, inputPII: 'None', outputPII: 'None', inputTone: 'Technical', outputTone: 'Explanatory' }
                          ].map((call, index) => (
                            <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCall(call)}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.timestamp}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{call.callId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.model}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.user}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  call.status === 'Success' ? 'bg-green-100 text-green-800' :
                                  call.status === 'Error' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {call.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{call.tokens}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{call.latency}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{call.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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
    <div className={`min-h-screen w-full ${cardStyle === 'glass' ? 'bg-transparent' : 'bg-gradient-to-b from-blue-100 from-50% to-white'} ${cardStyle === 'greyscale' ? 'grayscale' : ''}`}>
      <style>{tabStyles}</style>
      <div className={`w-full ${activeSection === 'protect' || activeSection === 'observe' || activeSection === 'home' || activeSection === 'monitor' ? '' : 'px-8 py-8'}`}>
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
