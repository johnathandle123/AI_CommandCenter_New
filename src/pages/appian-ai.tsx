import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, ArrowUp, ExternalLink as LinkIcon, Search, Grid3X3, Paintbrush, Settings, Database, Flag, FileText, Info, HelpCircle, Activity, AlertCircle, Shield, Layout, Gauge, XCircle, AlertTriangle, CheckCircle, ChevronDown, Zap, PanelLeftClose, PanelLeftOpen, Plus, Trash2, Clock, MessageSquare } from 'lucide-react'
import { HeadingField } from '@pglevy/sailwind'
import { useWaffleOption } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'
import { Link } from 'wouter'

interface ChatMsg {
  id: number
  role: 'user' | 'assistant'
  content: string
  setting?: { name: string; type: string; config: Record<string, string>; link: string; linkLabel: string }
  options?: string[]
  showInsights?: boolean
}

type AppiaConvo = { step: 'idle' } | { step: 'guardrail-describe' } | { step: 'guardrail-clarify'; guardrailType: string; description: string } | { step: 'guardrail-scope'; guardrailType: string; description: string; details: string } | { step: 'guardrail-action'; guardrailType: string; scope: string; details: string } | { step: 'guardrail-block-msg'; guardrailType: string; scope: string; details: string } | { step: 'interface-describe' } | { step: 'interface-confirm'; desc: string }

function detectGuardrailType(text: string): string {
  if (/pii|personal|ssn|credit card|phone|email|address|sensitive data/i.test(text)) return 'PII scrubbing'
  if (/toxic|hate|harass|offensive|inappropriate|profanity/i.test(text)) return 'Toxicity detection'
  if (/inject|jailbreak|bypass|manipulat|override|prompt attack/i.test(text)) return 'Prompt injection'
  return 'Content safety'
}

const guardrailBuilders: Record<string, (scope: string, action: string) => { response: string; setting: ChatMsg['setting'] }> = {
  'PII scrubbing': (scope, action) => ({ response: "Your PII Scrubbing guardrail is ready:", setting: { name: 'PII Scrubbing', type: 'Guardrail · Admin Console', config: { 'Type': 'PII Scrubbing', 'Scope': scope, 'Entity Types': 'SSN, Credit Card, Phone, Email, Address', 'On Match': action, 'Status': 'Active', 'Applied To': 'All AI Skills' }, link: '/admin-console', linkLabel: 'Review & Test Guardrail' } }),
  'Toxicity detection': (scope, action) => ({ response: "Your Toxicity Detection guardrail is ready:", setting: { name: 'Toxicity Detection', type: 'Guardrail · Admin Console', config: { 'Type': 'Toxicity Detection', 'Scope': scope, 'Sensitivity': 'Medium', 'Categories': 'Hate speech, Harassment, Self-harm, Violence', 'On Match': action, 'Status': 'Active', 'Applied To': 'All AI Skills' }, link: '/admin-console', linkLabel: 'Review & Test Guardrail' } }),
  'Prompt injection': (scope, action) => ({ response: "Your Prompt Injection guardrail is ready:", setting: { name: 'Prompt Injection Shield', type: 'Guardrail · Admin Console', config: { 'Type': 'Prompt Injection Detection', 'Scope': scope, 'Detection': 'Hybrid (Keyword + Semantic)', 'On Match': action, 'Status': 'Active', 'Applied To': 'All AI Skills' }, link: '/admin-console', linkLabel: 'Review & Test Guardrail' } }),
  'Content safety': (scope, action) => ({ response: "Your Content Safety guardrail is ready:", setting: { name: 'Content Safety', type: 'Guardrail · Admin Console', config: { 'Type': 'Content Safety', 'Scope': scope, 'Sensitivity': 'Medium', 'On Match': action, 'Status': 'Active', 'Applied To': 'All AI Skills' }, link: '/admin-console', linkLabel: 'Review & Test Guardrail' } }),
}

const clarifyByType: Record<string, { question: string; options: string[] }> = {
  'PII scrubbing': { question: 'What types of sensitive data are you most concerned about?', options: ['Names and contact info', 'Financial data (SSN, credit cards)', 'Health records (HIPAA)', 'All of the above'] },
  'Toxicity detection': { question: 'What kind of harmful content are you seeing?', options: ['Hate speech and slurs', 'Harassment and threats', 'Self-harm content', 'All categories'] },
  'Prompt injection': { question: 'What are you trying to prevent?', options: ['Users bypassing system instructions', 'Jailbreak attempts', 'Role-play manipulation', 'All injection types'] },
  'Content safety': { question: 'What topics or content should be restricted?', options: ['Off-topic requests', 'Competitor mentions', 'Legal/medical advice', 'Custom topic list'] },
}

const blockMessages: Record<string, string> = {
  'PII scrubbing': 'Your request contains sensitive personal information. For your security, this data has been redacted.',
  'Toxicity detection': 'This request was blocked because it contains content that violates our community guidelines.',
  'Prompt injection': 'This request was blocked because it appears to attempt to override system instructions.',
  'Content safety': 'This request was blocked because it contains content outside the scope of this AI assistant.',
}

const scopeRecommendations: Record<string, string> = {
  'PII scrubbing': 'For PII, I would recommend scanning both — users often paste sensitive data in prompts, and models can hallucinate PII in responses.',
  'Toxicity detection': 'For toxicity, both is safest — but if you mainly want to filter model responses, output only works too.',
  'Prompt injection': 'For injection attacks, user input is the primary risk. I would recommend input only unless you have chained AI calls.',
  'Content safety': 'For general content safety, both input and output gives the most coverage.',
}

const actionRecommendations: Record<string, string> = {
  'PII scrubbing': 'For PII, masking is usually best — it redacts the data while keeping the request flowing. Blocking can frustrate users.',
  'Toxicity detection': 'For toxicity, blocking is the safest default — you do not want harmful content reaching users.',
  'Prompt injection': 'For injection attempts, blocking and alerting your team is recommended so you can investigate patterns.',
  'Content safety': 'For content safety, flagging and logging is a good start — it lets you monitor without disrupting users.',
}

const responses: { trigger: RegExp; response: string; setting?: ChatMsg['setting']; showInsights?: boolean }[] = [
  { trigger: /create.*interface|new.*interface|add.*interface|build.*interface/i, response: "Done — I've scaffolded a new interface in Appian Designer:", setting: { name: 'Customer Feedback Form', type: 'Interface · Appian Designer', config: { 'Object Type': 'Interface', 'Name': 'Customer Feedback Form', 'Components': 'Header, Text Fields (3), Dropdown, Text Area, Submit Button', 'Record Type': 'Customer Feedback', 'Status': 'Draft' }, link: '/appian-designer', linkLabel: 'Open in Designer' } },
  { trigger: /create.*process|new.*process|add.*process|build.*process/i, response: "Done — I've created a new process model in Designer:", setting: { name: 'Feedback Review Workflow', type: 'Process Model · Appian Designer', config: { 'Object Type': 'Process Model', 'Name': 'Feedback Review Workflow', 'Nodes': 'Start → Assign Reviewer → Review Task → Decision Gateway → Notify Customer → End', 'Triggers': 'Record event on Feedback submission', 'Status': 'Draft' }, link: '/appian-designer', linkLabel: 'Open in Designer' } },
  { trigger: /create.*record|new.*record|add.*record/i, response: "Done — New record type created in Designer:", setting: { name: 'Customer Feedback Record', type: 'Record Type · Appian Designer', config: { 'Object Type': 'Record Type', 'Name': 'Customer Feedback', 'Source': 'Database', 'Fields': 'ID, Customer, Category, Description, Rating, Status, Created Date', 'Sync': 'Enabled', 'Status': 'Draft' }, link: '/appian-designer', linkLabel: 'Open in Designer' } },
  { trigger: /what.*attention|what.*wrong|what.*happening|status|overview|insight/i, response: "Here's what needs your attention right now:", showInsights: true },
  { trigger: /error|process.*fail|fix.*process/i, response: "I found 3 process errors in the last 24 hours:\n\n• **Invoice Processing #892** — Connection timeout, 4th occurrence this week\n• **Document Review #567** — 2 unresolved errors blocking 12 queued items\n• **Legacy Data Migration** — RPA-Bot-004 crashed on batch #445\n\nI can restart the failed processes and increase the connection pool timeout. Want me to proceed?", setting: { name: 'Process Error Summary', type: 'Insights · Operations Console', config: { 'Total Errors': '3 in last 24h', 'Most Critical': 'Invoice Processing #892 (recurring)', 'Queue Impact': '12 items blocked', 'RPA Status': 'Bot-004 offline 2h' }, link: '/appian-monitor', linkLabel: 'View in Operations Console' } },
  { trigger: /performance|slow|latency/i, response: "Performance overview:\n\n⚡ **Overall:** Avg latency 1.3s (↓8.1%)\n\n🔴 **Case Summary View** — 8.5s max, 4.2s avg. Slowest record view.\n🟡 **Invoice Detail View** — 3.8s max, 1.9s avg.\n🟢 **Customer & Employee lists** — under 0.5s avg.\n\nThe Case Summary View needs index optimization. I can analyze the query plan and apply fixes.", setting: { name: 'Performance Summary', type: 'Insights · Operations Console', config: { 'Avg Latency': '1.3s (↓8.1%)', 'Slowest View': 'Case Summary (4.2s avg)', 'Healthy Views': 'Customer, Employee (< 0.5s)', 'AI Skill Latency': '1.1–1.8s' }, link: '/appian-monitor', linkLabel: 'View in Operations Console' } },
]

function getResponse(input: string): { response: string; setting?: ChatMsg['setting']; showInsights?: boolean } {
  for (const r of responses) {
    if (r.trigger.test(input)) return { response: r.response, setting: r.setting, showInsights: r.showInsights }
  }
  return { response: "I can help you across your entire Appian environment:\n\n🛡️ **Admin Console** — Add guardrails, configure AI services, manage settings\n🎨 **Designer** — Create interfaces, process models, record types, expression rules\n📊 **Analyst** — Get insights on errors, performance, costs, sync status, RPA\n\nJust describe what you need in plain language." }
}

export default function AppianAI() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option5')
  const [animReady, setAnimReady] = useState(false)
  const [expandedInlineInsights, setExpandedInlineInsights] = useState<Set<number>>(new Set())
  const [inlineInsightStatus, setInlineInsightStatus] = useState<Record<number, 'open' | 'resolving' | 'resolved'>>({})
  const [convo, setConvo] = useState<AppiaConvo>({ step: 'idle' })
  const [appTab, setAppTab] = useState<'chat' | 'insights' | 'insights-v2'>('chat')
  const [autopilotView, setAutopilotView] = useState<'all' | 'environment' | 'application' | 'history'>('all')
  const [selectedAutopilotApp, setSelectedAutopilotApp] = useState<string | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; date: string; messages: ChatMsg[] }[]>([
    { id: 'c1', title: 'Customer feedback guardrail', date: 'Today', messages: [
      { id: 1, role: 'user', content: 'Add a guardrail for customer feedback' },
      { id: 2, role: 'assistant', content: "Tell me about what you're looking to protect against — for example, are you concerned about users sharing sensitive data, inappropriate content, or prompt manipulation?" },
    ]},
    { id: 'c2', title: 'Process error investigation', date: 'Today', messages: [
      { id: 1, role: 'user', content: 'What needs my attention?' },
      { id: 2, role: 'assistant', content: "Here's what needs your attention right now:", showInsights: true },
    ]},
    { id: 'c3', title: 'New onboarding interface', date: 'Yesterday', messages: [
      { id: 1, role: 'user', content: 'Create an employee onboarding interface' },
      { id: 2, role: 'assistant', content: "Done — I've scaffolded a new interface in Appian Designer:", setting: { name: 'Employee Onboarding Form', type: 'Interface · Appian Designer', config: { 'Components': 'Header, Personal Info Fields, Department Dropdown, Start Date Picker, Submit Button', 'Record Type': 'Employee', 'Status': 'Draft' }, link: '/appian-designer', linkLabel: 'Open in Designer' } },
    ]},
    { id: 'c4', title: 'Performance optimization', date: 'Yesterday', messages: [
      { id: 1, role: 'user', content: 'How is performance looking?' },
      { id: 2, role: 'assistant', content: "Performance overview:\n\n⚡ **Overall:** Avg latency 1.3s (↓8.1%)\n\n🔴 **Case Summary View** — 8.5s max, 4.2s avg. Slowest record view.\n🟡 **Invoice Detail View** — 3.8s max, 1.9s avg.\n🟢 **Customer & Employee lists** — under 0.5s avg." },
    ]},
  ])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [tasks, setTasks] = useState([
    { id: 't1', name: 'Daily health check', desc: 'Scan processes, sync, and AI skills every morning', schedule: 'Daily at 8:00 AM', active: true },
    { id: 't2', name: 'Weekly cost report', desc: 'Summarize AI spend and recommend optimizations', schedule: 'Mondays at 9:00 AM', active: true },
    { id: 't3', name: 'Guardrail audit', desc: 'Review guardrail triggers and false positives', schedule: 'Fridays at 5:00 PM', active: false },
  ])

  const switchChat = (chatId: string) => {
    // Save current messages to history if we have an active chat
    if (activeChatId && messages.length > 0) {
      setChatHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...messages] } : c))
    }
    const chat = chatHistory.find(c => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setActiveChatId(chatId)
      setConvo({ step: 'idle' })
    }
  }

  const newChat = () => {
    if (activeChatId && messages.length > 0) {
      setChatHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...messages] } : c))
    }
    setMessages([])
    setActiveChatId(null)
    setConvo({ step: 'idle' })
  }

  const runTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    newChat()
    const taskPrompts: Record<string, string> = {
      't1': 'What needs my attention?',
      't2': 'Break down AI costs',
      't3': 'Show me guardrail triggers and false positives',
    }
    setTimeout(() => sendMessage(taskPrompts[taskId] || task.name), 100)
  }
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const allWaffleApps = [
    { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', active: true, path: '/appian-ai', options: ['option5'] as const },
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
    { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
    { name: 'Process HQ', icon: Activity, color: 'bg-rose-500', path: '/process-hq', options: ['option4', 'option6'] as const },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' },
  ]
  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))
  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' },
  ]
  const allSites = [
    'Admin Console', 'Appina', 'Appian Designer', 'Operations Console',
    'Cloud Database', 'Feature Flags', 'System Logs',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  // Auto-save chat to history
  useEffect(() => {
    if (messages.length >= 2 && !activeChatId) {
      const title = messages[0].content.slice(0, 40) + (messages[0].content.length > 40 ? '...' : '')
      const id = 'c' + Date.now()
      setChatHistory(prev => [{ id, title, date: 'Today', messages: [...messages] }, ...prev])
      setActiveChatId(id)
    } else if (activeChatId && messages.length > 0) {
      setChatHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...messages] } : c))
    }
  }, [messages])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (showWaffleMenu && !(e.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showWaffleMenu])
  useEffect(() => { const t = setTimeout(() => setAnimReady(true), 100); return () => clearTimeout(t) }, [])

  const suggestions = [
    { label: 'What needs my attention?', icon: AlertCircle },
    { label: 'Add a guardrail', icon: Shield },
    { label: 'Create a customer feedback interface', icon: Layout },
    { label: 'How is performance looking?', icon: Gauge },
  ]

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text.trim() }])
    setInput('')
    setIsTyping(true)
    if (inputRef.current) inputRef.current.style.height = '160px'

    setTimeout(() => {
      setIsTyping(false)

      // Multi-turn guardrail flow
      if (convo.step === 'guardrail-describe') {
        const type = detectGuardrailType(text)
        const clarify = clarifyByType[type]
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `It sounds like you need **${type}**. ${clarify.question}`, options: clarify.options }])
        setConvo({ step: 'guardrail-clarify', guardrailType: type, description: text })
        return
      }
      if (convo.step === 'guardrail-clarify') {
        const rec = scopeRecommendations[convo.guardrailType]
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Got it — I will configure the guardrail to cover **${text.toLowerCase()}**.\n\n${rec}\n\nWhere should this apply?`, options: ['User input only', 'LLM output only', 'Both (recommended)'] }])
        setConvo({ step: 'guardrail-scope', guardrailType: convo.guardrailType, description: convo.description, details: text })
        return
      }
      if (convo.step === 'guardrail-scope') {
        const rec = actionRecommendations[convo.guardrailType]
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Applying to **${text.toLowerCase()}**.\n\n${rec}\n\nWhat should happen when a match is found?`, options: ['Block the request', 'Mask/redact the content', 'Flag and log only'] }])
        setConvo({ step: 'guardrail-action', guardrailType: convo.guardrailType, scope: text, details: convo.details })
        return
      }
      if (convo.step === 'guardrail-action') {
        if (/block/i.test(text)) {
          const msg = blockMessages[convo.guardrailType]
          setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Here is the recommended block message users will see:\n\n> ${msg}\n\nWould you like to use this message or customize it?`, options: ['Use this message', 'Customize it'] }])
          setConvo({ step: 'guardrail-block-msg', guardrailType: convo.guardrailType, scope: convo.scope, details: convo.details })
          return
        }
        const result = guardrailBuilders[convo.guardrailType](convo.scope, text)
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: result.response, setting: result.setting }])
        setConvo({ step: 'idle' })
        return
      }
      if (convo.step === 'guardrail-block-msg') {
        const result = guardrailBuilders[convo.guardrailType](convo.scope, 'Block the request')
        if (result.setting) result.setting.config['Block Message'] = /use this/i.test(text) ? blockMessages[convo.guardrailType] : 'Custom message configured'
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: result.response, setting: result.setting }])
        setConvo({ step: 'idle' })
        return
      }

      // Interface creation flow
      if (convo.step === 'interface-describe') {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `Got it — I will create a **${text}** interface. This will include:\n\n• A form layout with relevant input fields\n• Connected to a record type for data storage\n• Validation rules for required fields\n• Submit and cancel actions\n\nShould I proceed with this setup?`, options: ['Yes, create it', 'Let me customize'] }])
        setConvo({ step: 'interface-confirm', desc: text })
        return
      }
      if (convo.step === 'interface-confirm') {
        if (/yes|create|proceed|go/i.test(text)) {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Your interface is ready:", setting: { name: convo.desc, type: 'Interface · Appian Designer', config: { 'Object Type': 'Interface', 'Name': convo.desc, 'Components': 'Header, Form Fields, Dropdown Selectors, Text Area, Submit/Cancel Buttons', 'Record Type': convo.desc.replace(/interface|form/gi, '').trim(), 'Validation': 'Required field checks', 'Status': 'Draft' }, link: '/appian-designer', linkLabel: 'Open in Designer' } }])
            setConvo({ step: 'idle' })
          }, 1500)
        } else {
          setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'What would you like to change about the interface?', options: ['Add more fields', 'Change the layout', 'Connect to a different record type'] }])
          setConvo({ step: 'interface-describe' })
        }
        return
      }

      // Check if user wants to create an interface
      if (/create.*interface|build.*interface|new.*interface|create.*form|build.*form/i.test(text)) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'What kind of interface would you like to create? Describe what it should do or what data it should capture.', options: ['Customer feedback form', 'Employee onboarding form', 'Support ticket submission', 'Approval workflow form'] }])
        setConvo({ step: 'interface-describe' })
        return
      }

      // Check if user wants a guardrail
      if (/add.*guardrail|new.*guardrail|create.*guardrail|set.*up.*guardrail|protect|guardrail/i.test(text)) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Tell me about what you're looking to protect against — for example, are you concerned about users sharing sensitive data, inappropriate content, or prompt manipulation?" }])
        setConvo({ step: 'guardrail-describe' })
        return
      }

      // Default single-turn responses
      const { response, setting, showInsights } = getResponse(text)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: response, setting, showInsights }])
    }, 800 + Math.random() * 1200)
  }, [convo])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = '160px'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
        return part
      })
      return <span key={i}>{i > 0 && <br />}{parts}</span>
    })
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed header */}
      <div className="app-header-sail py-4 relative flex-shrink-0">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-lg p-3 flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <HeadingField text="Appina" size="LARGE" headingTag="H1" marginBelow="NONE" fontWeight="BOLD" />
          </div>
          <div className="flex items-center gap-3">
            <VersionSwitcher />
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors"><Search size={20} className="text-black" /></button>
            <button onClick={() => setShowWaffleMenu(!showWaffleMenu)} className="p-2 rounded-md hover:bg-white/20 transition-colors waffle-menu"><Grid3X3 size={20} className={showWaffleMenu ? 'text-blue-500' : 'text-black'} /></button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">J</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" alt="Appian" className="h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 flex gap-6">
        <button onClick={() => setAppTab('chat')} className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${appTab === 'chat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Chat</button>
        <button onClick={() => setAppTab('insights')} className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${appTab === 'insights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Recommendations <span className="text-[10px] text-gray-400">(Concept)</span></button>
        <button onClick={() => setAppTab('insights-v2')} className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${appTab === 'insights-v2' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Autopilot <span className="text-[10px] text-gray-400">(Concept)</span></button>
      </div>

      {/* Waffle Menu */}
      {showWaffleMenu && (
        <div className="fixed top-20 right-8 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] waffle-menu w-80 flex flex-col" style={{ maxHeight: '480px' }}>
          <div className="flex border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
            <button onClick={() => setWaffleTab('favorites')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'favorites' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Favorites</button>
            <button onClick={() => setWaffleTab('all')} className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${waffleTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>All</button>
          </div>
          {waffleTab === 'all' && (
            <div className="px-3 pt-3 pb-3 border-b border-gray-200 bg-white">
              <input type="text" placeholder="Search sites..." value={waffleSiteSearch} onChange={e => setWaffleSiteSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3">
            {waffleTab === 'favorites' ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {waffleApps.map((app, i) => { const Icon = app.icon; return (
                    <Link key={i} href={app.path}><button className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'}`} onClick={() => setShowWaffleMenu(false)}>
                      <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                      <span className="font-medium text-xs text-center">{app.name}</span>
                    </button></Link>
                  )})}
                </div>
                <div className="border-t border-gray-200 mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                  {helpApps.map((app, i) => { const Icon = app.icon; return (
                    <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500" onClick={() => setShowWaffleMenu(false)}>
                      <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                      <span className="font-medium text-xs text-center">{app.name}</span>
                    </button>
                  )})}
                </div>
              </>
            ) : (
              <div className="space-y-1">
                {allSites.map((site, i) => (<button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" onClick={() => setShowWaffleMenu(false)}>{site}</button>))}
                {allSites.length === 0 && <div className="text-sm text-gray-400 text-center py-4">No sites found</div>}
              </div>
            )}
          </div>
          {!waffleLocked ? <div className="border-t border-gray-200 p-3 sticky bottom-0 bg-white rounded-b-lg">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as 'option1' | 'option2' | 'option3' | 'option4' | 'option5')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option><option value="option3">Option 3</option><option value="option4">Option 4</option><option value="option5">Option 5</option>
            </select>
          </div> : <div className="border-t border-gray-200 p-3 sticky bottom-0 bg-white rounded-b-lg">
            <select value={waffleOption} onChange={(e) => setWaffleOption(e.target.value as any)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="option4">Option 1 — With Operations Console</option><option value="option6">Option 2 — Without Operations Console</option>
            </select>
          </div>}
        </div>
      )}

      {/* Tab content */}
      {appTab === 'insights' ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Product Insights</h2>
                <p className="text-sm text-gray-500">Usage-based recommendations to improve your application</p>
              </div>
              <button className="btn-gradient-text"><Zap size={12} />Apply All Recommendations</button>
            </div>
            <div className="space-y-3">
              {[
                { id: 'p1', severity: 'critical' as const, category: 'User Complaints', title: 'Customer Onboarding form has a 34% abandonment rate', desc: 'Users are dropping off at the address verification step. The current flow requires 3 separate fields for address entry. We recommend replacing it with a single auto-complete address field.', action: 'Simplify address entry to single auto-complete field', impact: 'Est. 20% reduction in abandonment', metric: '34% drop-off' },
                { id: 'p2', severity: 'warning' as const, category: 'Performance', title: 'Invoice Approval workflow takes avg 4.2 days to complete', desc: 'The bottleneck is the manager review step — 78% of time is spent waiting for approval. Adding an auto-approve rule for invoices under $500 would eliminate 60% of the queue.', action: 'Add auto-approve rule for invoices under $500', impact: 'Est. 2.5 day reduction in cycle time', metric: 'Avg 4.2 days' },
                { id: 'p3', severity: 'warning' as const, category: 'Cost', title: 'Document Classification AI Skill costs $89/mo with 12% usage', desc: 'Only 3 of 25 users actively use this skill. Most documents are being manually classified anyway. Consider deprecating or restricting to power users to save costs.', action: 'Restrict to power users or deprecate', impact: 'Save $89/mo', metric: '12% adoption' },
                { id: 'p4', severity: 'info' as const, category: 'Feature Gap', title: 'Users search for "export to PDF" 47 times/week with no result', desc: 'There is no PDF export on the Case Summary view, but users consistently look for it. Adding a one-click PDF export would address the #1 unmet user need.', action: 'Add PDF export to Case Summary view', impact: 'Address #1 feature request', metric: '47 searches/wk' },
                { id: 'p5', severity: 'info' as const, category: 'Optimization', title: 'HR Dashboard loads 3 unused related records on every view', desc: 'The Benefits, Training History, and Equipment Assignment related records are loaded but never displayed. Removing them from the query would cut load time by ~40%.', action: 'Remove unused related records from query', impact: 'Est. 40% faster load time', metric: '3 unused records' },
                { id: 'p6', severity: 'info' as const, category: 'Guardrails', title: 'PII Scrubbing guardrail triggered 42 times with 8 false positives', desc: 'The SSN detection regex is matching internal reference numbers that follow a similar pattern. Tightening the regex or switching to semantic detection would reduce false positives by ~80%.', action: 'Switch SSN detection from regex to semantic', impact: 'Est. 80% fewer false positives', metric: '8 false positives' },
              ].map(insight => {
                const cfg = { critical: { bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={18} className="text-red-500" />, badge: 'bg-red-100 text-red-700' }, warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={18} className="text-amber-500" />, badge: 'bg-amber-100 text-amber-700' }, info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info size={18} className="text-blue-500" />, badge: 'bg-blue-100 text-blue-700' } }[insight.severity]
                return (
                  <div key={insight.id} className={`rounded-xl border ${cfg.bg} ${cfg.border} transition-all`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.badge}`}>{insight.category}</span>
                            <span className="px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">{insight.metric}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">{insight.desc}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] text-gray-500"><span className="font-semibold text-gray-700">Recommendation:</span> {insight.action}</div>
                              <div className="text-[11px] text-green-600 font-medium mt-0.5">{insight.impact}</div>
                            </div>
                            <button className="btn-manual flex-shrink-0">Dismiss</button>
                            <button className="btn-gradient-text flex-shrink-0"><Zap size={10} />Apply Fix</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : appTab === 'insights-v2' ? (<>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Automatic Optimizations</h2>
                <p className="text-sm text-gray-500">Changes applied automatically. Reverse or preview any change.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowVersionHistory(true)} className="btn-manual">Version History</button>
                <button className="btn-manual">Reverse All</button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['all', 'environment', 'application'] as const).map(v => (
                  <button key={v} onClick={() => setAutopilotView(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${autopilotView === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {v === 'all' ? 'All Changes' : v === 'environment' ? 'Environment Wide' : 'Application Specific'}
                  </button>
                ))}
              </div>
            </div>
            {autopilotView === 'application' ? (
              selectedAutopilotApp ? (
                <div>
                  <button onClick={() => setSelectedAutopilotApp(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"><ChevronDown size={16} className="rotate-90" />Back to Applications</button>
                  <h3 className="text-base font-bold text-gray-900 mb-4">{selectedAutopilotApp}</h3>
                  <div className="space-y-3">
                    {[
                      { app: 'Customer Portal', changes: [{ category: 'User Complaints', title: 'Simplified address entry on Customer Onboarding form', desc: 'Replaced 3 separate address fields with auto-complete.', impact: 'Est. 20% reduction in abandonment' }, { category: 'Feature Gap', title: 'PDF export added to Case Summary view', desc: 'One-click PDF export addresses #1 feature request.', impact: 'Addressed #1 feature request' }] },
                      { app: 'Invoice Management', changes: [{ category: 'Performance', title: 'Auto-approve rule for invoices under $500', desc: 'Eliminates 60% of the approval queue.', impact: 'Est. 2.5 day reduction in cycle time' }] },
                      { app: 'HR Portal', changes: [{ category: 'Optimization', title: 'Removed 3 unused related records from HR Dashboard', desc: 'Load time reduced by ~40%.', impact: '~40% faster load time' }] },
                      { app: 'AI Services', changes: [{ category: 'Cost', title: 'Document Classification AI restricted to power users', desc: 'Saves $89/mo with no impact.', impact: 'Saving $89/mo' }, { category: 'Guardrails', title: 'SSN detection switched from regex to semantic', desc: 'False positives reduced by ~80%.', impact: 'Est. 80% fewer false positives' }] },
                    ].find(g => g.app === selectedAutopilotApp)?.changes.map((c, ci) => (
                      <div key={ci} className="rounded-xl border bg-white border-gray-200 p-4 flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 text-green-700">{c.category}</span>
                          <h3 className="text-sm font-semibold text-gray-900 mt-1">{c.title}</h3>
                          <p className="text-xs text-gray-600 mt-0.5 mb-2">{c.desc}</p>
                          <div className="flex items-center justify-between"><span className="text-[11px] text-green-600 font-medium">{c.impact}</span><div className="flex gap-2"><button className="btn-gradient-text">Preview</button><button className="btn-manual">Reverse</button></div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Application</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Changes Applied</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Updated</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'Customer Portal', changes: 2, lastUpdated: 'Apr 9, 2026' },
                        { name: 'Invoice Management', changes: 1, lastUpdated: 'Apr 9, 2026' },
                        { name: 'HR Portal', changes: 1, lastUpdated: 'Apr 8, 2026' },
                        { name: 'AI Services', changes: 2, lastUpdated: 'Apr 9, 2026' },
                      ].map(app => (
                        <tr key={app.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAutopilotApp(app.name)}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.name}</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{app.changes} applied</span></td>
                          <td className="px-6 py-4 text-sm text-gray-500">{app.lastUpdated}</td>
                          <td className="px-6 py-4 text-right text-gray-400"><ChevronDown size={16} className="-rotate-90" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
            <div className="space-y-3">
              {(autopilotView === 'environment' ? [
                { id: 'e1', category: 'Security', title: 'Enforced MFA for all admin accounts', desc: 'Multi-factor authentication now required for all users with System Administrator or Admin Console access.', impact: 'Improved security posture', metric: 'Applied' },
                { id: 'e2', category: 'Guardrails', title: 'SSN detection switched from regex to semantic', desc: 'PII Scrubbing guardrail updated environment-wide. False positives reduced from 8 to ~1 per week.', impact: 'Est. 80% fewer false positives', metric: 'Applied' },
                { id: 'e3', category: 'Infrastructure', title: 'Connection pool increased from 20 to 50', desc: 'Database connection pool size increased across all environments to prevent timeout errors during peak hours.', impact: 'Eliminated peak-hour timeouts', metric: 'Applied' },
                { id: 'e4', category: 'Data Retention', title: 'Process archive policy set to 18 months', desc: 'Completed process instances older than 18 months are now auto-archived to reduce database load.', impact: 'Est. 30% reduction in DB size', metric: 'Applied' },
                { id: 'e5', category: 'AI Services', title: 'Document Classification AI restricted to power users', desc: 'Access limited to 3 active users environment-wide. Saves $89/mo with no impact on active workflows.', impact: 'Saving $89/mo', metric: 'Applied' },
              ] : [
                { id: 'v1', category: 'User Complaints', title: 'Simplified address entry on Customer Onboarding form', desc: 'Replaced 3 separate address fields with a single auto-complete field. Abandonment rate expected to drop from 34% to ~14%.', impact: 'Est. 20% reduction in abandonment', metric: 'Applied' },
                { id: 'v2', category: 'Performance', title: 'Auto-approve rule added for invoices under $500', desc: 'Invoices under $500 now skip manager review and are auto-approved. This eliminates 60% of the approval queue.', impact: 'Est. 2.5 day reduction in cycle time', metric: 'Applied' },
                { id: 'v3', category: 'Cost', title: 'Document Classification AI Skill restricted to power users', desc: 'Access limited to 3 active users. Inactive users removed. Saves $89/mo with no impact on active workflows.', impact: 'Saving $89/mo', metric: 'Applied' },
                { id: 'v4', category: 'Feature Gap', title: 'PDF export added to Case Summary view', desc: 'One-click PDF export button added to the Case Summary record view header. Addresses the #1 unmet user need (47 searches/week).', impact: 'Addressed #1 feature request', metric: 'Applied' },
                { id: 'v5', category: 'Optimization', title: 'Removed 3 unused related records from HR Dashboard', desc: 'Benefits, Training History, and Equipment Assignment queries removed from the HR Dashboard load. Page load time reduced by ~40%.', impact: '~40% faster load time', metric: 'Applied' },
                { id: 'v6', category: 'Guardrails', title: 'SSN detection switched from regex to semantic', desc: 'PII Scrubbing guardrail updated to use semantic detection for SSNs. False positives reduced from 8 to ~1 per week.', impact: 'Est. 80% fewer false positives', metric: 'Applied' },
              ]).map(insight => (
                <div key={insight.id} className="rounded-xl border bg-white border-gray-200 transition-all">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5"><CheckCircle size={18} className="text-green-500" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 text-green-700">{insight.category}</span>
                          <span className="px-2 py-0.5 bg-green-50 border border-green-200 rounded-md text-[10px] font-medium text-green-700">{insight.metric}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">{insight.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-green-600 font-medium">{insight.impact}</span>
                          <div className="flex gap-2">
                            <button className="btn-gradient-text flex-shrink-0">Preview</button>
                            <button className="btn-manual flex-shrink-0">Reverse Change</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
        {showVersionHistory && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setShowVersionHistory(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
                <button onClick={() => setShowVersionHistory(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><XCircle size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {[
                  { version: 'v2.4.1', date: 'Apr 9, 2026 — 8:00 AM', env: 'Production', current: true, changes: [{ type: 'applied', desc: 'Simplified address entry on Customer Onboarding form' }, { type: 'applied', desc: 'Auto-approve rule for invoices under $500' }, { type: 'applied', desc: 'SSN detection switched to semantic' }] },
                  { version: 'v2.4.0', date: 'Apr 8, 2026 — 8:00 AM', env: 'Production', current: false, changes: [{ type: 'applied', desc: 'Document Classification AI restricted to power users' }, { type: 'applied', desc: 'PDF export added to Case Summary view' }, { type: 'reversed', desc: 'Auto-archive for cases older than 90 days (reversed)' }] },
                  { version: 'v2.3.9', date: 'Apr 7, 2026 — 8:00 AM', env: 'Production', current: false, changes: [{ type: 'applied', desc: 'Removed unused related records from HR Dashboard' }, { type: 'applied', desc: 'Increased connection pool for CO_Onboarding_v3' }] },
                  { version: 'v2.3.8', date: 'Apr 6, 2026 — 8:00 AM', env: 'Production', current: false, changes: [{ type: 'applied', desc: 'Profanity filter threshold adjusted' }, { type: 'applied', desc: 'New competitor keywords added' }] },
                  { version: 'v1.2.0', date: 'Apr 8, 2026 — 2:00 PM', env: 'Staging', current: false, changes: [{ type: 'applied', desc: 'New feedback chat interface deployed' }, { type: 'applied', desc: 'PII scrubbing guardrails applied' }] },
                ].map(v => (
                  <div key={v.version} className={`rounded-xl border overflow-hidden ${v.current ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">{v.version}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">{v.env}</span>
                        {v.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">Current</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{v.date}</span>
                        {!v.current && <div className="flex gap-1.5 ml-3"><button className="btn-gradient-text text-[11px]">View</button><button className="btn-manual text-[11px]">Revert to this version</button></div>}
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {v.changes.map((c, ci) => (
                        <div key={ci} className="px-5 py-2.5 flex items-center gap-3">
                          {c.type === 'applied' ? <CheckCircle size={13} className="text-green-500 flex-shrink-0" /> : <XCircle size={13} className="text-gray-400 flex-shrink-0" />}
                          <span className={`text-sm ${c.type === 'reversed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>) : (
      <>
      {/* Body: Sidebar + Chat */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
          <div className="p-3 border-b border-gray-200">
            <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
              <Plus size={16} />New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent</div>
              {chatHistory.map(chat => (
                <div key={chat.id} className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => switchChat(chat.id)}>
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{chat.title}</span>
                  <button onClick={e => { e.stopPropagation(); setChatHistory(prev => prev.filter(c => c.id !== chat.id)) }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 transition-all">
                    <Trash2 size={12} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200">
              <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks</div>
              {tasks.map(task => (
                <div key={task.id} className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer" onClick={() => runTask(task.id)}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className={task.active ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="text-sm font-medium text-gray-700 truncate">{task.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 ml-6 mt-0.5">{task.schedule}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute left-2 top-[90px] z-10 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all" style={{ left: sidebarOpen ? '260px' : '8px', transition: 'left 0.3s' }}>
            {sidebarOpen ? <PanelLeftClose size={16} className="text-gray-500" /> : <PanelLeftOpen size={16} className="text-gray-500" />}
          </button>

      {/* Scrollable messages */}
      <div className={`flex-1 min-h-0 ${messages.length === 0 ? 'flex items-center justify-center' : 'overflow-y-auto'}`}>
        <div className={`max-w-3xl mx-auto px-4 ${messages.length === 0 ? '' : 'py-8'}`}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className={`relative mb-6 transition-transform duration-500 ease-out ${input.trim() ? 'scale-110' : 'scale-100'} ${animReady ? 'animate-[appiaIconEntry_1.5s_cubic-bezier(0.32,0.72,0,1)_forwards,appiaIconFloat_6s_ease-in-out_1.5s_infinite]' : 'opacity-0 scale-0'}`}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/50 overflow-hidden relative">
                  <div className="absolute inset-0 animate-[meshGradient_8s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle at 20% 30%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c084fc 0%, transparent 50%), radial-gradient(circle at 50% 80%, #f472b6 0%, transparent 50%)', backgroundColor: '#818cf8', backgroundSize: '150% 150%' }} />
                  <Sparkles size={28} className="text-white relative z-[1]" />
                </div>
                {animReady && <>
                  <span className="absolute w-2.5 h-2.5 bg-blue-300/50 rounded-full" style={{ top: '50%', left: '50%', animation: 'sparkCircle 12s linear infinite', offsetPath: 'circle(42px)', offsetRotate: '0deg' }} />
                  <span className="absolute w-2 h-2 bg-purple-300/40 rounded-full" style={{ top: '50%', left: '50%', animation: 'sparkCircle 15s linear infinite', animationDelay: '-5s', offsetPath: 'circle(42px)', offsetRotate: '0deg' }} />
                  <span className="absolute w-2 h-2 bg-pink-300/40 rounded-full" style={{ top: '50%', left: '50%', animation: 'sparkCircle 13s linear infinite', animationDelay: '-9s', offsetPath: 'circle(42px)', offsetRotate: '0deg' }} />
                </>}
              </div>
              <h2 className={`text-2xl font-semibold mb-2 transition-all duration-1000 ease-out delay-200 ${animReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', ...(animReady ? { animation: 'gradientFade 2s ease-in-out 0.8s forwards' } : {}) }}>What can I help you with?</h2>
              <p className={`text-gray-500 mb-10 text-center transition-all duration-700 ease-out delay-300 ${animReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Configure guardrails, build interfaces, check on your environment — just ask.</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.label)} className={`group px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 text-left hover:border-gray-300 hover:scale-[1.02] font-medium flex items-center gap-3 ${animReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)', transitionDelay: (!animReady ? `${450 + i * 100}ms` : '0ms') }}>
                    <s.icon size={18} className="text-gray-400 group-hover:text-blue-400 flex-shrink-0 transition-colors duration-500" />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:[-webkit-background-clip:text] group-hover:[-webkit-text-fill-color:transparent] transition-all duration-500">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'messageIn 0.7s cubic-bezier(0.32, 0.72, 0, 1)' }}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3 mt-1">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-3xl rounded-br-lg px-5 py-3 text-[15px]' : ''}`}>
                {msg.role === 'user' ? msg.content : (
                  <div>
                    <div className="text-gray-800 leading-relaxed text-[15px] mb-3">{renderText(msg.content)}</div>
                    {msg.options && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.options.map((opt, oi) => (
                          <button key={oi} onClick={() => sendMessage(opt)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.showInsights && (
                      <div className="space-y-2 mb-3">
                        {[
                          { severity: 'critical' as const, title: 'Process Model: CO_Onboarding_v3 — Connection Timeout', metric: '4th this week', desc: 'Invoice Processing #892 timed out for the 4th time this week. Connection pool likely exhausted.' },
                          { severity: 'critical' as const, title: 'Process Model: DR_Review_v2 — 2 Unresolved Errors', metric: '12 queued', desc: 'Document Review #567 has 2 unresolved errors blocking 12 queued items.' },
                          { severity: 'critical' as const, title: 'Robotic Task: Legacy Data Migration — Failed', metric: '2h offline', desc: 'RPA-Bot-004 crashed on batch #445. Offline for 2 hours, HR Pool at 50%.' },
                          { severity: 'warning' as const, title: 'Record Type: Employee — Sync Failed', metric: 'Stale since 3:30 PM', desc: 'Salesforce auth token expired. Employee data is stale.' },
                          { severity: 'warning' as const, title: 'Record Type: Case — Approaching Sync Row Limit', metric: '890K rows', desc: '890,000 rows synced, approaching the platform limit.' },
                          { severity: 'info' as const, title: 'AI Skill: Customer Support — High Cost Driver', metric: '$142.30 MTD', desc: '57% of AI spend. Consider rule-based routing for simple requests.' },
                          { severity: 'info' as const, title: 'AI Guardrails: High PII Detection Rate', metric: '42 triggers', desc: '38% of guardrail events. Users may be pasting sensitive data.' },
                        ].map((insight, ii) => {
                          const cfg = { critical: { bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={16} className="text-red-500" /> }, warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={16} className="text-amber-500" /> }, info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info size={16} className="text-blue-500" /> } }[insight.severity]
                          return (
                            <div key={ii} className={`rounded-lg border ${cfg.bg} ${cfg.border} transition-all`}>
                              <button onClick={() => setExpandedInlineInsights(prev => { const next = new Set(prev); next.has(ii) ? next.delete(ii) : next.add(ii); return next })} className="w-full flex items-center gap-2 p-3 text-left">
                                <div className="flex-shrink-0">{cfg.icon}</div>
                                <span className="flex-1 text-sm font-semibold text-gray-900">{insight.title}</span>
                                <span className="px-1.5 py-0.5 bg-white/70 border border-gray-200 rounded text-[10px] font-medium text-gray-600">{insight.metric}</span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${expandedInlineInsights.has(ii) ? 'rotate-180' : ''}`} />
                              </button>
                              {expandedInlineInsights.has(ii) && (
                                <div className="px-3 pb-3 pl-9">
                                  <p className="text-xs text-gray-600 mb-2">{insight.desc}</p>
                                  {(inlineInsightStatus[ii] || 'open') === 'open' && (
                                    <div className="flex items-center gap-2">
                                      <button onClick={e => { e.stopPropagation(); setInlineInsightStatus(prev => ({ ...prev, [ii]: 'resolved' })) }} className="btn-manual">
                                        <LinkIcon size={10} />Resolve Manually
                                      </button>
                                      <button onClick={e => { e.stopPropagation(); setInlineInsightStatus(prev => ({ ...prev, [ii]: 'resolving' })); setTimeout(() => setInlineInsightStatus(prev => ({ ...prev, [ii]: 'resolved' })), 2500) }} className="btn-gradient-text">
                                        <Zap size={10} />Let Agent Resolve
                                      </button>
                                    </div>
                                  )}
                                  {(inlineInsightStatus[ii]) === 'resolving' && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin"></div>
                                      <span className="text-[11px] text-purple-600 font-medium">Agent is resolving...</span>
                                    </div>
                                  )}
                                  {(inlineInsightStatus[ii]) === 'resolved' && (
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle size={12} className="text-green-500" />
                                      <span className="text-[11px] text-green-600 font-medium">Resolved</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                        <a href="/appian-monitor" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mt-1">
                          <LinkIcon size={12} />Open Operations Console
                        </a>
                      </div>
                    )}
                    {msg.setting && (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-gray-900">{msg.setting.name}</div>
                            <div className="text-xs text-gray-500">{msg.setting.type}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">Created</span>
                        </div>
                        <div className="p-4 space-y-2">
                          {Object.entries(msg.setting.config).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-500">{key}</span>
                              <span className="font-medium text-gray-900 text-right">{val}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                          <a href={msg.setting.link} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <LinkIcon size={12} />{msg.setting.linkLabel}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mr-3 relative overflow-visible animate-[stampPulse_1.5s_ease-in-out_infinite]">
                <Sparkles size={14} className="text-white" />
                <span className="absolute w-2 h-2 bg-blue-300/50 rounded-full" style={{ animation: 'sparkCircle 3s linear infinite', offsetPath: 'circle(18px)', offsetRotate: '0deg' }} />
                <span className="absolute w-1.5 h-1.5 bg-purple-300/50 rounded-full" style={{ animation: 'sparkCircle 4s linear infinite', animationDelay: '-1.3s', offsetPath: 'circle(18px)', offsetRotate: '0deg' }} />
                <span className="absolute w-1.5 h-1.5 bg-pink-300/50 rounded-full" style={{ animation: 'sparkCircle 3.5s linear infinite', animationDelay: '-2.5s', offsetPath: 'circle(18px)', offsetRotate: '0deg' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 pb-6 pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end bg-gray-50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:border-blue-400 focus-within:shadow-md transition-all min-h-[160px]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — guardrails, interfaces, insights..."
              rows={4}
              className="flex-1 px-5 py-5 bg-transparent text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
              style={{ height: '160px', maxHeight: '200px' }}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()} className={`m-3 p-3 rounded-xl transition-all ${input.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}`}>
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
