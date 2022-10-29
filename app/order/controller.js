const { Types } = require("mongoose");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../delivery-address/model");

const index = async (req, res, next) => {
	try {
		const { skip = 0, limit = 0 } = req.query;
		const count = await Order.find({ user: req.user._id }).countDocuments();
		const orders = await Order.find({ user: req.user._id })
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate("order_items")
			.sort("-createdAt");
		return res.json({
			data: orders.map((order) => order.toJSON({ virtuals: true })),
			count,
		});
	} catch (error) {
		next(error);
	}
};

const store = async (req, res, next) => {
	try {
		const { delivery_fee, delivery_address } = req.body;
		let items = await CartItem.find({ user: req.user._id }).populate(
			"product"
		);
		if (!items) {
			return res.json({
				error: 1,
				message: "Your cart is empty",
			});
		}
		let address = await DeliveryAddress.findById(delivery_address);
		if (!address) {
			return res.json({
				error: 1,
				message: "Address not found",
			});
		}
		let order = new Order({
			_id: Types.ObjectId(),
			status: "waiting_payment",
			user: req.user,
			delivery_address: {
				provinsi: address.provinsi,
				kabupaten: address.kabupaten,
				kecamatan: address.kecamatan,
				kelurahan: address.kelurahan,
				detail: address.detail,
			},
			delivery_fee,
		});
		let orderItem = await OrderItem.insertMany(
			items.map((item) => ({
				...item,
				name: item.name,
				price: parseInt(item.price),
				qty: parseInt(item.qty),
				product: item.product._id,
				order: order._id,
			}))
		);
		orderItem.forEach((item) => order.order_items.push(item));
		await order.save();
		await CartItem.deleteMany({ user: req.user._id });
		return res.json(order);
	} catch (error) {
		if (error && error.name === "ValidationError") {
			return res.json({
				error: 1,
				message: error.message,
				fields: error.errors,
			});
		}
		next(error);
	}
};

module.exports = {
	index,
	store,
};
