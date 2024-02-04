const rule = require("./no-unawaited-dot-catch-throw");
const plugin = { rules: { "enforce-no-unawaited-dot-catch-throw": rule } };
module.exports = plugin;
