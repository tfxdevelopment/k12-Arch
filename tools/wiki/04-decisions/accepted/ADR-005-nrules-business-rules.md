# ADR-005: NRules for Business Rules Engine

**Status:** Accepted
**Date:** 2024-11-23
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), K12 Dev Team
**Technical Story:** Rules engine needed for complex business logic orchestration

## Context and Problem Statement

The K12 MyPortal application requires a sophisticated business rules engine to handle complex decision-making and orchestration within the Business Logic Layer (BLL). The system must:

- Coordinate business logic with rules to make determinations
- Proceed with specific actions based on rule evaluations
- Handle complex eligibility calculations
- Manage interdependent rules (Rule of Rules)
- Maintain all rules in C# source code (no external JSON/XML configuration)
- Support high testability and type safety

## Decision Drivers

* **Code-based rules**: All rules must be defined in C# source code for compile-time type safety
* **Orchestration support**: Must execute actions, not just validate
* **Composability**: Support complex rule correlation and dependencies
* **Developer experience**: Fluent API for readable rule definition
* **Testability**: Rules must be easily unit testable
* **Performance**: Handle high-volume, complex decision scenarios
* **Community support**: Active community and documentation

## Considered Options

1. **NRules** - Rete-based inference engine with Fluent C# API
2. **FluentValidation** - Validation framework (adapted for rules)
3. **Custom Rule Engine Pattern** - Hand-rolled Strategy/Specification pattern
4. **RulesEngine (Microsoft)** - JSON-based rules engine (rejected - violates requirement)

## Decision Outcome

**Chosen option:** "NRules", because it is the only solution that natively supports:
1. Complex fact correlation (Rule of Rules)
2. Action execution via Then() clause
3. Forward-chaining inference
4. Compile-time type safety
5. Rete algorithm optimization for complex scenarios

### Consequences

#### Good
- Native support for orchestration actions via Then() clause
- Efficient Rete algorithm for complex fact correlation
- Strongly-typed, compile-time validation
- Excellent composability for complex business logic
- MIT licensed, active community
- No external configuration files to manage

#### Bad
- Learning curve for Rete algorithm concepts
- Initial memory overhead for network creation
- Requires careful session management in stateless Azure environment
- Less mainstream than FluentValidation

#### Neutral
- Need to treat ISessionFactory as singleton
- Must create/dispose ISession per request
- Rules defined as C# classes (trade-off: less business-user-configurable, more reliable)

## Pros and Cons of the Options

### NRules (Chosen)

* **Pro:** Native Then() clause for action execution
* **Pro:** Rete algorithm optimized for complex pattern matching
* **Pro:** Forward-chaining supports "Rule of Rules"
* **Pro:** Fluent C# API with type safety
* **Pro:** Excellent for complex eligibility logic
* **Pro:** MIT licensed, open source
* **Con:** Learning curve for Rete concepts
* **Con:** Memory overhead for Rete network
* **Con:** Session management complexity in stateless environment

### FluentValidation

* **Pro:** Best-in-class Fluent API for validation
* **Pro:** Massive community (most popular .NET validation library)
* **Pro:** Excellent for input validation
* **Pro:** Highly testable
* **Con:** Designed for validation, not orchestration
* **Con:** No native action execution support
* **Con:** Sequential execution only (no inference)
* **Con:** Would require architectural workarounds for BLL orchestration

### Custom Rule Engine Pattern

* **Pro:** Complete control over execution order and logic
* **Pro:** Zero third-party dependencies
* **Pro:** Maximum testability (isolated classes)
* **Pro:** Simple for sequential policies
* **Con:** High boilerplate to implement
* **Con:** Manual management of rule dependencies
* **Con:** No Rete optimization for complex scenarios
* **Con:** Maintenance burden for core engine features

### RulesEngine (Microsoft) - REJECTED

* **Pro:** Powerful expression engine
* **Pro:** Dynamic rule modification without recompilation
* **Con:** ❌ Requires JSON configuration (violates requirement)
* **Con:** ❌ No compile-time type safety
* **Con:** ❌ Runtime expression parsing errors possible

## Technical Details

### NRules Implementation Pattern

```csharp
// Rule definition using Fluent API
public class EligibilityRule : Rule
{
    public override void Define()
    {
        Application application = default!;
        Household household = default!;

        When()
            .Match<Application>(() => application,
                a => a.Status == ApplicationStatus.Submitted)
            .Match<Household>(() => household,
                h => h.Id == application.HouseholdId,
                h => h.Income < 100000);

        Then()
            .Do(ctx =>
            {
                application.SetEligible();
                ctx.Insert(new EligibilityDetermined(application.Id));
            });
    }
}

// Session management in Azure Functions
public class BusinessLogicService
{
    private readonly ISessionFactory _sessionFactory; // Singleton

    public async Task ProcessApplication(Application app)
    {
        using var session = _sessionFactory.CreateSession();
        session.Insert(app);
        session.Insert(app.Household);
        session.Fire(); // Execute matching rules
    }
}
```

### Layered Strategy

1. **FluentValidation**: Input validation at service boundary (DTOs)
2. **NRules**: Complex decision orchestration in BLL
3. **Custom Pattern**: Simple sequential policies (if needed)

## Validation

Success metrics:
- Rules are easily unit testable with high coverage (>90%)
- Complex eligibility logic is maintainable by team
- Performance acceptable for high-volume periods
- New rules can be added without modifying existing rules

## Related Decisions

* [ADR-002](ADR-002-dapper-over-entity-framework.md) - Dapper for data access (impacts how facts are loaded)
* ADR-007 - .NET 8 and Azure Functions (impacts session management)

## References

* [Confluence: Rule Engine (.NET/C#)](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4420075531)
* [NRules Official Documentation](https://nrules.net/)
* [NRules Fluent DSL](https://nrules.net/articles/fluent-rules-dsl.html)
* [Rete Algorithm Explanation](https://decisions.com/the-rete-algorithm-in-decisions-and-rule-net/)
