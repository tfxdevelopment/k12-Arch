# SOLID Principles

**Category**: Design Principles  
**Complexity**: Fundamental  
**Use Case**: Object-oriented design and architecture  

## Overview

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. Introduced by Robert C. Martin (Uncle Bob), these principles are fundamental to creating well-structured object-oriented code.

## The Five Principles

### S - Single Responsibility Principle (SRP)
### O - Open/Closed Principle (OCP)
### L - Liskov Substitution Principle (LSP)
### I - Interface Segregation Principle (ISP)
### D - Dependency Inversion Principle (DIP)

---

## Single Responsibility Principle (SRP)

**"A class should have only one reason to change."**

Each class should have one, and only one, responsibility. A responsibility is a reason to change.

### ❌ Bad Example

```javascript
// This class has multiple responsibilities
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // User data management
  getName() { return this.name; }
  getEmail() { return this.email; }

  // Database operations
  save() {
    db.execute('INSERT INTO users VALUES (?, ?)', [this.name, this.email]);
  }

  // Email operations
  sendWelcomeEmail() {
    emailService.send(this.email, 'Welcome!', 'Thanks for joining...');
  }

  // Validation
  isValid() {
    return this.email.includes('@') && this.name.length > 0;
  }

  // Formatting/Presentation
  toJSON() {
    return { name: this.name, email: this.email };
  }
}
```

### ✅ Good Example

```javascript
// User entity - only manages user data
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getName() { return this.name; }
  getEmail() { return this.email; }
}

// Repository - handles data persistence
class UserRepository {
  save(user) {
    db.execute('INSERT INTO users VALUES (?, ?)', 
      [user.getName(), user.getEmail()]);
  }
}

// Validator - handles validation
class UserValidator {
  isValid(user) {
    return user.getEmail().includes('@') && 
           user.getName().length > 0;
  }
}

// Email service - handles email operations
class UserEmailService {
  sendWelcomeEmail(user) {
    emailService.send(user.getEmail(), 'Welcome!', 'Thanks for joining...');
  }
}

// Formatter - handles presentation
class UserFormatter {
  toJSON(user) {
    return { 
      name: user.getName(), 
      email: user.getEmail() 
    };
  }
}
```

### C# Example

```csharp
// ❌ Bad - Multiple responsibilities
public class Employee
{
    public string Name { get; set; }
    public decimal Salary { get; set; }

    // Business logic
    public decimal CalculateBonus() { /* ... */ }

    // Database operations
    public void Save() { /* ... */ }

    // Reporting
    public string GenerateReport() { /* ... */ }
}

// ✅ Good - Single responsibility each
public class Employee
{
    public string Name { get; set; }
    public decimal Salary { get; set; }
}

public class BonusCalculator
{
    public decimal Calculate(Employee employee) { /* ... */ }
}

public class EmployeeRepository
{
    public void Save(Employee employee) { /* ... */ }
}

public class EmployeeReportGenerator
{
    public string Generate(Employee employee) { /* ... */ }
}
```

---

## Open/Closed Principle (OCP)

**"Software entities should be open for extension but closed for modification."**

You should be able to extend a class's behavior without modifying it.

### ❌ Bad Example

```javascript
class DiscountCalculator {
  calculateDiscount(customer) {
    if (customer.type === 'regular') {
      return customer.orderTotal * 0.05;
    } else if (customer.type === 'premium') {
      return customer.orderTotal * 0.10;
    } else if (customer.type === 'vip') {
      return customer.orderTotal * 0.20;
    }
    // Adding new customer type requires modifying this method
  }
}
```

### ✅ Good Example

```javascript
// Base class/interface
class DiscountStrategy {
  calculate(orderTotal) {
    throw new Error('Must implement calculate method');
  }
}

// Concrete implementations
class RegularDiscount extends DiscountStrategy {
  calculate(orderTotal) {
    return orderTotal * 0.05;
  }
}

class PremiumDiscount extends DiscountStrategy {
  calculate(orderTotal) {
    return orderTotal * 0.10;
  }
}

class VIPDiscount extends DiscountStrategy {
  calculate(orderTotal) {
    return orderTotal * 0.20;
  }
}

// Calculator doesn't need modification for new discount types
class DiscountCalculator {
  constructor(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  calculateDiscount(orderTotal) {
    return this.discountStrategy.calculate(orderTotal);
  }
}

// Usage
const calculator = new DiscountCalculator(new PremiumDiscount());
const discount = calculator.calculateDiscount(1000); // 100
```

### C# Example

```csharp
// ✅ Good - Using interfaces and polymorphism
public interface IDiscountStrategy
{
    decimal Calculate(decimal orderTotal);
}

public class RegularDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal orderTotal) => orderTotal * 0.05m;
}

public class PremiumDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal orderTotal) => orderTotal * 0.10m;
}

public class DiscountCalculator
{
    private readonly IDiscountStrategy _strategy;

    public DiscountCalculator(IDiscountStrategy strategy)
    {
        _strategy = strategy;
    }

    public decimal Calculate(decimal orderTotal)
    {
        return _strategy.Calculate(orderTotal);
    }
}
```

---

## Liskov Substitution Principle (LSP)

**"Objects of a superclass should be replaceable with objects of a subclass without breaking the application."**

Derived classes must be substitutable for their base classes.

### ❌ Bad Example

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(width) { this.width = width; }
  setHeight(height) { this.height = height; }
  
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width; // Forces square constraint
  }

  setHeight(height) {
    this.width = height;
    this.height = height; // Forces square constraint
  }
}

// This breaks LSP!
function testArea(rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  console.assert(rectangle.getArea() === 20); // Fails for Square!
}
```

### ✅ Good Example

```javascript
class Shape {
  getArea() {
    throw new Error('Must implement getArea');
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  setWidth(width) { this.width = width; }
  setHeight(height) { this.height = height; }
  
  getArea() { return this.width * this.height; }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  setSide(side) { this.side = side; }
  
  getArea() { return this.side * this.side; }
}

// Now both can be used as Shape without issues
function printArea(shape) {
  console.log(`Area: ${shape.getArea()}`);
}
```

### C# Example

```csharp
// ✅ Good - Proper abstraction
public abstract class Shape
{
    public abstract double GetArea();
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double GetArea() => Width * Height;
}

public class Square : Shape
{
    public double Side { get; set; }

    public override double GetArea() => Side * Side;
}
```

---

## Interface Segregation Principle (ISP)

**"Clients should not be forced to depend on interfaces they don't use."**

Many client-specific interfaces are better than one general-purpose interface.

### ❌ Bad Example

```javascript
// Fat interface
class Worker {
  work() { throw new Error('Must implement'); }
  eat() { throw new Error('Must implement'); }
  sleep() { throw new Error('Must implement'); }
}

class HumanWorker extends Worker {
  work() { console.log('Working...'); }
  eat() { console.log('Eating...'); }
  sleep() { console.log('Sleeping...'); }
}

class RobotWorker extends Worker {
  work() { console.log('Working...'); }
  eat() { throw new Error('Robots don\'t eat!'); } // Forced to implement
  sleep() { throw new Error('Robots don\'t sleep!'); } // Forced to implement
}
```

### ✅ Good Example

```javascript
// Segregated interfaces
class Workable {
  work() { throw new Error('Must implement'); }
}

class Eatable {
  eat() { throw new Error('Must implement'); }
}

class Sleepable {
  sleep() { throw new Error('Must implement'); }
}

class HumanWorker extends Workable {
  constructor() {
    super();
    this.eatable = new HumanEatable();
    this.sleepable = new HumanSleepable();
  }

  work() { console.log('Working...'); }
}

class RobotWorker extends Workable {
  work() { console.log('Working...'); }
  // No need to implement eat() or sleep()
}
```

### C# Example

```csharp
// ✅ Good - Segregated interfaces
public interface IWorkable
{
    void Work();
}

public interface IEatable
{
    void Eat();
}

public interface ISleepable
{
    void Sleep();
}

public class HumanWorker : IWorkable, IEatable, ISleepable
{
    public void Work() { /* ... */ }
    public void Eat() { /* ... */ }
    public void Sleep() { /* ... */ }
}

public class RobotWorker : IWorkable
{
    public void Work() { /* ... */ }
    // No need to implement Eat() or Sleep()
}
```

---

## Dependency Inversion Principle (DIP)

**"Depend on abstractions, not concretions."**

High-level modules should not depend on low-level modules. Both should depend on abstractions.

### ❌ Bad Example

```javascript
// High-level module depends on low-level module
class MySQLDatabase {
  save(data) {
    console.log('Saving to MySQL:', data);
  }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency
  }

  saveUser(user) {
    this.database.save(user);
  }
}
```

### ✅ Good Example

```javascript
// Abstraction
class Database {
  save(data) {
    throw new Error('Must implement save');
  }
}

// Low-level modules
class MySQLDatabase extends Database {
  save(data) {
    console.log('Saving to MySQL:', data);
  }
}

class MongoDatabase extends Database {
  save(data) {
    console.log('Saving to MongoDB:', data);
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(database) {
    this.database = database; // Injected dependency
  }

  saveUser(user) {
    this.database.save(user);
  }
}

// Usage
const mysqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();

const userService1 = new UserService(mysqlDb);
const userService2 = new UserService(mongoDb);
```

### C# Example

```csharp
// ✅ Good - Depend on abstractions
public interface IDatabase
{
    void Save(object data);
}

public class MySQLDatabase : IDatabase
{
    public void Save(object data)
    {
        Console.WriteLine($"Saving to MySQL: {data}");
    }
}

public class MongoDatabase : IDatabase
{
    public void Save(object data)
    {
        Console.WriteLine($"Saving to MongoDB: {data}");
    }
}

public class UserService
{
    private readonly IDatabase _database;

    public UserService(IDatabase database)
    {
        _database = database;
    }

    public void SaveUser(User user)
    {
        _database.Save(user);
    }
}

// Dependency Injection
var service = new UserService(new MySQLDatabase());
```

---

## Benefits of SOLID

✅ **Maintainability**: Easier to understand and modify  
✅ **Testability**: Easier to write unit tests  
✅ **Flexibility**: Easy to extend and adapt  
✅ **Reusability**: Components can be reused  
✅ **Reduced Coupling**: Less interdependence  

## Real-World Application

```javascript
// Combining all SOLID principles

// DIP - Abstractions
class IUserRepository {
  save(user) { throw new Error('Must implement'); }
  findById(id) { throw new Error('Must implement'); }
}

class IEmailService {
  send(to, subject, body) { throw new Error('Must implement'); }
}

// SRP - Single responsibility classes
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class UserValidator {
  validate(user) {
    if (!user.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!user.name || user.name.length === 0) {
      throw new Error('Name is required');
    }
  }
}

// ISP - Segregated interfaces
class MongoUserRepository extends IUserRepository {
  save(user) { /* MongoDB specific */ }
  findById(id) { /* MongoDB specific */ }
}

class SendGridEmailService extends IEmailService {
  send(to, subject, body) { /* SendGrid specific */ }
}

// OCP - Open for extension
class CreateUserUseCase {
  constructor(repository, emailService, validator) {
    this.repository = repository;
    this.emailService = emailService;
    this.validator = validator;
  }

  async execute(userData) {
    const user = new User(
      this.generateId(),
      userData.name,
      userData.email
    );

    this.validator.validate(user);
    await this.repository.save(user);
    await this.emailService.send(
      user.email,
      'Welcome',
      'Thanks for joining!'
    );

    return user;
  }

  generateId() {
    return `user_${Date.now()}`;
  }
}

// LSP - Substitutable implementations
class CreateUserUseCaseFactory {
  static create(dbType, emailProvider) {
    const repository = dbType === 'mongo' 
      ? new MongoUserRepository()
      : new SQLUserRepository();
    
    const emailService = emailProvider === 'sendgrid'
      ? new SendGridEmailService()
      : new SMTPEmailService();
    
    const validator = new UserValidator();
    
    return new CreateUserUseCase(repository, emailService, validator);
  }
}
```

## When to Apply SOLID

✅ **Apply When:**
- Building maintainable systems
- Working in teams
- Code will evolve over time
- Testing is important

⚠️ **Be Pragmatic:**
- Don't over-engineer small projects
- Balance principles with simplicity
- Consider team experience
- Avoid premature abstraction

## Related Concepts

- [Clean Architecture](../patterns/clean-architecture.md)
- [Design Patterns](./design-patterns.md)
- [Domain-Driven Design](../patterns/domain-driven-design.md)
- [Dependency Injection](./dependency-injection.md)

## Further Reading

- "Clean Architecture" by Robert C. Martin
- "Agile Software Development, Principles, Patterns, and Practices" by Robert C. Martin
- "Design Patterns" by Gang of Four
- [SOLID Principles on Wikipedia](https://en.wikipedia.org/wiki/SOLID)
