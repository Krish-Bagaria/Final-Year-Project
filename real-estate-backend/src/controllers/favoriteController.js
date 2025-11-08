const Favorite = require("../models/Favorite");
const Property = require("../models/Property");

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorite properties
 * @access  Private (Buyer)
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 12,
      sortBy = "-createdAt",
      interested = true,
    } = req.query;

    const result = await Favorite.getUserFavorites(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      interested: interested === "true" || interested === true,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch favorites",
    });
  }
};

/**
 * @route   POST /api/favorites/:propertyId
 * @desc    Add property to favorites
 * @access  Private (Buyer)
 */
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;
    const { notes, interestedLevel, tags } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!property.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot favorite inactive property",
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingFavorite) {
      if (!existingFavorite.isActive) {
        // Reactivate if previously removed
        existingFavorite.isActive = true;
        existingFavorite.interested = true;
        if (notes) existingFavorite.notes = notes;
        if (interestedLevel) existingFavorite.interestedLevel = interestedLevel;
        if (tags) existingFavorite.tags = tags;
        await existingFavorite.save();

        return res.status(200).json({
          success: true,
          message: "Property added back to favorites",
          data: {
            favorite: existingFavorite,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: "Property already in favorites",
      });
    }

    // Create new favorite
    const favorite = await Favorite.create({
      user: userId,
      property: propertyId,
      notes,
      interestedLevel: interestedLevel || "medium",
      tags: tags || [],
      interested: true,
      isActive: true,
    });

    const populatedFavorite = await Favorite.findById(favorite._id).populate(
      "property",
      "title type price area bedrooms images location city status"
    );

    return res.status(201).json({
      success: true,
      message: "Property added to favorites",
      data: {
        favorite: populatedFavorite,
      },
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add to favorites",
    });
  }
};

/**
 * @route   DELETE /api/favorites/:propertyId
 * @desc    Remove property from favorites
 * @access  Private (Buyer)
 */
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
      isActive: true,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    // Soft delete
    await favorite.softDelete();

    return res.status(200).json({
      success: true,
      message: "Property removed from favorites",
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to remove from favorites",
    });
  }
};

/**
 * @route   GET /api/favorites/check/:propertyId
 * @desc    Check if property is favorited
 * @access  Private (Buyer)
 */
const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const isFavorited = await Favorite.isFavorited(userId, propertyId);

    return res.status(200).json({
      success: true,
      data: {
        isFavorited,
        propertyId,
      },
    });
  } catch (error) {
    console.error("Check favorite error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check favorite status",
    });
  }
};

/**
 * @route   PUT /api/favorites/:propertyId/toggle
 * @desc    Toggle interested status
 * @access  Private (Buyer)
 */
const toggleInterested = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
      isActive: true,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.toggleInterested();

    return res.status(200).json({
      success: true,
      message: `Interest ${favorite.interested ? "marked" : "unmarked"}`,
      data: {
        favorite,
      },
    });
  } catch (error) {
    console.error("Toggle interested error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to toggle interest",
    });
  }
};

/**
 * @route   PUT /api/favorites/:propertyId/notes
 * @desc    Add/update notes on favorite
 * @access  Private (Buyer)
 */
const updateFavoriteNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: "Notes are required",
      });
    }

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
      isActive: true,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.addNote(notes);

    return res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      data: {
        favorite,
      },
    });
  } catch (error) {
    console.error("Update notes error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update notes",
    });
  }
};

/**
 * @route   PUT /api/favorites/:propertyId/reminder
 * @desc    Set reminder for favorite property
 * @access  Private (Buyer)
 */
const setReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;
    const { reminderDate } = req.body;

    if (!reminderDate) {
      return res.status(400).json({
        success: false,
        message: "Reminder date is required",
      });
    }

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
      isActive: true,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.setReminder(new Date(reminderDate));

    return res.status(200).json({
      success: true,
      message: "Reminder set successfully",
      data: {
        favorite,
      },
    });
  } catch (error) {
    console.error("Set reminder error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to set reminder",
    });
  }
};

/**
 * @route   GET /api/favorites/by-type
 * @desc    Get favorites grouped by property type
 * @access  Private (Buyer)
 */
const getFavoritesByType = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.getFavoritesByType(userId);

    return res.status(200).json({
      success: true,
      data: {
        favorites,
      },
    });
  } catch (error) {
    console.error("Get favorites by type error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch favorites by type",
    });
  }
};

/**
 * @route   GET /api/favorites/stats
 * @desc    Get favorite statistics
 * @access  Private (Buyer)
 */
const getFavoriteStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Favorite.countDocuments({
      user: userId,
      isActive: true,
    });

    const interested = await Favorite.countDocuments({
      user: userId,
      isActive: true,
      interested: true,
    });

    const byType = await Favorite.getFavoritesByType(userId);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          total,
          interested,
          notInterested: total - interested,
          byType,
        },
      },
    });
  } catch (error) {
    console.error("Get favorite stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch favorite statistics",
    });
  }
};

/**
 * @route   PUT /api/favorites/:propertyId/view
 * @desc    Increment view count for favorite
 * @access  Private (Buyer)
 */
const incrementFavoriteView = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
      isActive: true,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.incrementViewCount();

    return res.status(200).json({
      success: true,
      message: "View count updated",
      data: {
        viewCount: favorite.viewCount,
      },
    });
  } catch (error) {
    console.error("Increment view error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update view count",
    });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite,
  toggleInterested,
  updateFavoriteNotes,
  setReminder,
  getFavoritesByType,
  getFavoriteStats,
  incrementFavoriteView,
};
