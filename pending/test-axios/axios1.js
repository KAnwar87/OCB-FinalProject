// import axios from "axios";

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

  axios({
        method: 'post',
        url: 'http://localhost:3333/kiraShamelin',
        data: formDataJSON
      });
  
}

// 

// // Make Axios POST request
// post("http://localhost:3333/kiraShamelin", formDataJSON)
// .then((response) => {
//   console.log("Data submitted successfully:", response.data);
//   res.render("pages/hasilShamelin", kiraShamelin);
//   // Handle the response as needed
// })
// .catch((error) => {
//   console.error("Error submitting data:", error);
//   // Handle errors
// });