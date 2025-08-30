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
// Renomeie a função para algo mais genérico, como showSearchForm
function showSearchForm() {
  // O HTML agora inclui a caixa de seleção para o tipo de busca
  forms.innerHTML = `
    <div class="bg-slate-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 class="text-xl font-semibold text-white mb-4">Buscar País</h2>
      <form id="searchForm">
        
        <div class="mb-4">
          <label for="searchType" class="block text-sm font-medium text-slate-300 mb-2">Buscar por:</label>
          <select 
            id="searchType" 
            class="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="name">Nome</option>
            <option value="code">Abreviação</option>
            <option value="capital">Capital</option>
          </select>
        </div>

        <div>
          <label for="searchTerm" class="block text-sm font-medium text-slate-300 mb-2">Termo da Busca</label>
          <input 
            type="text" 
            id="searchTerm" 
            placeholder="Digite sua busca aqui..." 
            required 
            class="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors mt-6"
        >
          Buscar
        </button>
      </form>
    </div>
  `;
  
  // O event listener agora é mais inteligente
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    
    // Pega os valores dos dois campos: o tipo de busca e o termo digitado
    const searchType = document.getElementById('searchType').value;
    const searchTerm = document.getElementById('searchTerm').value;
    
    let found = null;

    // Decide qual função de busca chamar com base no tipo selecionado
    switch (searchType) {
      case 'name':
        // Substitua por sua função real de busca por nome
        found = Paises.findCountryByName(countries, searchTerm); 
        break;
      case 'code':
        // Substitua por sua função real de busca por abreviação/código
        found = Paises.findCountryByCode(countries, searchTerm);
        break;
      case 'capital':
        found = Paises.findCountryByCapital(countries, searchTerm);
        break;
    }
    
    // Limpa a área de formulários
    forms.innerHTML = '';
    
    // A lógica para exibir o resultado continua a mesma
    if (found) {
      output.innerHTML = `
        <div class="bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-white mb-4">Resultado da Busca:</h3>
          <pre class="bg-slate-900 text-slate-300 p-4 rounded-md overflow-x-auto whitespace-pre-wrap font-mono">${Paises.formatCountry(found)}</pre>
        </div>
      `;
    } else {
      output.innerHTML = `
        <div class="bg-slate-800 p-6 rounded-lg shadow-md">
          <p class="text-center text-yellow-400">Nenhum resultado encontrado para "${searchTerm}".</p>
        </div>
      `;
    }
  });
}

// ===== Gráfico de População =====
// Esta nova função irá gerar o formulário de seleção do gráfico
function showChartForm() {
  // Limpa a área de output para garantir que não haja gráficos antigos
  output.innerHTML = '';

  // Cria o formulário de seleção com o estilo do Tailwind
  forms.innerHTML = `
    <div class="bg-slate-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 class="text-xl font-semibold text-white mb-4">Gerar Gráfico</h2>
      <form id="chartForm">
        
        <!-- Caixa de Seleção para o critério do gráfico -->
        <div class="mb-4">
          <label for="chartType" class="block text-sm font-medium text-slate-300 mb-2">Visualizar Top 10 por:</label>
          <select 
            id="chartType" 
            class="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="population">População</option>
            <option value="area">Área (km²)</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors mt-6"
        >
          Gerar Gráfico
        </button>
      </form>
    </div>
  `;

  // Adiciona o event listener para o formulário que acabamos de criar
  document.getElementById('chartForm').addEventListener('submit', e => {
    e.preventDefault();
    
    // Pega o valor selecionado: 'population' ou 'area'
    const chartType = document.getElementById('chartType').value;
    
    let top10, chartTitle, datasetLabel;

    // Prepara os dados com base na escolha do usuário
    if (chartType === 'population') {
      top10 = Paises.getTop10ByPopulation(countries);
      chartTitle = 'Top 10 Países Mais Populosos';
      datasetLabel = 'População';
    } else { // chartType === 'area'
      // Aqui usamos a nova função que você adicionou
      top10 = Paises.getTop10ByArea(countries); 
      chartTitle = 'Top 10 Maiores Países por Área';
      datasetLabel = 'Área (km²)';
    }

    // Extrai os dados para o gráfico
    const labels = top10.map(country => country.nome_comum);
    const data = top10.map(country => chartType === 'population' ? country.populacao : country.area_km2);
    const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

    // Limpa o formulário e prepara a área de output para o gráfico
    forms.innerHTML = '';
    output.innerHTML = `<div class="bg-slate-800 p-6 rounded-lg shadow-md"><canvas id="dynamicChart"></canvas></div>`;

    // Cria o gráfico na área de output
    const ctx = document.getElementById('dynamicChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: datasetLabel,
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#cbd5e1' } // Cor do texto da legenda
          },
          title: {
            display: true,
            text: chartTitle,
            color: '#ffffff', // Cor do texto do título
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#94a3b8' }, // Cor dos números do eixo Y
            grid: { color: '#334155' }   // Cor das linhas de grade
          },
          x: {
            ticks: { color: '#94a3b8' }, // Cor dos nomes dos países no eixo X
            grid: { color: '#334155' }
          }
        }
      }
    });
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
  findByCapital: () => showSearchForm(),
  populationChart: () => showChartForm(),
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
