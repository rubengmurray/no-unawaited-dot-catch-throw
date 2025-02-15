const {RuleTester} = require("eslint");
const fooBarRule = require("./no-unawaited-dot-catch-throw");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2020 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "enforce-no-throw",
  fooBarRule,
  {
    valid: [
      {
        code: `
          const qFunc = async () => ''; 
          qFunc().catch(e => console.log(e));
        `,
      }, 
      {
        code: `
          const qFunc = async () => ''; 
          qFunc().catch(e => { console.log(e) });
        `,
      }, 
      {
        code: `
          const qFunc = async () => ''; 
          qFunc().catch(e => { console.log(e); });
        `,
      }, 
      {
        code: `
          const qFunc = async () => ''; 
          const start = async () => await qFunc().catch(e => console.log(e));
        `,
      },
      {
        code: `
          const qFunc = async () => ''; 
          const start = async () => qFunc().catch(e => console.log(e));
        `,
      },
      {
        code: `
          const qFunc = async () => ''; 
          const start = async () => qFunc().catch(e => { console.log(e); throw e; });
        `,
      },
      {
        code: `
          const qFunc = async () => ''; 
          const start = async () => qFunc().catch(function (e) { 
            console.log(e); 
            throw e; 
          });
        `,
      },
      {
        code: `
          const qFunc = async () => ''; 
          const start = async () => { 
            return qFunc().catch(e => {
              console.log(e); 
              throw e;
            }) 
          };
        `,
      },
    ],
    invalid: [
      {
        code: `
          const pFunc = async () => ''; 
          pFunc().catch(e => { throw e; });
        `,
        output: `
          const pFunc = async () => ''; 
          pFunc().catch(e => { });
        `,
        errors: 1,
      },
      {
        code: `
          const pFunc = async () => ''; 
          pFunc().catch(e => { console.error(e); throw e; });`,
        output: `
          const pFunc = async () => ''; 
          pFunc().catch(e => { console.error(e); });`,
        errors: 1,
      }
    ],
  }
);

console.log("All tests passed!");
