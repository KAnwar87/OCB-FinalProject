

function submitForm() {
    // Get form data
    const formData = {
        nama: document.getElementById('nama').value,
        noKP: document.getElementById('noKP').value,
        gajiElaunTetap: document.getElementById('gajiElaunTetap').value,
        potonganPayslip: document.getElementById('potonganPayslip').value,
        peratusPotonganDibenarkan: document.getElementById('peratusPotonganDibenarkan').value,
        umurPencen: document.getElementById('umurPencen').value,
    };

    // Make Axios POST request
    post('http://localhost:3333/kira', formData)
        .then(response => {
            console.log('Data submitted successfully:', response.data);
            // Handle the response as needed
        })
        .catch(error => {
            console.error('Error submitting data:', error);
            // Handle errors
        });
}


// axios({
//     method: 'post',
//     url: '/calc',
//     data: {
//         nama: document.getElementById('nama').value,
//         noKP: document.getElementById('noKP').value,
//         gajiElaunTetap: document.getElementById('gajiElaunTetap').value,
//         potonganPayslip: document.getElementById('potonganPayslip').value,
//         peratusPotonganDibenarkan: document.getElementById('peratusPotonganDibenarkan').value,
//         umurPencen: document.getElementById('umurPencen').value,
//     }
//   });

