// Importa o módulo principal que contém as funções de manipulação dos países
import { Paises } from './lib.js';



// ========================
// Ações que não dependem de outra função
// ========================


Paises.clearComparison(); // Limpa a comparação

// Carrega os países salvos no localStorage.
let countries = Paises.loadCountries();
if (countries.length === 0) {
    countries = Paises.resetCountries(); // Carrega os dados iniciais se estiver vazio
};


// ========================
// Elementos
// ========================


const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');
const comparisonCartContainer = document.getElementById('comparison-cart-container');



// ========================
// Forms
// ========================



// Formulário para buscar país 

function showSearchForm() {
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
  
  // O event listener para identificar os valores de texto e tipo
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    
    // Pega os valores dos dois campos: o tipo de busca e o termo digitado
    const searchType = document.getElementById('searchType').value;
    const searchTerm = document.getElementById('searchTerm').value;
    
    let found = null;

    // Decide qual função de busca chamar com base no tipo selecionado
    switch (searchType) {
      case 'name':
        found = Paises.findCountryBy(countries, searchTerm)('nome_comum'); 
        break;
      case 'code':
        found = Paises.findCountryBy(countries, searchTerm)( 'cca3');
        break;
      case 'capital':
        found = Paises.findCountryBy(countries, searchTerm)('capital');
        break;
    }
    
    forms.innerHTML = '';

    if (found) {
      Paises.displayCountryDetails(found)
    } else {
      output.innerHTML = `
        <div class="bg-slate-800 p-6 rounded-lg shadow-md">
          <p class="text-center text-yellow-400">Nenhum resultado encontrado para "${searchTerm}", use os nomes em inglês.</p>
        </div>
      `;
    }
  });
};



// ========================
// Comparação de Paises
// ========================

const updateComparisonCart = () => {
    const list = Paises.getComparisonList();
    
    if (list.length === 0) {
        comparisonCartContainer.innerHTML = ''; // Se a lista estiver vazia, esconde o ícone
        return;
    }

    // Gera o HTML do carrinho com o contador
    comparisonCartContainer.innerHTML = `
        <button 
            id="compare-now-btn" 
            class="flex items-center gap-x-3 bg-indigo-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
            <!-- Ícone de balança (aumentado) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scale flex-shrink-0"><path d="m16 16 3-8 3 8c-2 1-4 1-6 0"/><path d="M2 16l3-8 3 8c-2 1-4 1-6 0"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
            
            <!-- Texto dinâmico -->
            <span>
                Comparar (${list.length}) Países
            </span>
        </button>
    `;
};


const displayComparisonView = () => {
    const listCca3 = Paises.getComparisonList();
    
    if (listCca3.length < 2) {
        alert('Selecione pelo menos 2 países para comparar.');
        return;
    }

    // Filtra os objetos completos dos países a partir dos códigos cca3
    const countriesToCompare = Paises.getComparisonList();

    // Lógica para encontrar os maiores valores de população e área
    const maxPop = Math.max(...countriesToCompare.map(c => c.populacao || 0));
    const maxArea = Math.max(...countriesToCompare.map(c => c.area_km2 || 0));

    // Gera as colunas para cada país
    const countryColumns = countriesToCompare.map(country => {
        // Define a classe da célula de população (verde para o maior, vermelho para os outros)
        const popClass = country.populacao === maxPop ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';
        // Define a classe da célula de área
        const areaClass = country.area_km2 === maxArea ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';

        return `
            <div class="bg-slate-800 p-4 rounded-lg shadow-md flex flex-col">
                <img 
                    src="https://flagcdn.com/w1280/${country.cca2.toLowerCase()}.jpg" 
                    alt="Bandeira de ${country.nome_comum}" 
                    class="w-full max-w-sm mx-auto h-auto rounded-md mb-4 border-2 border-slate-700"
                >
                <h3 class="text-xl font-bold text-white text-center mb-2">${country.nome_comum}</h3>
                <p class="text-slate-400 text-center italic mb-4">${country.oficial_ptBr}</p>
                <div class="space-y-2 mt-auto">
                    <div class="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span class="font-semibold text-slate-400">Capital:</span>
                        <span class="text-slate-100">${country.capital}</span>
                    </div>
                    <!-- Célula de População com cor condicional -->
                    <div class="flex justify-between items-center p-2 rounded-md ${popClass} transition-colors">
                        <span class="font-semibold">População:</span>
                        <span class="font-bold">${(country.populacao || 0).toLocaleString('pt-BR')}</span>
                    </div>
                     <!-- Célula de Área com cor condicional -->
                    <div class="flex justify-between items-center p-2 rounded-md ${areaClass} transition-colors">
                        <span class="font-semibold">Área (km²):</span>
                        <span class="font-bold">${(country.area_km2 || 0).toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Cria a grade responsiva para exibir as colunas
    output.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 ${countriesToCompare.length === 3 ? 'lg:grid-cols-3' : ''} gap-6">
          ${countryColumns}
      </div>
    `;
    forms.innerHTML = ''; // Limpa a área de formulários
    Paises.clearComparison(); // Limpa o localStorage e o ícone do carrinho
}


// ========================
// Gráficos
// ========================


function showChartForm() {
  // Limpa a área de output para garantir que não elementos indesejados
  output.innerHTML = '';

  // Cria o formulário de seleção
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

  // Adiciona o event listener para o formulário
  document.getElementById('chartForm').addEventListener('submit', e => {
    e.preventDefault();
    
    // Pega o valor selecionado: 'population' ou 'area'
    const chartType = document.getElementById('chartType').value;
    
    let top10, chartTitle, datasetLabel;

    // Prepara os dados com base na escolha
    if (chartType === 'population') {
      top10 = Paises.getTop10By(countries)('populacao');
      chartTitle = 'Top 10 Países Mais Populosos';
      datasetLabel = 'População';
    } else { 
      top10 = Paises.getTop10by(countries)(area_km2); 
      chartTitle = 'Top 10 Maiores Países por Área';
      datasetLabel = 'Área (km²)';
    }

    // Extrai os dados para o gráfico
    const labels = top10.map(country => country.nome_comum);
    const data = top10.map(country => chartType === 'population' ? country.populacao : country.area_km2);
    const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

    // Limpa o formulário e prepara a área para o gráfico
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
};





// ========================
// Listar
// ========================


// Função que exibe a lista interativa
function showCountriesList() {
  // Renderiza a tabela na tela
  output.innerHTML = Paises.listCountriesAsTable(countries);

  // Adiciona o event listener na div 'output' para analisar clicks
  output.addEventListener('click', e => {
    // Encontra a linha mais próxima de onde o usuário clicou
    // que tenha o nosso atributo 'data-country-code'.
    const row = e.target.closest('tr[data-country-code]');

    // Se linha é válida...
    if (row) {
      // Pega o código cca3 do país 
      const countryCode = row.dataset.countryCode;
      
      // Encontra o pais completo 
      const country = countries.find(c => c.cca2 === countryCode);

      // Se encontrou o país, exibe os detalhes dele
      // (Reaproveitando codigo da outra função)
      if (country) {
        forms.innerHTML = '';
        Paises.displayCountryDetails(country); // Chama a função para mostrar os detalhes
      }
    }
  });
};




// ========================
// Actions
// ========================

const actions = {
  init: () => {
    countries = Paises.resetCountries();
    output.innerHTML = "<p>🌍 Dados dos países carregados com sucesso!</p>";
    forms.innerHTML = "";
  },
  
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


// ========================
// Event listener
// ========================


// Botões padrões
buttons.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const action = e.target.dataset.action;
    if (action && actions[action]) {
      actions[action]();
    }
  }
});


// EventListener da função comparar
document.addEventListener('click', (e) => {
    // Captura clique no botão "Selecionar para Comparar" 
    const compareButton = e.target.closest('[data-action="addCompare"]');
    if (compareButton) {
        const cca3 = compareButton.dataset.compareCca3;
        Paises.addToComparison(cca3, countries);
        updateComparisonCart();
        return; 
    }

    // Captura clique no botão do "carrinho" para iniciar a comparação
    const cartButton = e.target.closest('#compare-now-btn');
    if (cartButton) {
        displayComparisonView(); // Mostra comparação
        updateComparisonCart(); // Limpa o localStorage
    }
});