const Category = require("../models/Category");

const initialSetting = async function (req, res, next) {
  const categories = ["BrandLogo", "KeyImage", "Icon"];
  try {
    const newCategoryList = categories.map(el => {
      return new Category({
        name: el,
      }).save();
    });

    const temp = await Promise.all(newCategoryList);

    res.statusCode = 201;
    res.json(temp);
  } catch (error) {
    next(error);
  }
};

module.exports = initialSetting;
