import { query } from "../database/connection.js";

const get = async (req, res) => {
  try {
    // const reqBody = req.body;
    console.log("### Accessing roadtax records.");
    console.time("getRoadtaxDuration");
    const resDb = await query(
      `
            SELECT * FROM ocbproject_roadtax
            `
    );
    console.timeEnd("getRoadtaxDuration");

    const data = resDb.rows;
    // res.status(200).json({ message: resDb });
    res.render("pages/roadtax-view", { data });

    return;
  } catch (error) {
    // res.status(500).json({ message: "Server Error 500", error: error.message });
    console.log(error);
    return;
  }
};

const post = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("### Save new record for: ", reqBody);
    const resDb = await query(
      `
            INSERT INTO ocbproject_roadtax (reg_no, owner_name, owner_nokp, veh_type, veh_make, veh_model, veh_eng_cc) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        reqBody.reg_no,
        reqBody.owner_name,
        reqBody.owner_nokp,
        reqBody.veh_type,
        reqBody.veh_make,
        reqBody.veh_model,
        reqBody.veh_eng_cc,
      ]
    );

    res.redirect("/roadtax");
    return;
  } catch (error) {
    // res.status(500).json({ message: "Server Error 500", error: error.message });
    console.log(error);
    return;
  }
};

const detail = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("### Get details for: ", reqBody);
    console.time(`getDetailDuration`);
    const resDb = await query(
      `
            SELECT * FROM ocbproject_roadtax WHERE id = ($1)
            `,
      [reqBody.id]
    );
    console.timeEnd(`getDetailDuration`);

    const data = resDb.rows;
    // res.status(200).json({ data });
    res.render("pages/roadtax-edit", { data });

    return;
  } catch (error) {
    // res.status(500).json({ message: "Server Error 500", error: error.message });
    console.log(error);
    return;
  }
};


const put = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("### Editing data: ", reqBody);
    const resDb = await query(
      `
      UPDATE ocbproject_roadtax 
      SET 
        reg_no = $1,
        owner_name = $2,
        owner_nokp = $3,
        veh_type = $4,
        veh_make = $5,
        veh_model = $6,
        veh_eng_cc = $7
      WHERE id = $8
    `,
      [
        reqBody.reg_no,
        reqBody.owner_name,
        reqBody.owner_nokp,
        reqBody.veh_type,
        reqBody.veh_make,
        reqBody.veh_model,
        reqBody.veh_eng_cc,
        reqBody.id
      ]
    );

    console.log("Redirecting to /roadtax");
    res.redirect("/roadtax");
    // res.status(200).json({ data });
    // res.render("pages/roadtax-edit", { data });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error 500", error: error.message });
    return;
  }
}

const del = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("### Deleting data from db: ", reqBody);
    console.time(`deleteDuration`);
    const resDb = await query(
      `
            DELETE FROM ocbproject_roadtax WHERE id = ($1)
            `,
      [reqBody.id]
    );
    console.timeEnd(`deleteDuration`);

    const data = resDb.rows;
    // res.status(200).json({ data });
    // res.render("pages/roadtax-edit", { data });
    res.redirect("/roadtax");

    return;
  } catch (error) {
    // res.status(500).json({ message: "Server Error 500", error: error.message });
    console.log(error);
    return;
  }
};


const roadtax = { get, post, detail, put, del };

export default roadtax;
