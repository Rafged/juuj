import React from 'react';
import MovieSearch from './components/MovieSearch';

function App() {
  return (
    <div style={{maxWidth: 900, margin: '32px auto', padding: 16, fontFamily: 'Arial, sans-serif'}}>
      <h1>Movie Search (CRA)</h1>
      <MovieSearch />
    </div>
  );
}

export default App;
