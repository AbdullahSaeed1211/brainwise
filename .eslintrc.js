module.exports = {
  // ... existing config
  overrides: [
    {
      files: ["components/ui/**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
} 