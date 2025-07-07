import { NAV } from './SidebarMenu.jsx';

export default function BottomNav({ currentView, setCurrentView }) {
  return (
    <nav className="fixed bottom-0 left-[100px] right-0 z-50 bg-surface/95 border-t border-main flex justify-around items-center py-2 shadow-2xl backdrop-blur-lg"></nav>
      {NAV.map(nav => (
        <button
          key={nav.key}
          className={`flex flex-col items-center px-2 py-1 rounded-xl transition-all duration-200 text-xs font-semibold
            ${currentView === nav.key ? 'text-primary' : 'text-gray-300 hover:text-primary'}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
          onClick={() => setCurrentView(nav.key)}
          aria-current={currentView === nav.key ? 'page' : undefined}
        >
          <span className="text-xl mb-0.5">{nav.icon}</span>
          <span>{nav.label}</span>
        </button>
      ))}
    </nav>
  );
}
