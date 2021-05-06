import dts from 'rollup-plugin-dts';

// Rollup the TS definitions generated in ./lib

export default [
   {
      input: "./lib/functions.d.ts",
      output: [{ file: "types/functions.d.ts", format: "es" }],
      plugins: [dts()],
   },
];
