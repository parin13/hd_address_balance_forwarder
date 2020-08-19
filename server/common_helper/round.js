(() => {
    'use strict';

    module.exports = async (number, round_digit) => {
        return new Promise((resolve, reject) => {
            if (round_digit === undefined) {
                round_digit = 0;
              }
            var multiplicator = Math.pow(10, round_digit);
            number = parseFloat((number * multiplicator).toFixed(11));
            var test =(Math.round(number) / multiplicator);
            resolve (test.toFixed(round_digit));            
          });
    };
})();