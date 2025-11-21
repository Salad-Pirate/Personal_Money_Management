const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    pageLoadTimeout: 120000,
    baseUrl: "https://muict.app/salad-pirate-frontend",
  },
});

