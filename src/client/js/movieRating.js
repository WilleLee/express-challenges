const ratingColored = document.getElementById("ratingColored");

const rating = Number(ratingColored.dataset.id);
const width = `${(rating / 5) * 100}%`;

ratingColored.style.width = width;
