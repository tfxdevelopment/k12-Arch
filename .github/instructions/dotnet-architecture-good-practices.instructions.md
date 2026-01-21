---
description: 'Rules for good architecture practices in a dotnet application'
globs: '*.cs'
applyTo: '**/*.cs'
---
# Rules for good architecture practices

## Refactoring

1. Make sure you have a good test coverage before start refactoring.
2. Make sure you refactor and fix your tests in separated commits.
3. This helps the reviewers to understand the changes better.

## Architecture

1. Always try to use SOLID principles.
2. Always try to use Clean Architecture.
3. When ever is possible avoid introducing new dependencies.
4. Try to reuse existing methods, classes, and components.

## Naming

1. Always use meaningful names for classes, methods, and variables.
2. Do not use comments to explain what the code does.
3. If you need to add a comment to explain what the code does you need to consider refactoring the code.

## Dependencies

1. Use dependency injection to manage dependencies.
2. Avoid using static classes and methods to improve testability.
3. Use an Inversion of Control (IoC) container to manage dependencies.
