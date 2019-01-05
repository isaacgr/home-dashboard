console.log("JS Running");

function getData() {
  return fetch("/api/temp/all?limit=216", {
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
