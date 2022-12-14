const { model, Schema } = require("mongoose");

const deliveryAddressSchema = Schema(
	{
		name: {
			type: String,
			required: [true, "Name cannot be empty"],
			maxLength: [255, "Name must be less than 255 character"],
		},
		kelurahan: {
			id: String,
			name: {
				type: String,
				required: [true, "Kelurahan cannot be empty"],
				maxLength: [255, "Kelurahan must be less than 255 character"],
			},
		},
		kecamatan: {
			id: String,
			name: {
				type: String,
				required: [true, "Kecamatan cannot be empty"],
				maxLength: [255, "Kecamatan must be less than 255 character"],
			},
		},
		kabupaten: {
			id: String,
			name: {
				type: String,
				required: [true, "Kabupaten cannot be empty"],
				maxLength: [255, "Kabupaten must be less than 255 character"],
			},
		},
		provinsi: {
			id: String,
			name: {
				type: String,
				required: [true, "Kelurahan cannot be empty"],
				maxLength: [255, "Kelurahan must be less than 255 character"],
			},
		},
		detail: {
			type: String,
			required: [true, "Detail cannot be empty"],
			maxLength: [1000, "Detail must be less than 1000 character"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
