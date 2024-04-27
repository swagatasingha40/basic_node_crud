const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc post a contact
//@route POST /api/contacts
//@access private
const postContact = asyncHandler(async (req, res) => {
  const { name, email, phoneNo } = req.body;
  if (!name || !email || !phoneNo) {
    res.status(400);
    throw new Error("All fields are manadatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phoneNo,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//@desc get a contact by Id
//@route GET /api/contacts/:id
//@access private
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }
  res.status(200).json(contact);
});

//@desc update a contact by Id
//@route PUT /api/contacts/:id
//@access private
const updateContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user does not have permission to update");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc delete a contact by Id
//@route DELETE /api/contacts/:id
//@access private
const deleteContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user does not have permission to update");
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  postContact,
  getContactById,
  updateContactById,
  deleteContactById,
};
