const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const searchResults = document.querySelector(".streets");

function search(e) {
  e.preventDefault();
  if (e.target.nodeName === "FORM") {
    let searchTerm = searchInput.value;
    console.log(searchTerm);
    if (searchInput.value === "") {
      searchResults.innerHTML = "<p>Please enter a street name!</p>";
    }
    searchInput.value = "";
  }
}

searchForm.addEventListener("submit", search);
