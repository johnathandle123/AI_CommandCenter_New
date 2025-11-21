import { HeadingField, CardLayout } from '@pglevy/sailwind'
import { useState } from 'react'

export default function ThreeTabs() {
  const [active, setActive] = useState<number>(0)
  const tabs = ['Overview', 'Details', 'Settings']

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <HeadingField text="Three Tabs" size="LARGE" headingTag="H1" marginBelow="STANDARD" />

      <CardLayout padding="STANDARD" showShadow={true}>
        <div className="flex gap-2 mb-4">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`px-3 py-1 rounded-md font-medium focus:outline-none transition-colors ${
                i === active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-800">
          {active === 0 && (
            <div>
              <HeadingField text="Overview" size="MEDIUM" marginBelow="EVEN_LESS" />
              <p>This is the overview tab. Put summary information or a quick dashboard here.</p>
            </div>
          )}

          {active === 1 && (
            <div>
              <HeadingField text="Details" size="MEDIUM" marginBelow="EVEN_LESS" />
              <p>Detailed information and data can be shown on this tab.</p>
            </div>
          )}

          {active === 2 && (
            <div>
              <HeadingField text="Settings" size="MEDIUM" marginBelow="EVEN_LESS" />
              <p>Put configuration options or controls in this tab.</p>
            </div>
          )}
        </div>
      </CardLayout>
    </div>
  )
}
