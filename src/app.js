const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const searchResults = document.querySelector(".streets");
const searchResultTitle = document.getElementById("street-name");
const resultsTable = document.querySelector("tbody");
const resultLink = document.querySelectorAll("a");

function cleanPage() {
  searchResults.innerHTML = "";
  searchResultTitle.innerHTML = "Please enter and select a street name!";
  resultsTable.innerHTML = "";
}

function getStreet(street) {
  fetch(
    `https://api.winnipegtransit.com/v3/streets.json?api-key=BGA5REIJoz3BbXP5CXN4&name=${street}&usage=long`
  )
    .then((response) => response.json())
    .then((street) => displaySearch(street.streets));
}

function displaySearch(street) {
  searchResults.innerHTML = "";

  if (Object.keys(street).length === 0) {
    searchResults.innerHTML = "<p>No results for that street!</p>";
  }

  street.map((name) => {
    searchResults.insertAdjacentHTML(
      "beforeend",
      `<a href="#" data-id="${name.key}">${name.name}</a>`
    );
  });
}

function search(e) {
  e.preventDefault();
  if (e.target.nodeName === "FORM") {
    getStreet(searchInput.value);

    searchInput.value = "";

    if (searchInput.value === "") {
      searchResults.innerHTML = "<p>Please enter a street name!</p>";
    }
  }
}

searchForm.addEventListener("submit", search);

searchResults.addEventListener("click",  e => {
  if(e.target.nodeName === "A"){
    let streetName = e.target.innerHTML;
    let streetID = e.target.dataset.id;
    console.log(streetID, streetName)
  }
})

cleanPage();
