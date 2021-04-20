# bull.js

Bull is a Node library that implements a fast and robust queue system based on redis.

Errors:

- parasite queue

  - dependency - this is `JS` magic. If u import from file variable and call it ex. `console.log(VARIABLE)`, it will parse whole file and init queue

    1. yarn dependency:publisher

    2. analyze result, u see only 1 queue

    3. in /src/cases/dependency/publisher/app.ts write `console.log(SERVICE_NAME)`

    4. yarn dependency:publisher

  - self call

- wrong context - if u call `item.process` u set context for node proccess another word is `consumer`. this is very sensetive if u use kubernets and use services or files from services (domain arch) as dependencies in monolite

[bull.js get started](https://optimalbits.github.io/bull/)

[bull.js git](https://github.com/OptimalBits/bull)
