const express = require("express");
const router = express.Router();
const University = require("../models/University");

// POST /api/merit/calculate
router.post("/calculate", async (req, res) => {
  const { uniSlug, deptName, matric, fsc, test } = req.body;

  if (!uniSlug || !matric || !fsc) {
    return res
      .status(400)
      .json({ message: "University, matric, and FSc marks are required." });
  }

  const uni = await University.findOne({ slug: uniSlug, status: "approved" });
  if (!uni) {
    return res.status(404).json({ message: "University not found." });
  }

  const f = uni.aggregateFormula;
  const aggregate =
    parseFloat(matric) * (f.matric || 0) +
    parseFloat(fsc) * (f.fsc || 0) +
    parseFloat(test || 0) * (f.test || 0);

  const rounded = Math.round(aggregate * 100) / 100;

  let meritStatus = null;
  if (deptName) {
    const dept = uni.departments.find((d) => d.name === deptName);
    if (dept?.lastMerit?.length > 0) {
      const closing = dept.lastMerit[0].closing;
      const diff = rounded - closing;

      if (diff >= 3)
        meritStatus = { status: "likely", label: "Likely Admitted", diff };
      else if (diff >= 0)
        meritStatus = { status: "borderline", label: "Borderline", diff };
      else meritStatus = { status: "unlikely", label: "Below Merit", diff };
    }
  }

  res.json({
    aggregate: rounded,
    university: uni.shortName,
    formula: f,
    meritStatus,
  });
});

module.exports = router;
