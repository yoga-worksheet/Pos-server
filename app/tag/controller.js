const Tag = require("./model");

const index = async (req, res, next) => {
	try {
		const tags = await Tag.find();
		return res.json(tags);
	} catch (error) {
		next(error);
	}
};

const find = async (req, res, next) => {
	try {
		const { category_id } = req.params;
		const tags = await Tag.find({ category: category_id });
		return res.json(tags);
	} catch (error) {
		next(error);
	}
};

const store = async (req, res, next) => {
	try {
		const payload = req.body;
		const tag = new Tag(payload);
		tag.save();
		return res.json(tag);
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
	try {
		const payload = req.body;
		const { id } = req.params;
		const tag = await Tag.findByIdAndUpdate(id, payload, {
			new: true,
			runValidators: true,
		});
		return res.json(tag);
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

const destroy = async (req, res, next) => {
	try {
		const tag = await Tag.findByIdAndDelete(req.params.id);
		return res.json(tag);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	index,
	find,
	store,
	update,
	destroy,
};
