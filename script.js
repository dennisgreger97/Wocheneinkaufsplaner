const form = document.getElementById("rezepteingabe");
const zutatenListe = document.getElementById("zutatenListe");
const rezepte = [];
const fruehstueckListe = document.getElementById("fruehstueckListe");
const mittagListe = document.getElementById("mittagListe");
const abendListe = document.getElementById("abendListe");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // verhindert das Neuladen der Seite

  const rezeptname = document.getElementById("rezeptname").value;
  const rezeptart = document.getElementById("rezeptart").value;
  const zutatenAnzahl = document.getElementById("zutatenAnzahl").value;

  const zutaten = []; // Array, um Zutaten und Mengen zu speichern

  // eingaben der zutaten
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
  form.reset();
});

// eventlistener input um auf veränderungen im eingabefeld zu reagieren
document.getElementById("zutatenAnzahl").addEventListener("input", function () {
  const anzahl = parseInt(this.value, 10) || 0;

  // Vorherige Zutaten-Eingabefelder löschen
  zutatenListe.innerHTML = "";

  // funktion zur flexiblen anzeige der zutaten inputs
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

// umsetzung des wochenplaners
const fruehstueckPlaner = document.getElementById("fruehstueckPlaner");
const mittagPlaner = document.getElementById("mittagPlaner");
const abendPlaner = document.getElementById("abendPlaner");
const startButton = document.getElementById("startPlanerButton");
const resetButton = document.getElementById("planReset");
const essenPlaner = document.getElementById("essenPlaner");

// Array zum Speichern der geplanten Mahlzeiten
let wochenplan = [];

// Funktion zur Erstellung eines Formulars für einen Mahlzeitentyp
function createMealPlanner(section, mealType) {
  section.innerHTML = ""; // Leert die Sektion vor dem Hinzufügen

  for (let i = 0; i < 7; i++) {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal-input");
    mealDiv.innerHTML = `
      <select class="${mealType}-select">
        <option value="" disabled selected>Wähle ein Rezept</option>
        ${rezepte
          .filter((rezept) => rezept.art === mealType)
          .map(
            (rezept) => `<option value="${rezept.name}">${rezept.name}</option>`
          )
          .join("")}
      </select>
    `;
    section.appendChild(mealDiv);
  }
}

// Funktion zum Starten des Planers
function initializeMealPlanner() {
  createMealPlanner(fruehstueckPlaner, "Frühstück");
  createMealPlanner(mittagPlaner, "Mittag");
  createMealPlanner(abendPlaner, "Abendessen");

  // Tausche den Start-Button gegen einen Bestätigen-Button
  startButton.style.display = "none";
  const confirmButton = document.createElement("button");
  confirmButton.id = "confirmPlanButton";
  confirmButton.textContent = "Bestätigen";
  essenPlaner.appendChild(confirmButton);

  confirmButton.addEventListener("click", saveMealPlan);
}

// Funktion zum Speichern des Wochenplans
function saveMealPlan() {
  wochenplan = []; // Leert den alten Wochenplan

  // Rezepte aus den Formularen sammeln
  collectMeals(fruehstueckPlaner, "Frühstück");
  collectMeals(mittagPlaner, "Mittag");
  collectMeals(abendPlaner, "Abendessen");

  console.log("Geplanter Wochenplan:", wochenplan);
  alert("Dein Wochenplan wurde gespeichert!");
}

// Hilfsfunktion zum Sammeln der Rezepte
function collectMeals(section, mealType) {
  const mealInputs = section.querySelectorAll(".meal-input");

  mealInputs.forEach((mealInput) => {
    const recipeSelect = mealInput.querySelector(`.${mealType}-select`);

    if (recipeSelect.value) {
      wochenplan.push({
        typ: mealType,
        rezept: recipeSelect.value,
      });
    }
  });
}

// Funktion zum Zurücksetzen des Planers
function resetMealPlanner() {
  fruehstueckPlaner.innerHTML = "";
  mittagPlaner.innerHTML = "";
  abendPlaner.innerHTML = "";
  wochenplan = []; // Wochenplan leeren

  // Falls der Bestätigen-Button existiert, entfernen
  const confirmButton = document.getElementById("confirmPlanButton");
  if (confirmButton) {
    confirmButton.remove();
  }

  // Start-Button wieder anzeigen
  startButton.style.display = "inline-block";
}

// Event-Listener für die Buttons
startButton.addEventListener("click", initializeMealPlanner);
resetButton.addEventListener("click", resetMealPlanner);
