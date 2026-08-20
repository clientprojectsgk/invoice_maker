import { useState } from 'react';

export default function Tabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);

  return (
    <div>
      <div className="flex border-b border-gray-200 overflow-x-auto -mx-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              active === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}
