const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const DeliveryAddress = require("./model");

const index = async (req, res, next) => {
	try {
		const { skip = 0, limit = 0 } = req.query;
		const count = await DeliveryAddress.find({
			user: req.user._id,
		}).countDocuments();
		const addresses = await DeliveryAddress.find({
			user: req.user._id,
		})
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.sort("-createdAt");
		return res.json({ data: addresses, count });
	} catch (error) {
		next(error);
	}
};

const store = async (req, res, next) => {
	try {
		const payload = req.body;
		const user = req.user;
		const address = new DeliveryAddress({ ...payload, user: user._id });
		await address.save();
		return res.json(address);
	} catch (error) {
		if (error && error.name === "ValidationError") {
			return res.json({
				error: 1,
				message: error.message,
				field: error.errors,
			});
		}
		next(error);
	}
};

const update = async (req, res, next) => {
	const policy = policyFor(req.user);
	try {
		const payload = req.body;
		const user = req.user;
		let address = await DeliveryAddress.findById(req.params.id);
		const subjectAddress = subject("DeliveryAddress", {
			...address,
			user_id: address.user,
		});
		if (!policy.can("update", subjectAddress)) {
			return res.json({
				error: 1,
				message: `You are not allowed to modify this resource`,
			});
		}
		address = await DeliveryAddress.findByIdAndUpdate(
			req.params.id,
			{
				...payload,
				user: user._id,
			},
			{
				new: true,
				runValidators: true,
			}
		);
		return res.json(address);
	} catch (error) {
		if (error && error.name === "ValidationError") {
			return res.json({
				error: 1,
				message: error.message,
				fields: error.errors,
			});
		}
		next(error);
	}
};

const destroy = async (req, res, next) => {
	try {
		const policy = policyFor(req.user);
		let address = await DeliveryAddress.findById(req.params.id);
		const subjectAddress = subject("DeliveryAddress", {
			...address,
			user_id: address.user,
		});
		if (!policy.can("delete", subjectAddress)) {
			return res.json({
				error: 1,
				message: `You are not allowed to delete this resource`,
			});
		}
		address = await DeliveryAddress.findByIdAndDelete(req.params.id);
		return res.json(address);
	} catch (error) {
		if (error && error.name === "ValidationError") {
			return res.json({
				error: 1,
				message: error.message,
				fields: error.errors,
			});
		}
		next(error);
	}
};

module.exports = {
	index,
	store,
	update,
	destroy,
};
