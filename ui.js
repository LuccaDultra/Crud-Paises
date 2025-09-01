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


const homepageView = document.getElementById('homepage-view');
const dashboardView = document.getElementById('dashboard-view');
const enterDashboardBtn = document.getElementById('enter-dashboard-btn');


enterDashboardBtn.addEventListener('click', () => {
    // Adiciona classes para uma transição suave de fade-out
    homepageView.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    
    // Espera a animação de fade-out terminar
    setTimeout(() => {
        homepageView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        
        // Adiciona uma animação de fade-in para o dashboard
        dashboardView.classList.add('opacity-0');
        setTimeout(() => {
             dashboardView.classList.remove('opacity-0');
             dashboardView.classList.add('opacity-100', 'transition-opacity', 'duration-500');
        }, 50);

    }, 500);
});

const output = document.getElementById('output');
const forms = document.getElementById('forms');
const buttons = document.getElementById('buttons');
const comparisonCartContainer = document.getElementById('comparison-cart-container');



// ========================
// Forms
// ========================

const showAddCountryForm = () => {
  output.innerHTML = ''; // Limpa a área de visualização
  forms.innerHTML = `
    <div class="bg-slate-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-6">Adicionar Novo País</h2>
      <form id="addForm">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nome_comum" class="block text-sm font-medium text-slate-300 mb-2">Nome Comum</label>
            <input type="text" id="nome_comum" placeholder="Ex: Atlântida" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="capital" class="block text-sm font-medium text-slate-300 mb-2">Capital</label>
            <input type="text" id="capital" placeholder="Ex: Poseidonis" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="populacao" class="block text-sm font-medium text-slate-300 mb-2">População</label>
            <input type="number" id="populacao" placeholder="Ex: 100000" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="area_km2" class="block text-sm font-medium text-slate-300 mb-2">Área (km²)</label>
            <input type="number" id="area_km2" placeholder="Ex: 50000" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button type="button" id="cancelAdd" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button type="submit" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
            Adicionar País
          </button>
        </div>
      </form>
    </div>
  `;

  // Listener para o botão de cancelar
  document.getElementById('cancelAdd').addEventListener('click', () => {
    forms.innerHTML = '';
    output.innerHTML = '<p>Criação de país cancelada.</p>';
  });

  // Listener para o envio do formulário
  document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault();

    const nomeComum = document.getElementById('nome_comum').value;
    
    // Gera abreviações simples baseadas no nome (suficiente para este app)
    const cca3 = nomeComum.slice(0, 3).toUpperCase();

    // Validação: Verifica se um país com a mesma abreviação já existe
    if (countries.some(c => c.cca3 === cca3)) {
      showCustomAlert(`Já existe um país com a abreviação '${cca3}'. Por favor, escolha um nome diferente.`);
      return; // Interrompe a execução
    }

    const newCountry = {
      nome_comum: nomeComum,
      capital: document.getElementById('capital').value,
      populacao: parseInt(document.getElementById('populacao').value, 10),
      area_km2: parseInt(document.getElementById('area_km2').value, 10),
      cca3: cca3,
      cca2: 'us-al',
      // Preenche outros dados com valores padrão para evitar erros
      oficial_ptBr: `República de ${nomeComum}`,
      regiao: 'N/D',
      sub_regiao: 'N/D',
      idioma_principal: 'N/D',
      moeda_principal: 'N/D'
    };

    // Adiciona o novo país à lista principal e salva
    countries = Paises.addCountry(countries, newCountry);
    Paises.saveCountries(countries);

    // Limpa o formulário e exibe o novo país
    forms.innerHTML = '';
    Paises.displayCountryDetails(newCountry);
    showCustomAlert('País adicionado com sucesso!');
  });
}

const showEditForm = (countryToEdit) => {
  output.innerHTML = '';
  
  // Preenche a div 'forms' com o HTML do formulário
  forms.innerHTML = `
    <div class="bg-slate-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-6">Editando: ${countryToEdit.nome_comum}</h2>
      <form id="editForm" data-cca3="${countryToEdit.cca3}">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nome_comum" class="block text-sm font-medium text-slate-300 mb-2">Nome Comum</label>
            <input type="text" id="nome_comum" value="${countryToEdit.nome_comum}" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="capital" class="block text-sm font-medium text-slate-300 mb-2">Capital</label>
            <input type="text" id="capital" value="${countryToEdit.capital}" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="populacao" class="block text-sm font-medium text-slate-300 mb-2">População</label>
            <input type="number" id="populacao" value="${countryToEdit.populacao}" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
          <div>
            <label for="area_km2" class="block text-sm font-medium text-slate-300 mb-2">Área (km²)</label>
            <input type="number" id="area_km2" value="${countryToEdit.area_km2}" required class="w-full bg-slate-700 text-white rounded-md px-3 py-2">
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button type="button" id="cancelEdit" class="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button type="submit" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  `;

  // Listener para o botão CANCELAR
  document.getElementById('cancelEdit').addEventListener('click', () => {
    forms.innerHTML = ''; // Limpa o formulário
    Paises.displayCountryDetails(countryToEdit); // Mostra os detalhes do país novamente
  });

  // Listener para a SUBMISSÃO do formulário
  document.getElementById('editForm').addEventListener('submit', e => {
    e.preventDefault();
    
    // Pega o código do país do atributo do formulário
    const cca3 = e.target.dataset.cca3;
    
    // Cria um objeto com os dados atualizados do formulário
    const updatedData = {
      nome_comum: document.getElementById('nome_comum').value,
      capital: document.getElementById('capital').value,
      populacao: parseInt(document.getElementById('populacao').value, 10),
      area_km2: parseInt(document.getElementById('area_km2').value, 10)
    };

    // Atualiza a lista de países
    countries = Paises.updateCountry(countries, cca3, updatedData);
    
    // Salva os dados no localStorage
    Paises.saveCountries(countries);
    
    // Limpa o formulário da tela
    forms.innerHTML = '';
    
    // Encontra o país atualizado para exibir os detalhes
    const updatedCountry = countries.find(c => c.cca3 === cca3);
    if (updatedCountry) {
      Paises.displayCountryDetails(updatedCountry);
    }

    alert('País atualizado com sucesso!');
  });
}



// Formulário para buscar país 

const showSearchForm = () => {
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
                    <div class="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span class="font-semibold text-slate-400">Capital:</span>
                        <span class="text-slate-100">${country.capital}</span>
                    </div>
                  
                    <div class="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span class="font-semibold text-slate-400">Região:</span>
                        <span class="text-slate-100">${country.regiao}</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span class="font-semibold text-slate-400">Moeda:</span>
                        <span class="text-slate-100">${country.moeda_principal}</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span class="font-semibold text-slate-400">Idioma:</span>
                        <span class="text-slate-100">${country.idioma_principal}</span>
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


const showChartForm = () => {
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
      top10 = Paises.getTop10By(countries)('area_km2'); 
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
const showCountriesList = () => {
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
  addFictional: () => showAddCountryForm(),
  findByCapital: () => showSearchForm(),
  populationChart: () => showChartForm(),
  clear: () => {
    forms.innerHTML = '';
    Paises.clearCountries();
    countries = [];
    output.innerHTML = '<p>Dados limpos.</p>';
  },
  exit: () => {
    // 1. Inicia a animação de fade-out do dashboard
    dashboardView.classList.remove('opacity-100');
    dashboardView.classList.add('opacity-0', 'transition-opacity', 'duration-500');

    // 2. Após a animação, esconde o dashboard e mostra a home
    setTimeout(() => {
      dashboardView.classList.add('hidden');
      homepageView.classList.remove('hidden');
      
      // 3. Inicia a animação de fade-in da homepage
      homepageView.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      
      setTimeout(() => {
        homepageView.classList.remove('opacity-0');
        homepageView.classList.add('opacity-100');
      }, 20); // Pequeno delay para o navegador processar a mudança

    }, 500); // Tempo da animação de saída
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



document.addEventListener('click', (e) => {
    // Captura clique no botão "Selecionar para Comparar" 
    const compareButton = e.target.closest('[data-action="addCompare"]');
    if (compareButton) {
        const cca3 = compareButton.dataset.compareCca3;
        Paises.addToComparison(cca3, countries);
        updateComparisonCart();
        return; 
    }
    const cartButton = e.target.closest('#compare-now-btn');
    if (cartButton) {
        displayComparisonView(); // Mostra comparação
        updateComparisonCart(); // Limpa o localStorage
        return; 
    }

    
    const deleteButton = e.target.closest('[data-action="deleteCountry"]');
    if (deleteButton) {
        const cca3Cod = deleteButton.dataset.cca3;
        if (confirm('Tem certeza que deseja deletar este país?')) {
            countries = Paises.deleteCountry(countries, cca3Cod); 
            Paises.saveCountries(countries);
            // Exibe a mensagem de sucesso.
            output.innerHTML = '<p class="text-green-400">País deletado com sucesso!</p>';
            forms.innerHTML = ''; // Limpa qualquer formulário visível
        }
        return;
    }

    // --- EDITAR ---
    const editButton = e.target.closest('[data-action="editCountry"]');
    if (editButton) {
        const cca3 = editButton.dataset.cca3;
        const countryToEdit = countries.find(c => c.cca3 === cca3);
        if (countryToEdit) {
            showEditForm(countryToEdit); // Chama a função que cria o formulário
        }
        return;
    }
});
