const { model, Schema } = require("mongoose");

const invoiceSchema = Schema(
	{
		sub_total: {
			type: Number,
			required: [true, "Sub total cannot be empty"],
		},
		delivery_fee: {
			type: Number,
			required: [true, "Delivery fee cannot be empty"],
		},
		delivery_address: {
			kelurahan: {
				id: String,
				name: {
					type: String,
					required: [true, "Kelurahan cannot be empty"],
					maxLength: [
						255,
						"Kelurahan must be less than 255 character",
					],
				},
			},
			kecamatan: {
				id: String,
				name: {
					type: String,
					required: [true, "Kecamatan cannot be empty"],
					maxLength: [
						255,
						"Kecamatan must be less than 255 character",
					],
				},
			},
			kabupaten: {
				id: String,
				name: {
					type: String,
					required: [true, "Kabupaten cannot be empty"],
					maxLength: [
						255,
						"Kabupaten must be less than 255 character",
					],
				},
			},
			provinsi: {
				id: String,
				name: {
					type: String,
					required: [true, "Kelurahan cannot be empty"],
					maxLength: [
						255,
						"Kelurahan must be less than 255 character",
					],
				},
			},
			detail: {
				type: String,
			},
		},
		total: {
			type: Number,
			required: [true, "Total cannot be empty"],
		},
		payment_status: {
			type: String,
			enum: ["waiting_payment", "paid"],
			default: "waiting_payment",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
		},
	},
	{ timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);
