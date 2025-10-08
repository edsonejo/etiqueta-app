import { useState, useEffect } from 'react';

/**
 * Hook customizado para persistir o estado no localStorage.
 * @param {string} key - A chave a ser usada no localStorage.
 * @param {any} initialValue - O valor inicial (se não houver nada no storage).
 * @returns {[any, Function]} - O valor atual e a função de atualização.
 */
function useLocalStorage(key, initialValue) {
  // Use uma função para obter o estado inicial do localStorage
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Analisa o JSON do item armazenado ou retorna o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se houver erro (ex: storage cheio), usa o valor inicial
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect para salvar o estado no localStorage sempre que 'value' mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;