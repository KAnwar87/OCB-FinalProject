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

  // Make Axios POST request
  axios({
    method: "post",
    url: "http://localhost:3333/kiraShamelin",
    data: formData,
  });
}
