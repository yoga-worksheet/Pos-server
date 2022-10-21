const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchema = Schema(
	{
		full_name: {
			type: String,
			required: [true, "Fullname cannot be empty"],
			minLength: [3, "Fullname must be more than 3 character"],
			maxLength: [255, "Fullname must be less than 255 character"],
		},
		customer_id: {
			type: Number,
		},
		email: {
			type: String,
			required: [true, "Email cannot be empty"],
			maxLength: [255, "Email must be less than 255 character"],
		},
		password: {
			type: String,
			required: [true, "Password cannot be empty"],
			maxLength: [255, "Password must be less than 255 character"],
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		token: [String],
	},
	{ timestamps: true }
);

userSchema.path("email").validate(
	(value) => {
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return emailRegex.test(value);
	},
	(attr) => `${attr.value} must be a valid email`
);

userSchema.path("email").validate(
	async function (value) {
		try {
			const count = await this.model("User").count({ email: value });
			return !count;
		} catch (error) {
			throw error;
		}
	},
	(attr) => `${attr.value} has been registered`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
	this.password = bcrypt.hashSync(this.password, HASH_ROUND);
	next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
