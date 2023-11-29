
  // function submitForm() {
  //   // Get form data
  //   const nama = document.getElementById("nama").value;
  //   const noKP = document.getElementById("noKP").value;
  //   const gajiElaunTetap = document.getElementById("gajiElaunTetap").value;
  //   const potonganPayslip = document.getElementById("potonganPayslip").value;
  //   const peratusPotonganDibenarkan = document.getElementById(
  //       "peratusPotonganDibenarkan"
  //     ).value;
  //   const umurPencen = document.getElementById("umurPencen").value;

  //   const reqBody = { nama : nama, noKP : noKP, gajiElaunTetap : gajiElaunTetap, potonganPayslip : potonganPayslip, peratusPotonganDibenarkan : peratusPotonganDibenarkan, umurPencen : umurPencen};
  
  //   // const formDataJSON = JSON.stringify(formData);

  //   try {
  //     const res = axios.post('http://localhost:3333/test', reqBody);
  //     console.log(res);
  //   } catch (error) {
  //     console.error(error);
  //   }

  // }


  function handleRequest() {
    e.preventDefault()
    const nama = e.target[0].value;
    const noKP = e.target[1].value;
    const gajiElaunTetap = e.target[2].value;
    const potonganPayslip = e.target[3].value;
    const peratusPotonganDibenarkan = e.target[4].value;
    const umurPencen = e.target[5].value;

    axios.post("http://localhost:3333/test", { nama : nama, noKP : noKP, gajiElaunTetap : gajiElaunTetap, potonganPayslip : potonganPayslip, peratusPotonganDibenarkan : peratusPotonganDibenarkan, umurPencen : umurPencen}).then(function (response) {
        console.log(response)
        // do whatever you want if console is [object object] then stringify the response
    })
}

// function handleRequest(event) {
//   event.preventDefault();
//   console.dir(typeof event.target);
// }