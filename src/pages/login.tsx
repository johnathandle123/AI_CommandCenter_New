import { HeadingField, CardLayout, TextField, ButtonWidget } from '@pglevy/sailwind'
import { useState } from 'react'
import { useLocation } from 'wouter'

export default function Login() {
  const [, setLocation] = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)

  const handleLogin = () => {
    if (username && password) {
      setLocation('/')
    } else {
      setShowError(true)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <HeadingField 
            text="AI Command Center" 
            size="LARGE" 
            headingTag="H1"
            marginBelow="STANDARD"
          />
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        <CardLayout padding="MORE" showShadow={true}>
          {showError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Please enter both username and password
            </div>
          )}

          <TextField
            label="Username"
            value={username}
            placeholder="Enter your username"
            required={true}
            marginBelow="STANDARD"
            onChange={setUsername}
          />

          <TextField
            label="Password"
            value={password}
            placeholder="Enter your password"
            required={true}
            marginBelow="MORE"
            onChange={setPassword}
          />

          <div className="mb-4">
            <ButtonWidget
              label="Sign In"
              style="SOLID"
              color="ACCENT"
              size="STANDARD"
              onClick={handleLogin}
            />
          </div>

          <div className="text-center">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Forgot your password?
            </a>
          </div>
        </CardLayout>

        <div className="text-center mt-6 text-xs text-gray-500">
          ©2025 AI Command Center
        </div>
      </div>
    </div>
  )
}
