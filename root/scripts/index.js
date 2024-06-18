let searchForm = document.getElementById("search-form");
let speciesInput = document.getElementById("search-input");
let charactersList = document.querySelector(".characters-list");
let pagination = document.querySelector(".pagination");
let currentPage = 1;

function redering(characters) {
  let charactersItems = ``;

  characters.results.forEach((character) => {
    charactersItems += `<li class="characters-item">
        <img class="character__image" src=${character.image} alt="" />
        <h2 class="character__name">${character.name}</h2>
        <ul>
          <li class="property">
            <span class="characteristic">gender:</span> ${character.gender}
          </li>
          <li class="property">
            <span class="characteristic">status:</span> ${character.status}
          </li>
          <li class="property">
            <span class="characteristic">location:</span> ${character.location.name}
          </li>
        </ul>
        <button class="learn-more-button enabled">Learn More...</button>
      </li>`;
  });
  charactersList.innerHTML = charactersItems;
  pagination.innerHTML = `<button class="pagination-button ${
    currentPage !== 1 ? "enabled" : ""
  }" id="prev-button">Previous</button>
  <p>page ${currentPage}</p>        
  <button class="pagination-button ${
    currentPage !== characters.info.pages ? "enabled" : ""
  }" id="next-button">Next</button>`;
}

function dataFetching(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((characters) => {
      redering(characters);

      let nextButton = document.getElementById("next-button");
      let prevButton = document.getElementById("prev-button");

      nextButton.onclick =
        characters.info.next &&
        (() => {
          dataFetching(characters.info.next);
          currentPage++;
        });

      prevButton.onclick =
        characters.info.prev &&
        (() => {
          dataFetching(characters.info.prev);
          currentPage--;
        });
    })
    .catch((error) => {
      charactersList.innerHTML = `<h2>${error}</h2>`;
      pagination.innerHTML = ``;
    });
}

function serializeForm(formNode) {
  let name = formNode.querySelector('[name="name"]'),
    species = formNode.querySelector('[name="species"]'),
    type = formNode.querySelector('[name="type"]'),
    status = formNode.querySelectorAll('[name="status"]'),
    gender = formNode.querySelectorAll('[name="gender"]');

  let data = {
    name: name.value,
    species: species.value,
    type: type.value,
    status: [...status].find((radio) => radio.checked)?.value,
    gender: [...gender].find((radio) => radio.checked)?.value,
  };

  return data;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let searchingParams = serializeForm(searchForm);
  currentPage = 1;
  dataFetching(
    `https://rickandmortyapi.com/api/character/?${
      searchingParams.name ? `name=${searchingParams.name}` : ""
    }${searchingParams.gender ? `&gender=${searchingParams.gender}` : ""}${
      searchingParams.species ? `&species=${searchingParams.species}` : ""
    }${searchingParams.status ? `&status=${searchingParams.status}` : ""}${
      searchingParams.type ? `&type=${searchingParams.type}` : ""
    }`
  );
});
