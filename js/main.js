const form = document.getElementById('form');
const input = document.getElementById('input');
const showCard = document.querySelector('.card-container');

const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=200";

const traerPokemones = async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data.results;
}

const traerUrl = async () => {
    const pokemons = await traerPokemones();
    const pokemonData = await pokemons.map( async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return data;
    });

    const pokemonResolved = await Promise.all(pokemonData);
    return pokemonResolved;
}

const mostrarPokes = async (e) => {
    e.preventDefault();
    const inputValue = input.value.trim();
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}?limit=200`);
        const data = await res.json();
    if (inputValue == '') {
        showError('Completa el campo con algún número')
        input.classList.add('error')
    } else {
        const html = `
        <div class="card">
            <h2>${data.name.toUpperCase()}</h2>
            <div class="poke-img">
            <img src="${data.sprites.other.home.front_default}">
            </div>
        <div class="types"> Tipos:
            ${data.types
                .map((tipo) => {
                    return `<span>${tipo.type.name}</span>`
                })
                .join('')}
        </div>
        <div class="info">
        <p class="height">Altura: ${data.height / 10}m.</p>
        <p class="weight">Peso: ${data.weight / 10}kg.</p>
        </div>
        </div>
    `   
        input.classList.remove('error');
        clearError();
        showCard.innerHTML = html;
    }
    } catch (error) {
        console.log(error)
    }
}

const showError = (message) => {
    const msg = document.querySelector('small');
    msg.textContent = message;
}
    
const clearError = () => {
    const msg = document.querySelector('small');
    msg.textContent = "";
}

form.addEventListener('submit', mostrarPokes);