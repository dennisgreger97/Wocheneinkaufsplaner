const form1 = document.getElementById("rezepteingabe");
const zutatenListe = document.getElementById("zutatenListe");
const rezepte = [];

const fruehstueckListe = document.getElementById("fruehstueckListe");
const mittagListe = document.getElementById("mittagListe");
const abendListe = document.getElementById("abendListe");

//
function saveRezepteToLocalStorage() {
  localStorage.setItem("rezepte", JSON.stringify(rezepte)); // Rezepte als JSON-String speichern
}
//

form1.addEventListener("submit", function (e) {
  e.preventDefault(); // verhindert das Neuladen der Seite

  const rezeptname = document.getElementById("rezeptname").value;
  const rezeptart = document.getElementById("rezeptart").value;
  const zutatenAnzahl = document.getElementById("zutatenAnzahl").value;

  const zutaten = []; // für zutat und menge

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

  //
  saveRezepteToLocalStorage();
  //

  // rezeptuebersicht erstellen
  const liItem = document.createElement("li");
  liItem.textContent = rezeptname;

  if (rezeptart === "Frühstück") {
    fruehstueckListe.appendChild(liItem);
    updateDropdowns(fruehstueckListe, "select[name='fruehstueck[]']");
  } else if (rezeptart === "Mittag") {
    mittagListe.appendChild(liItem);
    updateDropdowns(mittagListe, "select[name='mittag[]']");
  } else if (rezeptart === "Abendessen") {
    abendListe.appendChild(liItem);
    updateDropdowns(abendListe, "select[name='abendessen[]']");
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

//dropdowns akutalisieren
function updateDropdowns(liste, dropdownSelector) {
  const dropdowns = document.querySelectorAll(dropdownSelector);
  dropdowns.forEach((dropdown) => {
    dropdown.innerHTML = "<option value=''>Bitte wähle:</option>";

    liste.querySelectorAll("li").forEach((li) => {
      const option = document.createElement("option");
      option.value = li.textContent;
      option.textContent = li.textContent;
      dropdown.appendChild(option);
    });
  });
}

// wochenplan speichern
const wochenplanForm = document.getElementById("wochenplanForm");
const wochenplan = {
  fruehstueck: [],
  mittag: [],
  abendessen: [],
};

wochenplanForm.addEventListener("submit", function (e) {
  e.preventDefault();

  //erfassen der ausgewählten zepten
  const fruehstueckAuswahl = document.querySelectorAll(
    "select[name='fruehstueck[]']"
  );
  const mittagAuswahl = document.querySelectorAll("select[name='mittag[]']");
  const abendessenAuswahl = document.querySelectorAll(
    "select[name='abendessen[]']"
  );

  //dann speichern im objekt wochenplan
  wochenplan.fruehstueck = Array.from(fruehstueckAuswahl).map(
    (select) => select.value
  );
  wochenplan.mittag = Array.from(mittagAuswahl).map((select) => select.value);
  wochenplan.abendessen = Array.from(abendessenAuswahl).map(
    (select) => select.value
  );

  console.log("Wochenplan gespeichert:", wochenplan);
  console.log(rezepte);

  createShoppingList(wochenplan);

  alert("Wochenplan erfolgreich gespeichert!");
});

// speichern der zutaten

function createShoppingList(wochenplan) {
  const einkaufslisteElement = document.getElementById("einkaufsliste");
  einkaufslisteElement.innerHTML = ""; // Einkaufslisteninhalt leeren

  const shoppingList = [];

  // Funktion zur Hinzufügung von Zutaten in die Einkaufsliste
  function addIngredientsFromRecipe(recipeName) {
    const recipe = rezepte.find((r) => r.name === recipeName);
    if (recipe) {
      recipe.zutaten.forEach((zutat) => {
        // Zutaten in Einkaufsliste aufnehmen
        const existing = shoppingList.find((item) => item.name === zutat.name);
        if (existing) {
          existing.count++; // Häufigkeit erhöhen, falls die Zutat schon existiert
        } else {
          shoppingList.push({ name: zutat.name, count: 1, menge: zutat.menge });
        }
      });
    }
  }

  // Zutaten für alle Rezepte im Wochenplan sammeln
  wochenplan.fruehstueck.forEach(addIngredientsFromRecipe);
  wochenplan.mittag.forEach(addIngredientsFromRecipe);
  wochenplan.abendessen.forEach(addIngredientsFromRecipe);

  // Einkaufsliste im HTML ausgeben
  shoppingList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.count} x ${item.menge} ${item.name}`;
    einkaufslisteElement.appendChild(li);
  });
}

//localStorage

// Rezepte aus localStorage laden
function loadRezepteFromLocalStorage() {
  const storedRezepte = localStorage.getItem("rezepte");
  if (storedRezepte) {
    rezepte.push(...JSON.parse(storedRezepte)); // Rezepte aus localStorage in das Array einfügen
  }
}

// Funktion zum Anzeigen der geladenen Rezepte
function displayRezepte() {
  rezepte.forEach((rezept) => {
    const liItem = document.createElement("li");
    liItem.textContent = rezept.name;

    if (rezept.art === "Frühstück") {
      fruehstueckListe.appendChild(liItem);
      updateDropdowns(fruehstueckListe, "select[name='fruehstueck[]']");
    } else if (rezept.art === "Mittag") {
      mittagListe.appendChild(liItem);
      updateDropdowns(mittagListe, "select[name='mittag[]']");
    } else if (rezept.art === "Abendessen") {
      abendListe.appendChild(liItem);
      updateDropdowns(abendListe, "select[name='abendessen[]']");
    }
  });
}

// Beim Laden der Seite
window.addEventListener("load", function () {
  loadRezepteFromLocalStorage(); // Rezepte laden
  displayRezepte(); // Rezepte anzeigen
});
