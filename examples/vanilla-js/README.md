# Vanilla Javascript demo
This demo contains a very simple and straightforward example of how to use the `@sqlite.org/sqlite-wasm` npm library.

## Dependencies
* Typescript
* Rollup

## Steps
To test it out for yourself, clone this repository and execute these steps:

1- Execute `npm install`

2- Execute `npm run build`

3.a - Execute `npm run start:server` if you want to run without COOP headers ("OPFS_WORKER" **will not** work)

3.b - Execute `npm run start:server:coop` if you want to run with COOP headers being returned ("OPFS_WORKER" **will** work)


4- Open your browser, go to `http://localhost:3000`, open the DevTools and you should see the results outputted.
