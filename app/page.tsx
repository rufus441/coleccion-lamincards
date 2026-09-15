'use client';

import { useState, useEffect } from 'react';
import { pokemonData } from './pokemonData';

type EstadoCarta = 'falta' | 'tengo' | 'repetida';

export default function LamincardsCollection() {
  const [collection, setCollection] = useState<Record<number, EstadoCarta>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lamincardsCollection');
    if (saved) {
      setCollection(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const updateStatus = (id: number, status: EstadoCarta) => {
    const newCollection = { ...collection, [id]: status };
    setCollection(newCollection);
    localStorage.setItem('lamincardsCollection', JSON.stringify(newCollection));
  };

  const stats = {
    tengo: Object.values(collection).filter((s) => s === 'tengo' || s === 'repetida').length,
    repetidas: Object.values(collection).filter((s) => s === 'repetida').length,
  };

  // Pantalla de carga con diseño premium
  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    /* Fondo radial oscuro */
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4 sm:p-8 font-sans text-slate-100">

      {/* Cabecera / Dashboard Liquid Glass */}
      <header className="max-w-6xl mx-auto mb-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight drop-shadow-sm mb-1">
            Colección Lamincards
          </h1>
          <p className="text-sm text-slate-400 font-medium">2005 Edition - 150 Pokémon</p>
        </div>
        
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <div className="flex-1 md:flex-none text-center px-6 py-3 bg-emerald-500/10 text-emerald-300 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-lg">
            <span className="block text-2xl font-black">{stats.tengo} <span className="text-sm font-medium opacity-60">/ 150</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1 block">Conseguidas</span>
          </div>
          <div className="flex-1 md:flex-none text-center px-6 py-3 bg-blue-500/10 text-blue-300 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-lg">
            <span className="block text-2xl font-black">{stats.repetidas}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1 block">Repetidas</span>
          </div>
        </div>
      </header>

      {/* Cuadrícula de Cartas */}
      <main className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
        {pokemonData.map((pokemon) => {
          const estado = collection[pokemon.id] || 'falta';

          // Estilos dinámicos del cristal dependiendo del estado
          const cardClasses = 
            estado === 'tengo' ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
            estado === 'repetida' ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 
            'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg';

          const imageClasses = 
            estado === 'falta' ? 'grayscale opacity-50' : 'drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]';

          return (
            <article 
              key={pokemon.id} 
              // 'group' permite animar elementos internos al hacer hover sobre la carta entera
              className={`group flex flex-col p-3 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${cardClasses}`}
            >
              {/* Contenedor de la Imagen */}
              <div className="relative aspect-[3/4] mb-4 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/5 p-2 transition-colors duration-500 group-hover:bg-black/20">
                <img 
                  src={`/lamincards/${pokemon.imagen}`} 
                  alt={pokemon.nombreEs} 
                  className={`w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 ${imageClasses}`}
                  loading="lazy"
                />
              </div>

              {/* Información */}
              <div className="text-center mb-4 flex-grow">
                <span className="text-[11px] font-mono text-slate-400 font-bold block mb-1 opacity-70">
                  #{pokemon.dex}
                </span>
                <h2 className="font-bold text-slate-100 leading-tight tracking-wide drop-shadow-md">
                  {pokemon.nombreEs}
                </h2>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-1.5 justify-center mt-auto">
                <button 
                  onClick={() => updateStatus(pokemon.id, 'falta')} 
                  className={`flex-1 py-2 text-[10px] font-black tracking-wider rounded-xl transition-all duration-300 ${estado === 'falta' ? 'bg-slate-700 text-white shadow-inner border border-slate-600' : 'bg-black/30 text-slate-400 hover:bg-black/50 hover:text-white'}`}
                >
                  FALTA
                </button>
                <button 
                  onClick={() => updateStatus(pokemon.id, 'tengo')} 
                  className={`flex-1 py-2 text-[10px] font-black tracking-wider rounded-xl transition-all duration-300 ${estado === 'tengo' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                >
                  TENGO
                </button>
                <button 
                  onClick={() => updateStatus(pokemon.id, 'repetida')} 
                  className={`flex-1 py-2 text-[10px] font-black tracking-wider rounded-xl transition-all duration-300 ${estado === 'repetida' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'}`}
                >
                  REP
                </button>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}