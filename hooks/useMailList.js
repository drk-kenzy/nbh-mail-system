import { useState, useEffect } from "react";

export function useMailList(type = "arrive") {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMails = async () => {
    try {
      setLoading(true);
      const endpoint = type === "arrive" ? "/api/courrier-arrive" : "/api/courrier-depart";
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setMails(data);
      } else {
        console.error("Erreur lors du chargement des courriers");
        setMails([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des courriers:", error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [type]);

  const addMail = async (mail) => {
    try {
      const endpoint = type === "arrive" ? "/api/courrier-arrive" : "/api/courrier-depart";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...mail, type }),
      });

      if (response.ok) {
        const newMail = await response.json();
        setMails((prev) => [newMail, ...prev]);
        return newMail;
      } else {
        throw new Error("Erreur lors de l'ajout du courrier");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      throw error;
    }
  };

  const removeMail = async (id) => {
    try {
      const endpoint = type === "arrive" ? "/api/courrier-arrive" : "/api/courrier-depart";
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMails((prev) => prev.filter((m) => m.id !== id));
      } else {
        throw new Error("Erreur lors de la suppression du courrier");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  };

  return { mails, addMail, removeMail, loading, refreshMails: fetchMails };
}
