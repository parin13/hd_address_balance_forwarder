(() => {
    'use strict';
    const HTTPRequest = require("request");

    module.exports = async (options) => {
        return new Promise((resolve, reject) => {
            HTTPRequest(options, (error, response, body) => {
              if (response && response.statusCode === 200) {
                const response_data = JSON.parse(response.body);
                resolve(response_data)
              } else {
                reject(error);
              }
            });
          });
    };
})();