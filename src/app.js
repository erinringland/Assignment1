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

function chosenStreet(streetID) {
  fetch(
    `https://api.winnipegtransit.com/v3/stops.json?api-key=BGA5REIJoz3BbXP5CXN4&street=${streetID}`
  )
    .then((response) => response.json())
    .then((stops) => {
      let info = stops.stops.map(function (name) {
        return fetch(
          `https://api.winnipegtransit.com/v3/stops/${name.key}/schedule.json?api-key=BGA5REIJoz3BbXP5CXN4&max-results-per-route=2`
        ).then((response) => response.json());
      });
      Promise.all(info).then((info) => {
        for (const items of info) {
          for (const route of items["stop-schedule"]["route-schedules"]) {
            displaySchedule(route, items["stop-schedule"].stop);
          }
        }
      });
    });
}

function displaySchedule(route, info) {
  searchResultTitle.innerHTML = `You are viewing the stops for ${info.street.name}`;

  route["scheduled-stops"].forEach((row) => {
    const date = new Date(row.times.arrival.estimated);
    const newDate = date.toLocaleString().slice(12);
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${info.street.name}</td>
        <td>${info["cross-street"].name}</td>
        <td>${info.direction}</td>
        <td>${route.route.number}</td>
        <td>${newDate}</td>
        </tr>`
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

searchResults.addEventListener("click", (e) => {
  if (e.target.nodeName === "A") {
    let streetID = e.target.dataset.id;
    chosenStreet(streetID);
  }
});

cleanPage();
