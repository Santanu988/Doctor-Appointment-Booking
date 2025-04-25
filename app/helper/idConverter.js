const { default: mongoose } = require("mongoose");
const blogmodel = require("../model/blog");

const fun = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  } else {
    const finddept = await blogmodel.findOne({ category: id });

    if (!finddept) {
      // Optional: You can throw, return null, or a fallback value
      throw new Error(`Department "${id}" not found in the database`);
      // Or: return null;
        
    }

    return finddept._id.toString();
  }
};

module.exports = { fun };
