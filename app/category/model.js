const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categorySchema = Schema({
	name: {
		type: String,
		minLength: [3, "Category must be more than 3 characters"],
		maxLength: [20, "Category must be less than 20 characters"],
		required: [true, "Category cannot be empty"],
	},
});

module.exports = model("Category", categorySchema);
