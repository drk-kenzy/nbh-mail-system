import { NAV } from './SidebarMenu.jsx';

export default function BottomNav({ currentView, setCurrentView }) {
  return (
    <nav className="fixed bottom-0 left-[100px] right-0 z-50 border-t border-main flex justify-around items-center py-2 shadow-2xl backdrop-blur-lg" style={{ backgroundColor: '#eaf5f0' }}>
      {NAV.map(nav => (
        <button
          key={nav.key}
          className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-300 text-xs font-semibold relative
            ${currentView === nav.key 
              ? 'text-primary bg-primary/10 border-2 border-primary/30 shadow-lg transform scale-105' 
              : 'text-gray-700 hover:text-primary hover:bg-primary/5 border-2 border-transparent'
            }
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
          onClick={() => setCurrentView(nav.key)}
          aria-current={currentView === nav.key ? 'page' : undefined}
        >
          <span className={`text-xl mb-0.5 transition-transform duration-200 ${currentView === nav.key ? 'scale-110' : ''}`}>
            {nav.icon}
          </span>
          <span className="relative">
            {nav.label}
            {currentView === nav.key && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </span>
        </button>
      ))}
    </nav>
  );
}