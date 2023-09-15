
const USER_KEY = "4f18d8981c95b987e3b7cb6e6866";
const URL = (endpoint) => `https://candidate.hubteam.com/candidateTest/v3/problem/${endpoint}?userKey=${USER_KEY}`;

const ApiService = {
  async fetchDataset() {
    const response = await fetch(URL("dataset"));
    return await response.json();
  },

  async postResult (result) {
    const response = await fetch(URL("result"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result),
    });
    return await response.json();
  }
};

module.exports = ApiService;