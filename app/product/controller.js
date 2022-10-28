const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

const index = async (req, res, next) => {
	try {
		let {
			skip = 0,
			limit = 10,
			q = "",
			category = "",
			tags = [],
		} = req.query;

		let criteria = {};

		if (q) {
			criteria = {
				...criteria,
				name: { $regex: `${q}`, $options: "i" },
			};
		}

		if (category) {
			let categoryResult = await Category.findOne({
				name: { $regex: category, $options: "i" },
			});
			if (categoryResult) {
				criteria = {
					...criteria,
					category: categoryResult._id,
				};
			}
		}

		if (tags.length > 0) {
			let tagResult = await Tag.find({
				name: { $in: tags },
			});
			if (tagResult.length > 0) {
				criteria = {
					...criteria,
					tags: { $in: tagResult.map((tag) => tag._id) },
				};
			}
		}

		const count = await Product.find(criteria).countDocuments();
		const product = await Product.find(criteria)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate("category")
			.populate("tags");
		return res.json({
			data: product,
			count,
		});
	} catch (error) {
		next(error);
	}
};

const find = async (req, res, next) => {
	try {
		const products = await Product.findById(req.params.id)
			.populate("category")
			.populate("tags");
		return res.json(products);
	} catch (error) {
		next(error);
	}
};

const store = async (req, res, next) => {
	try {
		let payload = req.body;
		if (payload.category) {
			let category = await Category.findOne({
				name: { $regex: payload.category, $options: "i" },
			});
			if (category) {
				payload = { ...payload, category: category._id };
			} else {
				delete payload.category;
			}
		}

		if (payload.tags && payload.tags.length > 0) {
			let tags = await Tag.find({
				name: { $in: payload.tags },
			});
			if (tags.length) {
				payload = { ...payload, tags: tags.map((tag) => tag._id) };
			} else {
				delete payload.tags;
			}
		}

		if (req.file) {
			let tmp_path = req.file.path;
			let originalExt =
				req.file.originalname.split(".")[
					req.file.originalname.split(".").length - 1
				];
			let filename = `${req.file.filename}.${originalExt}`;
			let target_path = path.resolve(
				config.rootPath,
				`public/images/products/${filename}`
			);

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);

			src.pipe(dest);
			src.on("end", async () => {
				try {
					let product = new Product({
						...payload,
						image_url: filename,
					});
					await product.save();
					return res.json(product);
				} catch (error) {
					fs.unlinkSync(target_path);
					if (error && error.name === "ValidationError") {
						return res.json({
							error: 1,
							message: error.message,
							fields: error.errors,
						});
					}
					next(error);
				}
			});

			src.on("error", async () => {
				next(error);
			});
		} else {
			let product = new Product(payload);
			await product.save();
			return res.json(product);
		}
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		let payload = req.body;
		let { id } = req.params;

		if (payload.category) {
			let category = await Category.findOne({
				name: { $regex: payload.category },
			});
			if (category) {
				payload = { ...payload, category: category._id };
			} else {
				delete payload.category;
			}
		}

		if (payload.tags && payload.tags.length > 0) {
			let tags = await Tag.find({
				name: { $in: payload.tags },
			});
			if (tags.length) {
				payload = { ...payload, tags: tags.map((tag) => tag._id) };
			} else {
				delete payload.tags;
			}
		}

		if (req.file) {
			let tmp_path = req.file.path;
			let originalExt =
				req.file.originalname.split(".")[
					req.file.originalname.split(".").length - 1
				];
			let filename = `${req.file.filename}.${originalExt}`;
			let target_path = path.resolve(
				config.rootPath,
				`public/images/products/${filename}`
			);

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);

			src.pipe(dest);
			src.on("end", async () => {
				try {
					let product = await Product.findById(id);
					let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
					if (fs.existsSync(currentImage)) {
						fs.unlinkSync(currentImage);
					}
					product = await Product.findByIdAndUpdate(
						id,
						{
							...payload,
							image_url: filename,
						},
						{
							new: true,
							runValidators: true,
						}
					);
					return res.json(product);
				} catch (error) {
					fs.unlinkSync(target_path);
					if (error && error.name === "ValidationError") {
						return res.json({
							error: 1,
							message: error.message,
							fields: error.errors,
						});
					}
					next(error);
				}
			});

			src.on("error", async () => {
				next(error);
			});
		} else {
			let product = await Product.findByIdAndUpdate(id, payload, {
				new: true,
				runValidators: true,
			});
			return res.json(product);
		}
	} catch (error) {
		next(error);
	}
};

const destroy = async (req, res, next) => {
	try {
		let product = await Product.findByIdAndDelete(req.params.id);
		let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
		if (fs.existsSync(currentImage)) {
			fs.unlinkSync(currentImage);
		}
		return res.json(product);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	store,
	find,
	index,
	update,
	destroy,
};
