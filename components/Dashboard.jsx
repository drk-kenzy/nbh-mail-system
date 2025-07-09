import { useMemo } from 'react';
import { useMailList } from '../hooks/useMailList';
import { useRouter } from 'next/router';
import { FiArrowDownCircle, FiArrowUpCircle, FiArchive, FiEdit2, FiClock, FiUsers, FiZap, FiInbox, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-card min-w-[160px] cursor-pointer hover:scale-105 hover:shadow-card-hover transition-all duration-200 group`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <Icon className={`w-8 h-8 ${color} group-hover:scale-110 transition`} />
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-gray-600 text-sm font-semibold">{label}</div>
      </div>
    </div>
  );
}

function ActivityItem({ mail }) {
  const typeIcon = mail.type === 'ARRIVE' ? <FiArrowDownCircle className="text-primary" /> : mail.type === 'DEPART' ? <FiArrowUpCircle className="text-green-500" /> : <FiEdit2 className="text-amber-500" />;
  const statutColor = mail.statut === 'Urgent' ? 'text-red-500' : mail.statut === 'Brouillon' ? 'text-amber-500' : 'text-green-500';
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-card">
      {typeIcon}
      <div className="flex-1">
        <div className="font-bold text-gray-900 text-sm">{mail.objet}</div>
        <div className="text-xs text-gray-600">{mail.type === 'ARRIVE' ? `De: ${mail.expediteur}` : `À: ${mail.destinataire}`}</div>
      </div>
      <div className={`text-xs font-bold ${statutColor}`}>{mail.statut}</div>
      <div className="text-xs text-gray-500 ml-2">{mail.date}</div>
    </div>
  );
}

export default function Dashboard() {
  const { mails: arrives } = useMailList('arrive');
  const { mails: departs } = useMailList('depart');
  const router = useRouter();

  // Fusion activité récente (4 derniers, tous types)
  const recent = useMemo(() => {
    const all = [...arrives, ...departs];
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  }, [arrives, departs]);

  // Statistiques
  const archives = arrives.filter(m => m.statut === 'Archivé').length + departs.filter(m => m.statut === 'Archivé').length;
  const brouillons = arrives.filter(m => m.statut === 'Brouillon').length + departs.filter(m => m.statut === 'Brouillon').length;
  const urgents = arrives.filter(m => m.statut === 'Urgent').length + departs.filter(m => m.statut === 'Urgent').length;
  // Partenaires actifs (mock: distinct destinataires/expéditeurs)
  const partenaires = useMemo(() => {
    const ps = new Set([...arrives.map(m => m.expediteur), ...departs.map(m => m.destinataire)]);
    ps.delete(undefined); ps.delete('');
    return ps.size;
  }, [arrives, departs]);
  // Temps moyen de traitement (mock: diff date/archivé)
  const traitement = useMemo(() => {
    const traités = [...arrives, ...departs].filter(m => m.statut === 'Archivé' && m.date && m.date_archivage);
    if (!traités.length) return '-';
    const moy = traités.reduce((acc, m) => acc + (new Date(m.date_archivage) - new Date(m.date)), 0) / traités.length;
    return `${Math.round(moy / (1000*60*60*24))} j`;
  }, [arrives, departs]);
  // Taux de traitement
  const taux = useMemo(() => {
    const total = arrives.length + departs.length;
    const traités = arrives.filter(m => m.statut === 'Archivé').length + departs.filter(m => m.statut === 'Archivé').length;
    return total ? `${Math.round((traités/total)*100)}%` : '-';
  }, [arrives, departs]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight">🏠 Tableau de bord</h1>
      {/* Statistiques en temps réel */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon={FiArrowDownCircle} label="Courriers Arrivés" value={arrives.length} color="text-primary" onClick={() => router.push('/dashboard/arrives')} />
        <StatCard icon={FiArrowUpCircle} label="Courriers Départs" value={departs.length} color="text-green-400" onClick={() => router.push('/dashboard/departs')} />
        <StatCard icon={FiEdit2} label="Brouillons" value={brouillons} color="text-yellow-400" onClick={() => router.push('/dashboard/brouillons')} />
        <StatCard icon={FiArchive} label="Archives" value={archives} color="text-indigo-400" onClick={() => router.push('/dashboard/archives')} />
      </div>
      {/* Activité récente */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-card p-6 mb-8">
        <div className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><FiInbox className="text-primary" /> Activité récente</div>
        {recent.length === 0 ? (
          <div className="text-gray-500">Aucune activité récente.</div>
        ) : (
          recent.map(mail => <ActivityItem key={mail.id} mail={mail} />)
        )}
      </div>
      {/* Tâches en attente */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-card p-6 mb-8">
        <div className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><FiAlertCircle className="text-red-500" /> Tâches en attente</div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-700"><FiZap className="text-amber-500" /> <span className="font-semibold">Courriers urgents :</span> {urgents}</li>
          <li className="flex items-center gap-2 text-sm text-gray-700"><FiEdit2 className="text-amber-500" /> <span className="font-semibold">Validation brouillons :</span> {brouillons}</li>
          <li className="flex items-center gap-2 text-sm text-gray-700"><FiArchive className="text-blue-500" /> <span className="font-semibold">Archivage automatique :</span> {archives}</li>
        </ul>
      </div>
      {/* Statistiques rapides */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-card p-6">
        <div className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><FiCheckCircle className="text-green-500" /> Statistiques rapides</div>
        <ul className="flex flex-wrap gap-8 text-sm">
          <li className="flex items-center gap-2 text-gray-700"><FiUsers className="text-primary" /> <span className="font-semibold">Partenaires actifs :</span> {partenaires}</li>
          <li className="flex items-center gap-2 text-gray-700"><FiClock className="text-blue-500" /> <span className="font-semibold">Temps moyen de traitement :</span> {traitement}</li>
          <li className="flex items-center gap-2 text-gray-700"><FiCheckCircle className="text-green-500" /> <span className="font-semibold">Taux de traitement :</span> {taux}</li>
        </ul>
      </div>
    </div>
  );
}
