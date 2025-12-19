import { TextField, ButtonWidget } from '@pglevy/sailwind'
import { useState } from 'react'
import { useLocation } from 'wouter'

export default function Login() {
  const [, setLocation] = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    setLocation('/loading')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" 
          alt="Appian" 
          className="h-8"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <TextField
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder=""
                  required={true}
                />

                <TextField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder=""
                  required={true}
                />
              </div>

              <ButtonWidget
                label="Sign In"
                style="SOLID"
                color="ACCENT"
                size="STANDARD"
                onClick={handleSignIn}
              />

              <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="mb-2">
              <a href="https://www.w3.org/TR/WCAG22/" className="text-blue-600 hover:underline">
                Web Content Accessibility Guidelines (WCAG) 2.2
              </a>
            </div>
            <div>©2003-2025 Appian Corporation</div>
          </div>
        </div>
      </div>
    </div>
  )
}
