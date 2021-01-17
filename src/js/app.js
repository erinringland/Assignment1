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

function search(e) {
  e.preventDefault();
  if (e.target.nodeName === "FORM") {
    if (searchInput.value === "") {
      searchResults.innerHTML = "<p>Please enter a street name!</p>";
    } else {
      getStreet(searchInput.value);
    }

    searchInput.value = "";
    resultsTable.innerHTML = "";
  }
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

  if (primaryDir === undefined) {
    noBuses();
  } else {
    displayStreetStops(primaryDir, secondaryDir);
  }
}

function noBuses() {
  searchResultTitle.innerHTML = `There are no bus stops! Please pick another street.`;
}

function displayStreetStops(primaryDir, secondaryDir) {
  searchResultTitle.innerHTML = `You are viewing stops on ${primaryDir[0].street.name}. Please select a stop and view the upcoming buses!`;
  resultsTable.innerHTML = "";

  primaryDir.forEach((stop) => {
    let streetName = stop.name;
    let stopName = streetName.substr(streetName.indexOf(" ") + 1);
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td>${stopName}</td>
      <td></td>
      <td>${stop.direction}</td>
      <td><a href="#" data-id="${stop.key}">${stop.key}</td>
      <td></td>
    </tr>`
    );
  });

  secondaryDir.forEach((stop) => {
    let streetName = stop.name;
    let stopName = streetName.substr(streetName.indexOf(" ") + 1);
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td>${stopName}</td>
      <td></td>
      <td>${stop.direction}</td>
      <td><a href="#" data-id="${stop.key}">${stop.key}</td>
      <td></td>
    </tr>`
    );
  });
}

function chosenStop(stopID) {
  fetch(
    `https://api.winnipegtransit.com/v3/stops/${stopID}/schedule.json?api-key=BGA5REIJoz3BbXP5CXN4`
  )
    .then((response) => response.json())
    .then((stop) => stopScheduleLogic(stop["stop-schedule"]));
}

function stopScheduleLogic(stop) {
  let streetArr = [{ Name: stop.stop.name, Key: stop.stop.key }];
  let busArr = [];

  for (let element of stop["route-schedules"]) {
    for (let item of element["scheduled-stops"]) {
      let crossStreet = stop.stop["cross-street"].name;
      let direction = stop.stop.direction;

      let date = new Date(item.times.arrival.scheduled);

      let busName = item.variant.name;

      let key = item.variant.key;
      busKeyArr = key.split("-", 1);
      let busKey = busKeyArr.toString();

      busArr.push({
        time: date,
        bus: busName,
        key: busKey,
        direction: direction,
        crossstreet: crossStreet,
      });
    }
  }

  busArr.sort(function (a, b) {
    return new Date(a.time) - new Date(b.time);
  });

  displayStopSchedule(busArr, streetArr);
}

function displayStopSchedule(stopTimes, streetInfo) {
  searchResultTitle.innerHTML = `You are viewing the schedule for Stop #${streetInfo[0].Key} ${streetInfo[0].Name}`;
  resultsTable.innerHTML = "";

  stopTimes.forEach((bus) => {
    resultsTable.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td>${bus.bus}</td>
      <td>${bus.crossstreet}</td>
      <td>${bus.direction}</td>
      <td>${bus.key}</td>
      <td>${bus.time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}</td>
    </tr>`
    );
  });
}

searchForm.addEventListener("submit", search);

searchResults.addEventListener("click", (e) => {
  if (e.target.nodeName === "A") {
    let streetID = e.target.dataset.id;
    chosenStreet(streetID);
  }
});

resultsTable.addEventListener("click", function (e) {
  if (e.target.nodeName === "A") {
    let stopID = e.target.dataset.id;
    chosenStop(stopID);
  }
});

cleanPage();
