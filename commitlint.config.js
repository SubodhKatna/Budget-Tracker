/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
    extends: [],
    plugins: [
      {
        rules: {
          'header-min-length': ({ header }) => {
            return [
              header.length >= 20,
              'Commit message must be at least 20 characters long.',
            ];
          },
          'header-case-start-capital': ({ header }) => {
            return [
              header[0] === header[0]?.toUpperCase(),
              'Commit message must start with a capital letter.',
            ];
          },
          'header-end-period': ({ header }) => {
            return [
              header.trim().endsWith('.'),
              'Commit message must end with a period.',
            ];
          },
        },
      },
    ],
    rules: {
      'header-min-length': [2, 'always'],
      'header-case-start-capital': [2, 'always'],
      'header-end-period': [2, 'always'],
    },
  };
  