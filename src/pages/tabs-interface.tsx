import { TabsField, HeadingField, RichTextDisplayField, CardLayout, ButtonWidget, DialogField, TextField, DropdownField, TagField, SliderField, Icon, StampField } from '@pglevy/sailwind'
import { Link } from 'wouter'
import { useState } from 'react'

const tabStyles = `
  .fixed-height-tabs [data-orientation="vertical"] [role="tablist"] [role="tab"] {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
  }
`

export default function TabsInterface() {
  const [showModal, setShowModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    scope: '',
    sensitivity: 2,
    action: '',
    notification: ''
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

  const getSensitivityStamp = (sensitivity: string) => {
    const config = {
      'Low': { backgroundColor: 'green-50', color: 'green-500' },
      'Medium': { backgroundColor: 'yellow-50', color: 'yellow-500' },
      'High': { backgroundColor: 'orange-50', color: 'orange-500' },
      'Critical': { backgroundColor: 'red-50', color: 'red-500' }
    }
    return config[sensitivity as keyof typeof config] || { backgroundColor: 'gray-50', color: 'gray-500' }
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
    const typeConfig = {
      'Harmful Content': { icon: 'AlertTriangle', backgroundColor: 'red-50', iconColor: 'red-500' },
      'Profanity': { icon: 'MessageSquareX', backgroundColor: 'red-50', iconColor: 'red-500' },
      'PII Exposure & Confidentiality': { icon: 'Shield', backgroundColor: 'blue-50', iconColor: 'blue-500' },
      'Tone': { icon: 'MessageCircle', backgroundColor: 'gray-50', iconColor: 'gray-500' },
      'Logic': { icon: 'Brain', backgroundColor: 'blue-50', iconColor: 'blue-500' },
      'Performance': { icon: 'Zap', backgroundColor: 'green-50', iconColor: 'green-500' },
      'Data Protection': { icon: 'Shield', backgroundColor: 'blue-50', iconColor: 'blue-500' },
      'Access Control': { icon: 'Lock', backgroundColor: 'gray-50', iconColor: 'gray-500' },
      'Compliance': { icon: 'CheckCircle', backgroundColor: 'green-50', iconColor: 'green-500' }
    }
    return typeConfig[type as keyof typeof typeConfig] || { icon: 'Shield', backgroundColor: 'gray-50', iconColor: 'gray-500' }
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

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      <style>{tabStyles}</style>
      <div className="px-8 py-8 w-full">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Tabs Interface"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        <div className="fixed-height-tabs w-full">
          <TabsField
            orientation="VERTICAL"
            tabs={[
            {
              label: "Protect",
              value: "protect",
              content: [
                <TabsField
                  key="guardrails-nested"
                  tabs={[
                    {
                      label: "Guardrails",
                      value: "guardrails",
                      content: [
                        <div key="policies-content" className="space-y-4">
                          <div className="flex justify-between items-center mb-6">
                            <HeadingField text="Guardrails" size="LARGE" marginBelow="NONE" />
                            <ButtonWidget 
                              label="Add Guardrails" 
                              style="SOLID" 
                              color="ACCENT"
                              onClick={() => setShowModal(true)}
                            />
                          </div>
                          <div className="space-y-4">
                            {guardrails.map((guardrail, index) => {
                              const typeStamp = getTypeStamp(guardrail.type)
                              const sensitivityStamp = getSensitivityStamp(guardrail.sensitivity)
                              return (
                                <CardLayout key={index} padding="STANDARD" showShadow={true}>
                                  <div className="relative">
                                    <div className="absolute top-0 right-0 flex items-center gap-2">
                                      <div className={`text-${sensitivityStamp.color}`} title={`Sensitivity: ${guardrail.sensitivity}`}>
                                        <StampField 
                                          text={guardrail.sensitivity}
                                          backgroundColor={sensitivityStamp.backgroundColor}
                                          size="SMALL"
                                        />
                                      </div>
                                      <div className="relative">
                                        <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => {
                                          e.stopPropagation()
                                          const menu = e.currentTarget.nextElementSibling as HTMLElement
                                          menu.classList.toggle('hidden')
                                        }}>
                                          <Icon icon="MoreVertical" size="SMALL" />
                                        </button>
                                        <div className="hidden absolute right-0 top-8 bg-white border rounded shadow-lg z-10 min-w-24">
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
                              )
                            })}
                          </div>
                        </div>
                      ]
                    },
                    {
                      label: "Rules",
                      value: "rules",
                      content: [
                        <RichTextDisplayField 
                          key="rules"
                          value={["This is the rules content within guardrails."]} 
                        />
                      ]
                    }
                  ]}
                />
              ]
            },
            {
              label: "Monitoring",
              value: "monitoring",
              content: [
                <RichTextDisplayField 
                  key="monitoring"
                  value={["This is the monitoring tab with system monitoring information."]} 
                />
              ]
            },
            {
              label: "Observability",
              value: "observability",
              content: [
                <RichTextDisplayField 
                  key="observability"
                  value={["This is the observability tab for system insights and analytics."]} 
                />
              ]
            },
            {
              label: "Analytics",
              value: "analytics",
              content: [
                <div key="analytics-content" className="space-y-4">
                  <CardLayout padding="STANDARD" showShadow={true}>
                    <HeadingField text="Performance Metrics" size="MEDIUM" marginBelow="LESS" />
                    <RichTextDisplayField value={["Real-time performance data and system health indicators."]} />
                  </CardLayout>
                  <CardLayout padding="STANDARD" showShadow={true}>
                    <HeadingField text="Usage Statistics" size="MEDIUM" marginBelow="LESS" />
                    <RichTextDisplayField value={["User activity patterns and resource utilization trends."]} />
                  </CardLayout>
                </div>
              ]
            }
          ]}
        />
        </div>
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
