# Azure Architecture Framework for K12 Modernization

> Canonical narrative is consolidated in [cloud-native-architecture.md](cloud-native-architecture.md).

Based on your request, I have broken this down into three parts: an extraction of the core architectural models from the **"Getting Started as an Azure Architect"** PDF, a walkthrough of **Cloud Native on Azure** principles, and a generated set of **Documentation and Diagrams** specifically tailored to your K12 Modernization context using the decision maps provided.

### Part 1: Extraction from "Getting Started as an Azure Architect"

The *Getting Started as an Azure Architect* document visualizes architecture through specific "Maps" or domains. Here is the content extracted and categorized by those domains:

**1. Solution Architecture Map**This domain categorizes systems based on their function within the enterprise:

* **Systems of Engagement:** The user interface layer, including Mobile apps, Chatbots (Azure Bot Service, LUIS), and Real-time web (SignalR) 1.
* **Systems of Record:** The source of truth for data. It distinguishes between **Relational** (Azure SQL, PostgreSQL) and **NoSQL** (Cosmos DB, Table Storage) 1.
* **Systems of Insight:** The analytics layer, including "All-in-one" solutions (Azure Synapse), computed dashboards (Power BI), and AI integration (Cognitive Services, ML Studio) 1.
* **Systems of Interaction:** The glue between services, including APIs (API Management), Pub/Sub (Event Grid), Messaging (Service Bus), and Orchestration (Logic Apps, Durable Functions) 1.

**2. Application Architecture Map**This domain focuses on patterns for building resilient applications:

* **Cloud Design Patterns:** Includes **Circuit Breaker** (handling faults), **Retry** (transient failure recovery), **Cache-Aside** (performance), and **Anti-Corruption Layer** (legacy integration) 1.
* **Microservices:** Focuses on **Dapr** (Application-level building blocks) and API Gateways (Backends for Frontends pattern) 1.
* **EDA (Event-Driven Architecture):** Utilizes discrete events (Event Grid) or event streams (Event Hubs) to trigger downstream logic 1.

**3. Infrastructure & Security Map**

* **Network:** heavily relies on the **Hub & Spoke** topology, utilizing Virtual Network Peering, Gateways, and Azure Firewall 1.
* **Security Posture:** Implements **Zero Trust** via Identity (Azure AD/Entra ID), Encryption (In transit/At rest), and Governance (Azure Policy) 1.

### Part 2: Walkthrough of Cloud Native for Azure (K12 Context)

Using the *Architecting Cloud Native .NET Apps* guide and applying the *K12 Modernization Strategy*, here is how the cloud-native approach is structured for your project.

#### 1. The Compute Layer: Serverless Containers

While standard cloud-native guidance often defaults to Azure Kubernetes Service (AKS) 2, your K12 strategy specifically selects **Azure Container Apps (ACA)** 3.

* **Why:** Cloud-native implies decoupling code from hardware 4. ACA provides the benefits of Kubernetes (KEDA scaling, Dapr integration) without the operational overhead of managing the cluster control plane 3.

#### 2. The Data Layer: Polyglot Persistence

Cloud-native systems move away from monolithic shared databases 5.

* **Decision:** You are implementing a **Hybrid Data Strategy**.
* **Transactional:** Azure SQL (Business Critical) handles the core relational data 3.
* **Analytical:** Read Replicas and a containerized **Metabase** instance handle "Systems of Insight," preventing reporting loads from slowing down transactional writes 3.

#### 3. Communication: Dapr & Messaging

Cloud-native apps rely on asynchronous communication to decouple services 6.

* **Decision:** You are utilizing **Dapr (Distributed Application Runtime)**.
* **Sidecar Pattern:** Dapr runs as a sidecar next to your .NET containers, abstracting the "plumbing" 7.
* **Implementation:** Your API Gateway publishes events (e.g., "Application Submitted") via Dapr, which routes them to **Azure Service Bus** topics for async processing (e.g., RDS verification) 3, 8.

### Part 3: Generated Docs & Diagrams (Canonical)

The generated ADRs, diagrams, and strategy tables are maintained in the consolidated document:

- Container diagram: [cloud-native-architecture.md](cloud-native-architecture.md#architecture-overview-c4-container)
- CI/CD pipeline: [cloud-native-architecture.md](cloud-native-architecture.md#cicd-pipeline-diagram)
- Data flow diagram: [cloud-native-architecture.md](cloud-native-architecture.md#data-flow-diagram-hybrid-data-strategy)
- Observability & resiliency: [cloud-native-architecture.md](cloud-native-architecture.md#observability-strategy-matrix)