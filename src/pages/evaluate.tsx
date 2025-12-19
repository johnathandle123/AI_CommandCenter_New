import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function Evaluate() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Evaluate"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        
        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField text="AI Model Assessment" size="MEDIUM" marginBelow="STANDARD" />
          <p className="text-gray-700 mb-4">
            Assess and measure AI model performance, accuracy, and compliance with established standards.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
              <p className="text-gray-600">Track accuracy, latency, and throughput</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Bias Detection</h3>
              <p className="text-gray-600">Identify and measure model bias</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Compliance Testing</h3>
              <p className="text-gray-600">Ensure adherence to regulations</p>
            </div>
          </div>
        </CardLayout>
      </div>
    </div>
  )
}
