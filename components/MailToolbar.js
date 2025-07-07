export default function MailToolbar({ onSearch, onFilter, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
      <button
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        onClick={onAdd}
      >
        Nouveau courrier
      </button>
      <input
        type="text"
        placeholder="Recherche…"
        className="bg-muted px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        onChange={e => onSearch(e.target.value)}
      />
      <select
        className="bg-muted px-3 py-2 rounded border border-gray-700 focus:outline-none"
        onChange={e => onFilter(e.target.value)}
      >
        <option value="">Tous</option>
        <option value="planifié">Planifiés</option>
        <option value="archivé">Archivés</option>
        <option value="corbeille">Corbeille</option>
      </select>
    </div>
  );
}
