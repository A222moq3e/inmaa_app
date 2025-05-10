module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@utils': './src/utils',
            '@services': './src/services',
            '@contexts': './src/contexts',
            '@theme': './src/theme',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
}; 