const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Invoice = require("../invoice/model");

const orderSchema = Schema(
	{
		status: {
			type: String,
			enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
			default: "waiting_payment",
		},
		delivery_fee: {
			type: Number,
			default: 0,
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
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		order_items: [
			{
				type: Schema.Types.ObjectId,
				ref: "OrderItem",
			},
		],
	},
	{ timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "order_number" });
orderSchema.virtual("items_count").get(function () {
	return this.order_items.reduce(
		(total, item) => (total += parseInt(item.qty)),
		0
	);
});
orderSchema.post("save", async function () {
	let sub_total = this.order_items.reduce(
		(total, item) => (total += parseInt(item.qty) * parseInt(item.price)),
		0
	);
	console.log(sub_total);
	let invoice = new Invoice({
		user: this.user,
		order: this._id,
		sub_total: sub_total,
		delivery_fee: parseInt(this.delivery_fee),
		total: parseInt(sub_total + this.delivery_fee),
		delivery_address: this.delivery_address,
	});
	await invoice.save();
});

module.exports = model("Order", orderSchema);
