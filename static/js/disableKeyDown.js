const keydownHandler = () => {};
window.removeEventListener("keydown", keydownHandler);

const changeSearchAttr = () => {
  const searchInput = document.getElementById("search-query");

  searchInput.setAttribute("autocomplete", "off");
};

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", function (e) {
    if (e.key === "/") {
      hideSearch();
      if (!searchVisible) {
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      hideSearch();
    } else if (e.key === "ArrowDown" && searchVisible && hasResults) {
      e.preventDefault();
      if (document.activeElement === input) {
        first.focus();
      } else if (document.activeElement === last) {
        last.focus();
      } else {
        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
      }
    } else if (e.key === "ArrowUp" && searchVisible && hasResults) {
      e.preventDefault();
      if (document.activeElement === input) {
        input.focus();
      } else if (document.activeElement === first) {
        input.focus();
      } else {
        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
      }
    }
  });
  changeSearchAttr();
});
