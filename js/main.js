const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const fadeModal = document.getElementById('fade');

const maxRecords = 151;
const limit = 9;
let offset = 0;

const setToUpperCase = (name) => {
    return name.charAt(0).toUpperCase() + name.substring(1)
}

const loadPokemonItems = (offset, limit) => {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map(pokemon => {
           
            return `<li class="pokemon ${pokemon.type}" onclick="selectPokemon(${pokemon.numberSerie})">

                    <span class="number">#${pokemon.numberSerie}</span>
                    <span class="name">${setToUpperCase(pokemon.name)}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${setToUpperCase(type)}</li>`).join('')}
                        </ol>

                        <img src="${pokemon.photo}" alt="${setToUpperCase(pokemon.name)}">
                    </div>
                </li>`
            }).join('')
    })
}

const toggleFade = () => {
    fadeModal.classList.toggle('hide');
}

const closePopupButton = () => {
    const popup = document.getElementById('popup')
    popup.parentElement.removeChild(popup)
    toggleFade()
}

const selectPokemon = async (id) => {
    toggleFade();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokemon = await res.json()
    displayPopup(pokemon)
}

// abrir modal
const displayPopup = (pokemon) => {
   
    const types = pokemon.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
 
    const photo = pokemon.sprites.other.dream_world.front_default
    const htmlString = `

    <div id="popup">
    
    <div class="${type} halfColorPokemon">
        
        <div class="closeButton">
            <button onclick="closePopupButton()" id="closeModalButton">x</button>
        </div>
            <div id="detailPokemon">

                <div class="modalHeader">
                    <div class="nameAndTypesModal">
                        <h2 class="nameModal">${setToUpperCase(pokemon.name)}</h2>
                            <div class="detailModal">
                                <ol class="typesModal">
                                    ${pokemon.types.map((type) =>`<li class="type ${type}">${setToUpperCase(type)}</li>`).join('')}
                                </ol>
                            </div>
                    </div>
                    <p class="numberModal">#${pokemon.id}</p>
                </div>

                
                <div class="imageModal">
                    <img src="${photo}" alt="${pokemon.name}">
                </div>


                <div class="statsModal">
                    <div classe="titleBaseStats">
                        <h3 class="BaseStatsTitleName">Base stats</h3>
                    </div>
                    <div class="baseStatsModal">
                        <div class="stat-desc">
                            ${pokemon.stats.map((name_stats) =>`<p class="stats-name">${setToUpperCase(name_stats.stat.name)}</p>`).join('')}
                        </div>
                        <div class="bar-inner">
                            ${pokemon.stats.map((base_stats) =>`<p class="stats-value">${base_stats.base_stat}</p>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    `
    pokemonList.innerHTML += htmlString
}

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    
    const qtdRecordsNextPage = offset + limit

    if (qtdRecordsNextPage >= maxRecords) {

        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }
})