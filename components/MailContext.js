import { createContext, useContext, useState, useEffect } from 'react';
import Loader from './Loader';

const MailContext = createContext();

export function MailProvider({ children }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les mails depuis localStorage (ou API plus tard)
    const data = typeof window !== 'undefined' ? localStorage.getItem('nbh_mails') : null;
    if (data) setMails(JSON.parse(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nbh_mails', JSON.stringify(mails));
    }
  }, [mails]);

  if (loading) return <Loader />;

  return (
    <MailContext.Provider value={{ mails, setMails }}>
      {children}
    </MailContext.Provider>
  );
}

export function useMails() {
  return useContext(MailContext);
}
