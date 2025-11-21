import { TabsField, HeadingField, RichTextDisplayField } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function TabsInterface() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Tabs Interface"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        <TabsField
          orientation="VERTICAL"
          tabs={[
            {
              label: "Guardrails",
              value: "guardrails",
              icon: "shield-check",
              content: [
                <TabsField
                  key="guardrails-nested"
                  tabs={[
                    {
                      label: "Policies",
                      value: "policies",
                      content: [
                        <RichTextDisplayField 
                          key="policies"
                          value={["This is the policies content within guardrails."]} 
                        />
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
              icon: "activity",
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
              icon: "eye",
              content: [
                <RichTextDisplayField 
                  key="observability"
                  value={["This is the observability tab for system insights and analytics."]} 
                />
              ]
            }
          ]}
        />
      </div>
    </div>
  )
}
