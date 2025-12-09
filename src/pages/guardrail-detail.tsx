import { HeadingField, ButtonWidget, CardLayout } from '@pglevy/sailwind'
import { ChevronLeft, Send, Pencil } from 'lucide-react'
import { useState } from 'react'

interface GuardrailDetailProps {
  guardrail: {
    name: string
    description: string
    type: string
    scope: string
    sensitivity: string
    action: string
  }
  onBack: () => void
  onSave: (data: any) => void
}

export default function GuardrailDetail({ guardrail, onBack, onSave }: GuardrailDetailProps) {
  const [name, setName] = useState(guardrail.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [description, setDescription] = useState(guardrail.description)
  const [output, setOutput] = useState(guardrail.action)
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'This is a test response showing how the guardrail would behave.' }])
    }, 500)
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4" style={{ flexShrink: 0 }}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Guardrails</span>
        </button>
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="text-2xl font-bold border-b-2 border-blue-500 outline-none"
              autoFocus
            />
          ) : (
            <>
              <h1 className="text-2xl font-bold">{name}</h1>
              <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-gray-100 rounded">
                <Pencil size={16} className="text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Split View */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left Pane - Edit */}
        <div className="w-1/2 border-r border-gray-200 p-8 overflow-y-auto bg-gray-50">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Input" size="MEDIUM" marginBelow="STANDARD" />
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
              />
            </div>
          </CardLayout>

          <div className="mt-4">
            <CardLayout padding="MORE" showShadow={true}>
              <HeadingField text="Output" size="MEDIUM" marginBelow="STANDARD" />
              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <select
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Block">Block</option>
                  <option value="Warn">Warn</option>
                  <option value="Allow">Allow</option>
                </select>
              </div>
              <div className="mt-4">
                <ButtonWidget 
                  label="Save Changes" 
                  style="SOLID" 
                  color="ACCENT"
                  onClick={() => onSave({ name, description, action: output })}
                />
              </div>
            </CardLayout>
          </div>
        </div>

        {/* Right Pane - Test */}
        <div className="w-1/2 bg-white" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="p-8 border-b border-gray-200 bg-white" style={{ flexShrink: 0 }}>
            <HeadingField text="Test Guardrail" size="MEDIUM" marginBelow="NONE" />
          </div>
          
          <div className="p-8 space-y-4 bg-white" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white" style={{ flexShrink: 0 }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message to test..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
