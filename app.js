var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middleware");

var app = express();

// Route List
const productRoute = require("./app/product/route");
const categoryRoute = require("./app/category/route");
const tagRoute = require("./app/tag/route");
const authRoute = require("./app/auth/route");
const deliveryAddressRoute = require("./app/delivery-address/route");
const cartRoute = require("./app/cart/route");
const orderRoute = require("./app/order/route");
const invoiceRoute = require("./app/invoice/route");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(decodeToken());

app.use("/", (req, res) => {
	res.json({
		message: "Hello to POS API Service"
	})
	// res.render("index", {
	// 	title: "welcome to POS system",
	// });
});
app.use("/auth", authRoute);
app.use("/api", productRoute);
app.use("/api", categoryRoute);
app.use("/api", tagRoute);
app.use("/api", deliveryAddressRoute);
app.use("/api", cartRoute);
app.use("/api", orderRoute);
app.use("/api", invoiceRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	// res.render("error");
	res.json({
		error: 1,
		message: err.message,
	});
});

module.exports = app;
