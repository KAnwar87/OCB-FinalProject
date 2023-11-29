const get = (req, res) => {
    res.status(200).json({ message: "This is a GET REST API" });
  };

const post = (req, res) => {
  const nama = req.body.nama;
  const birthYear = req.body.birthYear;
  const age = 2023 - birthYear;
  const postcode = req.body.postcode;
  const town = req.body.town;
  const data = {
    nama: nama,
    tahunLahir: birthYear,
    umur: age,
    podkod: postcode,
    bandar: town
  };
  res.status(200).json({ message: "This is a POST REST API", data: data });
}

const publicController = { get, post }

export default publicController;