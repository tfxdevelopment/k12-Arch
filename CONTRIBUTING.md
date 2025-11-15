# Contributing to k12-Arch

Thank you for your interest in contributing to k12-Arch! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Issues

- Check if the issue already exists
- Use a clear and descriptive title
- Provide detailed steps to reproduce the problem
- Include expected vs actual behavior
- Add relevant screenshots or code samples

### Suggesting Enhancements

- Use a clear and descriptive title
- Provide a detailed description of the enhancement
- Explain why this enhancement would be useful
- Include examples of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

## Development Setup

### Prerequisites

- Node.js 14+ (for Node.js tools)
- .NET 8.0+ (for .NET tools)
- Git

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/k12-Arch.git
cd k12-Arch

# For Node.js tools
cd tools/node
npm install

# For .NET tools
cd tools/dotnet
dotnet restore
dotnet build
```

## Coding Standards

### General Guidelines

- Write clear, self-documenting code
- Follow existing code style and patterns
- Add comments for complex logic
- Keep functions/methods small and focused
- Write meaningful commit messages

### JavaScript/Node.js

- Use ES6+ features
- Follow JSDoc for documentation
- Use meaningful variable names
- Handle errors appropriately
- Write unit tests for new features

### C#/.NET

- Follow Microsoft's C# coding conventions
- Use XML documentation comments
- Follow SOLID principles
- Use async/await for asynchronous operations
- Write unit tests for new features

### Wiki Documentation

- Use clear, concise language
- Include code examples in multiple languages
- Add cross-references to related topics
- Keep examples practical and realistic
- Update the table of contents

## Wiki Contributions

When adding or updating wiki content:

1. **Follow the existing structure**:
   - Patterns: `/wiki/patterns/`
   - Principles: `/wiki/principles/`
   - Guides: `/wiki/guides/`

2. **Use the template format**:
   ```markdown
   # Pattern/Principle Name

   **Category**: 
   **Complexity**: 
   **Use Case**: 

   ## Overview
   [Clear description]

   ## Key Concepts
   [Main concepts]

   ## Benefits
   ✅ Benefit 1
   ✅ Benefit 2

   ## Challenges
   ⚠️ Challenge 1
   ⚠️ Challenge 2

   ## Implementation
   [Code examples]

   ## When to Use
   ✅ Use when...
   ❌ Avoid when...

   ## Related Patterns
   [Links to related content]
   ```

3. **Include code examples** in both JavaScript and C# when applicable

4. **Add cross-references** to related patterns and principles

5. **Keep it LLM-friendly**:
   - Use clear hierarchical structure
   - Include metadata tags
   - Use consistent formatting
   - Provide complete examples

## Tool Contributions

### Adding New Pattern Implementations

1. **Node.js**:
   - Add implementation in `tools/node/src/patterns/`
   - Export from `src/index.js`
   - Add tests
   - Update README

2. **.NET**:
   - Add implementation in `tools/dotnet/K12Arch.Tools/Patterns/`
   - Add XML documentation
   - Add unit tests
   - Update README

### Adding New Generators

1. Create generator class
2. Add CLI command
3. Include templates
4. Write tests
5. Document usage

## Testing

### Node.js
```bash
cd tools/node
npm test
npm run lint
```

### .NET
```bash
cd tools/dotnet
dotnet test
dotnet format --verify-no-changes
```

## Documentation

- Update README files for significant changes
- Add/update wiki documentation for patterns
- Include code examples
- Update API documentation

## Commit Messages

Follow the conventional commits specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(node): add saga pattern implementation
fix(dotnet): correct repository delete method
docs(wiki): add hexagonal architecture pattern
```

## Review Process

1. All pull requests require review
2. Automated checks must pass
3. Documentation must be updated
4. Tests must be included for new features
5. Code must follow style guidelines

## Questions?

- Open an issue for questions
- Check existing issues and discussions
- Review wiki documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to k12-Arch! 🎉
