const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);


router.get("/", roleMiddleware("admin"), getUsers);
router.delete("/:id", roleMiddleware("admin"), deleteUser);

module.exports = router;