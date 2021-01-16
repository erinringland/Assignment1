const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const searchResults = document.querySelector(".streets");
const searchResultTitle = document.getElementById("street-name");
const resultsTable = document.querySelector(".main");
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
  resultsTable.innerHTML = "";

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
    .then((stops) => stopsLogic(stops.stops));
}

function stopsLogic(stops) {
  let primaryDir, secondaryDir;
  let northDir = stops.filter((north) => north.direction === "Northbound");
  let southDir = stops.filter((south) => south.direction === "Southbound");
  let westDir = stops.filter((west) => west.direction === "Westbound");
  let eastDir = stops.filter((east) => east.direction === "Eastbound");

  if (westDir.length) {
    primaryDir = westDir;
  }

  if (eastDir.length) {
    secondaryDir = eastDir;
  }

  if (northDir.length) {
    primaryDir = northDir;
  }

  if (southDir.length) {
    secondaryDir = southDir;
  }

  displayStreetStops(primaryDir, secondaryDir);
}

function displayStreetStops(primaryDir, secondaryDir) {
  searchResultTitle.innerHTML = `You are viewing stops on ${primaryDir[0].street.name}. Please select a stop and view the upcoming buses!`;
  resultsTable.innerHTML = "";

  primaryDir.forEach((stop) => {
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td>${stop.name}</td>
      <td><a href="#" data-id="${stop.key}">${stop.key}</td>
      <td>${stop.direction}</td>
    </tr>`
    );
  });

  secondaryDir.forEach((stop) => {
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td>${stop.name}</td>
      <td><a href="#" data-id="${stop.key}">${stop.key}</td>
      <td>${stop.direction}</td>
    </tr>`
    );
  });
}

function search(e) {
  e.preventDefault();
  if (e.target.nodeName === "FORM") {
    getStreet(searchInput.value);

    searchInput.value = "";
    resultsTable.innerHTML = "";

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
