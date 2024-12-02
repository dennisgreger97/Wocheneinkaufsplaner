const form = document.getElementById("rezepteingabe");
const zutatenListe = document.getElementById("zutatenListe");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // verhindert das Neuladen der Seite

  const rezeptname = document.getElementById("rezeptname").value;
  const rezeptart = document.getElementById("rezeptart").value;
  const zutatenAnzahl = document.getElementById("zutatenAnzahl").value;

  const zutaten = []; // Array, um Zutaten und Mengen zu speichern

  // Alle Eingaben für Zutaten auslesen
  for (let i = 0; i < zutatenAnzahl; i++) {
    const zutatName = document.getElementById(`zutat-${i}`).value;
    const menge = document.getElementById(`menge-${i}`).value;
    zutaten.push({ name: zutatName, menge: menge });
  }

  console.log(`Rezept hinzugefügt: ${rezeptname}, Rezeptart: ${rezeptart}`);
  console.log("Zutaten:", zutaten);
});

document.getElementById("zutatenAnzahl").addEventListener("input", function () {
  const anzahl = parseInt(this.value, 10) || 0;

  // Vorherige Zutaten-Eingabefelder löschen
  zutatenListe.innerHTML = "";

  // Neue Eingabefelder erstellen
  for (let i = 0; i < anzahl; i++) {
    const zutatDiv = document.createElement("div");
    zutatDiv.innerHTML = `
      <input type="text" id="zutat-${i}" placeholder="Zutat ${
      i + 1
    }" required />
      <input type="text" id="menge-${i}" placeholder="Menge (z. B. 100g)" required />
    `;
    zutatenListe.appendChild(zutatDiv);
  }
});
