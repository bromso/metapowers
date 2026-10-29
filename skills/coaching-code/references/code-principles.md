# Code Principles

## SOLID
- **S — Single Responsibility:** A module should have one reason to change
- **O — Open/Closed:** Open for extension, closed for modification
- **L — Liskov Substitution:** Subtypes must be substitutable for their base types
- **I — Interface Segregation:** Many specific interfaces over one general-purpose
- **D — Dependency Inversion:** Depend on abstractions, not concretions

## Clean Code
- **Naming:** Names should reveal intent. If a name needs a comment, the name is wrong.
- **Functions:** Small, do one thing, one level of abstraction
- **Comments:** Code should be self-documenting. Comments explain "why", not "what"
- **Formatting:** Consistent style, logical grouping, vertical density reflects relatedness
- **Error handling:** Don't return null, don't pass null, use exceptions for exceptional cases

## DRY / YAGNI / KISS
- **DRY:** Don't Repeat Yourself — but three similar lines is better than a premature abstraction
- **YAGNI:** Don't build features you don't need yet
- **KISS:** The simplest solution that works is the best solution

## Security (OWASP Top 10)
- Validate all input at system boundaries
- Parameterize queries (no string concatenation for SQL)
- Encode output to prevent XSS
- Use authentication and authorization properly
- Don't store secrets in code
- Keep dependencies updated

## Performance
- Measure before optimizing
- Avoid N+1 queries
- Use appropriate data structures
- Cache at the right layer
- Lazy load when possible

## Database
- Normalize data to eliminate redundancy
- Index columns used in WHERE, JOIN, ORDER BY
- Avoid SELECT * — specify columns
- Use transactions for multi-step operations
- Design for query patterns, not just data relationships

## Testing
- Test behavior, not implementation
- Each test should verify one thing
- Tests should be fast, isolated, repeatable
- Test names should describe the scenario
