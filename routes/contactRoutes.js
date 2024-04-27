const express = require("express");
const router = express.Router();
const {
  getContacts,
  postContact,
  getContactById,
  updateContactById,
  deleteContactById,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validatehandlerToken");

router.use(validateToken);

router.route("/").get(getContacts).post(postContact);
router
  .route("/:id")
  .get(getContactById)
  .put(updateContactById)
  .delete(deleteContactById);

module.exports = router;
