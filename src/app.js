const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const searchResults = document.querySelector(".streets");
const searchResultTitle = document.getElementById("street-name");
const resultsTable = document.querySelector("tbody");

function cleanPage() {
  searchResults.innerHTML = ``;
  searchResultTitle.innerHTML = `Please enter a street name!`;
  resultsTable.innerHTML = ``;
}

function getStreet(street) {
  fetch(
    `https://api.winnipegtransit.com/v3/streets.json?api-key=BGA5REIJoz3BbXP5CXN4&name=${street}&usage=long`
  )
    .then((response) => response.json())
    .then((street) => {
      street.streets.map((name) => {
        searchResults.insertAdjacentHTML(
          "beforeend",
          `<a href="#">${name.name}</a>`
        );
        console.log(name.name);
      });
    });
  // .then(street => console.log(street.streets));
}

getStreet();

// function showStreet(street){
//   street.map(name => {
//     searchResults.insertAdjacentHTML('beforeend',
//     `<a href="#">${name.name}</a>`);
//     // console.log(name.name);
//   })
// }

function search(e) {
  e.preventDefault();
  if (e.target.nodeName === "FORM") {
    getStreet(searchInput.value);
    searchInput.value = "";

    // if (searchInput.value === "") {
    //   searchResults.innerHTML = "<p>Please enter a street name!</p>";
    // }
  }
}

searchForm.addEventListener("submit", search);

cleanPage();
