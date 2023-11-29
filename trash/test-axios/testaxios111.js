// const {data} = axios.post('http://localhost:3333/kiraShamelin', document.querySelector('#calcKSB'), {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })




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

    const nama = document.getElementById("nama").value;
    const noKP = document.getElementById("noKP").value;
    const gajiElaunTetap = document.getElementById("gajiElaunTetap").value;
    const potonganPayslip = document.getElementById("potonganPayslip").value;
    const peratusPotonganDibenarkan = document.getElementById(
        "peratusPotonganDibenarkan"
      ).value;
    const umurPencen = document.getElementById("umurPencen").value;

    axios.post("http://localhost:3333/test", { nama : nama, noKP : noKP, gajiElaunTetap : gajiElaunTetap, potonganPayslip : potonganPayslip, peratusPotonganDibenarkan : peratusPotonganDibenarkan, umurPencen : umurPencen}).then(function (response) {
        console.log(response)
        // do whatever you want if console is [object object] then stringify the response
    })
}