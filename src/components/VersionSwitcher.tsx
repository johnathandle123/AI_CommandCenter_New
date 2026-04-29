import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export interface Version {
  id: string
  label: string
  date: string
}

const VERSIONS: Version[] = [
  { id: 'v5-4-29-2026', label: 'V5', date: '4/29/2026' },
  { id: 'v4-4-27-2026', label: 'V4', date: '4/27/2026' },
  { id: 'v3-4-23-2026', label: 'V3', date: '4/23/2026' },
  { id: 'v2-4-13-2026', label: 'V2', date: '4/13/2026' },
  { id: 'v1-4-9-2026', label: 'V1', date: '4/9/2026' },
]

const STORAGE_KEY = 'app-version'

export function useAppVersion() {
  const [version, setVersion] = useState(() => localStorage.getItem(STORAGE_KEY) || VERSIONS[0].id)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, version) }, [version])
  return [version, setVersion, VERSIONS] as const
}

export default function VersionSwitcher() {
  const [version, setVersion] = useAppVersion()
  const [open, setOpen] = useState(false)
  const current = VERSIONS.find(v => v.id === version) || VERSIONS[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && !(e.target as Element).closest('.version-switcher')) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative version-switcher">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-white/20 transition-colors flex items-center gap-1.5"
        title={`${current.label} - ${current.date}`}
      >
        <Clock size={20} className={open ? 'text-blue-500' : 'text-black'} />
        <span className="text-xs font-medium text-black">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] w-52 py-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Versions</div>
          {VERSIONS.map(v => (
            <button
              key={v.id}
              onClick={() => { setVersion(v.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm flex justify-between items-center transition-colors ${v.id === version ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{v.label}</span>
              <span className="text-xs text-gray-400">{v.date}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
