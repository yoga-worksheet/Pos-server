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
			provinsi: {
				type: String,
				required: [true, "provinsi cannot be empty"],
			},
			kabupaten: {
				type: String,
				required: [true, "kabupaten cannot be empty"],
			},
			kecamatan: {
				type: String,
				required: [true, "kecamatan cannot be empty"],
			},
			kelurahan: {
				type: String,
				required: [true, "kelurahan cannot be empty"],
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
