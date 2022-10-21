const { policyFor } = require("../../utils");
const { subject } = require("@casl/ability");
const Invoice = require("./model");

const index = async (req, res, next) => {
	try {
		const { order_id } = req.params;
		const policy = policyFor(req.user);
		const invoice = await Invoice.findOne({ order: order_id })
			.populate("user")
			.populate("product");
		const subjectInvoice = subject("Invoice", {
			...invoice,
			user_id: invoice.user._id,
		});
		if (!policy.can("read", subjectInvoice)) {
			return res.json({
				error: 1,
				message: "You are not allowed to perform this action",
			});
		}
		return res.json(invoice);
	} catch (error) {
		return res.json({
			error: 1,
			message: "Error when retrieving invoice",
		});
	}
};

module.exports = {
	index,
};
