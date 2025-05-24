import React, { useEffect, useState } from 'react'
import Search from './assets/components/Search'
import Spinner from './assets/components/Spinner';
import MovieCard from './assets/components/MovieCard';
import { useDebounce } from 'use-debounce';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
  }
}
const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null);
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm] = useDebounce(searchTerm, 1000);
  // const [debounceSearchTerm, setdebounceSearchTerm] = useState('');
// useDebounce(()=>setdebounceSearchTerm(searchTerm),500,[searchTerm]);

  const fetchMovies = async (query ='') => {
    try {
setIsLoading(true);
setErrorMessage('');
      const endPoint =query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :  `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error("failed to fetch movies");
      }
      const data = await response.json();
      console.log(data);
      if(data.Response === 'false'){
        setErrorMessage(data.error ||'Failde to fetch movies');
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results)
    } catch (error) {
      console.log(error);
      setErrorMessage('Error Fetching Movies: Try again later');
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm)
  }, [debounceSearchTerm])
  return (
    <main>
      <div className="patteren" />
      <div className='wrapper'>
        <header>
          <img src='/hero.png' alt='Hero Photo' />
          <h1>Find <span className='text-gradient'>Movies</span>You'll Enjoy Without Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (
           <Spinner />
          ) : errorMessage ? (
<p className='text-red-500'>{errorMessage}</p>
          ):
           moviesList.length === 0 && searchTerm.trim() !== '' ? (
  <p className='text-gray-500'>No results found for "<strong>{searchTerm}</strong>"</p>
):
          (
            <ul>
{
  moviesList.map((movie)=>{
    return <MovieCard key={movie.id} movie={movie}/>
  })
}
            </ul>
          )}
         
        </section>
      </div>
    </main>
  )
}

export default App
