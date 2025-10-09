/**
 * Central export file for all Mongoose models
 * This allows for cleaner imports throughout the application
 * Usage: const { User, Property, Favorite } = require('./models');
 */

const User = require("./User");
const Property = require("./Property");
const Favorite = require("./Favorite");
const Inquiry = require("./Inquiry");
const PropertyView = require("./PropertyView");
const Review = require("./Review");
const SavedSearch = require("./SavedSearch");
const Notification = require("./Notification");
const Transaction = require("./Transaction");

module.exports = {
  User,
  Property,
  Favorite,
  Inquiry,
  PropertyView,
  Review,
  SavedSearch,
  Notification,
  Transaction,
};
