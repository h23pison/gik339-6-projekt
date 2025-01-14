const url = 'http://localhost:3001/countries';

window.addEventListener('load', fetchData);

function continentColor(continent) {
  if (continent === "Africa") return "linear-gradient(to right,hsla(104, 95.20%, 48.80%, 0.48),rgb(243, 212, 42))";
  if (continent === "Asia") return "linear-gradient(to right,rgba(244, 55, 55, 0.76),rgb(248, 157, 0))";
  if (continent === "Europe") return "linear-gradient(to right, #2ebfe2,rgba(51, 197, 56, 0.79))";
  if (continent === "North America") return "linear-gradient(to right,rgb(171, 153, 107),rgba(62, 123, 0, 0.71))";
  if (continent === "South America") return "linear-gradient(to right,rgba(205, 33, 33, 0.72),rgba(15, 62, 0, 0.67))";
  if (continent === "Oceania") return "linear-gradient(to right,rgba(0, 255, 242, 0.78),rgba(57, 67, 255, 0.74))";
  return "gray"; // Default color
}

function continentImage(continent) {
  if (continent === "Africa") return "../images/africa.webp"; // Path to Africa image
  if (continent === "Asia") return "../images/asia.webp"; // Path to Asia image
  if (continent === "Europe") return "../images/europe.webp"; // Path to Europe image
  if (continent === "North America") return "../images/north-america.webp"; // Path to North America image
  if (continent === "South America") return "../images/south-america.webp";
  if (continent === "Oceania") return "../images/oceania.webp"; // Path to Oceania image
  return "../images/world-map.webp"; // Default image
}


function fetchData() {
    fetch(url)
      .then((result) => result.json())
      .then((countries) => {

        const htmlForm = 
        `<div class="card-header">
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

      const countryForm = document.getElementById('countryForm');
      countryForm.innerHTML = '';
      countryForm.insertAdjacentHTML('beforeend', htmlForm);

        if (countries.length > 0) {
          let htmlCard = `<ul class="row list-unstyled">`;
          countries.forEach((country) => {
            const color = continentColor(country.continent);
            const cardImage = continentImage(country.continent);
            htmlCard += `
            <li class="col-sm-12 col-md-6 mb-3 mb-sm-0 col-6 col-xl-4">
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
  
          const listContainer = document.getElementById('listContainer');
          listContainer.innerHTML = '';
          listContainer.insertAdjacentHTML('beforeend', htmlCard);

          countries.forEach(country => {
            const deleteButton = document.getElementById(`deleteButton${country.id}`);
            deleteButton.addEventListener('click', function () {
              const countryId = this.getAttribute('data-id');
              deleteCountry(countryId);
            });
          });


        }
      });
}

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

  async function deleteCountry(id) {

  const confirmed = await createModal(
      `Confirm delete`,
       `Are you sure you want to delete this country?`,
       'Delete'
  );

  if (confirmed) {
      console.log('delete', id);
      await fetch(`${url}/${id}`, { method: 'DELETE' });
      fetchData();
      alert("Landet togs bort!");
  } else {
      console.log('Action canceled');
  }
  
} 

  countryForm.addEventListener('submit', handleSubmit);

  async function handleSubmit(e) {
    e.preventDefault();

    const action = e.submitter.value;
    
    const serverUserObject = {
        country: '',
        capital: '',
        language: '',
        continent: '',
    };
    serverUserObject.country = countryForm.country.value;
    serverUserObject.capital = countryForm.capital.value;
    serverUserObject.language = countryForm.language.value;
    serverUserObject.continent = countryForm.continent.value;

    const id = localStorage.getItem('currentId');

    if (id) {
        serverUserObject.id = id;
    }

    const method = action === 'add' 
        ? 'POST' 
        : action === 'update' && serverUserObject.id 
            ? 'PUT'
            : null; 
            

       const confirmed = await createModal(
        `Confirm ${action}`,
        `Are you sure you want to ${action} this record?`,
        `${action.charAt(0).toUpperCase() + action.slice(1)}`
    );

    if (!confirmed) {
        console.log(`${action} canceled by user.`);
        return;
    }        

 
    const request = new Request(url, {
      method: method,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(serverUserObject)
    });
  
    fetch(request).then((response) => {
      fetchData();
  
      countryForm.reset();
      localStorage.removeItem('currentId');
      
    });
    if (action === 'add') {
      alert("Landet har lagts till")
    }
    if (action === 'update') {
      alert("Landet har uppdaterats")
    }
           
}

function createModal(title, bodyText, buttonText) {
  return new Promise((resolve) => {
      const modal = document.createElement('div');
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
      document.body.appendChild(modal);

      const modalInstance = new bootstrap.Modal(modal.querySelector('.modal'));
      modalInstance.show();

      modal.querySelector('.btn-primary').onclick = () => resolve(false);
      modal.querySelector('.btn-danger').onclick = () => resolve(true);
      modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
  });
}
