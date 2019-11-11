const path = require('path');

module.exports = function(env, args) {
  const config = {
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    target: 'async-node',
    mode: 'development'
  }


  if(args.targetFile === 'createUpdateSimasFilters') {
    config.entry = './jobs/createUpdateSimasFilters.ts'
    config.output.filename = 'createUpdateSimasFilters.js'
  }

  return config
}
