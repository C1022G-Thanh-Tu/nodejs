"use strict";

const ProductServiceV2 = require("../services/product.service.v2");
const { CreatedResponse, OkResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const serviceRes = await ProductServiceV2.createProduct(
      req.body.product_type,
      {
        ...req.body,
        product_shop: req.user.userId,
      }
    );
    new CreatedResponse({
      metadata: serviceRes,
    }).send(res);
  };

  /**
   * @description get all drafts shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  findAllDraftsForShop = async (req, res, next) => {
    const serviceRes = await ProductServiceV2.findAllDraftsForShop({
      product_shop: req.user.userId,
    });
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };

  findAllPublishedForShop = async (req, res, next) => {
    const serviceRes = await ProductServiceV2.findAllPublishedForShop({
      product_shop: req.user.userId,
    });
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    const serviceRes = await ProductServiceV2.publishProductByShop({
      product_id: req.params.id,
      product_shop: req.user.userId,
    });
    new OkResponse({
      metadata: serviceRes,
    }).send(res);
  };
}

module.exports = new ProductController();
