/** 修复 / */
document.addEventListener("keydown", function (e) {
  const focusElement = document.activeElement;
  if (focusElement.id === "wl-edit" && e.key === "/") {
    searchVisible = true;
  } else if (focusElement.id === "search-query" && e.key === "/") {
  } else if (focusElement.id !== "wl-edit" && e.key === "/" && searchVisible) {
    searchVisible = false;
  }
});
