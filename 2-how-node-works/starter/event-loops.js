const fs = require(`fs`);
const crypto = require(`crypto`);

const start = Date.now();

// Doesn't work on windows
// process.env.UV_THREADPOOL_SIZE = 1;

console.log(`Top Level 1`);

setTimeout(() => {
  console.log(`Timer 1`);
}, 0);

setImmediate(() => {
  console.log(`Immediate 1`);
});

fs.readFile(`./test-file.txt`, () => {
  console.log(`I/O`);

  setTimeout(() => {
    console.log(`Timer 2`);
  }, 0);

  setTimeout(() => {
    console.log(`Timer 3`);
  }, 1000);

  setImmediate(() => {
    console.log(`Immediate 2`);
  });

  process.nextTick(() => {
    console.log(`tick`);
  });

  crypto.pbkdf2(`password`, `salt`, 100000, 1024, `sha512`, () => {
    console.log(Date.now() - start, `encrypt`);
  });
  crypto.pbkdf2(`password`, `salt`, 100000, 1024, `sha512`, () => {
    console.log(Date.now() - start, `encrypt`);
  });
  crypto.pbkdf2(`password`, `salt`, 100000, 1024, `sha512`, () => {
    console.log(Date.now() - start, `encrypt`);
  });
  crypto.pbkdf2(`password`, `salt`, 100000, 1024, `sha512`, () => {
    console.log(Date.now() - start, `encrypt`);
  });
  crypto.pbkdf2(`password`, `salt`, 100000, 1024, `sha512`, () => {
    console.log(Date.now() - start, `encrypt`);
  });
});
