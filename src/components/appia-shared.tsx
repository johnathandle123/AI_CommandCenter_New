import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, ArrowUp, X, Maximize2, Minimize2 } from 'lucide-react'

// ── Shared waffle option persistence ──

type WaffleOption = 'option1' | 'option2' | 'option3' | 'option4' | 'option5' | 'option6'

export function useWaffleOption(defaultVal: WaffleOption = 'option1'): [WaffleOption, (v: WaffleOption) => void, boolean] {
  const [option, setOptionState] = useState<WaffleOption>(() => {
    const stored = localStorage.getItem('waffleOption')
    return (stored as WaffleOption) || defaultVal
  })
  const setOption = (v: WaffleOption) => {
    setOptionState(v)
    localStorage.setItem('waffleOption', v)
  }
  useEffect(() => {
    const h = () => { const v = localStorage.getItem('waffleOption'); if (v) setOptionState(v as WaffleOption) }
    window.addEventListener('storage', h)
    return () => window.removeEventListener('storage', h)
  }, [])
  const isV3 = (localStorage.getItem('app-version') || '').startsWith('v3')
  const effective = isV3 ? (option === 'option4' || option === 'option6' ? option : 'option4') : option
  return [effective, setOption, isV3]
}

// ── FAB Chat Overlay (Option 5 only) ──

interface FabChatMsg {
  id: number
  role: 'user' | 'assistant'
  content: string
  setting?: { name: string; type: string; config: Record<string, string> }
  options?: string[]
}

// Multi-turn flows: clarify → think → build
type ConvoState = { step: 'idle' } | { step: 'clarifying'; topic: string; context: string } | { step: 'building'; topic: string; context: string } | { step: 'feature-confirm' } | { step: 'feature-building'; phase: number }

const thinkingSteps: Record<string, string[]> = {
  designer: ['Reading your application schema...', 'Analyzing existing objects...', 'Generating component structure...', 'Applying best practices...'],
  analyst: ['Scanning process instances...', 'Checking record sync status...', 'Aggregating performance metrics...', 'Compiling findings...'],
  admin: ['Reviewing current guardrail config...', 'Checking for conflicts...', 'Applying security policies...', 'Validating settings...'],
}

const clarifyQuestions: Record<string, Record<string, { text: string; options: string[] }>> = {
  designer: {
    'interface': { text: 'Got it — a new interface. What kind of data should it capture?', options: ['Customer feedback', 'Support request', 'Employee onboarding'] },
    'process': { text: 'Sure — a new process model. What should the workflow handle?', options: ['Approval flow', 'Review cycle', 'Onboarding steps'] },
    'record': { text: 'I can create a record type. What entity does it represent?', options: ['Customer feedback', 'Support tickets', 'Inventory items'] },
  },
  analyst: {
    'error': { text: "I'll look into that. Want me to focus on a specific area?", options: ['Processes', 'Data sync', 'RPA'] },
    'performance': { text: "I'll pull the latest metrics. Any specific area you're concerned about?", options: ['Record views', 'AI skills', 'Overall'] },
    'sync': { text: 'Checking sync status now. What details do you need?', options: ['Row counts', 'Last sync times', 'Both'] },
  },
  admin: {
    'guardrail': { text: 'I can set that up. What type of guardrail?', options: ['PII scrubbing', 'Toxicity detection', 'Prompt injection'] },
    'mcp': { text: "I'll register a new MCP server. Which config?", options: ['Default enterprise config', 'Custom endpoint'] },
    'model': { text: 'Which AI skill should I update?', options: ['Customer Support AI', 'Invoice Processing AI', 'HR Onboarding AI'] },
  },
}

const finalResponses: Record<string, Record<string, { response: string; setting: FabChatMsg['setting'] }>> = {
  designer: {
    'interface': { response: "Here's your new interface — ready for review:", setting: { name: 'Customer Feedback Form', type: 'Interface', config: { 'Components': 'Header, Text Fields (3), Dropdown, Text Area, Submit Button', 'Record Type': 'Customer Feedback', 'Status': 'Draft' } } },
    'process': { response: "Process model created:", setting: { name: 'Feedback Review Workflow', type: 'Process Model', config: { 'Nodes': 'Start → Assign → Review → Decision → Notify → End', 'Trigger': 'Record event on submission', 'Status': 'Draft' } } },
    'record': { response: "New record type is ready:", setting: { name: 'Customer Feedback', type: 'Record Type', config: { 'Source': 'Database', 'Fields': 'ID, Customer, Category, Description, Rating, Status', 'Sync': 'Enabled' } } },
  },
  analyst: {
    'error': { response: "Here's what I found:\n\n• **Invoice Processing #892** — Connection timeout (4th this week)\n• **Document Review #567** — 2 unresolved errors, 12 items queued\n• **Legacy Data Migration** — RPA-Bot-004 crashed on batch #445", setting: undefined as unknown as FabChatMsg['setting'] },
    'performance': { response: "Performance summary:\n\n⚡ Avg latency 1.3s (↓8.1%)\n🔴 Case Summary View — 8.5s max, 4.2s avg\n🟢 Customer & Employee lists — under 0.5s", setting: undefined as unknown as FabChatMsg['setting'] },
    'sync': { response: "Sync status:\n\n✅ 30/34 syncing normally\n🔴 Employee (Salesforce) — failed at 3:30 PM, auth expired\n🟡 Case — 890K rows, approaching limit", setting: undefined as unknown as FabChatMsg['setting'] },
  },
  admin: {
    'guardrail': { response: "Guardrail is live:", setting: { name: 'PII Scrubbing — Customer Data', type: 'Guardrail', config: { 'Scan Depth': 'Deep — all input and output', 'Entity Types': 'SSN, Credit Card, Phone, Email, Address', 'Action': 'Anonymize (Masking)', 'Status': 'Active' } } },
    'mcp': { response: "MCP server connected:", setting: { name: 'Enterprise Data MCP', type: 'MCP Connection', config: { 'Endpoint': 'https://mcp.internal.corp/v1', 'Auth': 'OAuth 2.0', 'Tools': '12 discovered', 'Status': 'Connected' } } },
    'model': { response: "Model updated:", setting: { name: 'Model Configuration', type: 'AI Skill Setting', config: { 'AI Skill': 'Customer Support AI', 'New Model': 'Claude 3.5 Sonnet', 'Max Tokens': '4096', 'Status': 'Active' } } },
  },
}

function detectTopic(input: string, ctx: string): string | null {
  const topics: Record<string, [string, RegExp][]> = {
    designer: [['feature', /customer.*feedback|feedback.*portal|chat.*portal|customer.*portal.*chat|portal.*feedback/i], ['interface', /interface|form|page|view|dashboard/i], ['process', /process|workflow|approval/i], ['record', /record|data|entity|type/i]],
    analyst: [['error', /error|fail|issue|wrong|attention|problem/i], ['performance', /performance|slow|latency|speed/i], ['sync', /sync|record|data|stale/i]],
    admin: [['guardrail', /guardrail|pii|toxic|injection|safety|scrub/i], ['mcp', /mcp|server|connect|integration/i], ['model', /model|claude|gpt|switch/i]],
  }
  for (const [topic, re] of (topics[ctx] || [])) { if (re.test(input)) return topic }
  return null
}

const contextSuggestions: Record<string, string[]> = {
  designer: ['Add customer feedback to my portal', 'Create a new interface', 'Build a review workflow', 'Add a new record type'],
  analyst: ['What needs my attention?', 'How is performance?', 'Any sync failures?', 'Show me process errors'],
  admin: ['Add a PII scrubbing guardrail', 'Set up toxicity detection', 'Connect a new MCP server', 'Create a content safety guardrail'],
}

export function AppiaFab({ context }: { context: 'designer' | 'analyst' | 'admin' }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [fabPos, setFabPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const [messages, setMessages] = useState<FabChatMsg[]>([])
  const [input, setInput] = useState('')
  const [thinkingText, setThinkingText] = useState<string | null>(null)
  const [convo, setConvo] = useState<ConvoState>({ step: 'idle' })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinkingText])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      setDragging(true)
      setFabPos({ x: dragRef.current.origX + (e.clientX - dragRef.current.startX), y: dragRef.current.origY + (e.clientY - dragRef.current.startY) })
    }
    const onUp = () => { dragRef.current = null; setTimeout(() => setDragging(false), 50) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const suggestions = contextSuggestions[context] || []
  const steps = thinkingSteps[context] || []

  const showThinkingThenRespond = useCallback((response: string, setting?: FabChatMsg['setting']) => {
    let stepIdx = 0
    setThinkingText(steps[0] || 'Thinking...')
    const interval = setInterval(() => {
      stepIdx++
      if (stepIdx < steps.length) {
        setThinkingText(steps[stepIdx])
      } else {
        clearInterval(interval)
        setThinkingText(null)
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: response, setting: setting || undefined }])
        setConvo({ step: 'idle' })
      }
    }, 700)
  }, [steps])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text.trim() }])
    setInput('')
    if (inputRef.current) inputRef.current.style.height = '40px'

    // Feature flow — multi-object creation
    if (convo.step === 'feature-confirm') {
      if (/yes|create|go|proceed|build/i.test(text)) {
        setConvo({ step: 'feature-building', phase: 0 })
        const objects: { delay: number; text?: string; thinking?: string; setting?: Record<string, string | Record<string, string>> }[] = [
          { delay: 0, thinking: 'Generating data model...' },
          { delay: 2500, text: 'Data objects created:', setting: { name: 'Customer Feedback Data', type: 'Record Type + CDT + Data Store', config: { 'Record Type': 'Customer Feedback — ID, Customer, Message, Rating, Category, Status, Created Date', 'Data Type': 'Customer Feedback CDT', 'Data Store': 'Feedback Data Store — synced to database', '→ View in Designer': '/appian-designer' } } },
          { delay: 3200, thinking: 'Building user interfaces...' },
          { delay: 6000, text: 'Interfaces and views created:', setting: { name: 'Feedback UI', type: '4 User Interface Objects', config: { 'Chat Interface': 'Feedback Chat — chat window, AI responses, message history', 'Submission Form': 'Feedback Submission — rating, category, text area', 'Dashboard': 'Feedback Dashboard — volume, ratings, categories', 'Site Page': 'Customer Feedback Site Page', '→ View in Designer': '/appian-designer' } } },
          { delay: 6700, thinking: 'Configuring rules and AI...' },
          { delay: 9500, text: 'Rules and AI configured:', setting: { name: 'Feedback Intelligence', type: 'Rules + AI Skill + AI Agent', config: { 'Expression Rule': 'Validate Feedback Rule', 'Decision': 'Classify Feedback — routes by category and sentiment', 'AI Skill': 'Customer Support AI — Claude 3.5 Sonnet, product knowledge base', 'AI Agent': 'Support AI Agent — auto-respond and escalate', '→ View in Designer': '/appian-designer' } } },
          { delay: 10200, thinking: 'Building process and integrations...' },
          { delay: 13000, text: 'Process and integrations created:', setting: { name: 'Feedback Workflow', type: 'Process Model + Integrations', config: { 'Process Model': 'Feedback Processing — Classify → Route → Review → Respond → Close', 'Connected System': 'Email Notification Service', 'Integration': 'Feedback API — external webhook for notifications', 'MCP Server': 'Feedback Knowledge Base — product docs, FAQ, policies', '→ View in Designer': '/appian-designer' } } },
          { delay: 13700, thinking: 'Setting up groups, security, and guardrails...' },
          { delay: 16500, text: 'Application, access, and safety configured:', setting: { name: 'Customer Feedback App', type: 'Application + Groups + Security + Guardrails', config: { 'Application': 'Customer Feedback App', 'Feedback Users': 'Portal users — submit and view own feedback', 'Feedback Admins': 'Internal team — review, respond, manage', 'Security Rule': 'Portal Access Rule — row-level security on Customer field', 'PII Scrubbing': 'Active — masks sensitive data in input and output', 'Toxicity Detection': 'Active — blocks harmful content', '→ View in Admin Console': '/admin-console' } } },
          { delay: 17200, text: 'All done! Your customer feedback feature is ready — 16 objects created across data, UI, rules, process, integrations, and security.' },
        ]
        objects.forEach(obj => {
          if (obj.thinking) {
            setTimeout(() => setThinkingText(obj.thinking!), obj.delay)
          }
          if (obj.text) {
            setTimeout(() => {
              setThinkingText(null)
              setMessages(prev => [...prev, { id: Date.now() + obj.delay, role: 'assistant' as const, content: obj.text!, setting: (obj.setting || undefined) as unknown as FabChatMsg['setting'] }])
            }, obj.delay)
          }
        })
        setTimeout(() => setConvo({ step: 'idle' }), 17200)
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "No problem. What would you like to change about the plan?" }])
          setConvo({ step: 'idle' })
        }, 400)
      }
      return
    }

    if (convo.step === 'clarifying') {
      const final = finalResponses[convo.context]?.[convo.topic]
      if (final) {
        showThinkingThenRespond(final.response, final.setting)
      } else {
        setThinkingText(null)
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Done! Let me know if you need anything else." }])
        setConvo({ step: 'idle' })
      }
      return
    }

    // First message — detect topic
    const topic = detectTopic(text, context)

    // Feature flow — customer feedback / portal chat
    if (topic === 'feature' && context === 'designer') {
      setExpanded(true)
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "I can build a complete customer feedback feature for your portal. Here is what I will create:\n\n**Data**\n::chip::Customer Feedback::Record Type::\n::chip::Customer Feedback CDT::Data Type::\n::chip::Feedback Data Store::Data Store::\n\n**User Interfaces**\n::chip::Feedback Chat Interface::Interface::\n::chip::Feedback Submission Form::Interface::\n::chip::Feedback Dashboard::Report::\n::chip::Customer Feedback Site Page::Site::\n\n**Rules & AI**\n::chip::Validate Feedback Rule::Expression Rule::\n::chip::Classify Feedback::Decision::\n::chip::Customer Support AI Skill::AI Skill::\n::chip::Support AI Agent::AI Agent::\n\n**Process**\n::chip::Feedback Processing Workflow::Process Model::\n\n**Integrations**\n::chip::Email Notification Service::Connected System::\n::chip::Feedback API::Integration::\n::chip::Feedback Knowledge Base::MCP Server::\n\n**Groups & Security**\n::chip::Customer Feedback App::Application::\n::chip::Feedback Users::Group::\n::chip::Feedback Admins::Group::\n::chip::Portal Access Rule::Security Rule::\n::chip::PII Scrubbing::Guardrail::\n::chip::Toxicity Detection::Guardrail::\n\nShould I go ahead and create everything?", options: ['Yes, create it all', 'Let me customize first'] }])
        setConvo({ step: 'feature-confirm' })
      }, 400)
      return
    }

    if (topic && clarifyQuestions[context]?.[topic]) {
      const q = clarifyQuestions[context][topic]
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: q.text, options: q.options }])
        setConvo({ step: 'clarifying', topic, context })
      }, 400)
    } else {
      const hints: Record<string, string> = {
        designer: "I can help you build in Designer. Try asking me to add customer feedback to your portal, create an interface, or build a workflow.",
        analyst: "I can surface insights about your environment — errors, performance, or sync status.",
        admin: "I can configure guardrails, connect MCP servers, or update model settings.",
      }
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: hints[context] || "How can I help?" }])
      }, 400)
    }
  }, [context, convo, showThinkingThenRespond])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const renderText = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let chipGroup: React.ReactNode[] = []

    const flushChips = () => {
      if (chipGroup.length > 0) {
        elements.push(<div key={`chips-${elements.length}`} className="flex flex-wrap gap-1.5 mb-2">{chipGroup}</div>)
        chipGroup = []
      }
    }

    lines.forEach((line, i) => {
      const chipMatch = line.match(/^::chip::(.+?)::(.+?)::$/)
      if (chipMatch) {
        const typeColors: Record<string, string> = {
          'Record Type': 'bg-orange-100 text-orange-600', 'Data Type': 'bg-orange-100 text-orange-600', 'Data Store': 'bg-orange-100 text-orange-600',
          'Interface': 'bg-blue-100 text-blue-600', 'Report': 'bg-blue-100 text-blue-600', 'Site': 'bg-blue-100 text-blue-600',
          'Expression Rule': 'bg-purple-100 text-purple-600', 'Decision': 'bg-purple-100 text-purple-600', 'AI Skill': 'bg-purple-100 text-purple-600', 'AI Agent': 'bg-purple-100 text-purple-600', 'Constant': 'bg-purple-100 text-purple-600',
          'Process Model': 'bg-indigo-100 text-indigo-600',
          'Connected System': 'bg-green-100 text-green-600', 'Integration': 'bg-green-100 text-green-600', 'MCP Server': 'bg-green-100 text-green-600',
          'Group': 'bg-red-100 text-red-600', 'Application': 'bg-pink-100 text-pink-600', 'Security Rule': 'bg-yellow-100 text-yellow-700',
          'Guardrail': 'bg-red-100 text-red-600',
        }
        const typeIcons: Record<string, string> = {
          'Record Type': '☰', 'Data Type': '{ }', 'Data Store': '⬡',
          'Interface': '□', 'Report': '▦', 'Site': '◩',
          'Expression Rule': 'ƒx', 'Decision': '◈', 'AI Skill': '✦', 'AI Agent': '⚡', 'Constant': '∞',
          'Process Model': '▷',
          'Connected System': '⇋', 'Integration': '↔', 'MCP Server': '⊕',
          'Group': '⊙', 'Application': '▣', 'Security Rule': '⊘',
          'Guardrail': '◉',
        }
        const color = typeColors[chipMatch[2]] || 'bg-gray-100 text-gray-600'
        const icon = typeIcons[chipMatch[2]] || '•'
        chipGroup.push(
          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-800 shadow-sm">
            <span className={`w-6 h-6 rounded-md ${color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{icon}</span>
            <span className="font-medium">{chipMatch[1]}</span>
            <span className="text-gray-400">· {chipMatch[2]}</span>
          </span>
        )
        return
      }

      flushChips()

      if (line.trim() === '') { elements.push(<div key={i} className="h-2" />); return }

      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
        return part
      })
      elements.push(<div key={i}>{parts}</div>)
    })

    flushChips()
    return elements
  }

  return (
    <>
      {/* FAB button */}
      {!expanded && (
      <button
        onMouseDown={e => { e.preventDefault(); dragRef.current = { startX: e.clientX, startY: e.clientY, origX: fabPos.x, origY: fabPos.y } }}
        onClick={() => { if (!dragging) setOpen(!open) }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing ${dragging ? '' : 'transition-all duration-300'} ${open ? 'bg-gray-900 rotate-0' : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 hover:shadow-xl hover:scale-105'}`}
        style={{ transform: `translate(${fabPos.x}px, ${fabPos.y}px)`, willChange: dragging ? 'transform' : 'auto' }}
      >
        {open ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
      </button>
      )}

      {/* Chat overlay */}
      {open && (
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden ${expanded ? 'border-0' : 'border border-gray-200'}`} style={{
          transition: 'top 0.5s cubic-bezier(0.32, 0.72, 0, 1), left 0.5s cubic-bezier(0.32, 0.72, 0, 1), width 0.5s cubic-bezier(0.32, 0.72, 0, 1), height 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
          top: expanded ? 0 : 'calc(100vh - 560px - 96px)',
          left: expanded ? 0 : 'calc(100vw - 420px - 24px)',
          width: expanded ? '100vw' : 420,
          height: expanded ? '100vh' : 560,
          borderRadius: expanded ? 0 : 16,
        }}>
          {/* Header */}
          <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">Appia</div>
              <div className="text-xs text-gray-500">{context === 'designer' ? 'Designer Assistant' : context === 'analyst' ? 'Analyst Assistant' : 'Admin Assistant'}</div>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={() => { setOpen(false); setExpanded(false) }} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4">
            <div className={expanded ? 'max-w-4xl mx-auto' : ''}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mb-4">
                  <Sparkles size={18} className="text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">How can I help?</p>
                <p className="text-xs text-gray-500 mb-5 text-center">Ask me anything about {context === 'designer' ? 'building objects' : context === 'analyst' ? 'your environment' : 'admin settings'}</p>
                <div className="space-y-2 w-full">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} className="group w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 text-left hover:border-gray-300 hover:scale-[1.02] font-medium" style={{ transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)' }}>
                      <span className="group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:[-webkit-background-clip:text] group-hover:[-webkit-text-fill-color:transparent] transition-all duration-500">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'messageIn 0.7s cubic-bezier(0.32, 0.72, 0, 1)' }}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center mr-2 mt-1">
                    <Sparkles size={10} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-2xl rounded-br-md px-4 py-2 text-sm' : ''}`}>
                  {msg.role === 'user' ? msg.content : (
                    <div>
                      <div className="text-gray-800 leading-relaxed text-sm mb-2">{renderText(msg.content)}</div>
                      {msg.options && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {msg.options.map((opt, oi) => (
                            <button key={oi} onClick={() => sendMessage(opt)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.setting && (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-900">{msg.setting.name}</div>
                              <div className="text-[10px] text-gray-500">{msg.setting.type}</div>
                            </div>
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">Created</span>
                          </div>
                          <div className="p-3 space-y-1.5">
                            {Object.entries(msg.setting.config).map(([key, val]) => (
                              key.startsWith('→') ? (
                                <a key={key} href={val} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mt-1">
                                  {key.replace('→ ', '')}
                                </a>
                              ) : (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-gray-500">{key}</span>
                                <span className="font-medium text-gray-900 text-right">{val}</span>
                              </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {thinkingText && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mr-2 relative overflow-visible">
                  <Sparkles size={10} className="text-white" />
                  <span className="absolute w-1.5 h-1.5 bg-blue-300/50 rounded-full" style={{ animation: 'sparkCircle 3s linear infinite', offsetPath: 'circle(15px)', offsetRotate: '0deg' }} />
                  <span className="absolute w-1 h-1 bg-purple-300/50 rounded-full" style={{ animation: 'sparkCircle 4s linear infinite', animationDelay: '-1.3s', offsetPath: 'circle(15px)', offsetRotate: '0deg' }} />
                  <span className="absolute w-1 h-1 bg-pink-300/50 rounded-full" style={{ animation: 'sparkCircle 3.5s linear infinite', animationDelay: '-2.5s', offsetPath: 'circle(15px)', offsetRotate: '0deg' }} />
                </div>
                <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 italic">{thinkingText}</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-gray-200 px-3 pb-3 pt-2">
            <div className={`${expanded ? 'max-w-4xl mx-auto' : ''}`}>
            <div className="flex items-end bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-blue-400 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); const el = e.target; el.style.height = '40px'; el.style.height = Math.min(el.scrollHeight, 80) + 'px' }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Appina..."
                rows={1}
                className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
                style={{ height: '40px', maxHeight: '80px' }}
              />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()} className={`m-1.5 p-1.5 rounded-lg transition-all ${input.trim() ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <ArrowUp size={14} />
              </button>
            </div>
            {messages.length > 0 && !thinkingText && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {suggestions.slice(0, 3).map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  {s}
                </button>
              ))}
            </div>
            )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fabSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
