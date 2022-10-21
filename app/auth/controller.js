const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
	try {
		const payload = req.body;
		return res.json(payload);
		const user = new User(payload);
		await user.save();
		return res.json(user);
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

const localStrategy = async (email, password, done) => {
	try {
		let user = await User.findOne({ email }).select(
			"-__v -createdAt -updatedAt -cart_items -token"
		);
		if (!user) return done();
		if (bcrypt.compareSync(password, user.password)) {
			({ password, ...userWithoutPassword } = user.toJSON());
			return done(null, userWithoutPassword);
		}
	} catch (error) {
		done(error, null);
	}
	done();
};

const login = (req, res, next) => {
	passport.authenticate("local", async (error, user) => {
		if (error) return next(error);
		if (!user)
			return res.json({
				error: 1,
				message: "Email or Password incorrect",
			});
		let signed = jwt.sign(user, config.secretKey);
		await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
		return res.json({
			message: "Login successfully",
			user,
			token: signed,
		});
	})(req, res, next);
};

const logout = async (req, res, next) => {
	let token = getToken(req);
	let user = await User.findOneAndUpdate(
		{ token: { $in: [token] } },
		{ $pull: { token: token } },
		{ useFindAndModify: false }
	);
	if (!token || !user) {
		return res.json({
			error: 1,
			message: "User not found",
		});
	}
	return res.json({
		error: 0,
		message: "Logout succesfully",
	});
};

const me = (req, res, next) => {
	if (!req.user) {
		return res.json({
			error: 1,
			message: "You are not logged in or token expired",
		});
	}
	return res.json(req.user);
};

module.exports = {
	register,
	localStrategy,
	login,
	logout,
	me,
};
