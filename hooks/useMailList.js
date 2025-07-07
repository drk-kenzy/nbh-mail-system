import { useState, useEffect } from "react";

const STORAGE_KEY = "nbh-mails";

export function useMailList(type = "arrive") {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setMails(parsed[type] || []);
    }
  }, [type]);

  const addMail = (mail) => {
    setMails((prev) => {
      const updated = [...prev, mail];
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { arrive: [], depart: [] };
      all[type] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return updated;
    });
  };

  const removeMail = (id) => {
    setMails((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { arrive: [], depart: [] };
      all[type] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return updated;
    });
  };

  return { mails, addMail, removeMail };
}
