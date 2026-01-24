---
agent: 'agent'
description: 'Design Cosmos DB data model for specific workload requirements'
---
# Cosmos DB Data Modeling

Design an optimized Cosmos DB data model for ${input:WorkloadDescription}.

## Analysis Required

1. **Access Patterns**: Identify read/write patterns and query requirements
2. **Partition Strategy**: Design partition key for even distribution
3. **Container Structure**: Define containers and their relationships
4. **Indexing Policy**: Optimize indexes for query patterns
5. **Consistency Level**: Recommend appropriate consistency

## Design Considerations

### Partition Key Selection
- High cardinality for even distribution
- Frequently used in WHERE clauses
- Avoids hot partitions
- Supports efficient cross-partition queries

### Data Modeling Patterns
- Embedding vs. referencing
- Denormalization strategies
- Change feed for derived data
- TTL for automatic cleanup

### Cost Optimization
- RU estimation per operation type
- Autoscale vs. provisioned throughput
- Reserved capacity recommendations

## Output

Provide:
1. Container definitions with partition keys
2. Sample document schemas
3. Indexing policy JSON
4. Query patterns with estimated RU costs
5. Scaling recommendations
