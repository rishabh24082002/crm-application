const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;