import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Bar } from 'react-chartjs-2';
import Button from '../../components/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardStats() {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    setMails(JSON.parse(localStorage.getItem('nbh_mails') || '[]'));
  }, []);

  // Statistiques simples
  const total = mails.length;
  const archives = mails.filter(m => m.archived).length;
  const trash = mails.filter(m => m.trashed).length;
  const actifs = total - archives - trash;
  const byCategory = mails.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: 'Courriers par catégorie',
        data: Object.values(byCategory),
        backgroundColor: [
          '#60a5fa', // blue-400
          '#34d399', // green-400
          '#fbbf24', // yellow-400
          '#f87171', // red-400
          '#a78bfa', // purple-400
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Répartition des courriers par catégorie', color: '#fff' },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#374151' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#374151' } },
    },
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Statistiques des courriers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded text-center">
          <div className="text-4xl font-bold text-blue-400">{total}</div>
          <div className="mt-2 text-gray-300">Total courriers</div>
        </div>
        <div className="bg-gray-800 p-6 rounded text-center">
          <div className="text-4xl font-bold text-green-400">{actifs}</div>
          <div className="mt-2 text-gray-300">Actifs</div>
        </div>
        <div className="bg-gray-800 p-6 rounded text-center">
          <div className="text-4xl font-bold text-yellow-400">{archives}</div>
          <div className="mt-2 text-gray-300">Archivés</div>
        </div>
        <div className="bg-gray-800 p-6 rounded text-center">
          <div className="text-4xl font-bold text-red-400">{trash}</div>
          <div className="mt-2 text-gray-300">Corbeille</div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded mb-8">
        <h2 className="text-xl font-bold mb-4">Par catégorie</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="flex gap-2 mt-6">
        <Button variant="primary" onClick={() => window.location.href='/dashboard/mails'}>Voir les courriers</Button>
        <Button variant="secondary" onClick={() => window.location.href='/contacts'}>Voir les contacts</Button>
      </div>
    </Layout>
  );
}
