import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook pour synchroniser un state React avec localStorage
 * @param key - Clé localStorage (ex: "auth_token", "theme", "cart")
 * @param initialValue - Valeur par défaut si rien n'est stocké
 * @returns [valeur, setValeur] - Comme useState(), mais persisté !
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Lire depuis localStorage
      const item = window.localStorage.getItem(key);
      
      // Parser le JSON si la clé existe, sinon retourner initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // En cas d'erreur (JSON invalide), retourner initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      // Mettre à jour le state React
      setStoredValue(value);
      
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      
      console.log(`Saved to localStorage ["${key}"]`, value);
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Vérifier si c'est notre clé qui a changé
      if (e.key !== key) return;

      if (e.newValue === null) {
        // La clé a été supprimée depuis un autre onglet = revenir à la valeur initiale
        setStoredValue(initialValue);
      } else {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`⚠️ Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    // Écouter l'événement "storage"
    window.addEventListener('storage', handleStorageChange);

    // retirer l'event listener quand le composant est démonté
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  // `initialValue` est utilisé dans le handler ci‑dessus, donc on l'ajoute au tableau
  // des dépendances pour satisfaire le linter react-hooks/exhaustive-deps.
  }, [key, initialValue]);

  // Retourner [valeur, setValeur] exactement comme useState()
  return [storedValue, setValue];
}

export default useLocalStorage;
