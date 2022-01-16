const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

function searchAddressHandler(e: Event) {
  e.preventDefault();
  const enterdAdress = addressInput.value;
}

form?.addEventListener("submit", searchAddressHandler);
