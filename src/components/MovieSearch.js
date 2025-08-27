import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { TMDB_API_KEY } from "../config";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (searchQuery, currentPage) => {
    if (!searchQuery) {
      setMovies([]);
      setTotalPages(1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: TMDB_API_KEY,
          query: searchQuery,
          page: currentPage,
        },
      });
      setMovies(resp.data.results || []);
      setTotalPages(resp.data.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError("Ошибка при запросе к API");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q, p) => {
      fetchMovies(q, p);
    }, 500),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedFetch(query, page);
    } else {
      setMovies([]);
      setTotalPages(1);
    }
    return () => debouncedFetch.cancel();
  }, [query, page, debouncedFetch]);

  const handleInput = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div>
      <input
        placeholder="Поиск фильмов..."
        value={query}
        onChange={handleInput}
        style={{width: '100%', padding: '8px 12px', boxSizing: 'border-box', marginBottom: 12}}
      />
      {loading && <div>Загрузка...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}

      <ul style={{listStyle: 'none', padding: 0}}>
        {movies.map(m => (
          <li key={m.id} style={{padding: 10, borderRadius: 6, background: '#fff', marginBottom: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)'}}>
            <strong>{m.title}</strong> {m.release_date ? `(${m.release_date.slice(0,4)})` : ''}
            <div style={{fontSize: 13, color: '#555'}}>{m.overview}</div>
          </li>
        ))}
      </ul>

      <div style={{display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 12}}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>⬅ Предыдущая</button>
        <span>Страница {page} из {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Следующая ➡</button>
      </div>
    </div>
  );
}
