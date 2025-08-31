import { Paises } from './lib.js';

const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');

function initializeApp() {
    let countries = Paises.loadCountries();
        if (countries.length === 0) {
                countries = Paises.resetCountries();
                    }

    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        mainContent.classList.add('visible');
                   }, 1500);
        return countries;
                          }
 let countries = initializeApp();

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
    if (found) {
        // Cria a URL da bandeira usando o código do país (cca2)
            const flagUrl = `https://flagsapi.com/${found.cca2}/flat/64.png`;
                output.innerHTML = `<div class="country-info">
                    <img class="imagem" src="${flagUrl}" alt="Bandeira de ${found.nome_comum}" class="flag-output">
                    <pre>${Paises.formatCountry(found)}</pre>
                    </div> `;
      } else {
          output.innerHTML = 'Nenhum país encontrado com essa capital.';
      }

  });
}

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
