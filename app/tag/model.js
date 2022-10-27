const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema({
	name: {
		type: String,
		minLength: [3, "Tag must be more than 3 characters"],
		maxLength: [20, "Tag must be less than 20 characters"],
		required: [true, "Tag cannot be empty"],
	},
});

module.exports = model("Tag", tagSchema);
