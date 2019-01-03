console.log("JS Running");

function getData() {
  return fetch("/api/temp/all", {
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error;
    });
}
