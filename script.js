const form1 = document.getElementById("rezepteingabe");
const zutatenListe = document.getElementById("zutatenListe");
const rezepte = [];
const fruehstueckListe = document.getElementById("fruehstueckListe");
const mittagListe = document.getElementById("mittagListe");
const abendListe = document.getElementById("abendListe");

form1.addEventListener("submit", function (e) {
  e.preventDefault(); // verhindert das Neuladen der Seite

  const rezeptname = document.getElementById("rezeptname").value;
  const rezeptart = document.getElementById("rezeptart").value;
  const zutatenAnzahl = document.getElementById("zutatenAnzahl").value;

  const zutaten = []; // Array, um Zutaten und Mengen zu speichern

  // erfassen der zutaten
  for (let i = 0; i < zutatenAnzahl; i++) {
    const zutatName = document.getElementById(`zutat-${i}`).value;
    const menge = document.getElementById(`menge-${i}`).value;
    zutaten.push({ name: zutatName, menge: menge }); //als objekt in das zutaten array pushen
  }

  const rezept = {
    name: rezeptname,
    art: rezeptart,
    zutaten: zutaten,
  };

  rezepte.push(rezept);

  // rezeptuebersicht erstellen
  const liItem = document.createElement("li");
  liItem.textContent = rezeptname;

  if (rezeptart === "Frühstück") {
    fruehstueckListe.appendChild(liItem);
  } else if (rezeptart === "Mittag") {
    mittagListe.appendChild(liItem);
  } else if (rezeptart === "Abendessen") {
    abendListe.appendChild(liItem);
  }

  alert(
    `Dein Rezept "${rezeptname}" wurde erfolgreich der Rezeptesammlung hinzugefügt!`
  );
  form1.reset();
});

// eventlistener input um auf veränderungen im eingabefeld zu reagieren
document.getElementById("zutatenAnzahl").addEventListener("input", function () {
  const anzahl = parseInt(this.value) || 0;

  // vorherige eingabefelder löschen (sonst werden es immer mehr)
  zutatenListe.innerHTML = "";

  // funktion zur flexiblen anzeige der zutaten inputs
  for (let i = 0; i < anzahl; i++) {
    const zutatDiv = document.createElement("div");
    zutatDiv.innerHTML = `
      <input type="text" id="zutat-${i}" placeholder="Zutat ${
      i + 1
    }" required />
      <input type="text" id="menge-${i}" placeholder="Menge (z.B. 100g)" required />
    `;
    zutatenListe.appendChild(zutatDiv);
  }
});

// umsetzung des wochenplaners
