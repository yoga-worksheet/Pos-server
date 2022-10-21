const { model, Schema } = require("mongoose");

const cartItemSchema = Schema({
	name: {
		type: String,
		required: [true, "Name cannot be empty"],
		minLength: [5, "Name must be more than 5 character"],
	},
	qty: {
		type: Number,
		required: [true, "Quantity cannot be empty"],
		minLength: [1, "Quantity must be more than 1"],
	},
	price: {
		type: Number,
		default: 0,
	},
	image_url: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
	},
});

module.exports = model("CartItem", cartItemSchema);
