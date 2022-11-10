const { model, Schema } = require("mongoose");

const orderItemSchema = Schema({
	name: {
		type: String,
		minLength: [3, "Name must be more than 3 character"],
		required: [true, "Name cannot be empty"],
	},
	price: {
		type: Number,
		required: [true, "Price cannot be empty"],
	},
	qty: {
		type: Number,
		min: [1, "Quantity must be equal or more than 1"],
		required: [true, "Quantity cannot be empty"],
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
	},
	order: {
		type: Schema.Types.ObjectId,
		ref: "Order",
	},
});

module.exports = model("OrderItem", orderItemSchema);
