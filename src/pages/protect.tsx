import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function Protect() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Home</Link>
        
        <HeadingField
          text="Protect"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        
        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField text="AI Security & Guardrails" size="MEDIUM" marginBelow="STANDARD" />
          <p className="text-gray-700 mb-4">
            Implement comprehensive security measures to protect your AI systems from threats and ensure safe operation.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Access Controls</h3>
              <p className="text-gray-600">Manage user permissions and authentication</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Content Filtering</h3>
              <p className="text-gray-600">Block harmful or inappropriate content</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Rate Limiting</h3>
              <p className="text-gray-600">Control usage and prevent abuse</p>
            </div>
          </div>
        </CardLayout>
      </div>
    </div>
  )
}
