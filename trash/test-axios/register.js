function submitForm() {
  // Get form data
  const formData = {
    nama: document.getElementById("nama").value,
    noKP: document.getElementById("noKP").value,
    gajiElaunTetap: document.getElementById("gajiElaunTetap").value,
    potonganPayslip: document.getElementById("potonganPayslip").value,
    peratusPotonganDibenarkan: document.getElementById(
      "peratusPotonganDibenarkan"
    ).value,
    umurPencen: document.getElementById("umurPencen").value,
  };

  const formDataJSON = JSON.stringify(formData);

  axios
    .post("http://localhost:3333/api-register", formDataJSON)
    .then((response) => {
      console.log("response.data", typeof response.data, response.data);
      // console.log("Huhuhu");
    })
    .catch((error) => {
      console.error(error);
    });
}

// function submitForm() {
//   // Get form data
//   const form = document.getElementById("registerForm");
//   const formData = new FormData(form);

//   // Convert FormData to JSON
//   const jsonData = {};
//   formData.forEach((value, key) => {
//     jsonData[key] = value;
//   });

//   // Send data as JSON to the "/api-register" endpoint
//   fetch("/api-register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(jsonData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Handle the response data as needed
//       console.log(data);
//     })
//     .catch((error) => {
//       // Handle errors
//       console.error("Error:", error);
//     });
// }

// function resetForm() {
//   // Reset form logic here
//   // ...
//}
