const Category = require("../../models/Category");

const CategoryController = async function (req, res, next) {
  try {
    const categories = await Category.find();

    const categoryNameAndId = categories.map(category => {
      const { _id, name } = category;

      return { _id, name };
    });

    res.statusCode = 200;
    res.json({
      categories: categoryNameAndId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = CategoryController;
