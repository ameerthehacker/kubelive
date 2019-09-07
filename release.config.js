module.exports = {
  branch: 'release',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'chore', scope: 'dep', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' }
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        }
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true
      }
    ]
  ]
};
