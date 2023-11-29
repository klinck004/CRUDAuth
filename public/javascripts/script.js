/* Handles error message for delete function */

(function () {
  function Start() {
    console.log("App started");
  }
  window.addEventListener("load", Start);
  console.log("This is running.")
  let deleteButtons = document.querySelectorAll(".btn-danger");
  for (button of deleteButtons) {
    button.addEventListener('click', (event) => {

      if (!confirm("Do you wish to delete this item?")) {
        event.preventDefault();
        window.location.assign("list");
      }
    });
  }
})();
