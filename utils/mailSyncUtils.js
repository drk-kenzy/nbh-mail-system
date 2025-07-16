
// Utilitaires pour la synchronisation des courriers entre les différentes pages
export const triggerGlobalMailSync = (type = null, action = 'update') => {
  // Déclencher plusieurs événements pour assurer la synchronisation
  const events = [
    new CustomEvent('courriersUpdated', { detail: { type, action } }),
    new CustomEvent('storage', { detail: { key: 'courriers' } }),
    new CustomEvent('courriersGlobalRefresh', { detail: { type, action } })
  ];

  events.forEach(event => {
    window.dispatchEvent(event);
  });

  // Déclencher aussi après un court délai
  setTimeout(() => {
    events.forEach(event => {
      window.dispatchEvent(event);
    });
  }, 100);
};

export const syncMailsAcrossPages = () => {
  triggerGlobalMailSync();
};

// Fonction pour vérifier et synchroniser les données au chargement de page
export const ensureMailSync = () => {
  // Vérifier si il y a des données dans localStorage
  const courriers = JSON.parse(localStorage.getItem('courriers') || '[]');
  if (courriers.length > 0) {
    console.log('Synchronisation forcée des courriers:', courriers.length);
    triggerGlobalMailSync();
  }
};
