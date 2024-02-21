const get = (req, res) => {
  res.status(200).json({ message: "This is a TEST GET REST API" });
};

const post = (req, res) => {
  /* #region :: set req.body items */
  const nama = req.body.nama;
  const noKP = req.body.noKP;
  const gajiElaunTetap = parseFloat(req.body.gajiElaunTetap);
  const potonganPayslip = parseFloat(req.body.potonganPayslip);
  const peratusPotonganDibenarkan = parseFloat(
    req.body.peratusPotonganDibenarkan
  );
  const umurPencen = req.body.umurPencen;


  const kiraShamelin = {
    nama : nama,
    noKP: noKP,
    gajiElaunTetap: gajiElaunTetap,

    potonganPayslip: potonganPayslip,
    peratusPotonganDibenarkan: peratusPotonganDibenarkan,
    umurPencen: umurPencen,
  };

  // res.status(200).json({
  //   message: "POST REST API for KOP. SHAMELIN LOAN CALC",
  //   data: kiraShamelin,
  // });

  // Render the EJS template and pass data to it
  res.render("pages/hasilShamelin", kiraShamelin);
};

const test = { get, post };

export default test;
