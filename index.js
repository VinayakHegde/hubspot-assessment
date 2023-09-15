const ApiService = require("./api-service");
const aggregate = require("./aggregate");

(async () => {
  try {
    const dataset = await ApiService.fetchDataset();
    console.log(`Dataset received. partners length is ${dataset.partners.length}`);
    const result = aggregate(dataset.partners);
    console.log(`Aggregated Result is ${JSON.stringify(result, null, 2)}`);
    try {
      const response = await ApiService.postResult(result);
      console.log('Success! Response from server', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(`Error processing posted results: ${error.message}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})()