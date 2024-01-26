const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.onmousemove = function (e) {
    const x = e.pageX - card.offsetLeft,
      y = e.pageY - card.offsetTop;

    card.style.setProperty("--x", x + "px");
    card.style.setProperty("--y", y + "px");
  };
});