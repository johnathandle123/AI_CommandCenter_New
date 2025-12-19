import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function Observe() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Observe"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        
        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField text="AI System Monitoring" size="MEDIUM" marginBelow="STANDARD" />
          <p className="text-gray-700 mb-4">
            Monitor AI system behavior in real-time and gain insights into usage patterns and anomalies.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Real-time Monitoring</h3>
              <p className="text-gray-600">Track system health and performance</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Usage Analytics</h3>
              <p className="text-gray-600">Analyze user interactions and patterns</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Anomaly Detection</h3>
              <p className="text-gray-600">Identify unusual behavior and threats</p>
            </div>
          </div>
        </CardLayout>
      </div>
    </div>
  )
}
