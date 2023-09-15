const ApiService = require("./api-service");

(async () => {
  try {
    const dataset = await ApiService.fetchDataset();
    console.log(`Dataset received. partners length is ${dataset.partners.length}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})()