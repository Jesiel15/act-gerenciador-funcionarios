module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("karma-jasmine-html-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false,
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [
        { type: "html", subdir: "report-html" },
        { type: "text-summary" },
      ],
    },
    reporters: ["progress", "coverage", "kjhtml"],
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
