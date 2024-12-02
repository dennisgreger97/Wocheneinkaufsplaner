const form = document.getElementById("rezepteingabe");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const rezeptname = document.getElementById("rezeptname").value;
  const rezeptart = document.getElementById("rezeptart").value;

  console.log(`Rezept hinzugefügt: ${rezeptname}, Rezeptart: ${rezeptart}`);
});
