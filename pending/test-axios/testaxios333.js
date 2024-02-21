
// function handleRequest() {
//     const {data} = axios.post('http://localhost:3333/kiraShamelin', document.querySelector('#calcKSB'), {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
    
//   }

  function handleRequest() {
    const nama = document.getElementById("nama").value;
    const noKP = document.getElementById("noKP").value;
    const gajiElaunTetap = document.getElementById("gajiElaunTetap").value;
    const potonganPayslip = document.getElementById("potonganPayslip").value;
    const peratusPotonganDibenarkan = document.getElementById(
        "peratusPotonganDibenarkan"
      ).value;
    const umurPencen = document.getElementById("umurPencen").value;

    axios({
    method: 'post',
    url: 'http://localhost:3333/kiraShamelin',
    data: { nama : nama, noKP : noKP, gajiElaunTetap : gajiElaunTetap, potonganPayslip : potonganPayslip, peratusPotonganDibenarkan : peratusPotonganDibenarkan, umurPencen : umurPencen}
  });
  }
  