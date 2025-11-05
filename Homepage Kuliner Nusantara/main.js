document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("popular-grid");

  fetch("popular.json")
    .then(res => res.json())
    .then(data => {
      grid.innerHTML = data.map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.name}">
          <div class="card-body">
            <h4>${item.name}</h4>
            <p><b>${item.region}</b></p>
            <small>${item.desc}</small>
          </div>
        </div>
      `).join('');
    });
});
