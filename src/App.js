import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function usePokemonList() {
  return useQuery('pokemon', async () => {
    const { data } = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=50'
    );
    return data.results;
  });
}

function PokemonList({ setPokemon }) {
  const { isLoading, data } = usePokemonList();

  return (
    <div>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <ul>
          {data.map((pokemon) => (
            <li>
              <a onClick={() => setPokemon(pokemon.name)} href='#'>
                {pokemon.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function usePokemon(name) {
  return useQuery(['pokemon', name], async () => {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    return data;
  });
}

function Pokemon({ pokemon, setPokemon }) {
  const { isLoading, data } = usePokemon(pokemon);
  return (
    <div>
      <a href='#' onClick={() => setPokemon(null)}>
        Back to the list
      </a>
      {isLoading ? (
        <p>loading....</p>
      ) : (
        <div>
          <h1>{pokemon}</h1>
          <img src={data.sprites.front_default} alt={pokemon} />
        </div>
      )}
    </div>
  );
}

function App() {
  const [pokemon, setPokemon] = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      {pokemon ? (
        <Pokemon pokemon={pokemon} setPokemon={setPokemon} />
      ) : (
        <PokemonList setPokemon={setPokemon} />
      )}
    </QueryClientProvider>
  );
}

export default App;
