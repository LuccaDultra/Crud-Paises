// Importa o módulo principal que contém as funções de manipulação dos países
import { Paises } from './lib.js';

// ===== Dados e elementos =====

// Carrega os países salvos no localStorage.
let countries = Paises.loadCountries();
if (countries.length === 0) {
    countries = Paises.resetCountries(); // Carrega os dados iniciais se estiver vazio
}

// Seleciona elementos HTML
const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');

// ===== Forms =====

// --- Formulário para buscar país por capital ---
function showFindByCapitalForm() {
  forms.innerHTML = `
    <h3>Buscar País por Capital</h3>
    <form id="capitalForm">
      <input type="text" id="capitalName" placeholder="Nome da capital" required />
      <button type="submit">Buscar</button>
    </form>
  `;
  document.getElementById('capitalForm').addEventListener('submit', e => {
    e.preventDefault();
    const capital = document.getElementById('capitalName').value;
    const found = Paises.findCountryByCapital(countries, capital);
    forms.innerHTML = '';
    // A busca individual continua mostrando o formato de texto
    output.innerHTML = found ? `<pre>${Paises.formatCountry(found)}</pre>` : 'Nenhum país encontrado com essa capital.';
  });
}

// --- Formulário para buscar país por nome, para comparar ---
function showFindByNameForm() {
  forms.innerHTML = `
    <h3>Buscar País por Nome</h3>
    <form id="nameForm">
      <input type="text" id="countryName" placeholder="Nome do país" required />
      <button type="submit">Buscar</button>
    </form>
  `;
  document.getElementById('nameForm').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('countryName').value;
    const found = Paises.findCountryByName(countries, nome);
    forms.innerHTML = '';

// ===== Gráfico de População =====
function showPopulationChart() {
  forms.innerHTML = `<canvas id="populationChart"></canvas>`;
  output.innerHTML = ''; // Limpa a área de output

  const top10 = Paises.getTop10ByPopulation(countries);
  const labels = top10.map(country => country.nome_comum);
  const data = top10.map(country => country.populacao);
  const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

  const ctx = document.getElementById('populationChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'População',
        data,
        backgroundColor: colors
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Top 10 Países Mais Populosos' }
      },
      scales: {
        y: { beginAtZero: true },
        x: { ticks: { autoSkip: false } }
      }
    }
  });
}

// ===== Actions =====
const actions = {
  init: () => {
    countries = Paises.resetCountries();
    output.innerHTML = "<p>🌍 Dados dos países carregados com sucesso!</p>";
    forms.innerHTML = "";
  },
  // **ALTERADO**: Agora usa innerHTML para renderizar a tabela
  list: () => {
    forms.innerHTML = '';
    output.innerHTML = Paises.listCountriesAsTable(countries);
  },
  findByCapital: () => showFindByCapitalForm(),
  findByName: () => showFindByNameForm(),
  populationChart: () => showPopulationChart(),
  clear: () => {
    forms.innerHTML = '';
    Paises.clearCountries();
    countries = [];
    output.innerHTML = '<p>Dados limpos.</p>';
  },
  exit: () => {
    forms.innerHTML = '';
    output.innerHTML = '<p>Até logo! :)</p>';
  }
};

// ===== Event listener =====
buttons.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const action = e.target.dataset.action;
    if (action && actions[action]) {
      actions[action]();
    }
  }
});
