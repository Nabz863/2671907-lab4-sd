document.addEventListener("DOMContentLoaded", function() {
const btnSubmit = document.getElementById("btn");
const txtInput = document.getElementById("txt");
const secInfo = document.getElementById("country-info");
const secBorder = document.getElementById("bordering-countries");

btnSubmit.addEventListener("click", async function(event) {
    event.preventDefault();
    const strName = txtInput.value.trim();
    if (!strName) {
        displayError("Please enter a country name.");
        return;
    }
    try {
        const datCntryData = await fetchCntryData(strName);
        if (!datCntryData) {
            displayError("Country not found.");
            return;
        }
        const neighbours = await fetchNbrData(datCntryData.borders || []);
        updateDOM(datCntryData, neighbours);
    } catch(error) {
        displayError("Error");
        console.error(error);
    }
});

async function fetchCntryData(country) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
    if (!response.ok) throw new Error("Country not found.");
    const datData = await response.json();
    return datData[0];
}

async function fetchNbrData(borderCodes) {
    if (!borderCodes.length) return [];
    const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`);
    if (!response.ok) throw new Error("Bordering countries not found.");
    return await response.json();
}

function updateDOM(countryData, neighbours) {
    secInfo.innerHTML = `
                        <ul>
                         <li>Capital: ${countryData.capital ? countryData.capital[0] : "N/A"}</li>
                         <li>Population: ${countryData.population.toLocaleString()}</li>
                         <li>Region: ${countryData.region}</li>
                         <li>Flag:<br>
                         <img src="${countryData.flags.svg}" alt="${countryData.name.common}" width="150"></li>
                        </ul>
                         `;
                         if (neighbours.length === 0) {
                            secBorder.innerHTML = `<p>No bordering countries.</p>`;
                            return;
                         }
    secBorder.innerHTML = `
                        <ul>
                            <li>Bordering Countries:
                            ${neighbours.map(neighbour=> `
                                <ul>
                                    <li>${neighbour.name.common}<br>
                                    <img src="${neighbour.flags.svg}" alt="Flag of ${neighbour.name.common}" width="50"></li>
                                </ul>
                                `).join("")}
                        </ul>
                        `;  
}

function displayError(message) {
    secInfo.innerHTML = `<p class="error">   ${message}<br></p>`;
    secBorder.innerHTML = "";
}

});