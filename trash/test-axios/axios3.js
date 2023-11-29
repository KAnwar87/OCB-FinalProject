// const {data} = axios.post('http://localhost:3333/kiraShamelin', document.querySelector('#calcKSB'), {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })


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
  
    axios.post('http://localhost:3333/kiraShamelin', formDataJSON)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }