import { HeadingField } from '@pglevy/sailwind'
import { Search, Filter, ExternalLink, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Package, Rocket, Activity, Users, Building2, UserCircle, Receipt, Boxes, Ticket, MessageSquare, GraduationCap, Trophy, LifeBuoy, BookOpen, Store, PanelLeftClose, PanelLeftOpen, Sparkles, X, Shield, Plug, Plus, Pencil, Trash2, ChevronRight, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { MonitorPanel } from './appian-monitor'
import { useWaffleOption, AppiaFab } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'

function McpTable() {
  const [page, setPage] = useState(0)
  const PER = 10
  const mcps = [
    { name: 'Enterprise Data MCP', endpoint: 'https://mcp.internal.corp/v1', tools: 12, status: 'Connected' },
    { name: 'Feedback Knowledge Base', endpoint: 'https://mcp.kb.corp/v1', tools: 8, status: 'Connected' },
    { name: 'HR Systems MCP', endpoint: 'https://mcp.hr.corp/v1', tools: 5, status: 'Disconnected' },
    { name: 'Customer CRM MCP', endpoint: 'https://mcp.crm.corp/v1', tools: 15, status: 'Connected' },
    { name: 'Invoice Processing MCP', endpoint: 'https://mcp.invoice.corp/v1', tools: 9, status: 'Connected' },
    { name: 'Document Store MCP', endpoint: 'https://mcp.docs.corp/v1', tools: 7, status: 'Connected' },
    { name: 'Salesforce Connector', endpoint: 'https://mcp.sf.corp/v1', tools: 18, status: 'Connected' },
    { name: 'SAP Integration MCP', endpoint: 'https://mcp.sap.corp/v1', tools: 22, status: 'Connected' },
    { name: 'Email Service MCP', endpoint: 'https://mcp.email.corp/v1', tools: 4, status: 'Connected' },
    { name: 'Slack Notifications', endpoint: 'https://mcp.slack.corp/v1', tools: 3, status: 'Connected' },
    { name: 'Compliance Database', endpoint: 'https://mcp.compliance.corp/v1', tools: 6, status: 'Connected' },
    { name: 'Fraud Detection API', endpoint: 'https://mcp.fraud.corp/v1', tools: 11, status: 'Connected' },
    { name: 'Product Catalog MCP', endpoint: 'https://mcp.catalog.corp/v1', tools: 8, status: 'Connected' },
    { name: 'Vendor Management', endpoint: 'https://mcp.vendor.corp/v1', tools: 7, status: 'Disconnected' },
    { name: 'Asset Tracking MCP', endpoint: 'https://mcp.assets.corp/v1', tools: 5, status: 'Connected' },
    { name: 'Ticketing System MCP', endpoint: 'https://mcp.tickets.corp/v1', tools: 9, status: 'Connected' },
    { name: 'Analytics Warehouse', endpoint: 'https://mcp.analytics.corp/v1', tools: 14, status: 'Connected' },
    { name: 'Identity Provider MCP', endpoint: 'https://mcp.idp.corp/v1', tools: 6, status: 'Connected' },
    { name: 'Payment Gateway MCP', endpoint: 'https://mcp.payments.corp/v1', tools: 10, status: 'Connected' },
    { name: 'Shipping & Logistics', endpoint: 'https://mcp.logistics.corp/v1', tools: 8, status: 'Disconnected' },
    { name: 'Contract Management', endpoint: 'https://mcp.contracts.corp/v1', tools: 7, status: 'Connected' },
    { name: 'Knowledge Graph MCP', endpoint: 'https://mcp.kg.corp/v1', tools: 13, status: 'Connected' },
    { name: 'Workflow Engine MCP', endpoint: 'https://mcp.workflow.corp/v1', tools: 11, status: 'Connected' },
    { name: 'Audit Log Service', endpoint: 'https://mcp.audit.corp/v1', tools: 4, status: 'Connected' },
    { name: 'Geolocation MCP', endpoint: 'https://mcp.geo.corp/v1', tools: 3, status: 'Connected' },
    { name: 'Translation Service', endpoint: 'https://mcp.translate.corp/v1', tools: 5, status: 'Connected' },
    { name: 'Calendar Integration', endpoint: 'https://mcp.calendar.corp/v1', tools: 6, status: 'Connected' },
    { name: 'File Storage MCP', endpoint: 'https://mcp.files.corp/v1', tools: 8, status: 'Connected' },
    { name: 'Notification Hub', endpoint: 'https://mcp.notify.corp/v1', tools: 7, status: 'Connected' },
    { name: 'Legacy ERP Bridge', endpoint: 'https://mcp.erp.corp/v1', tools: 16, status: 'Disconnected' },
  ]
  const paged = mcps.slice(page * PER, (page + 1) * PER)
  const totalPages = Math.ceil(mcps.length / PER)
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Server</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Endpoint</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tools</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th><th className="px-4 py-3"></th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {paged.map((m, i) => (
            <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td><td className="px-4 py-3 text-sm font-mono text-gray-500 text-xs">{m.endpoint}</td><td className="px-4 py-3 text-sm text-gray-700">{m.tools}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${m.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{m.status}</span></td><td className="px-4 py-3 flex gap-1"><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil size={14} /></button><button className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></td></tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-500">{page * PER + 1}–{Math.min((page + 1) * PER, mcps.length)} of {mcps.length}</span>
        <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded text-xs font-medium ${i === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
        ))}</div>
      </div>
    </div>
  )
}

function SettingsEvalsTable({ onAdd }: { onAdd: () => void }) {
  const evals = [
    { name: 'Invoice Extraction Accuracy', object: 'Invoice Processing AI', lastRun: '4/22/2026 9:15 AM', score: '97.2%', cases: 500, status: 'Passed' },
    { name: 'Customer Routing Quality', object: 'Support Triage Agent', lastRun: '4/22/2026 8:30 AM', score: '94.8%', cases: 350, status: 'Passed' },
    { name: 'PII Detection Coverage', object: 'Customer Support AI', lastRun: '4/21/2026 11:00 PM', score: '99.1%', cases: 1000, status: 'Passed' },
    { name: 'Onboarding Completeness', object: 'Onboarding Agent', lastRun: '4/21/2026 6:00 PM', score: '88.4%', cases: 200, status: 'Warning' },
    { name: 'Fraud Signal Precision', object: 'Fraud Detection', lastRun: '4/21/2026 3:00 PM', score: '91.6%', cases: 750, status: 'Passed' },
    { name: 'Compliance Response Check', object: 'Compliance Review Agent', lastRun: '4/20/2026 10:00 AM', score: '78.3%', cases: 150, status: 'Failed' },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Evaluations</h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><Plus size={14} />Add Evaluation</button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Evaluation</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Object</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Run</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Score</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Test Cases</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {evals.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{e.name}</td><td className="px-4 py-3 text-sm text-gray-700">{e.object}</td><td className="px-4 py-3 text-sm text-gray-700">{e.lastRun}</td><td className="px-4 py-3 text-sm font-medium"><span className={parseFloat(e.score) >= 95 ? 'text-green-600' : parseFloat(e.score) >= 90 ? 'text-yellow-600' : 'text-red-600'}>{e.score}</span></td><td className="px-4 py-3 text-sm text-gray-700">{e.cases}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${e.status === 'Passed' ? 'bg-green-100 text-green-800' : e.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{e.status}</span></td><td className="px-4 py-3 flex gap-1"><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil size={14} /></button><button className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SettingsAddModal({ type, onClose }: { type: string; onClose: () => void }) {
  const fields: Record<string, string[]> = {
    User: ['Full Name', 'Email', 'Role', 'Groups'],
    Guardrail: ['Name', 'Type', 'Applied To', 'Action', 'Scan Depth'],
    Evaluation: ['Name', 'AI Object', 'Test Dataset', 'Passing Score Threshold'],
  }
  return (
    <div className="p-6 space-y-4">
      {(fields[type] || []).map((f, i) => (
        <div key={i}><label className="block text-sm font-medium text-gray-700 mb-1">{f}</label>
          {f === 'Role' ? <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Designer</option><option>System Administrator</option><option>Viewer</option></select>
          : f === 'Type' ? <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Content Safety</option><option>Input Validation</option><option>Output Validation</option><option>Usage Control</option><option>Compliance</option></select>
          : <input type="text" placeholder={`Enter ${f.toLowerCase()}...`} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />}
        </div>
      ))}
      <div className="flex gap-2 pt-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Create {type}</button>
      </div>
    </div>
  )
}

function SettingsGuardrailsTable({ onAdd }: { onAdd: () => void }) {
  const [page, setPage] = useState(0)
  const PER = 10
  const guardrails = [
    { name: 'PII Scrubbing — Customer Data', type: 'Content Safety', appliedTo: 'Customer Support AI, Onboarding Agent', triggers: 1245, status: 'Active' },
    { name: 'Toxicity Detection', type: 'Content Safety', appliedTo: 'All AI Skills', triggers: 89, status: 'Active' },
    { name: 'Prompt Injection Guard', type: 'Input Validation', appliedTo: 'All AI Skills, All AI Agents', triggers: 342, status: 'Active' },
    { name: 'Hallucination Check', type: 'Output Validation', appliedTo: 'Invoice Processing AI, Compliance Review Agent', triggers: 56, status: 'Active' },
    { name: 'Cost Limit — Per Invocation', type: 'Usage Control', appliedTo: 'Fraud Detection, Support Triage Agent', triggers: 12, status: 'Active' },
    { name: 'Rate Limiter — Customer Portal', type: 'Usage Control', appliedTo: 'Customer Support AI', triggers: 8, status: 'Warning' },
    { name: 'Data Residency — EU', type: 'Compliance', appliedTo: 'HR Benefits AI', triggers: 0, status: 'Active' },
    { name: 'PII Scrubbing — Employee Data', type: 'Content Safety', appliedTo: 'HR Benefits AI, Onboarding Agent', triggers: 890, status: 'Active' },
    { name: 'Profanity Filter', type: 'Content Safety', appliedTo: 'Customer Support AI', triggers: 234, status: 'Active' },
    { name: 'Output Length Limit', type: 'Output Validation', appliedTo: 'All AI Skills', triggers: 45, status: 'Active' },
    { name: 'Sensitive Topic Block', type: 'Content Safety', appliedTo: 'Customer Support AI, HR Benefits AI', triggers: 167, status: 'Active' },
    { name: 'JSON Schema Validator', type: 'Output Validation', appliedTo: 'Invoice Processing AI', triggers: 23, status: 'Active' },
    { name: 'Rate Limiter — API', type: 'Usage Control', appliedTo: 'All AI Skills', triggers: 5, status: 'Active' },
    { name: 'Cost Limit — Daily Budget', type: 'Usage Control', appliedTo: 'All AI Skills, All AI Agents', triggers: 2, status: 'Active' },
    { name: 'Data Residency — US', type: 'Compliance', appliedTo: 'Fraud Detection, Invoice Processing AI', triggers: 0, status: 'Active' },
    { name: 'Bias Detection', type: 'Output Validation', appliedTo: 'HR Benefits AI, Support Triage Agent', triggers: 78, status: 'Active' },
    { name: 'Copyright Content Filter', type: 'Content Safety', appliedTo: 'Document Classification', triggers: 34, status: 'Active' },
    { name: 'Regex Pattern Block', type: 'Input Validation', appliedTo: 'All AI Skills', triggers: 156, status: 'Active' },
    { name: 'Token Limit — Input', type: 'Usage Control', appliedTo: 'All AI Skills', triggers: 67, status: 'Active' },
    { name: 'Grounding Check', type: 'Output Validation', appliedTo: 'Customer Support AI, Compliance Review Agent', triggers: 189, status: 'Active' },
    { name: 'HIPAA Compliance', type: 'Compliance', appliedTo: 'HR Benefits AI', triggers: 0, status: 'Active' },
    { name: 'SOC2 Audit Trail', type: 'Compliance', appliedTo: 'All AI Skills, All AI Agents', triggers: 0, status: 'Active' },
    { name: 'Jailbreak Detection', type: 'Input Validation', appliedTo: 'All AI Skills', triggers: 412, status: 'Active' },
    { name: 'Competitor Mention Block', type: 'Content Safety', appliedTo: 'Customer Support AI', triggers: 23, status: 'Active' },
    { name: 'Financial Advice Disclaimer', type: 'Output Validation', appliedTo: 'Invoice Processing AI, Fraud Detection', triggers: 890, status: 'Active' },
    { name: 'Rate Limiter — Per User', type: 'Usage Control', appliedTo: 'Customer Support AI', triggers: 34, status: 'Warning' },
    { name: 'Model Fallback Policy', type: 'Usage Control', appliedTo: 'All AI Skills', triggers: 7, status: 'Active' },
    { name: 'PII Scrubbing — Financial', type: 'Content Safety', appliedTo: 'Invoice Processing AI, Fraud Detection', triggers: 2340, status: 'Active' },
    { name: 'Language Detection', type: 'Input Validation', appliedTo: 'Customer Support AI', triggers: 56, status: 'Active' },
    { name: 'Confidence Threshold', type: 'Output Validation', appliedTo: 'Fraud Detection, Document Classification', triggers: 234, status: 'Active' },
    { name: 'GDPR Right to Erasure', type: 'Compliance', appliedTo: 'All AI Skills', triggers: 3, status: 'Active' },
    { name: 'Watermark Injection', type: 'Output Validation', appliedTo: 'Document Classification', triggers: 12, status: 'Inactive' },
    { name: 'Latency Circuit Breaker', type: 'Usage Control', appliedTo: 'All AI Skills', triggers: 18, status: 'Active' },
    { name: 'Multi-turn Context Limit', type: 'Input Validation', appliedTo: 'Support Triage Agent, Onboarding Agent', triggers: 45, status: 'Active' },
    { name: 'Ethical Use Policy', type: 'Compliance', appliedTo: 'All AI Skills, All AI Agents', triggers: 0, status: 'Active' },
  ]
  const paged = guardrails.slice(page * PER, (page + 1) * PER)
  const totalPages = Math.ceil(guardrails.length / PER)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Guardrails <span className="text-sm font-normal text-gray-500">({guardrails.length})</span></h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><Plus size={14} />Add Guardrail</button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied To</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Triggers (30d)</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {paged.map((g, i) => (
              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td><td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">{g.type}</span></td><td className="px-4 py-3 text-sm text-gray-700">{g.appliedTo}</td><td className="px-4 py-3 text-sm text-gray-700">{g.triggers.toLocaleString()}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${g.status === 'Active' ? 'bg-green-100 text-green-800' : g.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{g.status}</span></td><td className="px-4 py-3 flex gap-1"><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil size={14} /></button><button className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></td></tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-500">{page * PER + 1}–{Math.min((page + 1) * PER, guardrails.length)} of {guardrails.length}</span>
          <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded text-xs font-medium ${i === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}</div>
        </div>
      </div>
    </div>
  )
}

function SettingsUsersTable({ onAdd }: { onAdd: () => void }) {
  const [page, setPage] = useState(0)
  const PER = 15
  const firstNames = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Dorothy','Andrew','Kimberly','Paul','Emily','Joshua','Donna','Kenneth','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa','Timothy','Deborah','Ronald','Stephanie','Jason','Rebecca','Edward','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy','Nicholas','Angela','Eric','Shirley','Jonathan','Brenda','Stephen','Emma','Larry','Anna','Justin','Pamela','Scott','Nicole','Brandon','Samantha','Benjamin','Katherine','Samuel','Christine','Raymond','Debra','Gregory','Rachel','Frank','Carolyn','Alexander','Janet','Patrick','Catherine','Jack','Maria','Dennis','Heather','Jerry','Diane','Tyler','Ruth','Aaron','Julie','Jose','Olivia','Nathan','Joyce','Henry','Virginia','Peter','Victoria','Douglas','Kelly','Zachary','Lauren','Adam','Christina','Harold','Joan','Keith','Evelyn','Austin','Judith','Roger','Megan','Bruce','Andrea','Ralph','Cheryl','Roy','Hannah','Eugene','Jacqueline','Russell','Martha','Bobby','Gloria','Philip','Teresa','Louis','Ann','Johnny','Sara','Wayne','Madison','Dylan','Frances','Alan','Kathryn','Howard','Janice','Carl','Jean','Arthur','Abigail']
  const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts']
  const roles = ['System Administrator','Designer','Designer','Designer','Viewer','Viewer','Designer','Viewer','Designer','Designer']
  const times = ['2 min ago','5 min ago','15 min ago','30 min ago','1 hour ago','2 hours ago','3 hours ago','Yesterday','2 days ago','Last week']
  const users = Array.from({ length: 150 }, (_, i) => ({
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    role: roles[i % roles.length],
    groups: (i % 5) + 1,
    lastActive: times[i % times.length],
    status: i % 8 === 0 ? 'Inactive' as const : 'Active' as const,
  }))
  const paged = users.slice(page * PER, (page + 1) * PER)
  const totalPages = Math.ceil(users.length / PER)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Users <span className="text-sm font-normal text-gray-500">({users.length})</span></h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><Plus size={14} />Add User</button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Groups</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Active</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {paged.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">{u.name.split(' ').map(n => n[0]).join('')}</div>{u.name}</td><td className="px-4 py-3 text-sm text-gray-700">{u.role}</td><td className="px-4 py-3 text-sm text-gray-700">{u.groups}</td><td className="px-4 py-3 text-sm text-gray-700">{u.lastActive}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{u.status}</span></td><td className="px-4 py-3 flex gap-1"><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil size={14} /></button><button className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></td></tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-500">{page * PER + 1}–{Math.min((page + 1) * PER, users.length)} of {users.length}</span>
          <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded text-xs font-medium ${i === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}</div>
        </div>
      </div>
    </div>
  )
}

export default function AppianDesigner() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')
  const [settingsSubTab, setSettingsSubTab] = useState<'users' | 'guardrails' | 'evaluations' | 'properties' | 'security' | 'documentation' | 'actions' | 'mcp' | 'precedents' | 'security-summary' | null>(null)
  const [settingsSearch, setSettingsSearch] = useState('')
  const [addModal, setAddModal] = useState<string | null>(null)
  const [designerNavOption, setDesignerNavOption] = useState<'1' | '2' | '3'>('1')
  const [aiSubTab, setAiSubTab] = useState<'guardrails' | 'mcp'>('guardrails')
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [showAppMenu, setShowAppMenu] = useState(false)
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false)
  const [showMcpModal, setShowMcpModal] = useState(false)
  const [, setLocation] = useLocation()
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option1')
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')

  const allWaffleApps = [
    { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', path: '/appian-ai', options: ['option5'] as const },
    { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', active: true, path: '/appian-designer' },
    { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
    { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard', options: ['option1'] as const },
    { name: 'Operations Console', icon: Monitor, color: 'bg-cyan-600', path: '/dashboard', options: ['option1','option2'] as const },
    { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
    { name: 'Process HQ', icon: Activity, color: 'bg-rose-500', path: '/process-hq', options: ['option4', 'option6'] as const },
    { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
    { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
    { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' }
  ]

  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))

  const allSites = [
    'Admin Console', 'AI Command Center', 'Appian Designer', 'Operations Console',
    'Appian RPA', 'Cloud Database', 'Connected Systems', 'Data Fabric',
    'Decision Platform', 'DevOps Infrastructure', 'Feature Flags',
    'Health Check', 'Integration Console', 'Low-Code Designer',
    'Operations Console', 'Performance Monitor', 'Portal Manager',
    'Process Mining', 'Record Manager', 'Security Console',
    'System Logs', 'Task Manager', 'User Management',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))

  const helpApps = [
    { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
    { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWaffleMenu && !(event.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false)
      if (showAppMenu && !(event.target as Element).closest('.app-menu')) setShowAppMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showWaffleMenu, showAppMenu])

  const recentApps = [
    { name: 'Customer Portal', editors: ['JD', 'SM', 'AK'], lastModified: '2 hours ago', description: 'Customer-facing portal application', icon: Building2, color: 'bg-blue-500' },
    { name: 'HR Onboarding', editors: ['SM', 'MG'], lastModified: '5 hours ago', description: 'Employee onboarding workflow', icon: UserCircle, color: 'bg-green-500' },
    { name: 'Invoice Processing', editors: ['AK', 'DC', 'SM', 'JD'], lastModified: 'Yesterday', description: 'Automated invoice approval system', icon: Receipt, color: 'bg-purple-500' }
  ]

  const applications = [
    { name: 'Customer Portal', description: 'Customer-facing portal application', lastModified: '1/15/2026 7:45 AM', modifiedBy: 'John Doe', icon: Building2, color: 'bg-blue-500' },
    { name: 'HR Onboarding', description: 'Employee onboarding workflow', lastModified: '1/15/2026 4:30 AM', modifiedBy: 'Sarah Miller', icon: UserCircle, color: 'bg-green-500' },
    { name: 'Invoice Processing', description: 'Automated invoice approval system', lastModified: '1/14/2026 3:20 PM', modifiedBy: 'Alex Kim', icon: Receipt, color: 'bg-purple-500' },
    { name: 'Asset Management', description: 'Track and manage company assets', lastModified: '1/14/2026 11:15 AM', modifiedBy: 'Maria Garcia', icon: Boxes, color: 'bg-orange-500' },
    { name: 'Help Desk', description: 'IT support ticket management', lastModified: '1/13/2026 2:45 PM', modifiedBy: 'David Chen', icon: Ticket, color: 'bg-teal-500' }
  ]

  const communityItems = [
    { title: 'Discuss', desc: 'Collaborate with developers', icon: MessageSquare, color: 'bg-blue-900' },
    { title: 'Learn', desc: 'Appian Academy & Certifications', icon: GraduationCap, color: 'bg-blue-900' },
    { title: 'Success', desc: 'Best practices with Appian Max', icon: Trophy, color: 'bg-blue-900' },
    { title: 'Support', desc: 'Browse support articles', icon: LifeBuoy, color: 'bg-blue-900' },
    { title: 'Documentation', desc: 'Tutorials and references', icon: BookOpen, color: 'bg-blue-900' },
    { title: 'AppMarket', desc: 'Browse plug-ins and utilities', icon: Store, color: 'bg-blue-900' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center">
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
            <VersionSwitcher />
            <button className="p-2 rounded-md hover:bg-white/20 transition-colors">
              <Search size={20} className="text-black" />
            </button>
            <div className="relative app-menu">
              <button onClick={() => setShowAppMenu(!showAppMenu)} className="p-2 rounded-md hover:bg-white/20 transition-colors">
                <Settings size={20} className={showAppMenu ? 'text-blue-500' : 'text-black'} />
              </button>
              {showAppMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] w-56 py-1">
                  {[
                    { label: 'Application Properties', action: () => setShowAppMenu(false) },
                    { label: 'Application Security', action: () => setShowAppMenu(false) },
                    { label: 'Application Documentation', action: () => setShowAppMenu(false) },
                    { label: 'Application Actions', action: () => setShowAppMenu(false) },
                    { label: 'Application Guardrails', action: () => { setShowGuardrailsModal(true); setShowAppMenu(false) } },
                    { label: 'Application MCP', action: () => { setShowMcpModal(true); setShowAppMenu(false) } },
                    { label: 'Missing Precedents', action: () => setShowAppMenu(false) },
                    { label: 'Security Summary', action: () => setShowAppMenu(false) },
                    { label: 'Manage Test Cases', action: () => setShowAppMenu(false) },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{item.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className="p-2 rounded-md hover:bg-white/20 transition-colors relative waffle-menu"
            >
              <Grid3X3 size={20} className={showWaffleMenu ? "text-blue-500" : "text-black"} />
            </button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
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
                  {waffleApps.map((app, index) => { const Icon = app.icon; return (
                    <Link key={index} href={app.path || '/dashboard'}><button className={`flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left w-full ${app.active ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:text-blue-500'}`} onClick={() => setShowWaffleMenu(false)}>
                      <div className={`${app.color} rounded-lg p-2 flex items-center justify-center`}><Icon size={16} className="text-white" /></div>
                      <span className="font-medium text-xs text-center">{app.name}</span>
                    </button></Link>
                  )})}
                </div>
                <div className="border-t border-gray-200 mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                  {helpApps.map((app, index) => { const Icon = app.icon; return (
                    <button key={index} className="flex flex-col items-center gap-2 p-3 rounded-md transition-colors text-left text-gray-700 hover:text-blue-500" onClick={() => setShowWaffleMenu(false)}>
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

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Navigation */}
        <div className={`${navCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          <nav className={`flex flex-col ${navCollapsed ? 'p-2' : 'p-4'} space-y-1 flex-1`}>
            {[
              { id: 'applications', label: 'Applications', icon: Package },
              { id: 'objects', label: 'Objects', icon: Database },
              { id: 'deploy', label: 'Deploy', icon: Rocket },
              { id: 'monitor', label: 'Monitor', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={navCollapsed ? tab.label : undefined}
                  className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {!navCollapsed && <span className="font-medium">{tab.label}</span>}
                </button>
              )
            })}

            {/* Option 2: Users, Guardrails, MCP as direct nav items */}
            {designerNavOption === '2' && (<>
              <div className="border-t border-gray-200 my-2"></div>
              {[{ id: 'nav-users', label: 'Users', icon: Users }, { id: 'nav-guardrails', label: 'Guardrails', icon: Shield }, { id: 'nav-mcp', label: 'MCP', icon: Plug }].map(tab => {
                const Icon = tab.icon
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} title={navCollapsed ? tab.label : undefined} className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}><Icon size={20} />{!navCollapsed && <span className="font-medium">{tab.label}</span>}</button>
              })}
            </>)}

            {/* Option 3: Users + AI section */}
            {designerNavOption === '3' && (<>
              <div className="border-t border-gray-200 my-2"></div>
              {[{ id: 'nav-users', label: 'Users', icon: Users }, { id: 'nav-ai', label: 'AI', icon: Brain }].map(tab => {
                const Icon = tab.icon
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} title={navCollapsed ? tab.label : undefined} className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}><Icon size={20} />{!navCollapsed && <span className="font-medium">{tab.label}</span>}</button>
              })}
            </>)}

            {/* Option 1: Settings tab */}
            {designerNavOption === '1' && (<>
              <div className="border-t border-gray-200 my-2"></div>
              <button onClick={() => { setActiveTab('settings') }} title={navCollapsed ? 'Settings' : undefined} className={`flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}><Settings size={20} />{!navCollapsed && <span className="font-medium">Settings</span>}</button>
            </>)}

            {/* Nav option switcher */}
            {!navCollapsed && (
              <div className="mt-auto pt-3 border-t border-gray-200">
                <select value={designerNavOption} onChange={e => { setDesignerNavOption(e.target.value as '1' | '2' | '3'); setActiveTab('applications') }} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1">Option 1 — Recommended</option>
                  <option value="2">Option 2 — Direct Nav</option>
                  <option value="3">Option 3 — AI Section</option>
                </select>
              </div>
            )}
          </nav>
          <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-4 border-t border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center">
            {navCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'monitor' ? (
            <MonitorPanel />
          ) : activeTab === 'nav-users' ? (
            <div className="p-6 max-w-5xl mx-auto"><SettingsUsersTable onAdd={() => setAddModal('User')} /></div>
          ) : activeTab === 'nav-guardrails' ? (
            <div className="p-6 max-w-5xl mx-auto"><SettingsGuardrailsTable onAdd={() => setAddModal('Guardrail')} /></div>
          ) : activeTab === 'nav-mcp' ? (
            <div className="p-6 max-w-5xl mx-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">MCP</h2>
              <McpTable />
            </div>
          ) : activeTab === 'nav-ai' ? (
            <div className="p-6 max-w-5xl mx-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">AI</h2>
              <div className="flex gap-4 border-b border-gray-200 mb-6">
                {([['guardrails', 'Guardrails'], ['mcp', 'MCP']] as const).map(([id, label]) => (
                  <button key={id} onClick={() => setAiSubTab(id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${aiSubTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{label}</button>
                ))}
              </div>
              {aiSubTab === 'guardrails' && (<SettingsGuardrailsTable onAdd={() => setAddModal('Guardrail')} />)}
              {aiSubTab === 'mcp' && (<McpTable />)}
            </div>
          ) : activeTab === 'settings' ? (
            <div className="flex-1 overflow-auto p-6 max-w-5xl mx-auto">
              {!settingsSubTab ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Settings</h2>
                  <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search settings..." value={settingsSearch} onChange={e => setSettingsSearch(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="space-y-2">
                    {([
                      ['properties', 'Properties', Settings, 'General configuration and metadata'],
                      ['users', 'Users', Users, 'Manage user accounts, roles, and permissions'],
                      ['guardrails', 'Guardrails', Shield, 'AI safety rules, content policies, and usage controls'],
                      ['evaluations', 'Evaluations', Filter, 'AI quality tests, benchmarks, and run history'],
                      ['security', 'Security', Shield, 'Access controls and security policies'],
                      ['documentation', 'Documentation', FileText, 'Docs, guides, and release notes'],
                      ['actions', 'Actions', Rocket, 'Automated actions and triggers'],
                      ['mcp', 'MCP', Plug, 'Model context protocol connections'],
                      ['precedents', 'Missing Precedents', ExternalLink, 'Unresolved object dependencies'],
                      ['security-summary', 'Security Summary', Shield, 'Overview of all security settings'],
                    ] as [string, string, typeof Users, string][])
                      .filter(([, label]) => !settingsSearch || label.toLowerCase().includes(settingsSearch.toLowerCase()))
                      .map(([id, label, Icon, desc]) => (
                      <button key={id} onClick={() => setSettingsSubTab(id as any)} className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm text-left transition-all">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><Icon size={20} /></div>
                        <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{label}</div><div className="text-xs text-gray-500">{desc}</div></div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSettingsSubTab(null)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"><ArrowLeft size={14} />Back to Settings</button>
                  {settingsSubTab === 'users' && (<SettingsUsersTable onAdd={() => setAddModal('User')} />)}
                  {settingsSubTab === 'guardrails' && (<SettingsGuardrailsTable onAdd={() => setAddModal('Guardrail')} />)}
                  {settingsSubTab === 'evaluations' && (<SettingsEvalsTable onAdd={() => setAddModal('Evaluation')} />)}
                  {settingsSubTab === 'properties' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Properties</h2>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                        {[['Name', 'Customer Feedback App'], ['Description', 'Customer feedback portal with AI-powered routing'], ['Prefix', 'CFA'], ['Version', '2.4.1'], ['Created', '11/15/2025'], ['Last Modified', '4/22/2026 9:15 AM'], ['Owner', 'john.smith']].map(([label, val], i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3"><span className="text-sm text-gray-500">{label}</span><span className="text-sm font-medium text-gray-900">{val}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {settingsSubTab === 'security' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Security</h2>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Group</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Permission</th><th className="px-4 py-3"></th></tr></thead>
                          <tbody className="divide-y divide-gray-200">
                            {[['Administrators', 'Admin'], ['Designers', 'Editor'], ['Feedback Users', 'Viewer'], ['Feedback Admins', 'Editor'], ['Portal Users', 'Viewer']].map(([g, p], i) => (
                              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{g}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${p === 'Admin' ? 'bg-red-100 text-red-700' : p === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{p}</span></td><td className="px-4 py-3 flex gap-1"><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil size={14} /></button><button className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {settingsSubTab === 'documentation' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Documentation</h2>
                      <div className="bg-white rounded-lg border border-gray-200 p-6"><p className="text-sm text-gray-500 mb-4">Add documentation, release notes, and guides for this application.</p><textarea className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter documentation..." defaultValue="# Customer Feedback App\n\nThis application handles customer feedback collection, AI-powered routing, and response management." /></div>
                    </div>
                  )}
                  {settingsSubTab === 'actions' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
                          <tbody className="divide-y divide-gray-200">
                            {[['Submit Feedback', 'Process Model', 'Active'], ['Escalate Case', 'Process Model', 'Active'], ['Generate Report', 'Smart Service', 'Active'], ['Archive Old Cases', 'Scheduled', 'Paused']].map(([name, type, status], i) => (
                              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td><td className="px-4 py-3 text-sm text-gray-700">{type}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{status}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {settingsSubTab === 'mcp' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">MCP</h2>
                      <McpTable />
                    </div>
                  )}
                  {settingsSubTab === 'precedents' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Missing Precedents</h2>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Object</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Referenced By</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Severity</th></tr></thead>
                          <tbody className="divide-y divide-gray-200">
                            {[['getLegacyCustomer', 'Expression Rule', 'Customer Onboarding Interface', 'High'], ['OLD_EmailTemplate', 'Constant', 'Notification Process', 'Medium']].map(([obj, type, ref, sev], i) => (
                              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-mono text-red-600">{obj}</td><td className="px-4 py-3 text-sm text-gray-700">{type}</td><td className="px-4 py-3 text-sm text-gray-700">{ref}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${sev === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{sev}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {settingsSubTab === 'security-summary' && (
                    <div><h2 className="text-lg font-bold text-gray-900 mb-4">Security Summary</h2>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {[['Total Groups', '5'], ['Objects with Security', '42 / 48'], ['Unrestricted Objects', '6']].map(([label, val], i) => (
                          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4"><div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div><div className="text-lg font-bold text-gray-900">{val}</div></div>
                        ))}
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Object</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Security</th></tr></thead>
                          <tbody className="divide-y divide-gray-200">
                            {[['Feedback Dashboard', 'Report', 'Unrestricted'], ['Test Interface', 'Interface', 'Unrestricted'], ['Debug Process', 'Process Model', 'Unrestricted'], ['Customer Record', 'Record Type', 'Row-level'], ['Invoice Record', 'Record Type', 'Row-level'], ['Feedback Form', 'Interface', 'Group-based']].map(([obj, type, sec], i) => (
                              <tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-gray-900">{obj}</td><td className="px-4 py-3 text-sm text-gray-700">{type}</td><td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${sec === 'Unrestricted' ? 'bg-red-100 text-red-800' : sec === 'Row-level' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-800'}`}>{sec}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
          <div className="container mx-auto px-6 py-6 max-w-7xl">

            <div className="grid grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="col-span-9">
                {/* Page Header */}
                <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <HeadingField text="Let's get started" size="LARGE" marginBelow="STANDARD" />
                  <p className="text-gray-600 mb-6">Build powerful applications with Appian's low-code platform</p>
                  
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
                      <Package size={18} />
                      NEW APPLICATION
                    </button>
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors">
                      <ExternalLink size={18} />
                      IMPORT
                    </button>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <HeadingField text="Recent Applications" size="MEDIUM" marginBelow="NONE" />
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {recentApps.map((app, idx) => {
                      const Icon = app.icon
                      return (
                        <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center`}>
                              <Icon size={24} className="text-white" />
                            </div>
                            <div className="flex -space-x-2">
                              {app.editors.slice(0, 3).map((editor, ei) => {
                                const palette = ['bg-teal-100 text-teal-600','bg-indigo-100 text-indigo-600','bg-rose-100 text-rose-600','bg-amber-100 text-amber-600','bg-violet-100 text-violet-600']
                                return (
                                  <div key={ei} className={`w-8 h-8 rounded-full ${palette[ei % palette.length]} flex items-center justify-center text-xs font-bold ring-2 ring-white`}>
                                    {editor}
                                  </div>
                                )
                              })}
                              {app.editors.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                  +{app.editors.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                          <h3 
                            onClick={() => setLocation('/build-view')}
                            className="font-bold text-gray-900 hover:text-blue-700 cursor-pointer mb-2 transition-colors"
                          >
                            {app.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                          <p className="text-xs text-gray-500 font-medium">{app.lastModified}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-6 bg-gray-50">
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
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Filter className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Modified</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app, idx) => {
                          const Icon = app.icon
                          return (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center`}>
                                    <Icon size={20} className="text-white" />
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
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-3">
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                  <HeadingField text="Learn More" size="MEDIUM" marginBelow="STANDARD" />
                  
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors">
                      <div className="font-bold text-gray-900 mb-1">Release Notes</div>
                      <div className="text-xs text-gray-600">View latest updates</div>
                    </button>

                    <button className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors">
                      <div className="font-bold text-gray-900 mb-1">About This Environment</div>
                      <div className="text-xs text-gray-600">Version and data sources</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <HeadingField text="Community" size="MEDIUM" marginBelow="STANDARD" />
                  <div className="space-y-2">
                    {communityItems.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <button key={idx} className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`${item.color} rounded-lg p-2 flex items-center justify-center`}>
                              <Icon size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</div>
                              <div className="text-xs text-gray-600">{item.desc}</div>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Application Guardrails Modal */}
      {showGuardrailsModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setShowGuardrailsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><Shield size={18} className="text-blue-500" /><h3 className="text-lg font-semibold text-gray-900">Application Guardrails</h3></div>
              <button onClick={() => setShowGuardrailsModal(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Guardrail</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Applied To</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'PII Scrubbing — Names', type: 'Semantic', objects: 'Customer Support AI, Feedback Chat Interface', status: 'Active' },
                    { name: 'PII Scrubbing — SSN', type: 'Regex', objects: 'All AI Skills', status: 'Active' },
                    { name: 'PII Scrubbing — Email', type: 'Regex', objects: 'Customer Support AI, HR Onboarding AI', status: 'Active' },
                    { name: 'Toxicity Detection', type: 'Keyword', objects: 'Customer Support AI, Feedback Chat Interface', status: 'Active' },
                    { name: 'Prompt Injection Shield', type: 'Semantic', objects: 'All AI Skills', status: 'Active' },
                    { name: 'Competitor Detection', type: 'Keyword', objects: 'Customer Support AI', status: 'Inactive' },
                  ].map((g, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${g.type === 'Regex' ? 'bg-blue-100 text-blue-700' : g.type === 'Semantic' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{g.type}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{g.objects}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${g.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{g.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Application MCP Modal */}
      {showMcpModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center" onClick={() => setShowMcpModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><Plug size={18} className="text-green-500" /><h3 className="text-lg font-semibold text-gray-900">Application MCP Connections</h3></div>
              <button onClick={() => setShowMcpModal(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Object</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">MCP Server</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tools Used</th><th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { object: 'Customer Support AI Skill', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'search_records, get_customer', status: 'Connected' },
                    { object: 'Feedback Chat Interface', type: 'Interface', server: 'Feedback Knowledge Base', tools: 'search_docs, get_faq', status: 'Connected' },
                    { object: 'Invoice Processing AI', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'get_invoice, validate_amount', status: 'Connected' },
                    { object: 'HR Onboarding AI', type: 'AI Skill', server: 'Enterprise Data MCP', tools: 'get_employee, check_benefits', status: 'Connected' },
                    { object: 'Document Review AI', type: 'AI Skill', server: 'Document Search MCP', tools: 'search_docs, extract_text', status: 'Connected' },
                    { object: 'Case Summary View', type: 'Interface', server: 'CRM Integration MCP', tools: 'get_case_history', status: 'Degraded' },
                  ].map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.object}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.type}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{m.server}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{m.tools}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${m.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {addModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setAddModal(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Add {addModal}</h3>
              <button onClick={() => setAddModal(null)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <SettingsAddModal type={addModal} onClose={() => setAddModal(null)} />
          </div>
        </div>
      )}
      {waffleOption === 'option5' && <AppiaFab context="designer" />}
    </div>
  )
}
