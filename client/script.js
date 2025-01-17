const url = 'http://localhost:3001/countries';

window.addEventListener('load', fetchData);

// If sats som retunerar bilder på respektive kontinenter baserat på innehållet i databasen.
function continentImage(continent) {
  if (continent === 'Africa') return '../images/africa.webp';
  if (continent === 'Asia') return '../images/asia.webp';
  if (continent === 'Europe') return '../images/europe.webp';
  if (continent === 'North America') return '../images/north-america.webp';
  if (continent === 'South America') return '../images/south-america.webp';
  if (continent === 'Oceania') return '../images/oceania.webp';
  return '../images/world-map.webp'; //
  // Bild tagen från https://pixabay.com/vectors/world-map-asia-black-continents-153509/ fri för användning.
}

/* Funktion som hämtar data från servern, hanterar även skapandet av HTML för formuläret och
 länderna som finns i databasen: */
function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((countries) => {
      /* HTML-strukturen för formuläret som användaren använder för att lägga till eller uppdatera länder: */
      const htmlForm =` 
      <div class="card-header">
        Countries
        </div>
            <div class="card-body row gap-3">
              <label for="country">Country</label>
              <input class="form-control" type="text" placeholder="..." aria-label="default input example" name="country"/>
              <label for="capital">Capital city</label>
              <input class="form-control" type="text" placeholder="..." aria-label="default input example" name="capital"/>
              <label for="language">Language</label>
              <input class="form-control" type="text" placeholder="..." aria-label="default input example" name="language"/>
              <select class="form-select" id="inputGroupSelect01" name="continent">
                  <option selected>Choose a continent</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Oceania">Oceania</option>
                  <option value="Africa">Africa</option>
                </select>
              <div class="flex">
                  <button class="btn btn-primary" id="addButton" name="action" value="add">Add</button>
                  <button class="btn btn-primary" name="action" value="update">Update</button>
              </div>
            </div>`;
      /* Infogar formuläret i HTML m.h.a. div:ens id: */
      const countryForm = document.getElementById('countryForm');
      countryForm.innerHTML = '';
      countryForm.insertAdjacentHTML('beforeend', htmlForm);
      /* Skapar en lista med kort för varje land som finns i tabellen countries: */
      if (countries.length > 0) {
        let htmlCard = `<ul class="row list-unstyled">`;
        countries.forEach((country) => {
          const color ='linear-gradient(to right,rgb(255, 255, 255),rgba(146, 246, 255, 0.74))';
          const cardImage = continentImage(country.continent);
          htmlCard += `
          <li class="col-sm-12 col-md-12 mb-3 mb-sm-0 col-xl-6 col-xxl-4">
            <div class="card">
                <div class="card-body grid-container" style="background: ${color};">
                    <div class="text-section">
                        <h5 class="card-title">${country.country}</h5>
                        <p class="card-text">Capital: ${country.capital}</p>
                        <p class="card-text">Language: ${country.language}</p>
                        <p class="card-text">Continent: ${country.continent}</p>
                        <button class="btn btn-primary" onclick="setCurrentCountry(${country.id})">Change</button>
                        <button class="btn btn-danger" id="deleteButton" data-id="${country.id}">Delete</button>
                    </div>
                    <div class="image-container">
                        <img href="https://pixabay.com/vectors/world-map-asia-black-continents-153509/" src="${cardImage}" alt="Country Image">
                    </div>
                </div>
            </div>
          </li>`;
        });
        htmlCard += `</ul>`;
        /* Infogar länderna(korten) till div:en med id:t listContainer */
        const listContainer = document.getElementById('listContainer');
        listContainer.innerHTML = '';
        listContainer.insertAdjacentHTML('beforeend', htmlCard);
      }
    });
}

// Funktion som skapar en modalruta med tre parametrar.
// Definierar ett promise för att ge användaren ett val att bekräfta sina handlingar
function createModal(title, bodyText, buttonText) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    // Modal ruta från bootstrap
    modal.innerHTML = `
          <div class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">${title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <p>${bodyText}</p>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                  <button class="btn btn-danger">${buttonText}</button>
                </div>
              </div>
            </div>
          </div>`;
    // Lägger till modalrutan i DOM-trädet
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal.querySelector('.modal'));
    modalInstance.show();

    // Sätter knapparna till resolve true/false, rensar sedan bort modalrutan
    modal.querySelector('.btn-primary').onclick = () => resolve(false);
    modal.querySelector('.btn-danger').onclick = () => resolve(true);
    modal
      .querySelector('.modal')
      .addEventListener('hidden.bs.modal', () => modal.remove());
  });
}

// Lägger till en eventlyssnare för deleteknappen som lysnnar efter klick.
// En kontroll sker om elementet är 'deleteButton'.
// Hämtar id från elementet och anropar deleteCountry funktionen.
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'deleteButton') {
    const id = e.target.getAttribute('data-id');
    if (id) {
      deleteCountry(id);
    } else {
      console.error('error 404 no id found');
    }
  }
});

// Asynkron funktion för att ta bort resurs baserat på id
// Skapar en modalruta med passande text för handlingen.
async function deleteCountry(id) {
  const confirmed = await createModal(
    `Confirm delete`,
    `Are you sure you want to delete this country?`,
    'Delete'
  );

  // Genom await väntar funktionen på att användaren ska göra ett val.
  // Om handlingen bekräftas körs fetch som skickar en DELETE förfrågan baserat på url och id.
  if (confirmed) {
    console.log('delete', id);
    await fetch(`${url}/${id}`, { method: 'DELETE' });
    fetchData();
    alert('Landet togs bort!');
  } else {
    console.log('Handlingen avbryts');
  }
}

/*funktionen setCurrCountry, använder sig av fetch för att skicka en get förfrågan för att få information om ett land
baserat på ID. Efter konvertering av svar från server uppdateras countryForm fälten med information om 
landet. Det hämtade landet(ID) sparas även i localstorage
 Console log används för debugging i funktionen
*/
function setCurrentCountry(id) {
  console.log('current', id);

  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((country) => {
      console.log(country);
      countryForm.country.value = country.country;
      countryForm.capital.value = country.capital;
      countryForm.language.value = country.language;
      countryForm.continent.value = country.continent;

      localStorage.setItem('currentId', country.id);
    });
}

countryForm.addEventListener('submit', handleSubmit);

// Funktion för att hantera knapptryck på add eller update
async function handleSubmit(e) {
  e.preventDefault(); // Tar bort standardbeteende
  const action = e.submitter.value; // Hämtar "action" typ, add eller update

  // Skapa ett objekt som håller datan
  const serverUserObject = {
    country: '',
    capital: '',
    language: '',
    continent: '',
  };
  // Tilldelar värdena från countryForm till serverUserObject
  serverUserObject.country = countryForm.country.value;
  serverUserObject.capital = countryForm.capital.value;
  serverUserObject.language = countryForm.language.value;
  serverUserObject.continent = countryForm.continent.value;

  // Hämta nuvarande id från local storage, om den finns
  const id = localStorage.getItem('currentId');

  if (id) {
    serverUserObject.id = id;
  }
  // Väljer metod baserat på action
  const method =
    action === 'add'
      ? 'POST' // Post för att lägga till
      : action === 'update' && serverUserObject.id
      ? 'PUT' // Put för uppdatering
      : null;

  // Visar en modal ruta för att bekräfta den knapp man tryckte.
  const confirmed = await createModal(
    `Confirm ${action}`,
    `Are you sure you want to ${action} this record?`,
    `${action.charAt(0).toUpperCase() + action.slice(1)}`
  );
  // Om inte bekräftad så görs en console log som säger att
  // användaren avbröt.
  if (!confirmed) {
    console.log(`${action} canceled by user.`);
    return;
  }
  // Skapa en objekt förfrågan för att skicka data till servern
  const request = new Request(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(serverUserObject),
  });
  // Skicka en förfrågan till servern
  fetch(request).then((response) => {
    fetchData();

    countryForm.reset(); // återställ formulärfälten
    localStorage.removeItem('currentId'); // Ta bort current id från localStorage
    // Visa att ett land har lagts till
  });
  if (action === 'add') {
    alert('Landet har lagts till');
  }
  if (action === 'update') {
    alert('Landet har uppdaterats');
  }
}
