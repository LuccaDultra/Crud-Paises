// Chave usada no localStorage para salvar os dados dos países
const STORAGE_KEY = "paises::data";

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de países do localStorage
// Se não existir nada salvo, retorna um array vazio
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
// Útil para resetar o sistema com dados de exemplo
const resetCountries = () => {
  const countries = [
    {
      "id": 1, "cca2": "BR", "codigo_iso_alpha3": "BRA", "nome_comum": "Brazil", "nome_oficial": "Federative Republic of Brazil", "populacao": 212559409, "area_km2": 8515767, "capital": "Brasília", "localizacao_capital": { "latitude": -15.79, "longitude": -47.88 }, "idioma_principal": "Portuguese", "moeda": { "nome": "Brazilian real", "simbolo": "R$" }, "pib": "1.609 trilhões USD (2021)", "idh": 0.754, "fundacao": 1822, "ponto_mais_alto_m": 2994
    },
    {
      "id": 2, "cca2": "US", "codigo_iso_alpha3": "USA", "nome_comum": "United States", "nome_oficial": "United States of America", "populacao": 329484123, "area_km2": 9372610, "capital": "Washington, D.C.", "localizacao_capital": { "latitude": 38.89, "longitude": -77.03 }, "idioma_principal": "English", "moeda": { "nome": "United States dollar", "simbolo": "$" }, "pib": "23.32 trilhões USD (2021)", "idh": 0.926, "fundacao": 1776, "ponto_mais_alto_m": 6190
    },
    {
      "id": 3, "cca2": "PT", "codigo_iso_alpha3": "PRT", "nome_comum": "Portugal", "nome_oficial": "Portuguese Republic", "populacao": 10305564, "area_km2": 92090, "capital": "Lisbon", "localizacao_capital": { "latitude": 38.72, "longitude": -9.13 }, "idioma_principal": "Portuguese", "moeda": { "nome": "Euro", "simbolo": "€" }, "pib": "250.2 bilhões USD (2021)", "idh": 0.864, "fundacao": 1143, "ponto_mais_alto_m": 2351
    },
    {
      "id": 4, "cca2": "JP", "codigo_iso_alpha3": "JPN", "nome_comum": "Japan", "nome_oficial": "Japan", "populacao": 125836021, "area_km2": 377930, "capital": "Tokyo", "localizacao_capital": { "latitude": 35.68, "longitude": 139.65 }, "idioma_principal": "Japanese", "moeda": { "nome": "Japanese yen", "simbolo": "¥" }, "pib": "4.94 trilhões USD (2021)", "idh": 0.919, "fundacao": -660, "ponto_mais_alto_m": 3776
    },
    {
      "id": 5, "cca2": "ZA", "codigo_iso_alpha3": "ZAF", "nome_comum": "South Africa", "nome_oficial": "Republic of South Africa", "populacao": 59308690, "area_km2": 1221037, "capital": "Pretoria", "localizacao_capital": { "latitude": -25.7, "longitude": 28.22 }, "idioma_principal": "Afrikaans", "moeda": { "nome": "South African rand", "simbolo": "R" }, "pib": "419.9 bilhões USD (2021)", "idh": 0.709, "fundacao": 1961, "ponto_mais_alto_m": 3450
    },
    {
      "id": 6, "cca2": "DE", "codigo_iso_alpha3": "DEU", "nome_comum": "Germany", "nome_oficial": "Federal Republic of Germany", "populacao": 83240525, "area_km2": 357114, "capital": "Berlin", "localizacao_capital": { "latitude": 52.52, "longitude": 13.4 }, "idioma_principal": "German", "moeda": { "nome": "Euro", "simbolo": "€" }, "pib": "4.26 trilhões USD (2021)", "idh": 0.947, "fundacao": 1871, "ponto_mais_alto_m": 2962
    },
    {
      "id": 7, "cca2": "CN", "codigo_iso_alpha3": "CHN", "nome_comum": "China", "nome_oficial": "People's Republic of China", "populacao": 1402112000, "area_km2": 9706961, "capital": "Beijing", "localizacao_capital": { "latitude": 39.92, "longitude": 116.38 }, "idioma_principal": "Chinese", "moeda": { "nome": "Chinese yuan", "simbolo": "¥" }, "pib": "17.73 trilhões USD (2021)", "idh": 0.761, "fundacao": -2070, "ponto_mais_alto_m": 8848
    },
    {
      "id": 8, "cca2": "IN", "codigo_iso_alpha3": "IND", "nome_comum": "India", "nome_oficial": "Republic of India", "populacao": 1380004385, "area_km2": 3287590, "capital": "New Delhi", "localizacao_capital": { "latitude": 28.6, "longitude": 77.2 }, "idioma_principal": "Hindi", "moeda": { "nome": "Indian rupee", "simbolo": "₹" }, "pib": "3.17 trilhões USD (2021)", "idh": 0.645, "fundacao": 1947, "ponto_mais_alto_m": 8586
    },
    {
      "id": 9, "cca2": "AU", "codigo_iso_alpha3": "AUS", "nome_comum": "Australia", "nome_oficial": "Commonwealth of Australia", "populacao": 25687041, "area_km2": 7692024, "capital": "Canberra", "localizacao_capital": { "latitude": -35.27, "longitude": 149.13 }, "idioma_principal": "English", "moeda": { "nome": "Australian dollar", "simbolo": "$" }, "pib": "1.54 trilhões USD (2021)", "idh": 0.944, "fundacao": 1901, "ponto_mais_alto_m": 2228
    },
    {
      "id": 10, "cca2": "AR", "codigo_iso_alpha3": "ARG", "nome_comum": "Argentina", "nome_oficial": "Argentine Republic", "populacao": 45376763, "area_km2": 2780400, "capital": "Buenos Aires", "localizacao_capital": { "latitude": -34.58, "longitude": -58.67 }, "idioma_principal": "Spanish", "moeda": { "nome": "Argentine peso", "simbolo": "$" }, "pib": "491.5 bilhões USD (2021)", "idh": 0.845, "fundacao": 1816, "ponto_mais_alto_m": 6961
    }
  ];

  saveCountries(countries);
  console.log("Dados iniciais dos países salvos.");
  return countries;
};

// ========================
// Listagem e formatação
// ========================

// Formata os dados de um único país para exibição em texto
const formatCountry = country => {
  return `
ID: ${country.id} (${country.codigo_iso_alpha3})
País: ${country.nome_comum} (${country.nome_oficial})
Capital: ${country.capital}
População: ${country.populacao.toLocaleString('pt-BR')}
Área: ${country.area_km2.toLocaleString('pt-BR')} km²
Idioma: ${country.idioma_principal}
Moeda: ${country.moeda.nome} (${country.moeda.simbolo})
  `.trim();
};

// **NOVO**: Gera uma tabela HTML com a lista de países
const listCountriesAsTable = countries => {
  // Cabeçalho da tabela
  const headers = `
    <thead>
      <tr>
        <th>Bandeira</th>
        <th>País</th>
        <th>Capital</th>
        <th>População</th>
        <th>Área (km²)</th>
      </tr>
    </thead>
  `;

  // Linhas da tabela, uma para cada país
  const rows = countries.map(country => `
    <tr>
      <td><img class="flag" src="https://flagsapi.com/${country.cca2}/flat/32.png" alt="Bandeira de ${country.nome_comum}"></td>
      <td>${country.nome_comum}</td>
      <td>${country.capital}</td>
      <td>${country.populacao.toLocaleString('pt-BR')}</td>
      <td>${country.area_km2.toLocaleString('pt-BR')}</td>
    </tr>
  `).join('');

  // Retorna a tabela completa
  return `
    <div class="table-container">
      <table>
        ${headers}
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

// Busca um país pelo nome da sua capital
const findCountryByCapital = (countries, capitalName) =>
  countries.find(country => country.capital.toLowerCase() === capitalName.toLowerCase());

// ========================
// Funções para Gráficos
// ========================

const getTop10ByPopulation = (countries) => {
  return [...countries]
    .sort((a, b) => b.populacao - a.populacao)
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
  formatCountry,
  listCountriesAsTable, // Nova função exportada
  findCountryByCapital,
  getTop10ByPopulation
};
