"use strict";

const { product } = require("../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const isDraft = false;
  const isPublished = true;
  return await updatePublished({
    product_shop,
    product_id,
    isDraft,
    isPublished,
  });
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const isDraft = true;
  const isPublished = false;
  return await updatePublished({
    product_shop,
    product_id,
    isDraft,
    isPublished,
  });
};

const updatePublished = async ({
  product_shop,
  product_id,
  isDraft,
  isPublished,
}) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = isDraft;
  foundShop.isPublished = isPublished;

  const { modifiedCount } = await foundShop.updateOne(foundShop); // modifiedCount => update success: 1 / update failed: 0
  return modifiedCount;
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email _id") // Lấy thông tin
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const searchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  return await product
    .find(
      {
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishedForShop,
  searchProduct,
};
