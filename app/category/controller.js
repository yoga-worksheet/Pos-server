const Category = require("./model");

const index = async (req, res, next) => {
	try {
		const categories = await Category.find();
		return res.json(categories);
	} catch (error) {
		next(error);
	}
};

const store = async (req, res, next) => {
	try {
		let payload = req.body;
		const category = new Category(payload);
		await category.save();
		return res.json(category);
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
		const category = await Category.findByIdAndUpdate(id, payload, {
			new: true,
			runValidators: true,
		});
		return res.json(category);
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
		const category = await Category.findByIdAndDelete(req.params.id);
		return res.json(category);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	index,
	store,
	update,
    destroy
};
