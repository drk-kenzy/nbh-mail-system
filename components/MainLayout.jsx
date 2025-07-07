import { useState } from 'react';
import SidebarMenu from './SidebarMenu.jsx';
import BottomNav from './BottomNav.jsx';
import Header from './Header';
import Dashboard from './Dashboard.jsx';
import CourrierArrive from './CourrierArrive.jsx';
import CourrierDepart from './CourrierDepart.jsx';
import Partenaires from './Partenaires.jsx';
import Parametres from './Parametres.jsx';

export default function MainLayout({ children }) {
  const [currentView, setCurrentView] = useState('accueil');
  return (
    <div className={`min-h-screen flex bg-main text-main`}>
      <SidebarMenu currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col min-h-screen pl-[80px] md:pl-[120px] transition-all duration-300 pb-16">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto py-8 px-4">
          {currentView === 'accueil' && <Dashboard />}
          {currentView === 'arrive' && <CourrierArrive />}
          {currentView === 'depart' && <CourrierDepart />}
          {currentView === 'partenaires' && <Partenaires />}
          {currentView === 'parametres' && <Parametres />}
          {children}
        </main>
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </div>
  );
}
