import { NAV } from './SidebarMenu.jsx';

export default function BottomNav({ currentView, setCurrentView }) {
  return (
    <nav className="fixed bottom-0 left-[100px] right-0 z-50 border-t border-main flex justify-around items-center py-3 shadow-2xl backdrop-blur-lg" style={{ backgroundColor: '#eaf5f0' }}>
      {NAV.map(nav => (
        <button
          key={nav.key}
          className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-500 ease-out text-xs font-semibold relative overflow-hidden group
            ${currentView === nav.key 
              ? 'text-white bg-gradient-to-br from-primary to-primary/80 shadow-xl transform scale-110 border border-primary/20' 
              : 'text-gray-700 hover:text-primary hover:bg-white/60 border border-transparent hover:border-primary/20 hover:shadow-lg'
            }
            focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-95`}
          onClick={() => setCurrentView(nav.key)}
          aria-current={currentView === nav.key ? 'page' : undefined}
        >
          {/* Effet de fond animé pour l'état actif */}
          {currentView === nav.key && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 animate-pulse rounded-2xl"></div>
          )}
          
          {/* Effet de survol pour les éléments non actifs */}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentView === nav.key ? 'hidden' : ''}`}></div>
          
          {/* Icône avec effets */}
          <span className={`text-2xl mb-1 transition-all duration-300 relative z-10 ${
            currentView === nav.key 
              ? 'scale-125 drop-shadow-lg filter brightness-110' 
              : 'group-hover:scale-110 group-hover:drop-shadow-md'
          }`}>
            {nav.icon}
          </span>
          
          {/* Label avec effets */}
          <span className={`relative z-10 transition-all duration-300 ${
            currentView === nav.key 
              ? 'font-bold tracking-wide' 
              : 'group-hover:font-semibold'
          }`}>
            {nav.label}
            
            {/* Indicateur de sélection sous le texte */}
            {currentView === nav.key && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-bounce"></div>
                <div className="w-6 h-0.5 bg-white/60 rounded-full mt-0.5 animate-pulse"></div>
              </div>
            )}
            
            {/* Indicateur de survol pour les éléments non actifs */}
            {currentView !== nav.key && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
            )}
          </span>
          
          {/* Effet de brillance pour l'élément actif */}
          {currentView === nav.key && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out rounded-2xl"></div>
          )}
        </button>
      ))}
    </nav>
  );
}