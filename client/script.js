const url = 'http://localhost:3001/countries';

window.addEventListener('load', fetchData);

function fetchData() {
    fetch(url)
      .then((result) => result.json())
      .then((countries) => {
        if (countries.length > 0) {
          let html = `<ul class="row list-unstyled">`;
          countries.forEach((country) => {
            html += `
            <li class="col-sm-6 mb-3 mb-sm-0 col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${country.country}</h5>
                        <p class="card-text">Capital: ${country.capital}</p>
                        <p class="card-text">Language: ${country.language}</p>
                        <p class="card-text">Continent: ${country.continent}</p>
                        <button class="btn btn-primary" onclick="setCurrentCountry(${country.id})">Change</button>
                        <button class="btn btn-danger" onclick="deleteCountry(${country.id})">Delete</button>
                    </div>
                 </div>
            </li>`;
          });
          html += `</ul>`;
  
          const listContainer = document.getElementById('listContainer');
          listContainer.innerHTML = '';
          listContainer.insertAdjacentHTML('beforeend', html);
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
  
  function deleteCountry(id) {
    console.log('delete', id);
    fetch(`${url}/${id}`, { method: 'DELETE' }).then((result) => fetchData());
  }
  
  countryForm.addEventListener('submit', handleSubmit);
  
  function handleSubmit(e) {
    e.preventDefault();
    const serverUserObject = {
        country: '',
        capital: '',
        language: '',
        continent: ''
    };
    serverUserObject.country = countryForm.country.value;
    serverUserObject.capital = countryForm.capital.value;
    serverUserObject.language = countryForm.language.value;
    serverUserObject.continent = countryForm.continent.value;
  
    const request = new Request(url, {
      method: serverUserObject.id ? 'PUT' : 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(serverUserObject)
    });
  
    fetch(request).then((response) => {
      fetchData();
  
      countryForm.reset();
    });
}

    updateButton.addEventListener('button', handleUpdate);
  
    function handleUpdate(e) {
        e.preventDefault();
        if (serverUserObject.id = id) {
        const serverUserObject = {
            country: '',
            capital: '',
            language: '',
            continent: ''
    
    };
    serverUserObject.country = countryForm.country.value;
    serverUserObject.capital = countryForm.capital.value;
    serverUserObject.language = countryForm.language.value;
    serverUserObject.continent = countryForm.continent.value;
  
    const id = localStorage.getItem('currentId');
    if (id) {
        serverUserObject.id = id;
    }

    const request = new Request(url, {
      method: serverUserObject.id ? 'PUT' : 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(serverUserObject)
    });
  
    fetch(request).then((response) => {
      fetchData();
  
      countryForm.reset();
    });
} else {
    alert("Kuken står");
}}