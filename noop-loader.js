// Returns the source without change. Logs the path that the loader gets.
module.exports = function (source) {
  if (this.resource.includes("#")) {
    console.log("[noop-loader]", {
      resourcePath: this.resourcePath,
      resourceFragment: this.resourceFragment,
    });
  }
  return source;
};
