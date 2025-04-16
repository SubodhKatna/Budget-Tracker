const { headers } = require('next/headers');

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
    extends: [],
    rules: {
      'header-min-length': [2, 'always'],
      'header-case-start-capital': [2, 'always'],
      'header-end-period': [2, 'always'],
    },
    plugins: [
      {
        rules: {
          'header-case-start-capital': ({raw}) => {
            return [
              /^[A-Z]/.test(raw),
              'Commit message must start with a capital letter',
            ]
          },
          'header-end-period': ({header}) => {
            return [/\.$/.test(header), 'Commit message should end with a period'];
          }
        }
      }
    ]

  };
  