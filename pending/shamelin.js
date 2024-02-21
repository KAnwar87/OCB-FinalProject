const get = (req, res) => {
  res.status(200).json({ message: "This is a GET REST API" });
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
  const agPayslipType = req.body.agPayslipType;
  const akpkStatus = req.body.akpkStatus;

  const installmentRedeemed = req.body.installmentRedeemed;
  const settlementAmount = req.body.settlementAmount;

  const checkAmount = req.body.checkAmount;
  const checkTenure = req.body.checkTenure;

  const ErrorLog = {};

  /* #endregion */

  /* #region :: Shamelin Parameter */
  const shamelinLastRevision = 231017;
  const shamelinMinAmount = 3000;
  const shamelinMaxAmount = 250000;
  const shamelinMinTenure = 2;
  const shamelinMaxTenure = 10;
  const shamelinRate = 5.99;
  const shamelinExistingMember = false;
  let shamelinMembershipFee;
  if (shamelinExistingMember == false) {
    shamelinMembershipFee = 30;
  } else {
    shamelinMembershipFee = 0;
  }
  /* #endregion */

  /* #region :: Extract Info Prom NoKP */
  const currentYear = parseInt(new Date().getFullYear().toString().slice(-2));
  const currentYear4D = parseInt(new Date().getFullYear().toString());
  const extractedYY = noKP.substr(0, 2);
  const extractedMM = noKP.substr(2, 2);
  const extractedDD = noKP.substr(4, 2);

  let birthYear;
  if (extractedYY > currentYear) {
    birthYear = parseInt(`19${extractedYY}`);
  } else {
    birthYear = parseInt(`20${extractedYY}`);
  }

  const dOB = birthYear + "-" + extractedMM + "-" + extractedDD;
  const birthDate = new Date(dOB);
  const today = new Date();

  /* ----- Semak Umur Semasa  ----- */
  let years = currentYear4D - birthYear;

  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;

    const monthDays = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      0
    ).getDate();
    days += monthDays;
  }

  let umurSemasa = years + " Tahun " + months + " Bulan " + days + " Hari";

  let umurSemasaObject = {
    tahun: years,
    bulan: months,
    hari: days,
  };

  /* #endregion */

  /* #region :: Baki Tempoh Berkhidmat */
  const retdYear = birthYear + umurPencen;
  const dOR = new Date(retdYear, extractedMM - 1, extractedDD);
  const dOT = new Date(today);

  let addMonth = 0;
  let addYear = 0;

  let daysDiff;
  if (days == 0) {
    daysDiff = 0;
    addMonth = 1;
  } else {
    daysDiff = 30 - days;
  }

  let monthsDiff;
  if (months == 11 && addMonth == 1) {
    monthsDiff = 0;
    addYear = 1;
  } else if (months == 0 && days !== 0) {
    monthsDiff = 11;
  } else if (months == 0 && days == 0) {
    monthsDiff = 0;
    addYear = 1;
  } else {
    monthsDiff = 12 - months - 1;
  }

  let yearsDiff = umurPencen - years - 1 + addYear;

  let bakiTempohKhidmat =
    yearsDiff + " Tahun " + monthsDiff + " Bulan " + daysDiff + " Hari";

  let bakiTempohKhidmatObject = {
    tahun: yearsDiff,
    bulan: monthsDiff,
    hari: daysDiff,
  };
  /* #endregion */

  /* #region :: General Calculation */

  const bakiKelayakanPotonganBulanan = parseFloat(
    (
      gajiElaunTetap * (peratusPotonganDibenarkan / 100) -
      potonganPayslip +
      installmentRedeemed
    ).toFixed(2)
  );

  const peratusanPotonganSemasa = parseFloat(
    ((potonganPayslip / gajiElaunTetap) * 100).toFixed(2)
  );

  function semakPercentageVariant(
    peratusanPotonganSemasa,
    peratusPotonganDibenarkan
  ) {
    if (peratusanPotonganSemasa < peratusPotonganDibenarkan) {
      return "success";
    } else if (peratusanPotonganSemasa >= 80) {
      return "danger";
    } else {
      return "warning";
    }
  }

  const checkPercentageVariant = semakPercentageVariant(
    peratusanPotonganSemasa,
    peratusPotonganDibenarkan
  );

  function semakBalanceVariant(bakiKelayakanPotonganBulanan) {
    if (bakiKelayakanPotonganBulanan <= 0) {
      return "danger";
    } else {
      return "info";
    }
  }

  const checkBalanceVariant = semakBalanceVariant(bakiKelayakanPotonganBulanan);
  /* #endregion */

  /* #region :: Shamelin Calculation */
  /* ----- Semak Baki Kelayakan Potongan Bulanan  ----- */
  let bakiKelayakanPotonganBulananShamelin;
  if (shamelinExistingMember == false) {
    bakiKelayakanPotonganBulananShamelin =
      bakiKelayakanPotonganBulanan - shamelinMembershipFee;
  } else {
    bakiKelayakanPotonganBulananShamelin = bakiKelayakanPotonganBulanan;
  }

  /* ----- Semak Max Tenure  ----- */
  let shamelinMaxTenureEligible;
  if (yearsDiff >= shamelinMaxTenure) {
    shamelinMaxTenureEligible = shamelinMaxTenure;
  } else if (yearsDiff < shamelinMinTenure) {
    shamelinMaxTenureEligible = 0;
    ErrorLog.shamelinMaxTenureEligible =
      "Baki Tempoh berkhidmat < Minimum Tenure";
  } else {
    shamelinMaxTenureEligible = yearsDiff;
  }

  /* ----- Semak Max Loan Eligible  ----- */
  // prettier-ignore
  let calculateMaxAmountEligible = ((bakiKelayakanPotonganBulananShamelin*100/102) * shamelinMaxTenureEligible * 12) / (shamelinRate / 100 * shamelinMaxTenureEligible + 1);
  let calculateMaxAmountEligibleRounded =
    Math.floor(calculateMaxAmountEligible / 1000) * 1000;

  let shamelinMaxAmountEligible;
  if (calculateMaxAmountEligibleRounded > shamelinMaxAmount) {
    shamelinMaxAmountEligible = shamelinMaxAmount;
  } else if (calculateMaxAmountEligibleRounded < shamelinMinAmount) {
    shamelinMaxAmountEligible = 0;
    ErrorLog.shamelinMaxAmountEligible =
      "Amaun Kelayakan Pinjaman < Minimum Loan Amount";
  } else {
    shamelinMaxAmountEligible = calculateMaxAmountEligibleRounded;
  }

  /* ----- Semak Installment for Max Loan Eligible  ----- */
  let shamelinInstallmentOfMaxAmountEligible;
  if (shamelinMaxAmountEligible > shamelinMinAmount) {
    // prettier-ignore
    shamelinInstallmentOfMaxAmountEligible = Math.ceil((shamelinMaxAmountEligible + (shamelinMaxAmountEligible * shamelinRate / 100 * shamelinMaxTenureEligible)) / (shamelinMaxTenureEligible * 12)*1.02) + shamelinMembershipFee;
  } else {
    shamelinInstallmentOfMaxAmountEligible = 0;
  }

  /* ----- Semak Monthly Installment of Specific Loan Amount  ----- */
  function shamelinCheckInstallment(loanAmount, tenure, shamelinRate) {
    if (loanAmount > shamelinMinAmount) {
      // prettier-ignore
      const installment = Math.ceil(((loanAmount + (loanAmount * shamelinRate / 100 * tenure)) / (tenure * 12)) * 1.02);
      return {
        loan: loanAmount,
        tenure: tenure,
        installment: installment + shamelinMembershipFee,
      };
    } else {
      return { loan: 0, tenure: tenure, installment: 0 };
    }
  }

  /* #endregion */

  /* #region :: Shamelin Charges */
  function shamelinCharges(amount, tenure, rate) {
    let scMembershipReg = 0;
    function shamelinChargesMembershipReg(amount) {
      if (shamelinExistingMember == false && amount >= shamelinMinAmount) {
        return (scMembershipReg = 50);
      } else {
        return (scMembershipReg = 0);
      }
    }
    let scProcessingFee = 0;
    function shamelinChargesProcessingFee(amount) {
      if (amount >= shamelinMinAmount) {
        return (scProcessingFee = 100);
      } else {
        return (scProcessingFee = 0);
      }
    }
    let scCoopShare = 0;
    function shamelinChargesCoopShare(amount) {
      if (amount >= shamelinMinAmount) {
        return (scCoopShare = 500);
      } else {
        return (scCoopShare = 0);
      }
    }
    let scAdminFee = 0;
    function shamelinChargesAdminFee(amount) {
      if (amount >= shamelinMinAmount) {
        return (scAdminFee = 50);
      } else {
        return (scAdminFee = 0);
      }
    }
    let scMembershipFeeAdv = 0;
    function shamelinChargesMembershipFeeAdv(amount) {
      if (shamelinExistingMember == false && amount >= shamelinMinAmount) {
        return (scMembershipFeeAdv = 6 * shamelinMembershipFee);
      } else {
        return (scMembershipFeeAdv = 0);
      }
    }
    let scStampDuty = 0;
    function shamelinChargesStampDuty(amount) {
      if (amount >= shamelinMinAmount) {
        return (scStampDuty = amount * 0.005 + 10);
      } else {
        return (scStampDuty = 0);
      }
    }
    let scKWPPAsinkingFund = 0;
    function shamelinChargesKWPPAsinkingFund(amount) {
      if (
        extractedYY >= 23 &&
        extractedYY <= 79 &&
        amount >= shamelinMinAmount
      ) {
        return (scKWPPAsinkingFund = amount * 0.175);
      } else if (amount >= shamelinMinAmount) {
        return (scKWPPAsinkingFund = amount * 0.155);
      } else {
        return (scKWPPAsinkingFund = 0);
      }
    }
    let scInstallmentAdv = 0;
    function shamelinChargesInstallmentAdv(amount, tenure, rate) {
      if (amount > shamelinMinAmount) {
        // prettier-ignore
        scInstallmentAdv = ((Math.ceil(((amount + (amount * rate / 100 * tenure)) / (tenure * 12)) * 1.02)) + 30) *2;
      } else {
        scInstallmentAdv = 0;
      }
      return scInstallmentAdv;
    }

    // Call the functions to calculate the values
    shamelinChargesMembershipReg(amount);
    shamelinChargesProcessingFee(amount);
    shamelinChargesCoopShare(amount);
    shamelinChargesAdminFee(amount);
    shamelinChargesMembershipFeeAdv(amount);
    shamelinChargesStampDuty(amount);
    shamelinChargesKWPPAsinkingFund(amount);
    shamelinChargesInstallmentAdv(amount, tenure, rate);

    let totalCharges =
      scMembershipReg +
      scProcessingFee +
      scCoopShare +
      scAdminFee +
      scMembershipFeeAdv +
      scStampDuty +
      scKWPPAsinkingFund +
      scInstallmentAdv;
    let netPayout = amount - totalCharges - settlementAmount;

    return {
      shamelinMembershipReg: scMembershipReg,
      shamelinProcessingFee: scProcessingFee,
      shamelinCoopShare: scCoopShare,
      shamelinAdminFee: scAdminFee,
      shamelinMembershipFeeAdv: scMembershipFeeAdv,
      shamelinStampDuty: scStampDuty,
      shamelinKWPPAsinkingFund: scKWPPAsinkingFund,
      shamelinInstallmentAdv: scInstallmentAdv,
      settlementAmount: settlementAmount,
      totalCharges: totalCharges,
      netPayout: netPayout,
    };
  }

  const maxPayout = shamelinCharges(
    shamelinMaxAmountEligible,
    shamelinMaxTenureEligible,
    shamelinRate
  );

  const maxPayoutNetCash = maxPayout.netPayout;

  /* #endregion */

  const kiraShamelin = {
    nama: nama,
    umurSemasa: umurSemasa,
    bakiTempohKhidmat: bakiTempohKhidmat,

    bakiKelayakanPotonganBulanan: bakiKelayakanPotonganBulanan,
    peratusanPotonganSemasa: peratusanPotonganSemasa,
    checkPercentageVariant: checkPercentageVariant,
    checkBalanceVariant: checkBalanceVariant,

    shamelinMaxAmountEligible: shamelinMaxAmountEligible,
    shamelinInstallmentOfMaxAmountEligible:
      shamelinInstallmentOfMaxAmountEligible,
    ErrorLog: ErrorLog,

    umurSemasaObject: umurSemasaObject,

    bakiTempohKhidmatObject: bakiTempohKhidmatObject,

    shamelinMaxAmountInstallment: shamelinCheckInstallment(
      shamelinMaxAmountEligible,
      shamelinMaxTenureEligible,
      shamelinRate
    ),

    shamelinChargesAndPayout: shamelinCharges(
      shamelinMaxAmountEligible,
      shamelinMaxTenureEligible,
      shamelinRate
    ),

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

const shamelin = { get, post };

export default shamelin;
