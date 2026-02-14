# Repository Pattern

**Category**: Application Architecture Pattern  
**Complexity**: Low-Medium  
**Use Case**: Data access abstraction  

## Overview

The Repository Pattern is a design pattern that mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects. It encapsulates the logic required to access data sources and provides a cleaner separation between the business logic and data access logic.

## Key Concepts

### Repository
A repository is responsible for:
- Retrieving entities from storage
- Saving entities to storage
- Providing query capabilities
- Abstracting database-specific code

### Benefits of Abstraction
- Business logic doesn't depend on data access implementation
- Easy to swap data sources (SQL, NoSQL, API, etc.)
- Simplified testing with mock repositories
- Centralized data access logic

## Implementation

### Basic Repository Interface

```javascript
// Node.js
class IRepository {
  async save(entity) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

class UserRepository extends IRepository {
  constructor(database) {
    super();
    this.db = database;
    this.collection = 'users';
  }

  async save(user) {
    const result = await this.db.collection(this.collection).insertOne({
      name: user.name,
      email: user.email,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  async findById(id) {
    return await this.db.collection(this.collection).findOne({ _id: id });
  }

  async findByEmail(email) {
    return await this.db.collection(this.collection).findOne({ email });
  }

  async findAll(options = {}) {
    const limit = options.limit || 100;
    const skip = options.skip || 0;
    
    return await this.db.collection(this.collection)
      .find({})
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  async update(id, data) {
    const result = await this.db.collection(this.collection).updateOne(
      { _id: id },
      { $set: data }
    );
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.db.collection(this.collection).deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
```

```csharp
// .NET
public interface IRepository<TEntity, TKey> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(TKey id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TKey id);
}

public class UserRepository : IRepository<User, Guid>
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> AddAsync(User entity)
    {
        _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(User entity)
    {
        _context.Users.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    // Custom query methods
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}
```

### Generic Repository

```javascript
// Node.js Generic Repository
class GenericRepository {
  constructor(database, collectionName) {
    this.db = database;
    this.collectionName = collectionName;
  }

  async save(entity) {
    const result = await this.db.collection(this.collectionName).insertOne(entity);
    return result.insertedId;
  }

  async findById(id) {
    return await this.db.collection(this.collectionName).findOne({ _id: id });
  }

  async findWhere(criteria) {
    return await this.db.collection(this.collectionName).find(criteria).toArray();
  }

  async findAll(options = {}) {
    return await this.db.collection(this.collectionName)
      .find({})
      .limit(options.limit || 100)
      .skip(options.skip || 0)
      .toArray();
  }

  async update(id, data) {
    const result = await this.db.collection(this.collectionName).updateOne(
      { _id: id },
      { $set: data }
    );
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.db.collection(this.collectionName).deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async count(criteria = {}) {
    return await this.db.collection(this.collectionName).countDocuments(criteria);
  }
}

// Usage
const userRepo = new GenericRepository(db, 'users');
const productRepo = new GenericRepository(db, 'products');
```

```csharp
// .NET Generic Repository
public class Repository<TEntity> : IRepository<TEntity, Guid> 
    where TEntity : class
{
    protected readonly DbContext Context;
    protected readonly DbSet<TEntity> DbSet;

    public Repository(DbContext context)
    {
        Context = context;
        DbSet = context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await DbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await DbSet.ToListAsync();
    }

    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        await DbSet.AddAsync(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(TEntity entity)
    {
        DbSet.Update(entity);
        await Context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            DbSet.Remove(entity);
            await Context.SaveChangesAsync();
        }
    }

    public IQueryable<TEntity> Query()
    {
        return DbSet.AsQueryable();
    }
}
```

## Specification Pattern

Combine Repository with Specification for complex queries:

```javascript
// Node.js Specification Pattern
class Specification {
  constructor(criteria) {
    this.criteria = criteria;
  }

  isSatisfiedBy(entity) {
    // Implement satisfaction logic
    return true;
  }

  toCriteria() {
    return this.criteria;
  }
}

class ActiveUserSpecification extends Specification {
  constructor() {
    super({ active: true });
  }
}

class UserByRoleSpecification extends Specification {
  constructor(role) {
    super({ role: role });
  }
}

// In Repository
class UserRepository extends GenericRepository {
  async findBySpecification(specification) {
    return await this.findWhere(specification.toCriteria());
  }
}

// Usage
const activeUsers = await userRepo.findBySpecification(new ActiveUserSpecification());
const admins = await userRepo.findBySpecification(new UserByRoleSpecification('admin'));
```

```csharp
// .NET Specification Pattern
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
}

public class Specification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();

    public Specification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }
}

public class ActiveUserSpecification : Specification<User>
{
    public ActiveUserSpecification() 
        : base(u => u.IsActive == true)
    {
    }
}

// In Repository
public async Task<IEnumerable<TEntity>> FindAsync(ISpecification<TEntity> spec)
{
    var query = DbSet.Where(spec.Criteria);
    
    foreach (var include in spec.Includes)
    {
        query = query.Include(include);
    }
    
    return await query.ToListAsync();
}
```

## Unit of Work Pattern

Coordinate multiple repositories in a transaction:

```javascript
// Node.js Unit of Work
class UnitOfWork {
  constructor(database) {
    this.db = database;
    this.session = null;
    this.repositories = new Map();
  }

  getRepository(name, collectionName) {
    if (!this.repositories.has(name)) {
      this.repositories.set(name, new GenericRepository(this.db, collectionName));
    }
    return this.repositories.get(name);
  }

  async beginTransaction() {
    this.session = this.db.startSession();
    this.session.startTransaction();
  }

  async commit() {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = null;
    }
  }

  async rollback() {
    if (this.session) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.session = null;
    }
  }
}

// Usage
const uow = new UnitOfWork(db);
try {
  await uow.beginTransaction();
  
  const userRepo = uow.getRepository('users', 'users');
  const orderRepo = uow.getRepository('orders', 'orders');
  
  await userRepo.save(user);
  await orderRepo.save(order);
  
  await uow.commit();
} catch (error) {
  await uow.rollback();
  throw error;
}
```

```csharp
// .NET Unit of Work
public interface IUnitOfWork : IDisposable
{
    IRepository<User, Guid> Users { get; }
    IRepository<Order, Guid> Orders { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Users = new Repository<User>(_context);
        Orders = new Repository<Order>(_context);
    }

    public IRepository<User, Guid> Users { get; }
    public IRepository<Order, Guid> Orders { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}

// Usage
using (var uow = new UnitOfWork(context))
{
    await uow.Users.AddAsync(user);
    await uow.Orders.AddAsync(order);
    await uow.SaveChangesAsync();
}
```

## Benefits

✅ **Separation of Concerns**: Business logic separate from data access  
✅ **Testability**: Easy to mock for unit tests  
✅ **Flexibility**: Switch data sources without changing business logic  
✅ **Centralization**: All data access logic in one place  
✅ **Reusability**: Share common data access code  

## Challenges

⚠️ **Abstraction Overhead**: Additional layer of complexity  
⚠️ **Over-abstraction**: Can become too generic  
⚠️ **Performance**: May hide optimization opportunities  
⚠️ **Learning Curve**: Developers need to understand pattern  

## Best Practices

1. **Keep repositories focused**: One entity per repository
2. **Use generic repositories carefully**: Balance reusability with specificity
3. **Implement specifications**: For complex queries
4. **Use Unit of Work**: For transactions across multiple repositories
5. **Don't expose IQueryable**: Return concrete types or use specifications
6. **Add custom methods**: For domain-specific queries

## When to Use

✅ **Use When:**
- Need to abstract data access
- Want to improve testability
- Planning to support multiple data sources
- Building layered architecture
- Need transaction management

❌ **Avoid When:**
- Simple CRUD applications with single data source
- Using ORM that provides good abstraction (like Entity Framework)
- Performance is critical and abstraction adds overhead
- Team prefers direct database access

## Related Patterns

- [Unit of Work](./unit-of-work.md)
- [Specification Pattern](./specification.md)
- [Data Mapper](./data-mapper.md)
- [Clean Architecture](./clean-architecture.md)

## Testing

```javascript
// Node.js - Mock Repository for Testing
class MockUserRepository extends IRepository {
  constructor() {
    super();
    this.users = new Map();
  }

  async save(user) {
    const id = Date.now().toString();
    this.users.set(id, { ...user, id });
    return id;
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findAll() {
    return Array.from(this.users.values());
  }
}

// Test
describe('UserService', () => {
  it('should create user', async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);
    
    const userId = await service.createUser('John', 'john@example.com');
    const user = await mockRepo.findById(userId);
    
    expect(user.name).toBe('John');
  });
});
```

```csharp
// .NET - Mock Repository for Testing
public class MockUserRepository : IRepository<User, Guid>
{
    private readonly Dictionary<Guid, User> _users = new();

    public Task<User> AddAsync(User entity)
    {
        entity.Id = Guid.NewGuid();
        _users[entity.Id] = entity;
        return Task.FromResult(entity);
    }

    public Task<User?> GetByIdAsync(Guid id)
    {
        _users.TryGetValue(id, out var user);
        return Task.FromResult(user);
    }

    // Implement other methods...
}

// Test
[Fact]
public async Task CreateUser_ShouldSaveUser()
{
    // Arrange
    var mockRepo = new MockUserRepository();
    var service = new UserService(mockRepo);

    // Act
    var user = await service.CreateUserAsync("John", "john@example.com");

    // Assert
    var savedUser = await mockRepo.GetByIdAsync(user.Id);
    Assert.NotNull(savedUser);
    Assert.Equal("John", savedUser.Name);
}
```

## Further Reading

- "Patterns of Enterprise Application Architecture" by Martin Fowler
- "Domain-Driven Design" by Eric Evans
- Microsoft's Repository Pattern documentation
- [Repository Pattern on Wikipedia](https://en.wikipedia.org/wiki/Repository_pattern)
