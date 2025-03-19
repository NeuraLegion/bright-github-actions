# Bright GitHub Actions

This repository is a collection of GitHub Actions, with each subfolder containing a separate action for different Bright Security functionalities.

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Fork this repository.
2. Navigate to the specific action folder you want to use (e.g., `run-discovery` or `stop-discovery`)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the action:
   ```bash
   npm run build
   ```

## Usage

1. Set `BRIGHT_TOKEN` and `KEY_GITHUB` secrets in your repository settings - with your own values.
2. Run a CI job in GitHub Actions.
3. Go to Bright Security app and check if a scan was started.

### Entry Points Parameter Support

The `entrypoints` parameter allows you to specify exact entry points to be included in the scan. 

_Example:_
```yaml
entrypoints: |
  [ "/api/v1/users", "/api/v2/products" ]
```

To apply patterns for all HTTP methods, you can set an empty array to `methods`:

```yaml
entrypoints: |
  [ { "methods": [], "patterns": [ "/api/v1/users", "/api/v2/products" ] } ]
```

Additionally, you can exclude specific entry points from the scan using the `exclude_entry_points` parameter:

```yaml
exclude_entry_points: |
  [ { "methods": [ "POST" ], "patterns": [ "users\/.+\/?$" ] } ]
```

To remove default exclusions pass an empty array as follows:

_Example:_
```yaml
exclude_entry_points: |
  []
```

To apply patterns for all HTTP methods, you can set an empty array to `methods`:

```yaml
exclude_entry_points: |
  [ { "methods": [], "patterns": [ "users\/.+\/?$" ] } ]
```

## Development

### Code Quality

This project uses ESLint for code linting. To run the linter:

```bash
npm run lint
```

### Git Hooks

This project uses Husky to manage Git hooks, ensuring code quality and consistency:

- Pre-commit: Runs linting and formatting checks
- Post-commit: Performs post-commit tasks
- Commit-msg: Validates commit messages format

### Commit Messages

We follow conventional commit messages format. Each commit message must have a specific structure:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Where `type` can be:

- build: Changes that affect the build system or external dependencies
- chore: Maintenance tasks
- ci: Changes to CI configuration files and scripts
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code
- test: Adding missing tests or correcting existing tests

Commit messages are automatically validated using commitlint.
