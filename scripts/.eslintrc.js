module.exports = {
  rules: {
    // This directory contains node scripts, not app code
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }]
  }
};
