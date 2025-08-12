const environmentConfiguration = {
    dev: "https://dev.saucedemo.com", //hypothetical url
    qa: "https://qa.saucedemo.com", //hypothetical url
    prod: "https://www.saucedemo.com",
  };
  
  function getUrl(env) {
    const url = environmentConfiguration[env];
    //If an invalid url value is sent then throw an error.
    if (!url) {
      throw new Error(
        `Environments must be one of [dev, qa, prod]. Invalid input: ${env}`,
      );
    }
    return url;
  }
  
  module.exports = {
    getUrl,
  };
  