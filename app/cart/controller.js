const Product = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
	try {
		const { items } = req.body;
		const productIds = items.map((item) => item._id);
		const products = await Product.find({ _id: { $in: productIds } });
		const cartItems = items.map((item) => {
			let relatedProduct = products.find(
				(product) => product._id.toString() === item._id.toString()
			);
			return {
				name: relatedProduct.name,
				qty: item.qty,
				price: relatedProduct.price,
				image_url: relatedProduct.image_url,
				user: req.user._id,
				product: relatedProduct._id,
			};
		});
		await CartItem.deleteMany({ user: req.user._id });
		await CartItem.bulkWrite(
			cartItems.map((item) => {
				return {
					updateOne: {
						filter: {
							user: req.user._id,
							product: item.product,
						},
						update: item,
						upsert: true,
					},
				};
			})
		);
		return res.json(cartItems);
	} catch (error) {
		if (error && error.name === "ValidationError") {
			return res.json({
				error: 1,
				message: error.message,
				field: error.errors,
			});
		}
		next(error);
	}
};

const index = async (req, res, next) => {
	try {
		const items = await CartItem.find({ user: req.user._id }).populate(
			"product"
		);
		return res.json(items);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	update,
	index,
};
