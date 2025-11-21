import { TabsField, HeadingField, RichTextDisplayField, CardLayout } from '@pglevy/sailwind'
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
                        <div key="policies-cards" className="space-y-4">
                          <CardLayout padding="STANDARD" showShadow={true}>
                            <HeadingField text="Data Privacy Policy" size="MEDIUM" marginBelow="LESS" />
                            <RichTextDisplayField value={["Ensures all data handling complies with privacy regulations and company standards."]} />
                          </CardLayout>
                          <CardLayout padding="STANDARD" showShadow={true}>
                            <HeadingField text="Access Control Policy" size="MEDIUM" marginBelow="LESS" />
                            <RichTextDisplayField value={["Defines user permissions and access levels for system resources."]} />
                          </CardLayout>
                          <CardLayout padding="STANDARD" showShadow={true}>
                            <HeadingField text="Security Compliance Policy" size="MEDIUM" marginBelow="LESS" />
                            <RichTextDisplayField value={["Maintains security standards and compliance requirements across all operations."]} />
                          </CardLayout>
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
