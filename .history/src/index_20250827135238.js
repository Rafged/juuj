import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

const apiKey = "ТВОЙ_API_KEY"; // вставь сюда свой ключ
const query = "Batman";

fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=1`)
  .then(response => response.json())
  .then(data => {
    console.log(data); // список фильмов
  })
  .catch(err => console.error("Ошибка при запросе к API:", err));
