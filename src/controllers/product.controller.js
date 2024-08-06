"use strict";

const ProductService = require("../services/product.service");
const { CreatedResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const serviceRes = await ProductService.createProduct(req.body.product_type, req.body);
    new CreatedResponse({
      metadata: serviceRes,
    }).send(res);
  };
}

module.exports = new ProductController();
