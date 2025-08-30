// Importa o módulo principal que contém as funções de manipulação dos países
import { Paises } from './lib.js';







// ===== Dados e elementos =====

Paises.clearComparison() // Limpa a comparação

// Carrega os países salvos no localStorage.
let countries = Paises.loadCountries();
if (countries.length === 0) {
    countries = Paises.resetCountries(); // Carrega os dados iniciais se estiver vazio
}

// Seleciona elementos HTML
const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');
const comparisonCartContainer = document.getElementById('comparison-cart-container');










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
        found = Paises.findCountryBy(countries, searchTerm)('nome_comum'); 
        break;
      case 'code':
        // Substitua por sua função real de busca por abreviação/código
        found = Paises.findCountryBy(countries, searchTerm)( 'cca3');
        break;
      case 'capital':
        found = Paises.findCountryBy(countries, searchTerm)('capital');
        break;
    }
    
    // Limpa a área de formulários
    forms.innerHTML = '';
    
    // A lógica para exibir o resultado continua a mesma
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
}


// ===== Comparação de Paises =====


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
}


// ===== Gráficos =====
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
        Paises.displayCountryDetails(country); // Chama uma função para mostrar os detalhes
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


document.addEventListener('click', (e) => {
    // Captura clique no botão "Selecionar para Comparar" pelo data-action
    // Usamos 'closest' para garantir que funciona mesmo clicando em um ícone dentro do botão
    const compareButton = e.target.closest('[data-action="addCompare"]');
    if (compareButton) {
        // Agora que temos o elemento botão, podemos pegar seu outro dataset com segurança
        const cca3 = compareButton.dataset.compareCca3;
        Paises.addToComparison(cca3, countries)
        updateComparisonCart()
        return; // Encerra para não processar outros cliques
    }

    // Captura clique no botão do "carrinho" para iniciar a comparação
    const cartButton = e.target.closest('#compare-now-btn');
    if (cartButton) {
        Paises.displayComparisonView();
        updateComparisonCart() 
    }
});