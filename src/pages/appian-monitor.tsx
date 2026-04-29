import { HeadingField } from '@pglevy/sailwind'
import { Search, Grid3X3, Paintbrush, Settings, Brain, Monitor, Database, Flag, FileText, Info, HelpCircle, Activity, AlertTriangle, XCircle, Clock, RefreshCw, Bot, BarChart3, Globe, Layers, PanelLeftClose, PanelLeftOpen, Sparkles, CheckCircle, Zap, ExternalLink as LinkIcon, ChevronDown, Download, Home, List, SlidersHorizontal, Lightbulb } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { useWaffleOption, AppiaFab } from '../components/appia-shared'
import VersionSwitcher from '../components/VersionSwitcher'

const allWaffleApps = [
  { name: 'Appina', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400', path: '/appian-ai', options: ['option5'] as const },
  { name: 'Appian Designer', icon: Paintbrush, color: 'bg-blue-500', path: '/appian-designer' },
  { name: 'Admin Console', icon: Settings, color: 'bg-green-500', path: '/admin-console' },
  { name: 'AI Command Center', icon: Brain, color: 'bg-purple-500', path: '/dashboard', options: ['option1'] as const },
  { name: 'Operations Console', icon: Monitor, color: 'bg-cyan-600', path: '/dashboard', options: ['option1','option2'] as const },
  { name: 'Operations Console', icon: Activity, color: 'bg-orange-500', active: true, path: '/appian-monitor', options: ['option3', 'option4', 'option5'] as const },
  { name: 'Process HQ', icon: BarChart3, color: 'bg-rose-500', path: '/process-hq', options: ['option4', 'option6'] as const },
  { name: 'Cloud Database', icon: Database, color: 'bg-teal-500', path: '/dashboard' },
  { name: 'Feature Flags', icon: Flag, color: 'bg-indigo-500', path: '/dashboard' },
  { name: 'System Logs', icon: FileText, color: 'bg-red-500', path: '/dashboard' },
]
const helpApps = [
  { name: 'About Appian', icon: Info, color: 'bg-gray-500' },
  { name: 'Help', icon: HelpCircle, color: 'bg-yellow-500' },
]

// ── Content Components ──

function ObserveContent() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Requests', value: '3,842', change: '+12.4%' },
          { label: 'Avg Latency', value: '1.3s', change: '-8.1%' },
          { label: 'Error Rate', value: '0.9%', change: '-2.3%' },
          { label: 'Est. Cost (MTD)', value: '$247.50', change: '+5.2%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className={`text-xs font-medium ${kpi.change.startsWith('-') ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-sm font-bold text-gray-700 mb-4">Requests Over Time</div>
          <div className="h-40 flex items-end gap-1">
            {[65,45,72,58,80,92,68,85,78,95,88,70,82,90,75,98,84,60,73,88,92,78,85,96].map((v, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, backgroundColor: i === 23 ? '#3b82f6' : '#dbeafe' }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-sm font-bold text-gray-700 mb-4">Latency (p50 / p95 / p99)</div>
          <div className="h-40 flex items-end gap-0.5">
            {[{p50:30,p95:55,p99:70},{p50:28,p95:50,p99:65},{p50:35,p95:60,p99:78},{p50:25,p95:48,p99:62},{p50:32,p95:58,p99:75},{p50:38,p95:65,p99:82},{p50:30,p95:52,p99:68},{p50:27,p95:50,p99:66},{p50:33,p95:56,p99:72},{p50:36,p95:62,p99:80},{p50:29,p95:51,p99:67},{p50:31,p95:54,p99:71}].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                <div className="rounded-t bg-red-200" style={{ height: `${v.p99 - v.p95}%` }}></div>
                <div className="bg-orange-200" style={{ height: `${v.p95 - v.p50}%` }}></div>
                <div className="bg-blue-400 rounded-b" style={{ height: `${v.p50}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>p50</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-200"></span>p95</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200"></span>p99</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-sm font-bold text-gray-700 mb-4">Cost Over Time</div>
          <div className="h-40 relative">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs><linearGradient id="monCostFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" /></linearGradient></defs>
              <path d="M0,90 C20,85 40,70 60,72 C80,74 100,60 120,55 C140,50 160,58 180,45 C200,32 220,40 240,35 C260,30 280,22 300,18" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <path d="M0,90 C20,85 40,70 60,72 C80,74 100,60 120,55 C140,50 160,58 180,45 C200,32 220,40 240,35 C260,30 280,22 300,18 L300,120 L0,120 Z" fill="url(#monCostFill)" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-sm font-bold text-gray-700 mb-4">Guardrail Triggers</div>
          <div className="space-y-3">
            {[{label:'PII Detected',count:42,pct:38,color:'bg-red-400'},{label:'Toxicity Blocked',count:28,pct:25,color:'bg-orange-400'},{label:'Prompt Injection',count:19,pct:17,color:'bg-yellow-400'},{label:'Topic Off-limits',count:14,pct:13,color:'bg-blue-400'},{label:'Hallucination Flag',count:8,pct:7,color:'bg-purple-400'}].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-700 font-medium">{item.label}</span><span className="text-gray-500">{item.count} ({item.pct}%)</span></div>
                <div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50"><HeadingField text="Per-Skill Breakdown" size="MEDIUM" marginBelow="NONE" /></div>
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Skill</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Requests</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Latency</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Error Rate</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guardrail Hits</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[{ name: 'Customer Support AI', requests: '2,156', latency: '1.1s', errorRate: '0.8%', guardrails: 64, cost: '$142.30' },{ name: 'Invoice Processing AI', requests: '987', latency: '1.8s', errorRate: '1.2%', guardrails: 31, cost: '$72.40' },{ name: 'HR Onboarding AI', requests: '699', latency: '0.9s', errorRate: '0.3%', guardrails: 16, cost: '$32.80' }].map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td><td className="px-6 py-4 text-sm text-gray-700">{s.requests}</td><td className="px-6 py-4 text-sm text-gray-700">{s.latency}</td><td className="px-6 py-4 text-sm text-gray-700">{s.errorRate}</td><td className="px-6 py-4 text-sm text-gray-700">{s.guardrails}</td><td className="px-6 py-4 text-sm font-medium text-gray-900">{s.cost}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MCP Server */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-4">
        <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <HeadingField text="MCP Server" size="MEDIUM" marginBelow="NONE" />
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Connected</span>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          {[
            { label: 'Total Tool Calls', value: '1,847', change: '+18.3%' },
            { label: 'Avg Response Time', value: '320ms', change: '-12.5%' },
            { label: 'Error Rate', value: '0.4%', change: '-0.2%' },
            { label: 'Available Tools', value: '36', change: '+2 this week' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className={`text-xs font-medium ${kpi.change.startsWith('-') ? 'text-green-600' : 'text-blue-600'}`}>{kpi.change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EvaluateContent() {
  const [selectedCall, setSelectedCall] = useState<any>(null)
  const [detailTab, setDetailTab] = useState<'general' | 'evals'>('general')

  const calls = [
    { timestamp: '2024-12-18 13:25:42', callId: 'call-001-xyz', model: 'CO_Agent_Customer_Onboarding', user: 'john.smith', status: 'Success', tokens: 1247, latency: '245ms', cost: '$0.024', input: 'Can you help me write a professional email to schedule a meeting with our client about the quarterly review?', output: "I'd be happy to help you write a professional email for scheduling a client meeting. Here's a draft:\n\nSubject: Quarterly Review Meeting - [Client Name]\n\nDear [Client Name],\n\nI hope this email finds you well. As we approach the end of the quarter, I would like to schedule our quarterly review meeting to discuss your account performance, upcoming initiatives, and address any questions you may have.\n\nWould you be available for a meeting during the week of [Date Range]? I'm flexible with timing and can accommodate your schedule.\n\nBest regards,\n[Your Name]", accuracy: 0.94, inputToxicity: 0.02, outputToxicity: 0.01, inputPII: 'None', outputPII: 'Template placeholders', inputTone: 'Professional', outputTone: 'Professional' },
    { timestamp: '2024-12-18 13:24:18', callId: 'call-002-abc', model: 'DR_Agent_Document_Review', user: 'jane.doe', status: 'Success', tokens: 892, latency: '189ms', cost: '$0.018', input: 'Explain the concept of machine learning in simple terms for a beginner.', output: "Machine learning is like teaching a computer to recognize patterns and make predictions, similar to how humans learn from experience.\n\n1. Training: We show the computer thousands of examples\n2. Pattern Recognition: The computer finds patterns in the data\n3. Prediction: When shown new data, the computer can predict based on learned patterns", accuracy: 0.97, inputToxicity: 0.01, outputToxicity: 0.00, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'Educational' },
    { timestamp: '2024-12-18 13:23:55', callId: 'call-003-def', model: 'CO_Agent_Customer_Onboarding', user: 'mike.wilson', status: 'Error', tokens: 0, latency: '1.2s', cost: '$0.000', input: 'Process new employee onboarding for batch #445', output: 'Error: Data source connection timeout after 1200ms', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
    { timestamp: '2024-12-18 13:22:31', callId: 'call-004-ghi', model: 'TX_Agent_Tax_Calculator', user: 'sarah.jones', status: 'Success', tokens: 1456, latency: '312ms', cost: '$0.029', input: 'Calculate quarterly tax for revenue $450,000 with deductions of $85,000', output: 'Based on the provided revenue of $450,000 with deductions of $85,000:\n\nTaxable income: $365,000\nEstimated quarterly tax: $91,250\nEffective rate: 25%\n\nNote: This is an estimate. Consult a tax professional for precise calculations.', accuracy: 0.89, inputToxicity: 0.03, outputToxicity: 0.02, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'Informative' },
    { timestamp: '2024-12-18 13:21:07', callId: 'call-005-jkl', model: 'DR_Agent_Document_Review', user: 'david.brown', status: 'Success', tokens: 734, latency: '156ms', cost: '$0.015', input: 'Review contract clause 4.2 for compliance with data protection regulations', output: 'Clause 4.2 appears compliant with GDPR Article 28 requirements. The data processing terms adequately cover: processor obligations, sub-processor management, and data subject rights. Recommend adding explicit breach notification timeline.', accuracy: 0.92, inputToxicity: 0.01, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Professional', outputTone: 'Professional' },
    { timestamp: '2024-12-18 13:19:43', callId: 'call-006-mno', model: 'CO_Agent_Customer_Onboarding', user: 'lisa.garcia', status: 'Success', tokens: 1089, latency: '278ms', cost: '$0.021', input: 'What benefits are available for new hires starting in Q1 2025?', output: 'New employees starting in Q1 2025 are eligible for: health/dental/vision insurance (effective day 1), 401(k) with 4% match (after 90 days), 15 PTO days, tuition reimbursement up to $5,250/year, and wellness stipend of $500/year.', accuracy: 0.95, inputToxicity: 0.02, outputToxicity: 0.01, inputPII: 'None', outputPII: 'None', inputTone: 'Casual', outputTone: 'Friendly' },
    { timestamp: '2024-12-18 13:18:29', callId: 'call-007-pqr', model: 'TX_Agent_Tax_Calculator', user: 'tom.anderson', status: 'Timeout', tokens: 0, latency: '30s', cost: '$0.000', input: 'Retrieve vendor payment history for fiscal year 2024', output: 'Request timed out after 30 seconds', accuracy: 0, inputToxicity: 0, outputToxicity: 0, inputPII: 'None', outputPII: 'None', inputTone: 'Neutral', outputTone: 'N/A' },
    { timestamp: '2024-12-18 13:17:15', callId: 'call-008-stu', model: 'DR_Agent_Document_Review', user: 'amy.taylor', status: 'Success', tokens: 967, latency: '203ms', cost: '$0.019', input: 'Summarize the key terms of the vendor agreement in section 3', output: 'Section 3 key terms: Payment net-30, auto-renewal annually, 60-day termination notice required, liability capped at 12 months fees, IP ownership retained by vendor with perpetual license granted.', accuracy: 0.91, inputToxicity: 0.01, outputToxicity: 0.00, inputPII: 'None', outputPII: 'None', inputTone: 'Technical', outputTone: 'Explanatory' },
  ]

  if (selectedCall) {
    return (
      <div>
        <div className="mb-4">
          <button onClick={() => { setSelectedCall(null); setDetailTab('general') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium mb-1">← Back to AI Calls</button>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">{selectedCall.callId}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedCall.status === 'Success' ? 'bg-green-100 text-green-800' : selectedCall.status === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedCall.status}</span>
          </div>
        </div>
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button onClick={() => setDetailTab('general')} className={`px-2 py-2 font-medium border-b-2 transition-colors ${detailTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>General</button>
          <button onClick={() => setDetailTab('evals')} className={`px-2 py-2 font-medium border-b-2 transition-colors ${detailTab === 'evals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Evals</button>
        </div>
        {detailTab === 'general' ? (
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-4 bg-gray-50"><span className="text-sm font-bold text-gray-700">Input</span></div>
                <div className="p-6"><div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">{selectedCall.input}</div></div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-4 bg-gray-50"><span className="text-sm font-bold text-gray-700">Output</span></div>
                <div className="p-6"><div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{selectedCall.output}</div></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-3 bg-gray-50"><span className="text-sm font-bold text-gray-700">Call Metrics</span></div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Latency</span><span className="font-medium text-gray-900">{selectedCall.latency}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cost</span><span className="font-medium text-gray-900">{selectedCall.cost}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tokens</span><span className="font-medium text-gray-900">{selectedCall.tokens}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Accuracy</span><span className="font-medium text-gray-900">{(selectedCall.accuracy * 100).toFixed(1)}%</span></div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-3 bg-gray-50"><span className="text-sm font-bold text-gray-700">Content Analysis</span></div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Input Toxicity</span><span className="font-medium text-gray-900">{(selectedCall.inputToxicity * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Output Toxicity</span><span className="font-medium text-gray-900">{(selectedCall.outputToxicity * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Input PII</span><span className="font-medium text-gray-900">{selectedCall.inputPII}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Output PII</span><span className="font-medium text-gray-900">{selectedCall.outputPII}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Input Tone</span><span className="font-medium text-gray-900">{selectedCall.inputTone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Output Tone</span><span className="font-medium text-gray-900">{selectedCall.outputTone}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gray-50"><span className="text-sm font-bold text-gray-700">Evaluation Metrics</span></div>
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Metric</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Value</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AI Explanation</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actual Value</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { metric: 'Relevance', aiValue: '85%', explanation: 'Response directly addresses the user query with comprehensive information' },
                  { metric: 'Accuracy', aiValue: '94%', explanation: 'Information provided is factually correct based on training data' },
                  { metric: 'Helpfulness', aiValue: '90%', explanation: 'Response provides actionable guidance and clear examples' },
                  { metric: 'Clarity', aiValue: '88%', explanation: 'Language is clear and appropriate for the target audience' },
                  { metric: 'Safety', aiValue: 'Pass', explanation: 'No harmful, biased, or inappropriate content detected' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.metric}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.aiValue}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{row.explanation}</td>
                    <td className="px-6 py-4 text-sm">
                      {row.metric === 'Safety' ? (
                        <select className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select value</option><option value="pass">Pass</option><option value="fail">Fail</option></select>
                      ) : (
                        <div className="flex items-center"><input type="number" min="0" max="100" step="0.1" placeholder="Enter %" className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /><span className="ml-1 text-gray-500">%</span></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Relevance', value: '88%', change: '+2.1%' },
          { label: 'Accuracy', value: '92%', change: '+1.4%' },
          { label: 'Helpfulness', value: '97%', change: '+0.8%' },
          { label: 'Clarity', value: '93%', change: '-0.3%' },
          { label: 'Safety', value: '98%', change: '+0.5%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search AI calls..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Object</label><div className="space-y-1">{['CO_Agent_Customer_Onboarding','DR_Agent_Document_Review','TX_Agent_Tax_Calculator'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Success','Error','Timeout'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Call ID</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Object</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tokens</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Latency</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {calls.map((call, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedCall(call)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">{call.callId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{call.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{call.tokens}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{call.latency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{call.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${call.status === 'Success' ? 'bg-green-100 text-green-800' : call.status === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{call.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HealthDashboard() {
  return (
    <div className="space-y-6">
      {/* Section A: Runtime Summary Cards with visuals */}
      <div className="grid grid-cols-4 gap-4">
        {/* Process Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3"><Layers size={18} className="text-gray-500" /><span className="text-sm font-bold text-gray-700">Process Activity</span></div>
          <div className="flex items-center gap-4 mb-3">
            <svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="8" /><circle cx="32" cy="32" r="28" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${142/234*176} 176`} strokeLinecap="round" transform="rotate(-90 32 32)" /><circle cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${89/234*176} 176`} strokeDashoffset={`${-142/234*176}`} strokeLinecap="round" transform="rotate(-90 32 32)" /><circle cx="32" cy="32" r="28" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray={`${3/234*176} 176`} strokeDashoffset={`${-(142+89)/234*176}`} strokeLinecap="round" transform="rotate(-90 32 32)" /><text x="32" y="35" textAnchor="middle" className="text-xs font-bold fill-gray-700">234</text></svg>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-gray-600">Active: 142</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-gray-600">Completed: 89</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-gray-600">Errors: 3</span></div>
            </div>
          </div>
        </div>

        {/* Process Model Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3"><BarChart3 size={18} className="text-gray-500" /><span className="text-sm font-bold text-gray-700">Process Model Metrics</span></div>
          <div className="space-y-2">
            {[{label:'Low',value:45,max:60,color:'bg-green-500'},{label:'Medium',value:12,max:60,color:'bg-yellow-500'},{label:'High',value:3,max:60,color:'bg-red-500'}].map((b,i) => (
              <div key={i}><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">{b.label}</span><span className="font-medium text-gray-700">{b.value}</span></div><div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 ${b.color} rounded-full`} style={{width:`${b.value/b.max*100}%`}}></div></div></div>
            ))}
          </div>
        </div>

        {/* Record Response Times */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3"><Clock size={18} className="text-gray-500" /><span className="text-sm font-bold text-gray-700">Record Response Times</span></div>
          <div className="space-y-2">
            {[{label:'Low',value:28,max:60,color:'bg-green-500'},{label:'Medium',value:8,max:60,color:'bg-yellow-500'},{label:'High',value:2,max:60,color:'bg-red-500'}].map((b,i) => (
              <div key={i}><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">{b.label}</span><span className="font-medium text-gray-700">{b.value}</span></div><div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 ${b.color} rounded-full`} style={{width:`${b.value/b.max*100}%`}}></div></div></div>
            ))}
          </div>
        </div>
        </div>

        {/* Section B: Application Design Metrics with visuals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Security Warnings</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">7</div>
          <div className="text-xs font-medium text-red-500">+2 from last scan</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="text-sm font-bold text-gray-700 mb-3">Test Health</div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Coverage</div>
              <div className="h-3 bg-gray-100 rounded-full mb-1"><div className="h-3 bg-blue-500 rounded-full" style={{width:'68%'}}></div></div>
              <div className="text-sm font-bold text-gray-900">68%</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Passing</div>
              <div className="h-3 bg-gray-100 rounded-full mb-1"><div className="h-3 bg-green-500 rounded-full" style={{width:`${42/51*100}%`}}></div></div>
              <div className="text-sm font-bold text-green-600">42/51</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unreferenced Objects</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">14</div>
          <div className="text-xs font-medium text-yellow-600">+3 from last scan</div>
        </div>
      </div>

    </div>
  )
}

function ProcessActivity() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active','Active with Errors','Completed','Paused','Canceled'])
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 15

  const models = ['CO_Onboarding_v3','INV_Process_v2','HR_Review_v1','AT_Transfer_v1','HD_Ticket_v4','DR_Review_v2','EX_Approval_v1','VN_Onboarding_v2','PO_Purchase_v3','CL_Claims_v1']
  const names = ['Customer Onboarding','Invoice Processing','HR Review','Asset Transfer','Help Desk Ticket','Document Review','Expense Approval','Vendor Onboarding','Purchase Order','Claims Processing']
  const users = ['john.smith','jane.doe','mike.wilson','sarah.jones','david.brown','lisa.garcia','tom.anderson','amy.taylor','chris.lee','nina.patel','maria.chen','james.wilson']
  const statuses: Array<'Active'|'Active with Errors'|'Completed'|'Paused'|'Canceled'> = ['Active','Active with Errors','Completed','Paused','Canceled']

  const allProcesses = Array.from({ length: 248 }, (_, i) => {
    const idx = i % names.length
    const s = statuses[i < 8 ? (i < 3 ? 1 : i < 5 ? 0 : i < 7 ? 3 : 4) : (i % 5 === 0 ? 1 : i % 7 === 0 ? 3 : i % 11 === 0 ? 4 : i % 3 === 0 ? 2 : 0)]
    const hr = 4 - Math.floor(i / 20)
    const min = 59 - ((i * 7) % 60)
    return {
      status: s,
      name: `${names[idx]} #${2100 - i}`,
      model: models[idx],
      errors: s === 'Active with Errors' ? (i % 3) + 1 : 0,
      startedBy: users[i % users.length],
      tasks: s === 'Active' || s === 'Active with Errors' ? (i % 4) + 1 : s === 'Paused' ? (i % 3) + 1 : 0,
      startTime: `Apr 28, ${((hr + 12) % 12) || 12}:${String(Math.abs(min)).padStart(2, '0')} ${hr >= 0 ? 'PM' : 'AM'}`,
    }
  })

  const filtered = allProcesses.filter(p =>
    (statusFilter.length === 5 || statusFilter.includes(p.status)) &&
    (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.model.toLowerCase().includes(searchQuery.toLowerCase()) || p.startedBy.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by process name or ID..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1) }} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative">
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 border rounded-lg transition-colors ${showFilters || statusFilter.length < 6 ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}><SlidersHorizontal size={14} /></button>
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Active','Active with Errors','Completed','Paused','Canceled'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={statusFilter.includes(s)} onChange={() => { setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); setPage(1) }} className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Process Name</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Process Model</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Errors</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Started By</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Active Tasks</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Start Time</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.model}</td>
                <td className="px-6 py-4 text-sm">{p.errors > 0 ? <span className="text-red-600 font-medium">{p.errors}</span> : <span className="text-gray-400">0</span>}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.startedBy}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.tasks}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.startTime}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : p.status === 'Completed' ? 'bg-blue-100 text-blue-800' : p.status === 'Paused' ? 'bg-gray-100 text-gray-800' : p.status === 'Canceled' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-500">Showing {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProcessModelMetrics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search process models..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Healthy','Warning','Critical'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Clean-up Policy</label><div className="space-y-1">{['Has policy','No policy'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Process Model</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Memory (AMU)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Instance (AMU)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Instances</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Completed</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Clean-up Days</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'CO_Onboarding_v3', status: 'high', totalMem: '1,245,000', avgMem: '12,450', instances: 100, completed: '78%', cleanup: '30' },
              { name: 'INV_Process_v2', status: 'medium', totalMem: '456,000', avgMem: '9,120', instances: 50, completed: '92%', cleanup: '14' },
              { name: 'HR_Review_v1', status: 'low', totalMem: '45,000', avgMem: '2,250', instances: 20, completed: '95%', cleanup: '7' },
              { name: 'HD_Ticket_v4', status: 'low', totalMem: '78,000', avgMem: '3,900', instances: 20, completed: '88%', cleanup: '30' },
              { name: 'AT_Transfer_v1', status: 'medium', totalMem: '234,000', avgMem: '7,800', instances: 30, completed: '67%', cleanup: 'Never' },
            ].map((pm, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">{pm.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pm.totalMem}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pm.avgMem}</td>
                <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline">{pm.instances}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pm.completed}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pm.cleanup}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${pm.status === 'low' ? 'bg-green-100 text-green-800' : pm.status === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{pm.status === 'low' ? 'Healthy' : pm.status === 'medium' ? 'Warning' : 'Critical'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecordResponseTimes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search record views..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><div className="space-y-1">{['List','View'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Healthy','Warning','Critical'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Record UI</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Max Time (s)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Time (s)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Customer Record List', category: 'List', health: 'low', maxTime: '1.2', avgTime: '0.4' },
              { name: 'Invoice Detail View', category: 'View', health: 'medium', maxTime: '3.8', avgTime: '1.9' },
              { name: 'Employee Record List', category: 'List', health: 'low', maxTime: '0.8', avgTime: '0.3' },
              { name: 'Case Summary View', category: 'View', health: 'high', maxTime: '8.5', avgTime: '4.2' },
              { name: 'Asset Inventory List', category: 'List', health: 'low', maxTime: '1.5', avgTime: '0.6' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:underline">{r.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.category}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.maxTime}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.avgTime}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${r.health === 'low' ? 'bg-green-100 text-green-800' : r.health === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{r.health === 'low' ? 'Healthy' : r.health === 'medium' ? 'Warning' : 'Critical'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecordSyncStatus() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search record types..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Source Type</label><div className="space-y-1">{['Database','Salesforce','Web Service'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Completed','Failed','Approaching Limit'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>

      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Record Type</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Source Type</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Sync</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Rows</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Customer', source: 'Database', status: 'Completed', lastSync: 'Mar 26, 4:00 PM', rows: '45,230' },
              { name: 'Invoice', source: 'Database', status: 'Completed', lastSync: 'Mar 26, 3:55 PM', rows: '128,450' },
              { name: 'Employee', source: 'Salesforce', status: 'Failed', lastSync: 'Mar 26, 3:30 PM', rows: '12,890' },
              { name: 'Case', source: 'Database', status: 'Approaching Limit', lastSync: 'Mar 26, 3:00 PM', rows: '890,000' },
              { name: 'Asset', source: 'Web Service', status: 'Completed', lastSync: 'Mar 26, 2:45 PM', rows: '5,670' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:underline">{r.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.source}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.lastSync}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{r.rows}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : r.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QueryPerformance() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search queries..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Record Type</label><div className="space-y-1">{['Customer','Invoice','Case','Employee','Asset'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Synced','Unsynced'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Query ID</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Record Type</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Execution Time (ms)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Wait Time (ms)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Started By</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Start Time</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { id: 'qry-4521', record: 'Customer', execTime: 245, waitTime: 12, startedBy: 'john.smith', startTime: 'Mar 26, 4:52 PM', type: 'Synced' },
              { id: 'qry-4520', record: 'Invoice', execTime: 1890, waitTime: 340, startedBy: 'jane.doe', startTime: 'Mar 26, 4:50 PM', type: 'Synced' },
              { id: 'qry-4519', record: 'Case', execTime: 567, waitTime: 45, startedBy: 'mike.wilson', startTime: 'Mar 26, 4:48 PM', type: 'Synced' },
              { id: 'qry-4518', record: 'Employee', execTime: 89, waitTime: 5, startedBy: 'sarah.jones', startTime: 'Mar 26, 4:45 PM', type: 'Unsynced' },
              { id: 'qry-4517', record: 'Asset', execTime: 3200, waitTime: 890, startedBy: 'david.brown', startTime: 'Mar 26, 4:42 PM', type: 'Synced' },
            ].map((q, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-blue-600 cursor-pointer hover:underline">{q.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{q.record}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{q.execTime.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{q.waitTime}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{q.startedBy}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{q.startTime}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${q.type === 'Synced' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{q.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PortalMonitoring() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search portals..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Published','Not Published','Published with errors'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>

      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Portal Name</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Error Count</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Error Rate</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Traffic Requests</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Median Latency (s)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">p90 Latency (s)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Customer Self-Service Portal', errors: 12, errorRate: '0.8%', traffic: '1,450', medianLatency: '0.3', p90: '1.2', status: 'Published' },
              { name: 'Vendor Onboarding Portal', errors: 3, errorRate: '0.5%', traffic: '620', medianLatency: '0.5', p90: '1.8', status: 'Published' },
              { name: 'Public Job Application Portal', errors: 0, errorRate: '0%', traffic: '2,340', medianLatency: '0.2', p90: '0.8', status: 'Published' },
              { name: 'Partner Registration Portal', errors: 45, errorRate: '5.2%', traffic: '865', medianLatency: '1.1', p90: '3.5', status: 'Published with errors' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">{p.name}</td>
                <td className="px-6 py-4 text-sm">{p.errors > 0 ? <span className="text-red-600 font-medium cursor-pointer hover:underline">{p.errors}</span> : <span className="text-gray-400">0</span>}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.errorRate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.traffic}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.medianLatency}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.p90}</td>
                <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RPAContent() {
  const [rpaTab, setRpaTab] = useState('robots')
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="bg-white border-b border-gray-200 px-8" style={{ minHeight: '80px' }}>
        <div className="flex items-center" style={{ minHeight: '48px' }}>
          <HeadingField text="RPA" size="LARGE" marginBelow="NONE" />
        </div>
        <div className="flex gap-0">
          <button onClick={() => setRpaTab('robots')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${rpaTab === 'robots' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Robots</button>
          <button onClick={() => setRpaTab('pools')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${rpaTab === 'pools' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Robot Pools</button>
          <button onClick={() => setRpaTab('tasks')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${rpaTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Robotic Tasks</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
      {rpaTab === 'robots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search robots..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="flex items-center gap-2"><div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Pool</label><div className="space-y-1">{['Finance Pool','CRM Pool','HR Pool','Analytics Pool'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Online','Offline','Busy'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Create Robot</button></div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Robot Name</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Current Task</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pool</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Executions (24h)</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Success Rate</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Active</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'RPA-Bot-001', status: 'Online', task: 'Invoice Data Entry', pool: 'Finance Pool', executions: 145, successRate: '98.6%', lastActive: 'Now' },
                  { name: 'RPA-Bot-002', status: 'Busy', task: 'Customer Record Update', pool: 'CRM Pool', executions: 89, successRate: '97.2%', lastActive: 'Now' },
                  { name: 'RPA-Bot-003', status: 'Online', task: 'Idle', pool: 'Finance Pool', executions: 67, successRate: '99.1%', lastActive: '5 min ago' },
                  { name: 'RPA-Bot-004', status: 'Offline', task: '—', pool: 'HR Pool', executions: 0, successRate: '—', lastActive: '2 hours ago' },
                  { name: 'RPA-Bot-005', status: 'Busy', task: 'Report Generation', pool: 'Analytics Pool', executions: 234, successRate: '95.8%', lastActive: 'Now' },
                  { name: 'RPA-Bot-006', status: 'Online', task: 'Idle', pool: 'CRM Pool', executions: 112, successRate: '99.4%', lastActive: '1 min ago' },
                ].map((bot, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline">{bot.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bot.task}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bot.pool}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bot.executions}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bot.successRate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bot.lastActive}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bot.status === 'Online' ? 'bg-green-100 text-green-800' : bot.status === 'Busy' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{bot.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {rpaTab === 'pools' && (
        <div className="space-y-4">
          <div className="flex items-center justify-end"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Create Pool</button></div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Finance Pool', robots: 3, activeRobots: 2, queuedTasks: 5, completedToday: 212 },
              { name: 'CRM Pool', robots: 2, activeRobots: 2, queuedTasks: 3, completedToday: 156 },
              { name: 'HR Pool', robots: 2, activeRobots: 1, queuedTasks: 0, completedToday: 45 },
              { name: 'Analytics Pool', robots: 1, activeRobots: 1, queuedTasks: 8, completedToday: 234 },
            ].map((pool, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4"><span className="text-base font-bold text-gray-900">{pool.name}</span><span className="text-xs text-gray-500">{pool.activeRobots}/{pool.robots} robots active</span></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Total Robots</span><div className="font-medium text-gray-900">{pool.robots}</div></div>
                  <div><span className="text-gray-500">Queued Tasks</span><div className="font-medium text-gray-900">{pool.queuedTasks}</div></div>
                  <div><span className="text-gray-500">Active</span><div className="font-medium text-green-600">{pool.activeRobots}</div></div>
                  <div><span className="text-gray-500">Completed Today</span><div className="font-medium text-gray-900">{pool.completedToday}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rpaTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search tasks..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Pool</label><div className="space-y-1">{['Finance Pool','CRM Pool','HR Pool','Analytics Pool'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><div className="space-y-1">{['Running','Queued','Completed','Failed'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Execution</label><div className="space-y-1">{['Enabled','Disabled'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Task Name</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Robot</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pool</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Started</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Execution</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'Invoice Data Entry', status: 'Running', robot: 'RPA-Bot-001', pool: 'Finance Pool', duration: '2m 34s', started: 'Mar 26, 4:50 PM', enabled: true },
                  { name: 'Customer Record Update', status: 'Running', robot: 'RPA-Bot-002', pool: 'CRM Pool', duration: '1m 12s', started: 'Mar 26, 4:51 PM', enabled: true },
                  { name: 'Report Generation', status: 'Running', robot: 'RPA-Bot-005', pool: 'Analytics Pool', duration: '5m 45s', started: 'Mar 26, 4:47 PM', enabled: true },
                  { name: 'Payroll Processing', status: 'Queued', robot: '—', pool: 'HR Pool', duration: '—', started: '—', enabled: true },
                  { name: 'Email Classification', status: 'Completed', robot: 'RPA-Bot-003', pool: 'Finance Pool', duration: '45s', started: 'Mar 26, 4:40 PM', enabled: true },
                  { name: 'Legacy Data Migration', status: 'Failed', robot: 'RPA-Bot-004', pool: 'HR Pool', duration: '12m 3s', started: 'Mar 26, 2:15 PM', enabled: false },
                ].map((task, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.robot}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.pool}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{task.started}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Running' ? 'bg-blue-100 text-blue-800' : task.status === 'Completed' ? 'bg-green-100 text-green-800' : task.status === 'Queued' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>{task.status}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{task.enabled ? 'Enabled' : 'Disabled'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  )
}

// ── Insights Chat (Gemini-style) ──

type InsightSeverity = 'critical' | 'warning' | 'info'

interface InsightItem {
  id: string
  severity: InsightSeverity
  title: string
  description: string
  remediation: string
  impact: string
  metric?: string
  category: string
  source: string
  confidence: 'High' | 'Medium' | 'Low'
  firstSeen: string
  isNew: boolean
  navTarget?: string
  agentAction?: string
  status: 'open' | 'resolving' | 'resolved'
}

const initialInsights: InsightItem[] = [
  // ── CRITICAL (6) ──
  { id: 'i1', severity: 'critical', title: 'Process Error: CO_Onboarding_v3 — Connection Timeout (4th this week)',
    description: 'Timed out at "Assign Agent" node after 30s. Connection pool exhausted during peak hours (2–4 PM). 12 tasks queued behind the stalled instance.',
    remediation: '1. Increase the connection pool size | Go to Admin Console → Data Sources → find your data source → change Max Connections from 10 to 25 (docs.appian.com/suite/help/25.3/Configuring_Relational_Databases.html)\n2. Restart the stuck process | Open Process Modeler → find instance PI-204888 → click Actions → Resume (docs.appian.com/suite/help/25.3/Process_Instance_Actions.html)\n3. Set up an alert so this does not happen again | Admin Console → Monitoring → Alerts → add one at 80% pool usage (docs.appian.com/suite/help/25.3/Monitoring_View.html)',
    impact: '12 onboarding tasks blocked. New customer onboarding SLA at risk.',
    metric: '4th this week', category: 'Processes', source: 'engine_system.csv + Process Monitor', confidence: 'High', firstSeen: 'Apr 25', isNew: false, navTarget: 'processes', agentAction: 'Increase connection pool size and restart stalled process instance', status: 'open' },
  { id: 'i2', severity: 'critical', title: 'Integration Down: SAP_Finance returning HTTP 503 since 11:30 AM',
    description: 'Continuous 503 errors since 11:30 AM. 23 process instances (Invoice Processing, Vendor Onboarding) are paused waiting for responses.',
    remediation: '1. Check if SAP is reachable | Go to Admin Console → Connected Systems → click SAP_Finance → check if status shows "Connected" or an error (docs.appian.com/suite/help/25.3/Connected_System_Object.html)\n2. Stop new work from piling up | Open each affected process model → click Disable New Instances so nothing else gets stuck (docs.appian.com/suite/help/25.3/Process_Model_Properties.html)\n3. Add automatic retry | Set up error handling so it recovers on its own next time (docs.appian.com/suite/help/25.3/Integration_Error_Handling.html)\n4. Prevent this long-term | Add a circuit breaker that stops calling SAP when it is down (docs.appian.com/suite/help/25.3/Local_Variables.html)',
    impact: 'No new invoices can be processed. $45K in pending payments delayed.',
    metric: '23 blocked', category: 'Integrations', source: 'integration*.csv + Connected Systems', confidence: 'High', firstSeen: 'Today 11:30 AM', isNew: true, navTarget: 'logs', agentAction: 'Pause dependent processes and set up auto-resume', status: 'open' },
  { id: 'i3', severity: 'critical', title: 'Memory Pressure: 2 process models exceed 1M AMU — GC pauses at 35ms',
    description: '1.4M AMU and 1.1M AMU respectively. No clean-up policy — instances accumulate indefinitely. GC pauses averaging 35ms every 8s on Engine 1.',
    remediation: '1. Turn on auto-cleanup | Open each process model → Properties → Clean-up tab → set "Archive after 30 days" (docs.appian.com/suite/help/25.3/Process_Cleanup.html)\n2. Clear out old finished instances now | Use a!archiveProcesses() to free up memory immediately (docs.appian.com/suite/help/25.3/fnaction_archiveprocesses.html)\n3. Verify memory improved | Run a!latestHealthCheck() and check the AMU numbers (docs.appian.com/suite/help/25.3/Health_Check.html)\n4. Set up an alert at 800K AMU | So you catch this before it gets bad again',
    impact: 'Engine 1 spending ~4% of time in GC. Contributes to slow page loads during peak.',
    metric: '2.5M AMU', category: 'Platform Health', source: 'Health Check (Apr 25) + engine_system.csv', confidence: 'High', firstSeen: 'Apr 20', isNew: false, navTarget: 'process-metrics', agentAction: 'Set archive policy and archive completed instances', status: 'open' },
  { id: 'i4', severity: 'critical', title: 'Thread Saturation: 150/150 app server threads in use',
    description: 'Engine idle 45%, DB queries avg 67ms — both healthy. Slowness is from requests queuing before processing starts. Users see 8–12s page loads.',
    remediation: '1. Take a thread dump | Admin Console → Monitoring → click "Thread Dump" to see what is stuck (docs.appian.com/suite/help/25.3/Monitoring_View.html)\n2. Find the stuck threads | Look for threads waiting on SAP_Finance — that is likely the cause (see the SAP alert above)\n3. Allow more threads if needed | Edit conf/custom.properties and set THREAD_POOL_SIZE to 200 (docs.appian.com/suite/help/25.3/Post-Install_Configurations.html)\n4. Check which integrations are slowest | Admin Console → Monitoring → Integration Performance',
    impact: 'All users experiencing degraded performance. Support tickets up 3x today.',
    metric: '150/150', category: 'Platform Health', source: 'system.csv + app server metrics', confidence: 'High', firstSeen: 'Today 10:15 AM', isNew: true, navTarget: 'home', agentAction: 'Generate thread dump and identify stuck threads', status: 'open' },
  { id: 'i5', severity: 'critical', title: 'RPA: Legacy Data Migration bot crashed — HR Pool at 50%',
    description: 'Crashed after 8,400/12,000 records due to malformed date field in batch #445. Offline 2 hours.',
    remediation: '1. Fix the date format | RPA Console → Robotic Tasks → open the task → Field Mappings → change hire_date to MM/DD/YYYY (docs.appian.com/suite/help/25.3/rpa-9.5/modules/configure-robotic-task.html)\n2. Turn the bot back on | RPA Console → Robots → RPA-Bot-004 → click Start (docs.appian.com/suite/help/25.3/rpa-9.5/modules/manage-robots.html)\n3. Add a check for bad dates | Use a Validate stage so bad data gets caught before processing (docs.appian.com/suite/help/25.3/rpa-9.5/modules/robotic-task-stages.html)\n4. Turn on checkpointing | So the bot can pick up where it left off if it crashes again',
    impact: 'HR Pool at 50% capacity. Downstream onboarding tasks delayed.',
    metric: '2h offline', category: 'RPA', source: 'RPA Console + Bot Logs', confidence: 'High', firstSeen: 'Today 9:45 AM', isNew: true, navTarget: 'rpa', agentAction: 'Fix date mapping, restart bot, resume from batch #445', status: 'open' },
  { id: 'i6', severity: 'critical', title: 'Record Sync Failed: Employee (Salesforce) — data stale since 3:30 PM',
    description: 'Auth token expired. Data stale for 2+ hours. Case record at 890K rows approaching sync limit.',
    remediation: '1. Log back into Salesforce | Admin Console → Connected Systems → Salesforce → click Re-authorize (docs.appian.com/suite/help/25.3/Salesforce_Connected_System.html)\n2. Pull fresh data | Go to the Employee record type → click Sync Now (docs.appian.com/suite/help/25.3/Syncing_Data.html)\n3. Prevent this from happening again | Turn on automatic token refresh in the connected system settings (docs.appian.com/suite/help/25.3/OAuth_2.0_Auth_Code_Grant.html)\n4. Shrink the Case table | Add a filter to only sync the last 24 months of data (docs.appian.com/suite/help/25.3/Source_Filters.html)',
    impact: 'Onboarding and review processes using stale employee data. Compliance risk.',
    metric: 'Stale 2h+', category: 'Data Sync', source: 'Record Sync Monitor', confidence: 'High', firstSeen: 'Today 3:30 PM', isNew: true, navTarget: 'record-sync', agentAction: 'Re-authenticate and trigger manual sync', status: 'open' },
  // ── WARNING (1) ──
  { id: 'i7', severity: 'warning', title: 'Slow Queries: Invoice queries averaging 2.4s (threshold 500ms)',
    description: 'Query plan indicates missing index on invoice_date column. 5× the 500ms threshold.',
    remediation: '1. Add a database index | Ask your DBA to add an index on the invoice_date column — this is the #1 fix (docs.appian.com/suite/help/25.3/Configuring_Relational_Databases.html)\n2. Update the query planner | After the index is added, run ANALYZE TABLE on the Invoice table\n3. Confirm it worked | Come back to the Query Performance tab and check the time dropped below 500ms\n4. Consider a combo index | If queries also filter by status, add an index on (invoice_date, status) (docs.appian.com/suite/help/25.3/Query_Recipes.html)',
    impact: 'Every interface showing Invoice data is slow — Finance dashboard, Invoice Processing action.',
    metric: '2.4s avg', category: 'Query Performance', source: 'data_store*.csv', confidence: 'High', firstSeen: 'Apr 22', isNew: false, navTarget: 'query-perf', agentAction: 'Add index on Invoice.invoice_date', status: 'open' },
  // ── OPTIMIZATION (5) — design guidance first ──
  { id: 'i8', severity: 'info', title: 'Design Guidance: 3 interfaces with >50 rule calls per evaluation',
    description: '78 rule calls (~15ms each = 1.17s), 62 calls, and 54 calls respectively. Common anti-pattern: repeated a!queryRecordType() calls that could be cached.',
    remediation: '1. Stop fetching the same data over and over | Wrap repeated queries in a!localVariables() so they only run once (docs.appian.com/suite/help/25.3/Local_Variables.html)\n2. Use the record data that is already there | In record views, use ri!record instead of making a new query (docs.appian.com/suite/help/25.3/Record_View_Definition.html)\n3. Combine small queries into one | Use a single a!queryRecordType() call instead of many small ones (docs.appian.com/suite/help/25.3/Query_Record_Type.html)\n4. Goal: under 20 rule calls per screen | Health Check will stop flagging it once you hit this target (docs.appian.com/suite/help/25.3/Health_Check.html)',
    impact: 'Record views loading slowly. Users report frustration with HR Dashboard specifically.',
    metric: '78 rule calls', category: 'Design Guidance', source: 'Health Check Analysis', confidence: 'High', firstSeen: 'Apr 25', isNew: false, navTarget: 'record-response', agentAction: 'Consolidate expression rules using a!localVariables', status: 'open' },
  { id: 'i9', severity: 'info', title: 'Design Guidance: Customer_Onboarding_PM — a!queryEntity() inside loop',
    description: 'Executes a!queryEntity() inside a forEach loop (N+1 pattern). With 50 items, generates 50 separate DB calls instead of 1 batch query.',
    remediation: '1. Fetch everything at once instead of one at a time | Use a!queryRecordType() with the "in" filter instead of querying in a loop (docs.appian.com/suite/help/25.3/Query_Record_Type.html)\n2. Build the filter like this | a!queryFilter(field, "in", local!idList) grabs everything in one trip (docs.appian.com/suite/help/25.3/Query_Filter.html)\n3. Add error handling | Wrap the integration call in a!tryCatch() so errors do not fail silently (docs.appian.com/suite/help/25.3/fnaction_trycatch.html)\n4. Expected result | 50 database calls → 1 call, roughly 10x faster',
    impact: 'Process execution time inflated. Contributes to thread pool pressure during peak.',
    metric: 'N+1 pattern', category: 'Design Guidance', source: 'Health Check + Code Analysis', confidence: 'High', firstSeen: 'Apr 25', isNew: false, navTarget: 'process-metrics', agentAction: 'Refactor to batch query and add error handling', status: 'open' },
  { id: 'i12', severity: 'info', title: 'Design Guidance: HR_Dashboard_Interface — 2 security findings',
    description: 'Exposes user emails without role-based filtering. Uses deprecated fn!topeople() which bypasses group security.',
    remediation: '1. Hide emails from unauthorized users | Add a!isUserMemberOfGroup() check before showing the email field (docs.appian.com/suite/help/25.3/fnaction_isusermemberofgroup.html)\n2. Replace the outdated function | Swap fn!topeople() for a!groupMembers() — it does the same thing but respects security (docs.appian.com/suite/help/25.3/fnaction_groupmembers.html)\n3. Verify the fix | Run the Health Check security scan again to confirm the warnings are gone (docs.appian.com/suite/help/25.3/Health_Check.html)',
    impact: 'Low immediate risk but fails security audit. Should fix before next compliance review.',
    metric: '2 findings', category: 'Design Guidance', source: 'Health Check Security Scan', confidence: 'High', firstSeen: 'Apr 25', isNew: false, navTarget: 'home', agentAction: 'Add role checks and replace deprecated function', status: 'open' },
  { id: 'i10', severity: 'info', title: 'AI: Customer Support AI accounts for 57% of total spend',
    description: '$142.30 MTD across 2,156 requests. ~40% are simple FAQ-type queries that could be handled by rule-based routing.',
    remediation: '1. See what people are asking | Go to AI tab → AI Calls → filter by Customer Support AI and look at the most common questions\n2. Handle simple questions without AI | Create a decision table for FAQ patterns like password resets and status checks (docs.appian.com/suite/help/25.3/Decisions.html)\n3. Turn on PII scrubbing | So sensitive data gets removed before it reaches the AI (docs.appian.com/suite/help/25.3/AI_Guardrails.html)\n4. Use a cheaper model for simple questions | Switch FAQ routing to a faster, lighter model (docs.appian.com/suite/help/25.3/AI_Skill_Object.html)',
    impact: 'Cost optimization opportunity: ~$40–50/month savings. PII compliance risk from unredacted inputs.',
    metric: '$142/mo', category: 'AI', source: 'AI Observe + Guardrail Logs', confidence: 'Medium', firstSeen: 'Apr 15', isNew: false, navTarget: 'ai', agentAction: 'Analyze patterns and route simple queries to rules', status: 'open' },
  { id: 'i11', severity: 'info', title: 'Portal: Partner Registration Portal — 5.2% error rate',
    description: '45 errors in 865 requests. Mostly 500 errors from backend service timeout.',
    remediation: '1. Check what is going wrong | Admin Console → Portals → Partner Registration → look at the Logs tab (docs.appian.com/suite/help/25.3/Portal_Object.html)\n2. Add automatic retry | Wrap the call in a!tryCatch() so temporary failures recover on their own (docs.appian.com/suite/help/25.3/fnaction_trycatch.html)\n3. Show a helpful error page | Replace the blank 500 error with a custom error interface (docs.appian.com/suite/help/25.3/Portal_Error_Handling.html)\n4. Set up an alert at 3% error rate | So you know before users start complaining',
    impact: 'Partner registration experience degraded. May affect partner onboarding pipeline.',
    metric: '5.2% errors', category: 'Portals', source: 'Portal Monitor', confidence: 'Medium', firstSeen: 'Apr 27', isNew: false, navTarget: 'portals', agentAction: 'Investigate timeout and add retry logic', status: 'open' },
]

function InsightsChat({ view, setView }: { view: 'insights' | 'chat' | 'rules'; setView: (v: 'insights' | 'chat' | 'rules') => void }) {
  const [insights, setInsights] = useState(initialInsights)
  const [loadingPhase, setLoadingPhase] = useState<'scanning' | 'done'>('scanning')
  const [visibleCount, setVisibleCount] = useState(0)
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['critical']))

  // Custom rules
  const [showNewRule, setShowNewRule] = useState(false)
  const [newRuleStep, setNewRuleStep] = useState<'template' | 'configure'>('template')
  const [advancedPattern, setAdvancedPattern] = useState(false)
  const [newRuleName, setNewRuleName] = useState('')
  const [newRulePattern, setNewRulePattern] = useState('')
  const [newRuleSeverity, setNewRuleSeverity] = useState<InsightSeverity>('warning')
  const [newRuleCategory, setNewRuleCategory] = useState('Custom Rule')
  const [scanningRule, setScanningRule] = useState<string | null>(null)

  type CustomRule = { id: string; name: string; pattern: string; severity: InsightSeverity; category: string; enabled: boolean; builtIn: boolean; matches: number; lastRun: string }

  const [customRules, setCustomRules] = useState<CustomRule[]>([
    { id: 'br1', name: 'Deprecated: apply() usage', pattern: 'apply(', severity: 'warning', category: 'Tech Debt', enabled: true, builtIn: true, matches: 14, lastRun: 'Apr 28' },
    { id: 'br2', name: 'Deprecated: a!fromJson_19r2()', pattern: 'a!fromJson_19r2(', severity: 'warning', category: 'Tech Debt', enabled: true, builtIn: true, matches: 7, lastRun: 'Apr 28' },
    { id: 'br3', name: 'Deprecated: fn!topeople()', pattern: 'fn!topeople(', severity: 'warning', category: 'Tech Debt', enabled: true, builtIn: true, matches: 3, lastRun: 'Apr 28' },
    { id: 'br4', name: 'Anti-pattern: wherecontains() inside index()', pattern: 'index(wherecontains(', severity: 'info', category: 'Design Guidance', enabled: true, builtIn: true, matches: 5, lastRun: 'Apr 28' },
    { id: 'br5', name: 'Anti-pattern: a!queryEntity() in forEach', pattern: 'a!queryEntity(forEach(', severity: 'warning', category: 'Design Guidance', enabled: true, builtIn: true, matches: 2, lastRun: 'Apr 28' },
    { id: 'br6', name: 'Security: hardcoded credentials', pattern: 'password="|apiKey="|secret="', severity: 'critical', category: 'Security', enabled: true, builtIn: true, matches: 0, lastRun: 'Apr 28' },
  ])

  const addCustomRule = () => {
    if (!newRuleName.trim() || !newRulePattern.trim()) return
    const ruleId = `cr-${Date.now()}`
    const newRule: CustomRule = { id: ruleId, name: newRuleName, pattern: newRulePattern, severity: newRuleSeverity, category: newRuleCategory, enabled: true, builtIn: false, matches: 0, lastRun: 'Never' }
    setCustomRules(prev => [...prev, newRule])
    setShowNewRule(false)
    setNewRuleName(''); setNewRulePattern(''); setNewRuleSeverity('warning'); setNewRuleCategory('Custom Rule'); setNewRuleStep('template'); setAdvancedPattern(false)
    // Simulate scanning
    setScanningRule(ruleId)
    setTimeout(() => {
      const matchCount = Math.floor(Math.random() * 12) + 1
      setCustomRules(prev => prev.map(r => r.id === ruleId ? { ...r, matches: matchCount, lastRun: 'Just now' } : r))
      // Generate insights for matches
      if (matchCount > 0) {
        const objects = ['CO_Onboarding_v3', 'INV_Process_v2', 'HR_Dashboard_Interface', 'DR_Review_v2', 'Customer_Detail_View', 'Vendor_Summary', 'Finance_Report_v1', 'Claims_Intake_Form']
        const matchedObjects = objects.slice(0, Math.min(matchCount, objects.length))
        const newInsight: InsightItem = {
          id: `ci-${ruleId}`, severity: newRule.severity, title: `Custom Rule: ${newRule.name} — ${matchCount} matches found`,
          description: `Pattern "${newRule.pattern}" found in ${matchCount} objects: ${matchedObjects.join(', ')}${matchCount > objects.length ? ` and ${matchCount - objects.length} more` : ''}.`,
          remediation: `1. Review each match in Appian Designer to assess upgrade feasibility\n2. Check for downstream dependencies before modifying\n3. Test changes in Development environment first\n4. Use bulk find-and-replace if pattern has a safe 1:1 replacement`,
          impact: matchCount > 5 ? 'Widespread usage — plan a phased migration across sprints.' : 'Limited usage — can be addressed in a single sprint.',
          metric: `${matchCount} objects`, category: newRule.category, source: 'Custom Rule Scan', confidence: 'High', firstSeen: 'Just now', isNew: true,
          navTarget: undefined, agentAction: 'Analyze each match and generate safe replacement code', status: 'open'
        }
        setInsights(prev => [...prev, newInsight])
      }
      setScanningRule(null)
    }, 2000)
  }

  const runRule = (ruleId: string) => {
    setScanningRule(ruleId)
    setTimeout(() => {
      const matchCount = Math.floor(Math.random() * 8) + 1
      setCustomRules(prev => prev.map(r => r.id === ruleId ? { ...r, matches: matchCount, lastRun: 'Just now' } : r))
      setScanningRule(null)
    }, 1500)
  }

  useEffect(() => {
    const t = setTimeout(() => setLoadingPhase('done'), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (loadingPhase !== 'done') return
    if (visibleCount >= insights.length) return
    const t = setTimeout(() => setVisibleCount(v => v + 1), 120)
    return () => clearTimeout(t)
  }, [loadingPhase, visibleCount, insights.length])


  // Wire header "Send All to Composer" button
  useEffect(() => {
    const btn = document.getElementById('ops-ai-resolve-all')
    if (!btn) return
    const handler = () => handleResolveAll()
    btn.addEventListener('click', handler)
    return () => btn.removeEventListener('click', handler)
  })

  const suggestions = [
    { label: 'Tell me more about the process errors' },
    { label: 'How is performance looking?' },
    { label: 'Break down AI costs' },
    { label: 'What\'s wrong with RPA?' },
  ]
  void suggestions

  const handleResolve = (id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' as const } : i))
  }

  const handleAgentResolve = (id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'resolving' as const } : i))
    setTimeout(() => {
      setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' as const } : i))
    }, 2500 + Math.random() * 2000)
  }

  const handleResolveAll = () => {
    const openIds = insights.filter(i => i.status === 'open').map(i => i.id)
    setInsights(prev => prev.map(i => openIds.includes(i.id) ? { ...i, status: 'resolving' as const } : i))
    openIds.forEach((id, idx) => {
      setTimeout(() => {
        setInsights(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' as const } : i))
      }, 1500 + idx * 800 + Math.random() * 1000)
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedInsights(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => { const next = new Set(prev); next.has(group) ? next.delete(group) : next.add(group); return next })
  }

  const severityConfig = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={18} className="text-red-500" />, badge: 'bg-red-100 text-red-700', label: 'Critical' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={18} className="text-amber-500" />, badge: 'bg-amber-100 text-amber-700', label: 'Warning' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info size={18} className="text-blue-500" />, badge: 'bg-blue-100 text-blue-700', label: 'Optimization' },
  }


  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat header — back button */}
      {view === 'chat' && (
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center flex-shrink-0">
          <button onClick={() => setView('insights')} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Alerts
          </button>
        </div>
      )}
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`mx-auto py-6 ${view === 'rules' ? 'max-w-7xl px-6' : 'max-w-4xl px-4'}`}>

          {/* Insights view */}
          {view === 'insights' && (
            <>

              {loadingPhase === 'scanning' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-5">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin"></div>
                    <Sparkles size={16} className="text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Scanning your environment...</p>
                  <p className="text-xs text-gray-400">Checking processes, data, portals, AI skills, and RPA</p>
                </div>
              )}

              {loadingPhase === 'done' && (
                <>
                  {/* Welcome message */}
                  <div className="mb-4 flex items-center gap-2 px-1">
                    <Sparkles size={16} className="text-blue-500 flex-shrink-0" />
                    <h3 className="text-base font-semibold text-gray-700">Welcome back, John. Here's what's changed since your last visit.</h3>
                  </div>
                  {/* Grouped by priority in accordions */}
                  <div className="space-y-4">
                    {(['critical', 'warning', 'info'] as InsightSeverity[]).map(severity => {
                      const cfg = severityConfig[severity]
                      const groupInsights = insights.filter(i => i.severity === severity).sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
                      const openInGroup = groupInsights.filter(i => i.status === 'open').length
                      const isGroupOpen = expandedGroups.has(severity)
                      return (
                        <div key={severity} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
                          {/* Accordion header */}
                          <button onClick={() => toggleGroup(severity)} className={`w-full flex items-center gap-3 px-5 py-4 text-left ${cfg.bg} hover:brightness-95 transition-all`}>
                            {cfg.icon}
                            <span className="text-sm font-bold text-gray-900">{cfg.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>{groupInsights.length}</span>
                            {openInGroup > 0 && openInGroup < groupInsights.length && <span className="text-xs text-gray-500">({openInGroup} open)</span>}
                            <div className="flex-1" />
                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {/* Accordion body */}
                          {isGroupOpen && (
                            <div className="p-3 space-y-2 bg-white">
                              {groupInsights.map((insight) => {
                                const isResolved = insight.status === 'resolved'
                                const isResolving = insight.status === 'resolving'
                                const isExpanded = expandedInsights.has(insight.id)
                                return (
                                  <div key={insight.id} className={`rounded-lg border border-gray-200 bg-white transition-all duration-300 ${isResolved ? 'opacity-60' : ''}`} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                                    <button onClick={() => toggleExpand(insight.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg">
                                      <div className="flex-shrink-0">{isResolved ? <CheckCircle size={16} className="text-green-500" /> : cfg.icon}</div>
                                      <span className={`flex-1 text-sm ${isResolved ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                        {insight.isNew && !isResolved && <span className="inline-flex px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold mr-2">NEW</span>}
                                        {insight.title.includes(': ') ? (
                                          <><span className="font-bold">{insight.title.split(': ')[0]}:</span> {insight.title.slice(insight.title.indexOf(': ') + 2)}</>
                                        ) : insight.title}
                                      </span>
                                      {insight.metric && !isResolved && <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-600 flex-shrink-0">{insight.metric}</span>}
                                      {isResolved && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium flex-shrink-0">Resolved</span>}
                                      {isResolving && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium flex-shrink-0">Sent to Composer</span>}
                                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isExpanded && (
                                      <div className="px-4 pb-4 pl-11 border-t border-gray-100">
                                        {/* What's happening */}
                                        <p className={`text-sm leading-relaxed mt-3 ${isResolved ? 'text-gray-400' : 'text-gray-600'}`}>{insight.description}</p>

                                        {/* Impact */}
                                        {!isResolved && (
                                          <div className="mt-3">
                                            <div className="text-xs font-semibold text-gray-700 mb-1">Impact:</div>
                                            <div className="text-xs text-gray-600">{insight.impact}</div>
                                          </div>
                                        )}

                                        {/* Remediation steps */}
                                        {!isResolved && (
                                          <div className="mt-3">
                                            <div className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><Lightbulb size={12} className="text-amber-500" />How to fix this:</div>
                                            <div className="space-y-3">
                                              {insight.remediation.split('\n').map((step, si) => {
                                                const num = step.split('.')[0]
                                                const rest = step.slice(step.indexOf('.') + 2)
                                                const [title, ...taskParts] = rest.split('|')
                                                const task = taskParts.join('|').trim()
                                                const renderWithLinks = (text: string) => text.split(/(docs\.appian\.com\/[^\s)]+)/g).map((p, pi) => p.startsWith('docs.appian.com') ? <a key={pi} href={`https://${p}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">docs ↗</a> : p)
                                                return (
                                                  <div key={si} className="flex gap-2 text-xs">
                                                    <span className="text-gray-400 flex-shrink-0 font-mono mt-0.5">{num}.</span>
                                                    <div>
                                                      <div className="font-semibold text-gray-800">{title.trim()}</div>
                                                      {task && <div className="text-gray-500 mt-0.5">{renderWithLinks(task)}</div>}
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}

                                        {/* Metadata row */}
                                        <div className="mt-3 flex items-center gap-3 flex-wrap text-[10px] text-gray-400">
                                          <span>Source: {insight.source}</span>
                                          <span>·</span>
                                          <span>Confidence: <span className={insight.confidence === 'High' ? 'text-green-600' : insight.confidence === 'Medium' ? 'text-amber-600' : 'text-gray-500'}>{insight.confidence}</span></span>
                                          <span>·</span>
                                          <span>First seen: {insight.firstSeen}</span>
                                          <span>·</span>
                                          <span>{insight.category}</span>
                                        </div>

                                        {/* Actions */}
                                        {!isResolved && !isResolving && (
                                          <div className="flex items-center gap-2 flex-wrap mt-3">
                                            {insight.navTarget && (
                                              <button onClick={(e) => { e.stopPropagation(); handleResolve(insight.id) }} className="btn-manual">
                                                <LinkIcon size={12} />Resolve Manually
                                              </button>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); handleAgentResolve(insight.id) }} className="btn-gradient-text">
                                              <Zap size={12} />Send to Composer
                                            </button>
                                          </div>
                                        )}
                                        {isResolving && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin"></div>
                                            <span className="text-xs text-purple-600 font-medium">Sending to Composer...</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {/* Rules view */}
          {view === 'rules' && (
            <div className="space-y-4">
              {/* Search + actions bar — matches other tabs */}
              <div className="flex items-center justify-between">
                <div className="relative w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search alerts..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="flex items-center gap-2"><div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Severity</label><div className="space-y-1">{['Critical','Warning','Optimization'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><div className="space-y-1">{['Tech Debt','Design Guidance','Security','Performance','Custom'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
                <button onClick={() => setShowNewRule(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex-shrink-0">+ New Alert</button></div>
              </div>

              {/* New rule modal */}
              {showNewRule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-[520px] h-[600px] flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                      <h3 className="text-lg font-semibold text-gray-900">{newRuleStep === 'template' ? 'Start from a template' : 'Configure rule'}</h3>
                      <button onClick={() => { setShowNewRule(false); setNewRuleStep('template'); setAdvancedPattern(false); setNewRuleName(''); setNewRulePattern(''); setNewRuleSeverity('warning'); setNewRuleCategory('Custom Rule') }} className="p-1 hover:bg-gray-100 rounded"><XCircle size={18} className="text-gray-400" /></button>
                    </div>

                    {/* Step 1: Template selection */}
                    {newRuleStep === 'template' && (
                      <>
                        <div className="px-6 py-5 flex-1 overflow-y-auto space-y-2">
                          <p className="text-sm text-gray-500 mb-3">Pick a starting point, or skip to create from scratch.</p>
                          {[
                            { name: 'Find old functions that should be replaced', pattern: 'apply(', cat: 'Tech Debt', sev: 'warning' as InsightSeverity, desc: 'Scans for apply(), a!fromJson_19r2(), fn!topeople() and other outdated functions', icon: <RefreshCw size={16} className="text-amber-500" /> },
                            { name: 'Find queries running inside loops', pattern: 'a!queryEntity(forEach(', cat: 'Design Guidance', sev: 'warning' as InsightSeverity, desc: 'Catches the common mistake of querying the database one row at a time instead of all at once', icon: <Database size={16} className="text-orange-500" /> },
                            { name: 'Find integrations without error handling', pattern: 'a!httpResponse( without tryCatch', cat: 'Design Guidance', sev: 'info' as InsightSeverity, desc: 'Flags external calls that will fail silently if something goes wrong', icon: <AlertTriangle size={16} className="text-yellow-500" /> },
                            { name: 'Find hardcoded passwords or API keys', pattern: 'password="|apiKey="', cat: 'Security', sev: 'critical' as InsightSeverity, desc: 'Looks for secrets typed directly into code instead of stored securely', icon: <XCircle size={16} className="text-red-500" /> },
                            { name: 'Find slow-loading interfaces', pattern: '>50 rule calls per eval', cat: 'Design Guidance', sev: 'info' as InsightSeverity, desc: 'Identifies screens that make too many calls and load slowly for users', icon: <Clock size={16} className="text-blue-500" /> },
                            { name: 'Find unused objects and dead code', pattern: 'unreferenced object', cat: 'Tech Debt', sev: 'info' as InsightSeverity, desc: 'Finds rules, interfaces, and process models that are no longer used anywhere', icon: <Search size={16} className="text-gray-500" /> },
                            { name: 'Find process models without cleanup policies', pattern: 'no archive policy', cat: 'Tech Debt', sev: 'warning' as InsightSeverity, desc: 'Process models that never clean up old instances, causing memory to grow over time', icon: <Activity size={16} className="text-purple-500" /> },
                            { name: 'Find record types near sync row limits', pattern: 'sync rows >80%', cat: 'Design Guidance', sev: 'warning' as InsightSeverity, desc: 'Record types approaching the maximum number of synced rows', icon: <BarChart3 size={16} className="text-teal-500" /> },
                          ].map((t, i) => (
                            <button key={i} onClick={() => { setNewRuleName(t.name); setNewRulePattern(t.pattern); setNewRuleCategory(t.cat); setNewRuleSeverity(t.sev) }} className={`w-full text-left p-3 border rounded-lg transition-colors flex gap-3 ${newRuleName === t.name ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                              <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{t.name}</div>
                                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
                          <button onClick={() => { setNewRuleName(''); setNewRulePattern(''); setNewRuleSeverity('warning'); setNewRuleCategory('Custom Rule'); setNewRuleStep('configure') }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Skip</button>
                          <button onClick={() => setNewRuleStep('configure')} disabled={!newRuleName} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
                        </div>
                      </>
                    )}

                    {/* Step 2: Configuration */}
                    {newRuleStep === 'configure' && (
                      <>
                        <div className="px-6 py-5 space-y-4 flex-1 overflow-y-auto">                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" value={newRuleName} onChange={e => setNewRuleName(e.target.value)} placeholder="Give this rule a name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-gray-700">When an object contains</label>
                              <button onClick={() => setAdvancedPattern(!advancedPattern)} className="text-[10px] text-blue-600 hover:underline">{advancedPattern ? 'Options' : 'Advanced'}</button>
                            </div>
                            {advancedPattern ? (
                              <div className="border border-gray-200 rounded-lg overflow-hidden flex bg-white">
                                <div className="bg-gray-50 border-r border-gray-200 px-2 py-2 text-right select-none">
                                  {(newRulePattern || ' ').split('\n').map((_, i) => <div key={i} className="text-[10px] font-mono text-gray-400 leading-5">{i + 1}</div>)}
                                </div>
                                <textarea value={newRulePattern} onChange={e => setNewRulePattern(e.target.value)} placeholder='Type a pattern, e.g. "apply(" or "wherecontains(index("' rows={4} className="flex-1 px-3 py-2 text-sm font-mono text-gray-800 focus:outline-none resize-y leading-5" />
                              </div>
                            ) : (
                              <select value={newRulePattern} onChange={e => setNewRulePattern(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                                <option value="">Pick what to look for...</option>
                                <optgroup label="Outdated code that should be updated">
                                  <option value="apply(">apply() — replaced by a!forEach()</option>
                                  <option value="a!fromJson_19r2(">a!fromJson_19r2() — replaced by a!fromJson()</option>
                                  <option value="fn!topeople(">fn!topeople() — replaced by a!groupMembers()</option>
                                  <option value="fn!todocument(">fn!todocument() — replaced by a!docFromByteArray()</option>
                                  <option value="fn!calendaradddays(">fn!calendaradddays() — replaced by caladddays()</option>
                                </optgroup>
                                <optgroup label="Performance problems">
                                  <option value="index(wherecontains(">Slow lookups — wherecontains() nested inside index()</option>
                                  <option value="a!queryEntity(forEach(">Querying the database one row at a time in a loop</option>
                                  <option value="load( without local!">Using load() instead of the faster a!localVariables()</option>
                                  <option value=">50 rule calls per eval">Screens that make too many calls and load slowly</option>
                                  <option value="a!httpResponse( without tryCatch">External calls that fail silently with no error handling</option>
                                </optgroup>
                                <optgroup label="Security concerns">
                                  <option value='password="|apiKey="'>Passwords or API keys typed directly into code</option>
                                  <option value="fn!topeople(">Functions that skip permission checks</option>
                                </optgroup>
                              </select>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                              <select value={newRuleCategory} onChange={e => setNewRuleCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                                <option>Tech Debt</option><option>Design Guidance</option><option>Security</option><option>Performance</option><option>Custom Rule</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
                              <select value={newRuleSeverity} onChange={e => setNewRuleSeverity(e.target.value as InsightSeverity)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                                <option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Optimization</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
                          <button onClick={() => setNewRuleStep('template')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">← Back</button>
                          <button onClick={addCustomRule} disabled={!newRuleName.trim() || !newRulePattern.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">Create</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Rules table — consistent with other tabs */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Alert</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pattern</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Matches</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Run</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customRules.map(rule => (
                      <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{rule.name}</span>
                            {rule.builtIn && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">Built-in</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{rule.category}</div>
                        </td>
                        <td className="px-6 py-4"><code className="text-xs font-mono text-pink-600 bg-gray-50 px-2 py-1 rounded">{rule.pattern}</code></td>
                        <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rule.severity === 'critical' ? 'bg-red-100 text-red-700' : rule.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{rule.severity === 'info' ? 'Optimization' : rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}</span></td>
                        <td className="px-6 py-4">
                          {scanningRule === rule.id ? (
                            <span className="flex items-center gap-1.5 text-xs text-purple-600"><span className="w-3 h-3 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></span>Scanning...</span>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rule.matches > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{rule.matches > 0 ? `${rule.matches} found` : 'Clean'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{rule.lastRun}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => runRule(rule.id)} disabled={scanningRule === rule.id} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40">Re-scan</button>
                            <button onClick={() => setCustomRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))} className={`relative w-9 h-5 rounded-full transition-colors ${rule.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                            {!rule.builtIn && <button onClick={() => setCustomRules(prev => prev.filter(r => r.id !== rule.id))} className="px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50">Delete</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Main Component ──

const navItems = [
  { id: 'ops-ai', label: 'Operations AI', icon: Sparkles },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'processes', label: 'Process Activity', icon: Layers },
  { id: 'process-metrics', label: 'Process Model Metrics', icon: BarChart3 },
  { id: 'record-response', label: 'Record Response Times', icon: Clock },
  { id: 'record-sync', label: 'Record Sync Status', icon: RefreshCw },
  { id: 'query-perf', label: 'Query Performance', icon: Database },
  { id: 'ai', label: 'AI', icon: Brain },
  { id: 'rpa', label: 'RPA', icon: Bot },
  { id: 'portals', label: 'Portal Monitoring', icon: Globe },
  { id: 'logs', label: 'Log', icon: List },
]
// Keep these available for future use
void HealthDashboard; void ProcessInstancesContent

function AIContent() {
  const [aiTab, setAiTab] = useState<'observe' | 'evaluate'>('observe')
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8" style={{ minHeight: '80px' }}>
        <div className="flex items-center" style={{ minHeight: '48px' }}>
          <HeadingField text="AI" size="LARGE" marginBelow="NONE" />
        </div>
        <div className="flex gap-0">
          <button onClick={() => setAiTab('observe')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${aiTab === 'observe' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Observe</button>
          <button onClick={() => setAiTab('evaluate')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${aiTab === 'evaluate' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>AI Calls</button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {aiTab === 'observe' && <ObserveContent />}
        {aiTab === 'evaluate' && <EvaluateContent />}
      </div>
    </div>
  )
}


function HomeContent({ editing }: { editing: boolean }) {
  const [cardOrder, setCardOrder] = useState(['health-summary','kpi-row','charts-row','error-sessions','runtime','infra','services','endpoints'])
  const [cardSpan, setCardSpan] = useState<Record<string, number>>({})
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())
  const [cardSource, setCardSource] = useState<Record<string, string>>({})
  const [dragging, setDragging] = useState<string | null>(null)
  const sources = ['Grafana', 'MyAppian Server Metrics', 'Appian CSV Logs', 'ELK for Appian', 'Custom API']
  const resetDashboard = () => { setHiddenCards(new Set()); setCardSpan({}); setCardSource({}); setCardOrder(['health-summary','kpi-row','charts-row','error-sessions','runtime','infra','services','endpoints']) }
  // cardOrder tracks user's preferred card arrangement (persisted in a real implementation)
  const handleDragStart = (id: string) => { if (editing) setDragging(id) }
  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); return }
    setCardOrder(prev => {
      const from = prev.indexOf(dragging)
      const to = prev.indexOf(targetId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      next.splice(from, 1)
      next.splice(to, 0, dragging)
      return next
    })
    setDragging(null)
  }
  const rpsData = [420,380,290,180,120,95,110,240,520,680,780,847,810,720,690,750,780,810,760,680,590,510,470,440]
  const latencyData = [120,115,108,95,88,82,85,110,145,168,182,195,188,172,165,175,180,185,178,165,148,132,125,118]
  const errData = [0.2,0.1,0.1,0.0,0.0,0.0,0.1,0.2,0.4,0.5,0.6,0.8,0.7,0.5,0.4,0.3,0.4,0.5,0.4,0.3,0.2,0.2,0.1,0.1]
  const cpuData = [32,30,28,25,22,20,21,28,38,45,52,58,55,48,46,50,52,54,51,47,42,38,35,33]
  const heapData = [62,61,60,58,56,55,54,58,65,72,78,82,80,76,74,76,78,79,77,74,70,66,64,63]
  const threadData = [80,78,72,65,58,52,55,70,95,120,142,158,150,135,128,138,142,148,140,130,115,100,90,85]
  const gcData = [12,10,8,6,5,4,5,8,15,22,28,35,32,25,22,26,28,30,27,24,18,15,13,12]
  const sessData = [180,165,140,95,60,42,48,120,280,420,510,580,560,490,470,510,530,550,520,480,380,290,220,195]
  const Spark = ({ data, color, max, h = 'h-8' }: { data: number[]; color: string; max: number; h?: string }) => (
    <svg viewBox={`0 0 ${data.length * 4} 32`} className={`w-full ${h}`} preserveAspectRatio="none">
      <defs><linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`M${data.map((v, i) => `${i * 4},${32 - (v / max) * 32}`).join(' L')} L${(data.length - 1) * 4},32 L0,32 Z`} fill={`url(#sg-${color})`} />
      <polyline points={data.map((v, i) => `${i * 4},${32 - (v / max) * 32}`).join(' ')} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
  const TimeAxis = () => <div className="flex justify-between mt-0.5 text-[7px] text-gray-400"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div>
  const Card = ({ id, children, className = '', label = '' }: { id: string; children: React.ReactNode; className?: string; label?: string }) => {
    if (hiddenCards.has(id)) return null
    const span = cardSpan[id] || 0
    const spanClass = span === 1 ? 'col-span-1' : span === 3 ? 'col-span-3' : ''
    const order = cardOrder.indexOf(id)
    return (
      <div
        draggable={editing}
        onDragStart={() => handleDragStart(id)}
        onDragOver={e => { if (editing) e.preventDefault() }}
        onDrop={() => handleDrop(id)}
        style={{ order }}
        className={`relative ${className} ${spanClass} ${editing ? 'ring-2 ring-blue-300 ring-dashed rounded-lg cursor-grab' : ''} ${dragging === id ? 'opacity-40' : ''} transition-all`}
      >
        {editing && (
          <div className="absolute -top-3 left-2 right-2 z-10 flex items-center gap-1 bg-white rounded-full shadow-sm border border-gray-200 px-2 py-0.5">
            <span className="text-[8px] text-gray-400 mr-auto cursor-grab">⠿ {label || id}</span>
            <div className="flex gap-px">
              {[1,2,3].map(s => <button key={s} onClick={() => setCardSpan(p => ({...p, [id]: s === 2 ? 0 : s}))} className={`w-4 h-4 rounded text-[7px] font-bold ${(span || 2) === (s === 2 ? 0 : s) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{s === 1 ? '⅓' : s === 2 ? '½' : '⅔'}</button>)}
            </div>
            <select value={cardSource[id] || ''} onChange={e => setCardSource(p => ({...p, [id]: e.target.value}))} className="text-[8px] text-gray-500 bg-transparent border-none p-0 cursor-pointer focus:outline-none max-w-[80px]">
              <option value="">Auto source</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setHiddenCards(prev => { const n = new Set(prev); n.add(id); return n })} className="w-4 h-4 rounded bg-red-100 text-red-500 text-[8px] font-bold hover:bg-red-200">✕</button>
          </div>
        )}
        {children}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {/* Customization toolbar */}
      <div className="flex items-center justify-between" style={{ order: -1 }}>
        <div className="flex items-center gap-2">
          {editing && (
            <>
              <span className="text-[10px] text-blue-600 font-medium">Drag cards to reorder · Resize with ⅓ ½ ⅔ · Set data source per card</span>
              <button onClick={() => { setHiddenCards(new Set()); }} className="px-2.5 py-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">Show All</button>
              <button onClick={resetDashboard} className="px-2.5 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">Reset Default</button>
            </>
          )}
        </div>
      </div>

      {/* Health summary cards (from Health Dashboard) */}
      <Card id="health-summary" label="Health Summary">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><Layers size={16} className="text-gray-500" /><span className="text-xs font-bold text-gray-700">Process Activity</span></div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">234</div>
              <div className="space-y-0.5 text-[10px]"><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Active: 142</div><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Completed: 89</div><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Errors: 3</div></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><BarChart3 size={16} className="text-gray-500" /><span className="text-xs font-bold text-gray-700">Process Model Metrics</span></div>
            <div className="space-y-1.5">
              {[{l:'Low',v:45,c:'bg-green-500'},{l:'Medium',v:12,c:'bg-yellow-500'},{l:'High',v:3,c:'bg-red-500'}].map((b,i) => <div key={i}><div className="flex justify-between text-[10px]"><span className="text-gray-600">{b.l}</span><span className="font-medium">{b.v}</span></div><div className="h-1.5 bg-gray-100 rounded-full"><div className={`h-1.5 ${b.c} rounded-full`} style={{width:`${b.v/60*100}%`}}></div></div></div>)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-gray-500" /><span className="text-xs font-bold text-gray-700">Record Response Times</span></div>
            <div className="space-y-1.5">
              {[{l:'Low',v:28,c:'bg-green-500'},{l:'Medium',v:8,c:'bg-yellow-500'},{l:'High',v:2,c:'bg-red-500'}].map((b,i) => <div key={i}><div className="flex justify-between text-[10px]"><span className="text-gray-600">{b.l}</span><span className="font-medium">{b.v}</span></div><div className="h-1.5 bg-gray-100 rounded-full"><div className={`h-1.5 ${b.c} rounded-full`} style={{width:`${b.v/60*100}%`}}></div></div></div>)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><RefreshCw size={16} className="text-gray-500" /><span className="text-xs font-bold text-gray-700">Record Sync Status</span></div>
            <div className="text-2xl font-bold text-gray-900 mb-1">34 <span className="text-xs font-normal text-gray-500">synced</span></div>
            <div className="flex gap-2 text-[10px]"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>OK: 30</span><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Failed: 2</span><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Warn: 2</span></div>
          </div>
        </div>
      </Card>

      <Card id="kpi-row" label="Key Metrics">
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'Web API Calls (24h)', value: '284,912', sub: '↑ 12.3%', spark: rpsData, max: 847, color: '#3b82f6' },
          { label: 'Avg Latency', value: '142ms', sub: 'p95: 420ms', spark: latencyData, max: 200, color: '#f59e0b' },
          { label: 'Error Rate', value: '0.34%', sub: '↓ 0.12%', spark: errData, max: 1, color: '#ef4444' },
          { label: 'Portal Sessions', value: '580', sub: 'peak today', spark: sessData, max: 580, color: '#8b5cf6' },
          { label: 'Process Memory', value: '1.2M', sub: 'AMU total', spark: cpuData, max: 100, color: '#06b6d4' },
          { label: 'Record Queries', value: '142k', sub: 'avg 67ms exec', spark: heapData, max: 100, color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">{s.label}</div>
            <div className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-gray-900">{s.value}</span><span className="text-[10px] text-gray-400">{s.sub}</span></div>
            <Spark data={s.spark} color={s.color} max={s.max} />
          </div>
        ))}
      </div>
      </Card>

      <Card id="charts-row" label="Throughput & Latency">
      {/* Row 2: Request throughput + Latency distribution */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Web API Throughput (req/s)</span><span className="text-[10px] text-gray-400">24h</span></div>
          <div className="h-24 flex items-end gap-0.5 relative">
            {/* Max thread capacity threshold */}
            <div className="absolute left-0 right-0 border-t border-dashed border-red-400" style={{ bottom: `${(750 / 847) * 100}%` }}><span className="absolute right-0 -top-3 text-[7px] text-red-400">750 rps — thread capacity</span></div>
            {rpsData.map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div className={`w-full rounded-sm ${v >= 750 ? 'bg-red-500/80 hover:bg-red-600' : 'bg-blue-500/80 hover:bg-blue-600'} transition-colors`} style={{ height: `${(v / 847) * 100}%` }}></div>
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">{v} rps · {i}:00{v >= 750 ? ' ⚠ near capacity' : ''}</div>
              </div>
            ))}
          </div>
          <TimeAxis />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Response Latency (ms)</span><span className="text-[10px] text-gray-400">p50/p95/p99</span></div>
          <svg viewBox="0 0 240 96" className="w-full h-24">
            <defs>
              <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></linearGradient>
            </defs>
            <path d={`M${latencyData.map((v, i) => `${i * (240 / 23)},${96 - (v / 250) * 96}`).join(' L')} L240,96 L0,96 Z`} fill="url(#latGrad)" />
            <polyline points={latencyData.map((v, i) => `${i * (240 / 23)},${96 - (v / 250) * 96}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <polyline points={latencyData.map((v, i) => `${i * (240 / 23)},${96 - (v * 2.2 / 500) * 96}`).join(' ')} fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            <polyline points={latencyData.map((v, i) => `${i * (240 / 23)},${96 - (v * 4.5 / 1500) * 96}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
            <line x1="0" y1={96 - (200 / 250) * 96} x2="240" y2={96 - (200 / 250) * 96} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3 2" />
            <text x="238" y={96 - (200 / 250) * 96 - 2} className="text-[6px] fill-red-400" textAnchor="end">SLA 200ms</text>
          </svg>
          <div className="flex justify-between mt-0.5"><div className="flex gap-3 text-[8px]"><span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 rounded"></span>p50</span><span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 rounded opacity-60"></span>p95</span><span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 rounded opacity-40"></span>p99</span></div><div className="text-[7px] text-gray-400">Now</div></div>
        </div>
      </div>
      </Card>
      <Card id="error-sessions" label="Errors & Sessions">
      {/* Row 3: Error rate + Active sessions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Error Rate (5xx)</span><span className="text-[10px] text-gray-400">threshold: 0.5%</span></div>
          <svg viewBox="0 0 240 64" className="w-full h-16">
            <defs><linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></linearGradient></defs>
            <path d={`M${errData.map((v, i) => `${i * (240 / 23)},${64 - (v / 1) * 64}`).join(' L')} L240,64 L0,64 Z`} fill="url(#errGrad)" />
            <polyline points={errData.map((v, i) => `${i * (240 / 23)},${64 - (v / 1) * 64}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="0" y1={64 - (0.5 / 1) * 64} x2="240" y2={64 - (0.5 / 1) * 64} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 2" />
            <text x="238" y={64 - (0.5 / 1) * 64 - 2} className="text-[6px] fill-amber-500" textAnchor="end">0.5% warn</text>
          </svg>
          <TimeAxis />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Portal Traffic Requests</span><span className="text-[10px] text-gray-400">page loads + interactions</span></div>
          <svg viewBox="0 0 240 64" className="w-full h-16">
            <defs><linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
            <path d={`M${sessData.map((v, i) => `${i * (240 / 23)},${64 - (v / 600) * 64}`).join(' L')} L240,64 L0,64 Z`} fill="url(#sessGrad)" />
            <polyline points={sessData.map((v, i) => `${i * (240 / 23)},${64 - (v / 600) * 64}`).join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
          </svg>
          <TimeAxis />
        </div>
      </div>

      </Card>
      <Card id="runtime" label="Appian Runtime">
      {/* Row 4: Appian Runtime — Process Memory, Engines, Record Sync, Query Perf */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-0.5"><span className="text-[10px] font-bold text-gray-700">Process Memory (AMU)</span></div>
          <div className="text-[9px] text-gray-400 mb-1">How much memory all running process instances consume. High AMU = processes aren't completing or archiving.</div>
          <Spark data={cpuData} color="#06b6d4" max={100} />
          <TimeAxis />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-0.5"><span className="text-[10px] font-bold text-gray-700">Engine Idle %</span></div>
          <div className="text-[9px] text-gray-400 mb-1">% of time engines wait for work. Below 20% = engines are overloaded and queuing transactions.</div>
          <Spark data={heapData} color="#22c55e" max={100} />
          <TimeAxis />
          <div className="text-[8px] text-red-500 mt-0.5">⚠ Threshold: &lt;20% idle = overloaded</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-0.5"><span className="text-[10px] font-bold text-gray-700">Engine Other Time (ms)</span></div>
          <div className="text-[9px] text-gray-400 mb-1">Time engines spend waiting on external factors (DB, integrations, file I/O) to process a transaction. High = external bottleneck.</div>
          <Spark data={threadData} color="#f97316" max={200} />
          <TimeAxis />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-0.5"><span className="text-[10px] font-bold text-gray-700">Work Queue Size</span></div>
          <div className="text-[9px] text-gray-400 mb-1">Transactions waiting to be processed. Growing queue = engines can't keep up with incoming work.</div>
          <Spark data={gcData} color="#f43f5e" max={50} />
          <TimeAxis />
          <div className="text-[8px] text-red-500 mt-0.5">⚠ Threshold: &gt;100 queued = investigate</div>
        </div>
      </div>

      </Card>
      <Card id="infra" label="Infrastructure">
      {/* Row 5: Execution Engines + Connected Systems + Status Codes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Execution Engines</span></div>
          <div className="space-y-2">
            {[{ name: 'Engine 1 (Primary)', active: 142, max: 300, status: 'Running' }, { name: 'Engine 2', active: 89, max: 300, status: 'Running' }, { name: 'Engine 3 (Autoscale)', active: 45, max: 200, status: 'Running' }].map((e, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-0.5"><span className="text-gray-700">{e.name}</span><span className="text-gray-500">{e.active}/{e.max} instances · <span className="text-green-600">{e.status}</span></span></div>
                <div className="h-1.5 bg-gray-100 rounded-full"><div className={`h-1.5 rounded-full ${(e.active / e.max) > 0.8 ? 'bg-red-500' : (e.active / e.max) > 0.5 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${(e.active / e.max) * 100}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Connected Systems</span></div>
          <div className="space-y-2">
            {[{ name: 'Salesforce (HR)', latency: '120ms', status: 'OK' }, { name: 'SAP Finance', latency: '—', status: 'Down' }, { name: 'DocuSign', latency: '89ms', status: 'OK' }, { name: 'AWS S3 (Documents)', latency: '45ms', status: 'OK' }].map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-gray-700">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">{c.latency}</span>
                  <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded ${c.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-700">Record Sync Status</span></div>
          <div className="space-y-2">
            {[{ type: 'Customer', rows: '45,230', status: 'Completed', time: '2m ago' }, { type: 'Invoice', rows: '128,450', status: 'Completed', time: '5m ago' }, { type: 'Employee', rows: '12,890', status: 'Failed', time: '18m ago' }, { type: 'Case', rows: '890,000', status: 'Approaching Limit', time: '3m ago' }].map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-gray-700">{r.type} <span className="text-gray-400">({r.rows} rows)</span></span>
                <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded ${r.status === 'Completed' ? 'bg-green-100 text-green-700' : r.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Card>
      <Card id="services" label="Service Throughput">
      {/* Row 6: Throughput by service */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-xs font-bold text-gray-700 mb-3">Throughput by Service</div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { svc: 'Web APIs', rps: 340, latency: '142ms', errs: 12, color: 'bg-blue-500' },
            { svc: 'Portals', rps: 180, latency: '52ms', errs: 0, color: 'bg-purple-500' },
            { svc: 'Process Engine', rps: 95, latency: '890ms', errs: 3, color: 'bg-green-500' },
            { svc: 'Record Queries', rps: 420, latency: '67ms', errs: 2, color: 'bg-cyan-500' },
            { svc: 'Connected Systems', rps: 65, latency: '1.2s', errs: 8, color: 'bg-orange-500' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`h-16 ${s.color} rounded-md mb-1.5 flex items-end justify-center`} style={{ opacity: 0.15 + (s.rps / 420) * 0.85 }}>
                <div className={`w-full ${s.color} rounded-md`} style={{ height: `${(s.rps / 420) * 100}%` }}></div>
              </div>
              <div className="text-[10px] font-bold text-gray-700">{s.svc}</div>
              <div className="text-[9px] text-gray-500">{s.rps} rps · {s.latency}</div>
              {s.errs > 0 && <div className="text-[9px] text-red-500">{s.errs} errors</div>}
            </div>
          ))}
        </div>
      </div>

      </Card>
      <Card id="endpoints" label="Top Endpoints">
      {/* Row 7: Top endpoints table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50 flex items-center justify-between"><span className="text-xs font-bold text-gray-700">Top Endpoints</span><span className="text-[10px] text-gray-400">by request volume · 24h</span></div>
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr>{['Endpoint','Method','Hits','Avg','P95','P99','Err %','Throughput'].map(h => <th key={h} className="px-3 py-2 text-left text-[10px] font-bold text-gray-700 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { endpoint: '/suite/webapi/customer-lookup', method: 'GET', hits: '48,230', avg: '89ms', p95: '210ms', p99: '480ms', err: '0.1%', rps: '33.5' },
              { endpoint: '/suite/webapi/invoice-submit', method: 'POST', hits: '32,100', avg: '245ms', p95: '890ms', p99: '2.1s', err: '0.8%', rps: '22.3' },
              { endpoint: '/suite/portal/customer-self-service', method: 'GET', hits: '28,450', avg: '52ms', p95: '120ms', p99: '280ms', err: '0.0%', rps: '19.8' },
              { endpoint: '/suite/webapi/document-upload', method: 'POST', hits: '18,920', avg: '1.2s', p95: '3.4s', p99: '8.1s', err: '1.2%', rps: '13.1' },
              { endpoint: '/suite/record/Customer (query)', method: 'GET', hits: '15,670', avg: '67ms', p95: '180ms', p99: '340ms', err: '0.0%', rps: '10.9' },
              { endpoint: '/suite/rest/a/task/latest/all', method: 'GET', hits: '12,340', avg: '134ms', p95: '450ms', p99: '1.1s', err: '0.2%', rps: '8.6' },
              { endpoint: '/suite/record/Invoice (sync)', method: 'POST', hits: '9,870', avg: '2.4s', p95: '5.1s', p99: '12s', err: '0.3%', rps: '6.9' },
              { endpoint: '/suite/ai/skill/invoice-processing', method: 'POST', hits: '8,420', avg: '1.6s', p95: '4.2s', p99: '12s', err: '0.5%', rps: '5.8' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 text-xs font-mono text-blue-600 max-w-[280px] truncate">{r.endpoint}</td>
                <td className="px-3 py-2"><span className={`inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded ${r.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{r.method}</span></td>
                <td className="px-3 py-2 text-xs text-gray-700">{r.hits}</td>
                <td className="px-3 py-2 text-xs text-gray-700">{r.avg}</td>
                <td className="px-3 py-2 text-xs text-gray-700">{r.p95}</td>
                <td className="px-3 py-2 text-xs text-gray-700">{r.p99}</td>
                <td className="px-3 py-2 text-xs"><span className={parseFloat(r.err) > 0.5 ? 'text-red-600 font-medium' : 'text-gray-500'}>{r.err}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.rps}/s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Card>
    </div>
  )
}

function LogSearchContent() {
  const [logSearch, setLogSearch] = useState('')
  const [logLevel, setLogLevel] = useState('All')
  const [logSource, setLogSource] = useState('All')
  const [logsPage, setLogsPage] = useState(0)
  const [regexMode, setRegexMode] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const allLogs = [
    { ts: '11:31:42.891', level: 'ERROR' as const, source: 'ProcessExecution', msg: 'Timeout waiting for subprocess "Assign Agent" in PI-204888 after 30000ms', trace: 'com.appian.process.engine.TimeoutException' },
    { ts: '11:31:40.123', level: 'WARN' as const, source: 'RecordSync', msg: 'Sync for Employee record type failed: connection refused to Salesforce endpoint', trace: '' },
    { ts: '11:31:38.456', level: 'INFO' as const, source: 'WebAPI', msg: 'POST /suite/webapi/invoice-submit completed in 245ms (200 OK)', trace: '' },
    { ts: '11:31:35.789', level: 'ERROR' as const, source: 'ProcessExecution', msg: 'Expression evaluation error in "Validate Amount" node: division by zero in PI-204883', trace: 'com.appian.expressions.EvalException' },
    { ts: '11:31:32.012', level: 'INFO' as const, source: 'ProcessExecution', msg: 'Process instance PI-204890 (Invoice Processing) completed successfully', trace: '' },
    { ts: '11:31:28.345', level: 'WARN' as const, source: 'Security', msg: 'Failed login attempt for user "admin.test" from IP 10.0.4.52 (3rd attempt)', trace: '' },
    { ts: '11:31:25.678', level: 'INFO' as const, source: 'AISkill', msg: 'Invoice Processing AI skill invocation completed: 980 input tokens, 240 output tokens, 1.6s latency', trace: '' },
    { ts: '11:31:22.901', level: 'DEBUG' as const, source: 'QueryPerf', msg: 'Slow query detected: Customer record query took 2.4s (threshold: 2s)', trace: '' },
    { ts: '11:31:20.234', level: 'INFO' as const, source: 'Portal', msg: 'Portal "Customer Self-Service" health check passed (response: 52ms)', trace: '' },
    { ts: '11:31:18.567', level: 'ERROR' as const, source: 'Integration', msg: 'Connected system "SAP_Finance" returned HTTP 503: service unavailable', trace: 'com.appian.integration.HttpException' },
    { ts: '11:31:15.890', level: 'INFO' as const, source: 'ProcessExecution', msg: 'Process instance PI-204891 started by maria.chen (Customer Onboarding)', trace: '' },
    { ts: '11:31:12.123', level: 'WARN' as const, source: 'Memory', msg: 'JVM heap usage at 78% (6.2GB / 8GB) — approaching warning threshold', trace: '' },
    { ts: '11:31:09.456', level: 'INFO' as const, source: 'WebAPI', msg: 'GET /suite/webapi/customer-lookup completed in 89ms (200 OK)', trace: '' },
    { ts: '11:31:06.789', level: 'ERROR' as const, source: 'RecordSync', msg: 'Record sync for "Order" type exceeded max retry count (3). Last error: socket timeout', trace: 'com.appian.data.sync.SyncException' },
    { ts: '11:31:03.012', level: 'WARN' as const, source: 'AISkill', msg: 'AI skill "Document Classifier" response latency 4.2s exceeds 3s SLA threshold', trace: '' },
    { ts: '11:31:00.345', level: 'INFO' as const, source: 'Security', msg: 'User john.smith authenticated via SSO (SAML 2.0)', trace: '' },
    { ts: '11:30:57.678', level: 'DEBUG' as const, source: 'Integration', msg: 'Outbound call to https://api.salesforce.com/v58 — 312ms, 200 OK', trace: '' },
    { ts: '11:30:54.901', level: 'WARN' as const, source: 'ProcessExecution', msg: 'Process model "Expense Approval" has 847 active instances — approaching 1000 limit', trace: '' },
    { ts: '11:30:51.234', level: 'INFO' as const, source: 'Portal', msg: 'Portal "Vendor Registration" received 23 submissions in last 5 minutes', trace: '' },
    { ts: '11:30:48.567', level: 'ERROR' as const, source: 'Security', msg: 'Unauthorized API access attempt: invalid token for /suite/webapi/admin-data from IP 10.0.9.14', trace: 'com.appian.security.AuthException' },
  ]

  const matchesSearch = (log: typeof allLogs[0]) => {
    if (!logSearch) return true
    const q = logSearch
    if (regexMode) {
      try {
        const re = new RegExp(q, 'i')
        return re.test(log.msg) || re.test(log.source) || re.test(log.trace)
      } catch { return false }
    }
    const lower = q.toLowerCase()
    return log.msg.toLowerCase().includes(lower) || log.source.toLowerCase().includes(lower) || log.trace.toLowerCase().includes(lower)
  }

  const filtered = allLogs.filter(l =>
    (logLevel === 'All' || l.level === logLevel) &&
    (logSource === 'All' || l.source === logSource) &&
    matchesSearch(l)
  )
  const PER = 10
  const paged = filtered.slice(logsPage * PER, (logsPage + 1) * PER)
  const totalPages = Math.ceil(filtered.length / PER)
  const levelColor = (l: string) => l === 'ERROR' ? 'bg-red-100 text-red-700' : l === 'WARN' ? 'bg-yellow-100 text-yellow-700' : l === 'DEBUG' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
  const sources = [...new Set(allLogs.map(l => l.source))].sort()
  const errorCount = allLogs.filter(l => l.level === 'ERROR').length
  const warnCount = allLogs.filter(l => l.level === 'WARN').length

  const toggleRow = (i: number) => {
    setExpandedRows(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next })
  }

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Errors (1h)', value: String(errorCount), color: 'text-red-600', bg: 'border-red-200 bg-red-50' },
          { label: 'Warnings (1h)', value: String(warnCount), color: 'text-yellow-600', bg: 'border-yellow-200 bg-yellow-50' },
          { label: 'Log Volume', value: '14.2k/hr', color: 'text-gray-900', bg: 'border-gray-200 bg-white' },
          { label: 'Sources Connected', value: `${sources.length}/${sources.length}`, color: 'text-green-600', bg: 'border-gray-200 bg-white' },
        ].map((s, i) => (
          <div key={i} className={`rounded-lg border p-4 ${s.bg}`}>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={regexMode ? 'Regex pattern...' : 'Search logs...'} value={logSearch} onChange={e => { setLogSearch(e.target.value); setLogsPage(0) }} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
          <button onClick={() => setRegexMode(!regexMode)} title="Toggle regex mode" className={`p-2 border rounded-lg text-sm font-mono font-bold ${regexMode ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}>.*</button>
          <div className="relative"><details className="inline-block"><summary className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer list-none"><SlidersHorizontal size={14} /></summary><div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 space-y-3"><div><label className="block text-xs font-medium text-gray-700 mb-1">Level</label><div className="space-y-1">{['ERROR','WARN','INFO','DEBUG'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={logLevel === 'All' || logLevel === s} onChange={() => { setLogLevel(logLevel === s ? 'All' : s); setLogsPage(0) }} className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div><div><label className="block text-xs font-medium text-gray-700 mb-1">Source</label><div className="space-y-1">{sources.map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={logSource === 'All' || logSource === s} onChange={() => { setLogSource(logSource === s ? 'All' : s); setLogsPage(0) }} className="rounded border-gray-300 text-blue-600" />{s}</label>)}</div></div></div></details></div>
          <button title="Export logs" className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600"><Download size={14} /></button>
          </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        <div className="divide-y divide-gray-200">
          {paged.map((l, i) => {
            const globalIdx = logsPage * PER + i
            return (
              <div key={i} className={`hover:bg-gray-50 font-mono text-xs ${l.level === 'ERROR' ? 'bg-red-50/50' : ''}`}>
                <div className="px-4 py-2 flex items-start gap-3 cursor-pointer" onClick={() => l.trace && toggleRow(globalIdx)}>
                  <span className="text-gray-400 flex-shrink-0 w-24">{l.ts}</span>
                  <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded flex-shrink-0 w-14 justify-center ${levelColor(l.level)}`}>{l.level}</span>
                  <span className="text-purple-600 flex-shrink-0 w-32">[{l.source}]</span>
                  <span className="text-gray-800 flex-1">{l.msg}</span>
                  {l.trace && <ChevronDown size={12} className={`text-gray-400 flex-shrink-0 transition-transform ${expandedRows.has(globalIdx) ? 'rotate-180' : ''}`} />}
                </div>
                {l.trace && expandedRows.has(globalIdx) && (
                  <div className="px-4 pb-2 ml-[11.5rem]">
                    <div className="text-[10px] text-red-400 bg-red-50 rounded px-2 py-1 border border-red-100">{l.trace}</div>
                  </div>
                )}
              </div>
            )
          })}
          {paged.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-400">No logs match your filters</div>}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">{logsPage * PER + 1}–{Math.min((logsPage + 1) * PER, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setLogsPage(Math.max(0, logsPage - 1))} disabled={logsPage === 0} className="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-30">Prev</button>
              <button onClick={() => setLogsPage(Math.min(totalPages - 1, logsPage + 1))} disabled={logsPage === totalPages - 1} className="px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Log file reference — collapsed */}
      <details className="px-1">
        <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-700 select-none flex items-center gap-1"><Info size={10} />What do these log files contain?</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { file: 'system.csv', desc: 'JVM heap, CPU, thread counts, GC pauses — the server\'s vital signs.' },
            { file: 'engine*.csv', desc: 'Execution engine health: idle %, other time, work queue size.' },
            { file: 'perf_monitor*.csv', desc: 'Per-request timing for DB queries, integrations, and expressions.' },
            { file: 'expression*.csv', desc: 'Expression rule evaluation times. Slow expressions cause slow interfaces.' },
            { file: 'data_store*.csv', desc: 'Database query execution times and row counts.' },
            { file: 'smart_service*.csv', desc: 'Smart service (process node) execution times.' },
            { file: 'integration*.csv', desc: 'Connected system call times. If SAP/Salesforce is slow, it shows here.' },
            { file: 'top_models*.csv', desc: 'Highest-memory process models by AMU.' },
          ].map((l, i) => (
            <div key={i} className="flex gap-2 p-2 bg-gray-50 rounded">
              <code className="text-[9px] font-mono font-bold text-blue-600 flex-shrink-0 w-28">{l.file}</code>
              <span className="text-[9px] text-gray-600">{l.desc}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}

function ProcessInstancesContent() {
  const [procSearch, setProcSearch] = useState('')
  const [procStatus, setProcStatus] = useState('All')
  const processInstances = [
    { id: 'PI-204891', name: 'Customer Onboarding', status: 'Active' as const, started: '4/27/2026 9:12 AM', user: 'maria.chen', duration: '2h 31m', node: 'Review Documents' },
    { id: 'PI-204890', name: 'Invoice Processing', status: 'Completed' as const, started: '4/27/2026 8:45 AM', user: 'james.wilson', duration: '12m', node: 'End' },
    { id: 'PI-204889', name: 'Expense Approval', status: 'Active' as const, started: '4/27/2026 8:30 AM', user: 'sarah.jones', duration: '3h 1m', node: 'Manager Approval' },
    { id: 'PI-204888', name: 'Help Desk Ticket', status: 'Error' as const, started: '4/27/2026 8:15 AM', user: 'tom.anderson', duration: '3h 16m', node: 'Assign Agent (ERROR)' },
    { id: 'PI-204887', name: 'Vendor Onboarding', status: 'Paused' as const, started: '4/27/2026 7:50 AM', user: 'lisa.garcia', duration: '3h 41m', node: 'Awaiting Vendor Response' },
    { id: 'PI-204886', name: 'Document Review', status: 'Active' as const, started: '4/27/2026 7:30 AM', user: 'david.brown', duration: '4h 1m', node: 'Legal Review' },
    { id: 'PI-204885', name: 'HR Review', status: 'Completed' as const, started: '4/27/2026 7:00 AM', user: 'amy.taylor', duration: '45m', node: 'End' },
    { id: 'PI-204884', name: 'Asset Transfer', status: 'Active' as const, started: '4/27/2026 6:45 AM', user: 'chris.lee', duration: '4h 46m', node: 'Compliance Check' },
    { id: 'PI-204883', name: 'Invoice Processing', status: 'Error' as const, started: '4/27/2026 6:30 AM', user: 'nina.patel', duration: '5h 1m', node: 'Validate Amount (TIMEOUT)' },
    { id: 'PI-204882', name: 'Customer Onboarding', status: 'Completed' as const, started: '4/26/2026 4:15 PM', user: 'john.smith', duration: '3h 20m', node: 'End' },
  ]
  const filteredProcs = processInstances.filter(p =>
    (procStatus === 'All' || p.status === procStatus) &&
    (!procSearch || p.name.toLowerCase().includes(procSearch.toLowerCase()) || p.id.toLowerCase().includes(procSearch.toLowerCase()) || p.user.toLowerCase().includes(procSearch.toLowerCase()))
  )
  const statusColor = (s: string) => s === 'Active' ? 'bg-blue-100 text-blue-800' : s === 'Completed' ? 'bg-green-100 text-green-800' : s === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
  return (
    <div className="space-y-4">
      {/* Non-designer access banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-green-600 flex items-center justify-center"><Layers size={14} className="text-white" /></div>
          <div>
            <div className="text-[11px] font-bold text-gray-800">Non-Designer Process Access</div>
            <div className="text-[9px] text-gray-500">Data via Web API → a!queryProcessAnalytics() · No Designer role required</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-[9px] bg-white text-gray-600 px-2 py-1 rounded border border-gray-200 font-mono">/suite/webapi/v4/process-instances</code>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-green-100 text-green-700"><CheckCircle size={9} />API Active</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by ID, name, or user..." value={procSearch} onChange={e => setProcSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <select value={procStatus} onChange={e => setProcStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option>All</option><option>Active</option><option>Completed</option><option>Error</option><option>Paused</option></select>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Download size={14} />Export</button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[{ label: 'Active', value: '142', color: 'text-blue-600' }, { label: 'Completed Today', value: '1,247', color: 'text-green-600' }, { label: 'Errors', value: '8', color: 'text-red-600' }, { label: 'Avg Duration', value: '24m', color: 'text-gray-900' }].map((s, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200"><tr>{['Instance ID','Process','Status','Current Node','Started By','Started','Duration'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProcs.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-blue-600">{p.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor(p.status)}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.node}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.user}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.started}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">Showing {filteredProcs.length} of {processInstances.length} instances</div>
      </div>
    </div>
  )
}

export default function AppianMonitor() {
  const [showWaffleMenu, setShowWaffleMenu] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('ops-ai')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [filterApp, setFilterApp] = useState('All')
  const [filterEnv, setFilterEnv] = useState('Production')
  const [filterTime, setFilterTime] = useState('Last 24 hours')
  const [defaultApp, setDefaultApp] = useState('All')
  const [defaultEnv, setDefaultEnv] = useState('Production')
  const [defaultTime, setDefaultTime] = useState('Last 24 hours')
  const [appSearch, setAppSearch] = useState('')
  const [appDropdownOpen, setAppDropdownOpen] = useState(false)
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)
  const [opsAiView, setOpsAiView] = useState<'insights' | 'chat' | 'rules'>('insights')
  const [homeEditing, setHomeEditing] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 })

  useEffect(() => {
    if (!navRef.current) return
    const activeBtn = navRef.current.querySelector(`[data-nav-id="${activeItem}"]`) as HTMLElement
    if (activeBtn) {
      setIndicatorStyle({ top: activeBtn.offsetTop, height: activeBtn.offsetHeight })
    }
  }, [activeItem, navCollapsed])
  const [waffleOption, setWaffleOption, waffleLocked] = useWaffleOption('option2')
  const [waffleTab, setWaffleTab] = useState<'favorites' | 'all'>('favorites')
  const [waffleSiteSearch, setWaffleSiteSearch] = useState('')

  const waffleApps = allWaffleApps.filter(app => !app.options || app.options.includes(waffleOption))
  const filteredNavItems = navItems
  const allSites = [
    'Admin Console', 'AI Command Center', 'Appian Designer', 'Operations Console',
    'Appian RPA', 'Cloud Database', 'Connected Systems', 'Data Fabric',
    'Decision Platform', 'DevOps Infrastructure', 'Feature Flags',
    'Health Check', 'Integration Console', 'Low-Code Designer',
    'Operations Console', 'Performance Monitor', 'Portal Manager',
    'Process Mining', 'Record Manager', 'Security Console',
    'System Logs', 'Task Manager', 'User Management',
  ].filter(s => waffleSiteSearch === '' || s.toLowerCase().includes(waffleSiteSearch.toLowerCase()))

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (showWaffleMenu && !(e.target as Element).closest('.waffle-menu')) setShowWaffleMenu(false)
      if (showFilterPanel && !(e.target as Element).closest('.filter-panel')) setShowFilterPanel(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showWaffleMenu, showFilterPanel])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-header-sail py-4 relative">
        <div className="app-header-overlay"></div>
        <div className="relative z-10 flex justify-between items-center" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 rounded-lg p-3 flex items-center justify-center"><Activity size={24} className="text-white" /></div>
            <HeadingField text="Operations Console" size="LARGE" headingTag="H1" marginBelow="NONE" fontWeight="BOLD" />
          </div>
          <div className="flex items-center gap-3">
            <VersionSwitcher />
            <button className="p-2 rounded-md hover:bg-white/20"><Search size={20} className="text-black" /></button>
            <button onClick={() => setShowWaffleMenu(!showWaffleMenu)} className="p-2 rounded-md hover:bg-white/20 waffle-menu"><Grid3X3 size={20} className={showWaffleMenu ? 'text-blue-500' : 'text-black'} /></button>
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">J</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" alt="Appian" className="h-6" />
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

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Collapsible Left Nav */}
        <div className={`${navCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          <nav ref={navRef} className={`flex flex-col ${navCollapsed ? 'p-2' : 'p-4'} space-y-1 flex-1 overflow-y-auto relative`}>
            <div className="absolute left-0 right-0 rounded-lg bg-blue-50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none" style={{ top: indicatorStyle.top, height: indicatorStyle.height, ...(navCollapsed ? { marginLeft: 8, marginRight: 8 } : { marginLeft: 0, marginRight: 0 }) }} />
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isOpsAi = item.id === 'ops-ai'
              return (
                <button
                  key={item.id}
                  data-nav-id={item.id}
                  onClick={() => setActiveItem(item.id)}
                  title={navCollapsed ? item.label : undefined}
                  className={`relative z-[1] flex items-center ${navCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-lg transition-colors text-left ${
                    activeItem === item.id ? (isOpsAi ? '' : 'text-blue-600') : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={20} className={isOpsAi ? 'text-blue-600' : undefined} />
                  {!navCollapsed && (
                    isOpsAi
                      ? <span className="font-medium bg-gradient-to-r from-[#2322F0] to-[#E21496] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">{item.label}</span>
                      : <span className="font-medium">{item.label}</span>
                  )}
                </button>
              )
            })}
          </nav>
          <button onClick={() => setNavCollapsed(!navCollapsed)} className="p-4 border-t border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center">
            {navCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Rules header for ops-ai */}
          {activeItem === 'ops-ai' && opsAiView === 'rules' && (
            <div className="bg-white border-b border-gray-200 px-8 flex-shrink-0 flex items-center" style={{ minHeight: '80px' }}>
              <div>
                <button onClick={() => setOpsAiView('insights')} className="text-xs text-blue-600 hover:text-blue-800 font-medium mb-1">← Back to Operations AI</button>
                <HeadingField text="Manage Alerts" size="LARGE" marginBelow="NONE" />
              </div>
            </div>
          )}
          {/* Normal header for all other views */}
          {!(activeItem === 'ops-ai' && opsAiView === 'rules') && activeItem !== 'ai' && activeItem !== 'rpa' && (() => {
          return (
          <div className="bg-white border-b border-gray-200 px-8 flex-shrink-0 flex items-center" style={{ minHeight: '80px' }}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <HeadingField text={filteredNavItems.find(n => n.id === activeItem)?.label || ''} size="LARGE" marginBelow="NONE" />
                {activeItem === 'ops-ai' && (
                  <>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{initialInsights.filter(i => i.severity === 'critical').length} critical</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{initialInsights.filter(i => i.isNew).length} new today</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {(filterApp !== defaultApp || filterEnv !== defaultEnv || filterTime !== defaultTime) && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {filterApp !== defaultApp && <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-blue-700">{filterApp}</span>}
                    {filterEnv !== defaultEnv && <span className="px-2 py-0.5 bg-green-50 border border-green-200 rounded text-green-700">{filterEnv}</span>}
                    {filterTime !== defaultTime && <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">{filterTime}</span>}
                  </div>
                )}
                <div className="relative filter-panel">
                  <button onClick={() => { setShowFilterPanel(!showFilterPanel); setAppSearch(''); setAppDropdownOpen(false) }} className={`p-1.5 border rounded-lg transition-colors ${showFilterPanel || filterApp !== defaultApp || filterEnv !== defaultEnv || filterTime !== defaultTime ? 'bg-blue-50 border-blue-300 text-blue-600' : 'text-gray-400 hover:text-gray-600 border-gray-200'}`}>
                    <SlidersHorizontal size={14} />
                  </button>
                  {showFilterPanel && (
                    <div ref={filterRef} className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Filters</span>
                        {(filterApp !== defaultApp || filterEnv !== defaultEnv || filterTime !== defaultTime) && (
                          <button onClick={() => { setFilterApp(defaultApp); setFilterEnv(defaultEnv); setFilterTime(defaultTime); setAppSearch('') }} className="text-xs text-blue-600 hover:text-blue-800">Reset all</button>
                        )}
                      </div>
                      <div className="px-4 py-3 space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Application</label>
                          <div className="relative">
                            <button onClick={() => setAppDropdownOpen(!appDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300">
                              <span className={filterApp === 'All' ? 'text-gray-500' : 'text-gray-900'}>{filterApp === 'All' ? 'All Applications' : filterApp}</span>
                              <ChevronDown size={14} className={`text-gray-400 transition-transform ${appDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {appDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input type="text" placeholder="Search..." value={appSearch} onChange={e => setAppSearch(e.target.value)} autoFocus className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                </div>
                                <div className="max-h-40 overflow-y-auto py-1">
                                  {['All','Customer Onboarding','Invoice Processing','HR Portal','Document Management','Finance','Vendor Onboarding','Claims Processing']
                                    .filter(a => !appSearch || a.toLowerCase().includes(appSearch.toLowerCase()))
                                    .sort((a, b) => a === defaultApp ? -1 : b === defaultApp ? 1 : 0)
                                    .map(app => (
                                    <div key={app} className={`group/item flex items-center px-3 py-1.5 transition-colors ${filterApp === app ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                                      <button onClick={() => { setFilterApp(app); setAppDropdownOpen(false); setAppSearch('') }} className="flex-1 text-left text-sm">{app === 'All' ? 'All Applications' : app}</button>
                                      {app === defaultApp && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-medium">Default</span>}
                                      {app !== defaultApp && <button onClick={(e) => { e.stopPropagation(); setDefaultApp(app); setFilterApp(app); setAppDropdownOpen(false); setAppSearch('') }} className="px-1.5 py-0.5 text-[9px] text-blue-600 hover:bg-blue-100 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Set as default</button>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Environment</label>
                          <div className="relative">
                            <button onClick={() => setEnvDropdownOpen(!envDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300">
                              <span className="text-gray-900">{filterEnv}</span>
                              <ChevronDown size={14} className={`text-gray-400 transition-transform ${envDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {envDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden py-1">
                                {['Production','Staging','Test','Development']
                                  .sort((a, b) => a === defaultEnv ? -1 : b === defaultEnv ? 1 : 0)
                                  .map(env => (
                                  <div key={env} className={`group/item flex items-center px-3 py-1.5 transition-colors ${filterEnv === env ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <button onClick={() => { setFilterEnv(env); setEnvDropdownOpen(false) }} className="flex-1 text-left text-sm">{env}</button>
                                    {env === defaultEnv && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-medium">Default</span>}
                                    {env !== defaultEnv && <button onClick={(e) => { e.stopPropagation(); setDefaultEnv(env); setFilterEnv(env); setEnvDropdownOpen(false) }} className="px-1.5 py-0.5 text-[9px] text-blue-600 hover:bg-blue-100 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Set as default</button>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Time Range</label>
                          <div className="relative">
                            <button onClick={() => setTimeDropdownOpen(!timeDropdownOpen)} className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300">
                              <span className="text-gray-900">{filterTime}</span>
                              <ChevronDown size={14} className={`text-gray-400 transition-transform ${timeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {timeDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden py-1">
                                {['Last 24 hours','Last 7 days','Last 30 days','Last 90 days']
                                  .sort((a, b) => a === defaultTime ? -1 : b === defaultTime ? 1 : 0)
                                  .map(time => (
                                  <div key={time} className={`group/item flex items-center px-3 py-1.5 transition-colors ${filterTime === time ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <button onClick={() => { setFilterTime(time); setTimeDropdownOpen(false) }} className="flex-1 text-left text-sm">{time}</button>
                                    {time === defaultTime && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-medium">Default</span>}
                                    {time !== defaultTime && <button onClick={(e) => { e.stopPropagation(); setDefaultTime(time); setFilterTime(time); setTimeDropdownOpen(false) }} className="px-1.5 py-0.5 text-[9px] text-blue-600 hover:bg-blue-100 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">Set as default</button>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {activeItem === 'ops-ai' && opsAiView === 'insights' && (
                  <div className="relative group">
                    <button onClick={() => setOpsAiView('rules')} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap">
                      Manage Alerts ({initialInsights.length > 0 ? '6' : '0'})
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                      These alerts are generated from platform telemetry, Health Check results, and log analysis. Manage rules to flag patterns specific to your applications.
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
                {activeItem === 'ops-ai' && opsAiView === 'insights' && (
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 whitespace-nowrap flex items-center gap-1.5" id="ops-ai-resolve-all">
                    <Zap size={12} />Send All to Composer
                  </button>
                )}
                {activeItem === 'home' && (
                  <button onClick={() => setHomeEditing(!homeEditing)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${homeEditing ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{homeEditing ? '✓ Done' : '⚙ Customize'}</button>
                )}
                <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg"><RefreshCw size={14} /></button>
              </div>
            </div>
          </div>
          )})()}
          {activeItem === 'ai' ? (
            <AIContent />
          ) : activeItem === 'rpa' ? (
            <RPAContent />
          ) : activeItem === 'ops-ai' ? (
            <InsightsChat view={opsAiView} setView={setOpsAiView} />
          ) : (
          <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 max-w-7xl">
            {activeItem === 'home' && <HomeContent editing={homeEditing} />}
            {activeItem === 'processes' && <ProcessActivity />}
            {activeItem === 'process-metrics' && <ProcessModelMetrics />}
            {activeItem === 'record-response' && <RecordResponseTimes />}
            {activeItem === 'record-sync' && <RecordSyncStatus />}
            {activeItem === 'query-perf' && <QueryPerformance />}
            {activeItem === 'portals' && <PortalMonitoring />}
            {activeItem === 'logs' && <LogSearchContent />}
          </div>
          </div>
          )}
        </div>
      </div>
      {waffleOption === 'option5' && <AppiaFab context="analyst" />}
    </div>
  )
}

export function MonitorPanel({ hideNav = false }: { hideNav?: boolean }) {
  const [activeItem, setActiveItem] = useState('health')
  return (
    <div className="flex h-full">
      {!hideNav && (
      <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
        <nav className="flex flex-col p-3 space-y-1">
          {navItems.filter(n => n.id !== 'ops-ai').map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setActiveItem(item.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${activeItem === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                <Icon size={18} /><span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeItem === 'ops-ai' ? (
          <InsightsChat view="insights" setView={() => {}} />
        ) : (
        <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {activeItem === 'ai' && <AIContent />}
          {activeItem === 'home' && <HomeContent editing={false} />}
          {activeItem === 'processes' && <ProcessActivity />}
          {activeItem === 'process-metrics' && <ProcessModelMetrics />}
          {activeItem === 'record-response' && <RecordResponseTimes />}
          {activeItem === 'record-sync' && <RecordSyncStatus />}
          {activeItem === 'query-perf' && <QueryPerformance />}
          {activeItem === 'portals' && <PortalMonitoring />}
          {activeItem === 'rpa' && <RPAContent />}
          {activeItem === 'logs' && <LogSearchContent />}
        </div>
        </div>
        )}
      </div>
    </div>
  )
}
