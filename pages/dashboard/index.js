import Layout from '../../components/Layout';
import RoleGuard from '../../components/RoleGuard';
import { useAuth } from '../../components/AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <RoleGuard allowedRoles={['admin','employe','rh','manager']}>
      <Layout>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Bienvenue, <span className="font-semibold">{user?.email}</span> ({user?.role})</p>
        {/* Statistiques, navigation, etc. à venir */}
      </Layout>
    </RoleGuard>
  );
}
