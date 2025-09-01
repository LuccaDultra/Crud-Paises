import { sourceCountries } from './bancoDados.js'; // Importa o objeto sourceCountries que contem todos paises

const STORAGE_KEY = "paises::data"; // Chave usada no localStorage para salvar os dados dos países
const COMPARISON_KEY = "paises::comparison"; // Chave usada no localStorage para salvar países para comparação



// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================


// Carrega a lista de países do localStorage
const loadCountries = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Salva a lista de países no localStorage (convertendo para texto JSON)
const saveCountries = (countries) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(countries));

// Remove todos os dados do localStorage
const clearCountries = () => {
  localStorage.removeItem(STORAGE_KEY);
  console.log("Dados dos países limpos.");
};

// Restaura a lista inicial de países (com os dados do JSON)
const resetCountries = () => {
  const countries = sourceCountries  // Chama o objeto do outro arquivo para ficar mais organizado
  saveCountries(countries);
  console.log("Dados iniciais dos países salvos.");
  return countries;
};



// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================


const addCountry = (countries, newCountry) => [...countries, newCountry];


const updateCountry = (countries, cca3, updates) =>
  countries.map(country => (country.cca3 === cca3 ? { ...country, ...updates } : country));

const deleteCountry = (countries, countryCca3) =>
  countries.filter(country => country.cca3 !== countryCca3);




// ========================
// Logica da comparação de paises
// ========================

const getComparisonList = () => {
    return JSON.parse(localStorage.getItem(COMPARISON_KEY)) || [];
}


const saveComparisonList = (list) => {
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(list));
}

const clearComparison = () => {
    localStorage.removeItem(COMPARISON_KEY);
    
}


const addToComparison = (countryCca3, countries) => {
    const list = getComparisonList();
    const existe = list.filter(x => x.cca3 === countryCca3)
    if (list.length >= 3) {
        alert('Você só pode comparar até 3 países por vez.');
        return;
    }

    if(existe.length != 0){
      alert('Este país já foi selecionado.');
      return;
    }
    const novoPais = countries.filter(pais => pais.cca3 === countryCca3)[0]
    const novaList = [...list, novoPais];
    saveComparisonList(novaList);
}




// ========================
// Listagem e formatação
// ========================


// Formata os dados de um único país para exibição, e funciona como uma peça central de controle
const displayCountryDetails = (country) => {
  output.innerHTML = `
    <div class="relative bg-slate-800 p-6 rounded-lg shadow-md transition-opacity duration-500">

        <button 
            data-action="editCountry"
            data-cca3="${country.cca3}"
            class="absolute top-6 left-6 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Editar País"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-pen-line"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z"/><path d="M8 18h1"/><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/></svg>
            <span class="font-semibold">Editar</span>
        </button>

        <button 
            data-action="deleteCountry"
            data-cca3="${country.cca3}"
            class="absolute top-6 right-6 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Deletar País"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            <span class="font-semibold">Deletar</span>
        </button>
        <!-- BANDEIRA EM ALTA RESOLUÇÃO -->
        <div class="mb-6">
            <img 
              src="https://flagcdn.com/w1280/${country.cca2.toLowerCase()}.jpg" 
              alt="Bandeira de ${country.nome_comum}" 
              class="w-full max-w-sm mx-auto border-2 border-slate-700 rounded-lg shadow-lg"
            >
        </div>
        
        <!-- INFORMAÇÕES DO PAÍS -->
        <div class="text-center border-b border-slate-700 pb-4 mb-4">
            <h3 class="text-3xl font-bold text-white">${country.nome_comum}</h3>
            <p class="text-slate-400 italic mt-1">${country.oficial_ptBr}</p>
        </div>
        
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
                <span class="text-slate-100">${country.sub_regiao}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">População:</span>
                <span class="text-slate-100">${(country.populacao || 0).toLocaleString('pt-BR')}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Área:</span>
                <span class="text-slate-100">${(country.area_km2 || 0).toLocaleString('pt-BR')} km²</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Idioma Principal:</span>
                <span class="text-slate-100">${country.idioma_principal}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Moeda Principal:</span>
                <span class="text-slate-100">${country.moeda_principal}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-semibold text-slate-400">Abreviação (CCA3):</span>
                <span class="text-slate-100 font-mono">${country.cca3}</span>
            </div>
        </div>

        <!-- BOTÃO PARA COMPARAÇÃO -->
        <div class="border-t border-slate-700 mt-6 pt-6">
            <button 
                data-compare-cca3="${country.cca3}"
                data-action="addCompare"
                class="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
            >
                Selecionar para Comparar
            </button>
        </div>

    </div>
  `;
}


// Gera uma tabela HTML com a lista de países
const listCountriesAsTable = countries => {
  // Cabeçalho da tabela 
  const headers = `
    <thead class="bg-slate-700">
      <tr>
        <th class="p-3 text-sm font-semibold tracking-wide text-left">Bandeira</th>
        <th class="p-3 text-sm font-semibold tracking-wide text-left">País</th>
        <th class="p-3 text-sm font-semibold tracking-wide text-left">Capital</th>
        <th class="p-3 text-sm font-semibold tracking-wide text-left">População</th>
        <th class="p-3 text-sm font-semibold tracking-wide text-left">Área (km²)</th>
      </tr>
    </thead>
  `;

  
  // Corpo da tabela
  const rows = countries.map(country => `
    <tr 
      class="bg-slate-800 border-b border-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
      data-country-code="${country.cca2}"
    >
      <td class="p-3"><img class="w-10 h-auto rounded-sm" src="https://flagcdn.com/w40/${country.cca2.toLowerCase()}.jpg" alt="Bandeira de ${country.nome_comum}"></td>
      <td class="p-3 font-bold text-white">${country.nome_comum}</td>
      <td class="p-3">${country.capital}</td>
      <td class="p-3">${country.populacao.toLocaleString('pt-BR')}</td>
      <td class="p-3">${country.area_km2.toLocaleString('pt-BR')}</td>
    </tr>
  `).join('');

  // Retorna a tabela completa 
  return `
    <div class="overflow-x-auto rounded-lg shadow-md">
      <table class="w-full text-slate-300">
        ${headers}
        <tbody class="divide-y divide-slate-700">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};



// Função de pesquisar que pode ser ultilizada para mais de um atributo
const findCountryBy = (countries, keyName) => (chave) =>
  countries.filter(country => country[chave].toLowerCase() == keyName.toLowerCase())[0];

// ========================
// Funções para Gráficos
// ========================



// Função para obter os 10 maiores países pelo parametro
const getTop10By = (countries) => (chave) => {
  return [...countries]
    .sort((a, b) => b[chave] - a[chave]) // Ordena pela chave 
    .slice(0, 10);
};


// ========================
// Exporta as funções
// ========================
export const Paises = {
  loadCountries,
  saveCountries,
  resetCountries,
  clearCountries,
  addCountry,
  updateCountry,
  deleteCountry,
  displayCountryDetails,
  listCountriesAsTable, 
  findCountryBy,
  getTop10By,
  getComparisonList,
  saveComparisonList,
  clearComparison,
  addToComparison,
};
