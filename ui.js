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

// ===== Listar =====
// Função que exibe a lista e ativa a interatividade da tabela
function showCountriesList() {
  // 1. Renderiza a tabela na tela
  output.innerHTML = Paises.listCountriesAsTable(countries);

  // 2. Adiciona o event listener na div 'output'
  output.addEventListener('click', e => {
    // Encontra a linha (TR) mais próxima de onde o usuário clicou
    // que tenha o nosso atributo 'data-country-code'.
    const row = e.target.closest('tr[data-country-code]');

    // Se o usuário clicou em uma linha válida...
    if (row) {
      // Pega o código do país que guardamos no atributo data
      const countryCode = row.dataset.countryCode;
      
      // Encontra o objeto completo do país no seu array de países
      const country = countries.find(c => c.cca2 === countryCode);

      // Se encontrou o país, exibe os detalhes dele
      // (usando o mesmo layout da busca para manter a consistência)
      if (country) {
        forms.innerHTML = ''; // Limpa a área de formulários
        displayCountryDetails(country); // Chama uma função para mostrar os detalhes
      }
    }
  });
}

// Crie esta função para não repetir código. A busca e o clique na tabela podem usá-la.
// Função ATUALIZADA para exibir os detalhes do país com os novos dados
function displayCountryDetails(country) {
  output.innerHTML = `
    <div class="bg-slate-800 p-6 rounded-lg shadow-md transition-opacity duration-500">
        
        <div class="mb-6">
            <img 
              src="https://flagcdn.com/w1280/${country.cca2.toLowerCase()}.jpg" 
              alt="Bandeira de ${country.nome_comum}" 
              class="w-full max-w-sm mx-auto border-2 border-slate-700 rounded-lg shadow-lg"
            >
        </div>
        
        <div class="text-center border-b border-slate-700 pb-4 mb-4">
            <h3 class="text-3xl font-bold text-white">${country.nome_comum}</h3>
            <p class="text-slate-400 italic mt-1">${country.oficial_ptBr}</p> </div>
        
        <div class="space-y-3 text-lg">
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Capital:</span>
                <span class="text-slate-100">${country.capital}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Região:</span>
                <span class="text-slate-100">${country.regiao}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Sub-região:</span>
                <span class="text-slate-100">${country.sub_regiao}</span> </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Idioma Principal:</span>
                <span class="text-slate-100">${country.idioma_principal}</span> </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Moeda Principal:</span>
                <span class="text-slate-100">${country.moeda_principal}</span> </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Abreviação:</span>
                <span class="text-slate-100 font-mono">${country.cca3}</span> </div>
        </div>
    </div>
  `;
}
// ===== Actions =====
const actions = {
  init: () => {
    countries = Paises.resetCountries();
    output.innerHTML = "<p>🌍 Dados dos países carregados com sucesso!</p>";
    forms.innerHTML = "";
  },
  // **ALTERADO**: Agora usa innerHTML para renderizar a tabela
  list: () => showCountriesList(),
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
