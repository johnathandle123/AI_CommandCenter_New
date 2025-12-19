import { useEffect } from 'react'
import { useLocation } from 'wouter'

export default function Loading() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('/dashboard')
    }, 2000) // 2 second loading time

    return () => clearTimeout(timer)
  }, [setLocation])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/9/93/Appian_Logo.svg" 
          alt="Appian" 
          className="h-12 mx-auto mb-8"
        />
        
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        
        <p className="text-gray-600 text-lg">This will take a few seconds...</p>
      </div>
    </div>
  )
}
