# K12 Cloud-Native Architecture Modernization Strategy (Start)

> Canonical narrative is consolidated in [cloud-native-architecture.md](cloud-native-architecture.md).

To build your **Cloud-Native Architecture** documentation for K12, we can map the theoretical models from the *Getting Started as an Azure Architect* guide directly to your specific K12 implementation decisions.

Quick links into the consolidated document:

- Architecture pillars mapping: [cloud-native-architecture.md](cloud-native-architecture.md#architecture-pillars-mapping)
- Canonical container diagram: [cloud-native-architecture.md](cloud-native-architecture.md#architecture-overview-c4-container)

### 3. Documentation Plan: Next Steps

To formalize the "Cloud Native" aspect of your architecture, we should generate the following specific docs next.

**Which would you like to draft first?**

1. **WA-04: Operational Excellence**: Using the PDF's "Monitoring" section to define how we use **Azure Monitor** and **Application Insights** to track the "Health" of the K12 containers.
2. **C4-PROP-02: Container Diagram**: Flesh out the diagram above with text describing the **Dapr Sidecar** pattern (how the API talks to Redis without code changes).
3. **CAF-03: Adopt**: A "Cloud Adoption Framework" page explaining *why* we chose **Serverless Containers** (ACA) over standard App Service (PaaS) for this specific workload.