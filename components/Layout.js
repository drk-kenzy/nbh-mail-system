import MainNav from './MainNav';

/**
 * Layout principal avec MainNav vertical fixe à gauche et contenu responsive.
 */
export default function Layout({ children }) {
  return (
    <div className="h-screen flex bg-surface text-gray-100 dark">
      {/* MainNav vertical fixe à gauche */}
      <MainNav />
      <div className="flex-1 flex flex-col min-h-screen ml-56">
        {/* Contenu principal scrollable */}
        <div className="flex-1 overflow-y-auto p-4 transition duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
}
