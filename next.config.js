module.exports = {
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
        type: 'json',
      },
    )
    return config
  }
}
