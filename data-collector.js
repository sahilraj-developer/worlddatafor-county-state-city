import { promises as fs } from 'fs';
import fetch from 'node-fetch';

async function fetchAndStoreData() {
  try {
    const countryResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,subregion');
    const countries = await countryResponse.json();

    const data = await Promise.all(countries.map(async (country) => {
      const states = await fetchStates(country.name.common);
      return {
        country: country.name.common,
        capital: country.capital,
        region: country.region,
        subregion: country.subregion,
        states: states
      };
    }));

    await fs.writeFile('world_data.json', JSON.stringify(data, null, 2)); 
    console.log('Data collected and stored in world_data.json');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
}

async function fetchStates(countryName) {
  const statesEndpoint = `https://restcountries.com/v3.1/name/${countryName}?fields=region`; 
  
  try {
    const statesResponse = await fetch(statesEndpoint);
    const statesData = await statesResponse.json();
    return statesData.map(stateData => stateData.region);
  } catch (error) {
    console.error(`Error fetching states for ${countryName}:`, error);
    return []; 
  }
}

fetchAndStoreData();
