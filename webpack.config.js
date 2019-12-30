const path = require('path')

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
      alias: {
        react: path.resolve(__dirname, 'node_modules', 'react'),
        dbStuff : path.resolve('./src/dbStuff'),
        services : path.resolve('./src/services'),
        utils : path.resolve('./src/utils'),
        appTypes : path.resolve('./src/appTypes'),
        jobs : path.resolve('./src/jobs'),
        appData : path.resolve('./src/appData'),
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    target: 'async-node',
    mode: 'development',
  }

  if (args.targetFile === 'createUpdateSimasFilters') {
    config.entry = './src/jobs/createUpdateSimasFilters.ts'
    config.output.filename = 'createUpdateSimasFilters.js'
  }

  if (args.targetFile === 'insertUpdateDbAutoData') {
    config.entry = './src/jobs/insertUpdateDbAutoData.ts'
    config.output.filename = 'insertUpdateDbAutoData.js'
  }

  if (args.targetFile === 'insertUpdateDbProviders') {
    config.entry = './src/jobs/insertUpdateDbProviders.ts'
    config.output.filename = 'insertUpdateDbProviders.js'
  }

  if (args.targetFile === 'collector') {
    config.entry = './src/jobs/collector.ts'
    config.output.filename = 'collector.js'
  }

  if (args.targetFile === 'debuger') {
    config.entry = './src/jobs/debuger.ts'
    config.output.filename = 'debuger.js'
  }

  return config
}
