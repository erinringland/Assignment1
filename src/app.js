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

function chosenStreet(streetID, streetName) {
  fetch(
    `https://api.winnipegtransit.com/v3/stops.json?api-key=BGA5REIJoz3BbXP5CXN4&street=${streetID}&usage=long`
  )
    .then((response) => response.json())
    // .then((stops) => console.log(stops.stops));
    .then((stops) => {
      // stops.stops.map((name) => console.log(name.key));
      let schedule = stops.stops
        .map((name) => name.key)
        .map((route) => {
          return fetch(
            `https://api.winnipegtransit.com/v3/stops/${route}/schedule.json?api-key=BGA5REIJoz3BbXP5CXN4&max-results-per-route=2&usage=long`
          ).then((response) => response.json());
        });
      Promise.all(schedule).then((schedule) => displaySchedule(schedule));
      // Promise.all(schedule).then(schedule => console.log(schedule));
    });
}

function displaySchedule(times) {
  resultsTable.innerHTML = times
    .map(function (item) {
      return `<tr>
      <td>${item.stop - schedule.stop.street.name}</td>
      <td>${item}</td>
      <td>${item}</td>
      <td>${item}</td>
      <td>${item}</td>
      </tr>
      `;
    })
    .join("");
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

searchResults.addEventListener("click", (e) => {
  if (e.target.nodeName === "A") {
    let streetName = e.target.innerHTML;
    let streetID = e.target.dataset.id;
    chosenStreet(streetID, streetName);
  }
});

cleanPage();
