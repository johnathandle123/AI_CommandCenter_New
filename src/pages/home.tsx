import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { useLocation } from 'wouter'

export default function Home() {
  const [, setLocation] = useLocation()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <HeadingField text="Hello User" size="LARGE" marginBelow="MORE" />

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <CardLayout padding="MORE" showShadow={true}>
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">Cost</div>
            <div className="text-3xl font-bold text-blue-700">$12,450</div>
          </div>
        </CardLayout>
        
        <CardLayout padding="MORE" showShadow={true}>
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">Guardrail Hits</div>
            <div className="text-3xl font-bold text-blue-700">247</div>
          </div>
        </CardLayout>
        
        <CardLayout padding="MORE" showShadow={true}>
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">Requirements</div>
            <div className="text-3xl font-bold text-blue-700">18</div>
          </div>
        </CardLayout>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-4">
        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/protect')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Protect" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Safeguard your AI systems with comprehensive security measures and guardrails to prevent unauthorized access and misuse.</p>
          </CardLayout>
        </div>

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/evaluate')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Evaluate" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Assess and measure AI model performance, accuracy, and compliance with established standards and requirements.</p>
          </CardLayout>
        </div>

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/observe')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Observe" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Monitor AI system behavior in real-time, track metrics, and gain insights into usage patterns and anomalies.</p>
          </CardLayout>
        </div>

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/topic-filtering')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Topic Filtering Configuration" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Configure topic filtering to ensure your AI stays within professional boundaries using keyword-based, semantic, or domain constraint approaches.</p>
          </CardLayout>
        </div>

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/appian-designer')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Appian Designer" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Access the Appian Designer Applications view to create, import, and manage applications in your environment.</p>
          </CardLayout>
        </div>

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation('/customer-portal-site')}
        >
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField text="Customer Portal Site" size="MEDIUM" marginBelow="LESS" />
            <p className="text-gray-700">Configure and manage your customer portal site with live chat integration and AI-powered customer service capabilities.</p>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
