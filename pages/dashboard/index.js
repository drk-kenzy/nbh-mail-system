import Layout from '../../components/Layout';
import RoleGuard from '../../components/RoleGuard';
import { useAuth } from '../../components/AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <RoleGuard allowedRoles={['admin','employe','rh','manager']}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Bienvenue</h2>
              <p className="text-gray-600">
                Bonjour <span className="font-semibold text-blue-600">{user?.email}</span> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {user?.role}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Navigation</h3>
                <p className="text-gray-600 text-sm">
                  Utilisez le menu de navigation pour accéder aux différentes sections :
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Courrier Arrivé</li>
                  <li>• Courrier Départ</li>
                  <li>• Paramètres</li>
                </ul>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Accès rapide</h3>
                <p className="text-gray-600 text-sm">
                  Fonctionnalités principales disponibles selon votre rôle.
                </p>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Informations</h3>
                <p className="text-gray-600 text-sm">
                  Système de gestion de courriers - Version 1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
}
