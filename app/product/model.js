const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
	{
		name: {
			type: String,
			minLength: [3, "Name must be more than 3 character"],
			required: [true, "Name cannot be empty"],
		},
		description: {
			type: String,
			maxLength: [1000, "Description must be less than 1000 character"],
		},
		price: {
			type: Number,
			default: 0,
		},
		image_url: String,
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tag",
			},
		],
	},
	{ timestamps: true }
);

module.exports = model("Product", productSchema);
