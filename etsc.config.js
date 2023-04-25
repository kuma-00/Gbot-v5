import {sync} from "rimraf";
import cpy from "cpy";

const config = {
  // Supports all esbuild.build options
  esbuild: {
    minify: false,
    format: 'esm',
  },
  // Prebuild hook
  prebuild: async () => {
    console.log("prebuild");
    sync("./dist"); // clean up dist folder
  },
  // Postbuild hook
  postbuild: async () => {
    console.log("postbuild");
    await cpy(
      [
        "src/**/*.graphql", // Copy all .graphql files
        "!src/**/*.{tsx,ts,js,jsx}", // Ignore already built files
      ],
      "dist"
    );
  },
};

export default config;