import path from "path";
const __dirname = new URL(".", import.meta.url).pathname;

if (process.env.TEST_NAME === undefined) {
  throw new Error("TEST_NAME environment variable is not defined");
}

export default config(process.env.TEST_NAME);

export function config(name) {
  return {
    mode: "production",
    entry: path.resolve(`${__dirname}/lib/${name}.js`),
    output: {
      path: path.resolve(`${__dirname}/results`),
      filename: `${name}.webpack.js`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { modules: false }]],
            },
          },
        },
      ],
    },
  };
}
