# Sensei Solution Architecture Document 1.0 - Keyword Extract (Auto)

- Source: g:\Projects\CFI\K12\k12-Arch\sources\Sensei-Solution Architecture Document-1.0.pdf
- Pages scanned: 52
- Keyword hits: 30 pages

## Keywords

elton, concern, risk, issue, recommendation, gap, event sourcing, cqrs, bff, dapr, cloudevents, event hub, service bus

## Matches (by page)

### Page 2

- **Elton**:  The following table summarizes the revision history for this document. Date Version Architect Author/Title Revision summary 07/25/2025 1.0 Elton Trotman Solution Architecture First Draft Contents Solution Architecture Document ................................ ................................ ................................ ........ 1 Document management history ...................
- **Issue**: tectural Solutions ................................ ................................ ................................ ...... 10 API Scaling Issues ................................ ................................ ................................ .................... 10 Workflow ................................ ................................ ................................ .......
- **Service Bus**:  Key Patterns and Resources ................................ ................................ ................................ ......... 17 Service Bus Utility ................................ ................................ ................................ .................... 17 Dead Letter Queueing ................................ ................................ .....................

### Page 3

- **Service Bus**: Service Bus Asynchronous Processing -Asynchronous Request-Reply ................................ ........ 19 Web Pub Sub ................................ ................................ ................................ ........................... 20 
- **Risk**: ................. ................................ ................................ ................................ ................... 33 Risks ................................ ................................ ................................ ................................ ........... 35 DB Risk: Monolithic Schema Design ................................ ........................
- **Risk**: ...................... ................................ ................................ ................................ ........... 35 DB Risk: Monolithic Schema Design ................................ ................................ .......................... 35 Risks for Microservices ................................ ................................ ...........................
- **Risk**: ...... 35 DB Risk: Monolithic Schema Design ................................ ................................ .......................... 35 Risks for Microservices ................................ ................................ ................................ ............. 36 Risk for Event Driven Systems ................................ ................................ ........
- **Risk**: Risks for Microservices ................................ ................................ ................................ ............. 36 Risk for Event Driven Systems ................................ ................................ ................................ ... 36 Architectural Compromises and Mitigation ................................ ........... Error! Bookmark not de
- **Event Sourcing**: mark not defined. No Backends for Frontends ................................ .............................. Error! Bookmark not defined. No Event Sourcing ................................ ................................ ........... Error! Bookmark not defined. Testing ................................ ................................ ................................ .........................

### Page 5

- **service bus**: st estimator? Commented [A2R1]: The current design offloads most of the cost on static web app and the function apps and places the load on service bus app plan which intended to be higher in compute.

### Page 6

- **service bus**: a. The architecture approved by CFI from Randstad was intended to resemble a microservice architecture complete with service bus, event grids and a domain driven design. 2. CFI stated existing application does not scale and fails under concurrency load a. We were able to procure the following concurrency numbers from CFI: i. A maximum of 80k concurrent users over an
- **issue**: ers from CFI: i. A maximum of 80k concurrent users over an hour span. ii. The time frame from max users is early March 3. Broad Performance issues Architectural goals 1. Scalability Beyond Vertical scaling is often necessary, introducing horizontal scaling provides benefit. 2. Always Secured Limit access at presentation, business logic and data access layers. Use security controls a
- **Service Bus**: DB, BLOB Containers, to define security limitations. 3. Consolidation of events Events from external webhooks, posts, routed via Event Grid/Service Bus should be centralized 4. Minimal Access Each service has access to only those resources it needs at the level it needs. one should "depend upon abstractions, [not] concretions. " 5. Tracing, Logging and Auditing Trace everything, log decis

### Page 9

- **issue**: rchitectural Patterns and Models Original Premise and Architecture The Original Premise and Architecture is fairly widespread and addresses issues such as reliability, distribution, and coupling. The monolithic architecture currently in place does not address scaling, reliability, and flexibility at large. Expanding upon the original architecture and augmenting the current architect

### Page 10

- **service bus**: n Event Grid. This decouples the application from processing requests synchronously and defers synchronous processing to queue workers. The service bus allows for decoupling, reliable messaging, scalability and async communication. Microservices are a key architectural component, and sensei has the beginnings of a robust Microservice Pattern Commented [A8]: This is a rearranging of the sa

### Page 11

- **Issue**: Sensei Architectural Solutions API Scaling Issues Sensei offers options for handling compute/data intensive calls. From the client these calls can cause downtime in the application. The system crashed specifically with high demand. Asynchronous Call Options 1. Sensei has addressed comput

### Page 13

- **service bus**: don't see any mention of EventHub, these solve unique use cases (push v pull etc) which is why I included them in the tech stack for the OG service bus. Commented [A11R10]: Webhooks typically don't generate much traffic so eventhubs may be overkill here. Let's check the use case other than signing confirmation of documents.

### Page 15

- **Dapr**: Resiliency Dapr achieves failures and retries through its resiliency building block, which is configured declaratively using a YAML file. This approach decouples the resilience logic from code. Dapr applies these policies to transient failures that occur 
- **Dapr**: its resiliency building block, which is configured declaratively using a YAML file. This approach decouples the resilience logic from code. Dapr applies these policies to transient failures that occur during communication between its sidecar and your application or other infrastructure components. Core components of Dapr resiliency • Resiliency spec: A YAML file, often named resili
- **Dapr**: nt failures that occur during communication between its sidecar and your application or other infrastructure components. Core components of Dapr resiliency • Resiliency spec: A YAML file, often named resiliency.yaml, where you define the specific policies for handling transient failures. • Timeouts: Your first line of defense, timeouts prevent applications from hanging indefinitely
- **Dapr**: g for an unresponsive service. A request that exceeds the timeout duration will trigger the retry policy. • Retries: If an operation fails, Dapr automatically reattempts the operation based on a configured policy. Retries are especially useful for handling temporary issues like network glitches or a service being temporarily unavailable. • Back-off strategies: Dapr supports two mai
- **issue**: ation fails, Dapr automatically reattempts the operation based on a configured policy. Retries are especially useful for handling temporary issues like network glitches or a service being temporarily unavailable. • Back-off strategies: Dapr supports two main back-off strategies for retries to avoid overwhelming a struggling service with repeated requests. o Exponential back-off: Inc
- **Dapr**: re especially useful for handling temporary issues like network glitches or a service being temporarily unavailable. • Back-off strategies: Dapr supports two main back-off strategies for retries to avoid overwhelming a struggling service with repeated requests. o Exponential back-off: Increases the delay between retry attempts exponentially. Dapr also adds jitter (random variation)

### Page 16

- **Dapr**: Pub/Sub • Mechanism: Dapr uses a combination of its own resiliency policies and the message broker's built-in retry mechanisms. • Dead letter queues: With supported components like Azure Service Bus, you can configure Dapr to send messages to a dead-letter queue af
- **Service Bus**:  its own resiliency policies and the message broker's built-in retry mechanisms. • Dead letter queues: With supported components like Azure Service Bus, you can configure Dapr to send messages to a dead-letter queue after a certain number of failed processing attempts. This prevents "poison messages" from causing infinite retries. Actors • Mechanism: Dapr offers built-in retry logic for f
- **Dapr**: d the message broker's built-in retry mechanisms. • Dead letter queues: With supported components like Azure Service Bus, you can configure Dapr to send messages to a dead-letter queue after a certain number of failed processing attempts. This prevents "poison messages" from causing infinite retries. Actors • Mechanism: Dapr offers built-in retry logic for failures during the sidec
- **Dapr**: ue after a certain number of failed processing attempts. This prevents "poison messages" from causing infinite retries. Actors • Mechanism: Dapr offers built-in retry logic for failures during the sidecar-to-sidecar communication for actor method calls. For durable actor state and reminders, retries are also built-in. • Runtime exceptions: If an actor method throws an exception, th
- **Dapr**:  calls. For durable actor state and reminders, retries are also built-in. • Runtime exceptions: If an actor method throws an exception, the Dapr runtime logs the error but does not automatically retry the actor's method itself. For true durability, you must use persistent state and reminders to re-trigger the logic. State management • Mechanism: Dapr automatically retries requests 
- **Dapr**: or's method itself. For true durability, you must use persistent state and reminders to re-trigger the logic. State management • Mechanism: Dapr automatically retries requests to state stores, like saving or retrieving data. Interservice Communication Depending on the specific requirements for synchronous or asynchronous communication and the level of coupling desired between servi

### Page 17

- **Service Bus**: r instance, facilitates this by providing internal DNS resolution for services within the same environment Asynchronous Communication Azure Service Bus: This is a robust messaging service for reliable, asynchronous communication. It supports queues for point-to-point messaging and topics/subscriptions for publish-subscribe patterns, enabling decoupling between services. Azure Event Grid: 

### Page 18

- **Service Bus**: Key Patterns and Resources Service Bus Utility Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. o Load-balancing work across competing workers o Safely routing and transferring data and control across service and a
- **Service Bus**: Key Patterns and Resources Service Bus Utility Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. o Load-balancing work across competing workers o Safely routing and transferring data and control across service and application boundaries o Co

### Page 19

- **issue**: r, or messages that couldn't be processed. Messages can then be removed from the DLQ and inspected. An application might let a user correct issues and resubmit the message. From an API and protocol perspective, the DLQ is mostly similar to any other queue, except that messages can only be submitted via the dead-letter operation of the parent entity. In addition, time-to-live isn't o

### Page 20

- **Service Bus**: Service Bus Asynchronous Processing -Asynchronous Request-Reply Change synchronous API calls to an asynchronous pattern using Azure Service Bus. This involves decoupling the request initiation from the response delivery. This allows the client to rece
- **Service Bus**: Service Bus Asynchronous Processing -Asynchronous Request-Reply Change synchronous API calls to an asynchronous pattern using Azure Service Bus. This involves decoupling the request initiation from the response delivery. This allows the client to receive an immediate acknowledgment while the actual processing occurs in the background, mediated by Service Bus. Steps to achieve this
- **Service Bus**: e delivery. This allows the client to receive an immediate acknowledgment while the actual processing occurs in the background, mediated by Service Bus. Steps to achieve this: o Client initiates requests and receives immediate acknowledgment: o The client sends its request to an API endpoint (e.g., a Web API or Azure Function). o Instead of performing the full processing synchronously, th
- **Service Bus**: Web API or Azure Function). o Instead of performing the full processing synchronously, this API immediately publishes a message to an Azure Service Bus queue or topic, containing the request details. o The API then returns an immediate response to the client (e.g., HTTP 202 Accepted), indicating that the request has been received and will be processed asynchronously. o A separate worker p
- **Service Bus**: ng that the request has been received and will be processed asynchronously. o A separate worker process or Azure Function subscribes to the Service Bus queue/topic and consumes the messages. o This consumer performs the actual business logic and processing of the request. https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply

### Page 23

- **Event Hub**: Event Consolidation and Tracking An event is created by a publisher such as a Blob Storage account, Event Hubs or even an Azure subscription. As events occur, they’re published to an endpoint called a topic that the Event Grid service manages to digest all incoming messages. If they can post an HTTP request to the Event Grid service, then they’re 

### Page 25

- **cqrs**: perts, developers, etc.) using a ubiquitous language. https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd- cqrs-patterns/ddd-oriented-microservice

### Page 26

- **cqrs**: ide and retrieves the data from the read database. https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data- persistence/cqrs-pattern.html

### Page 35

- **Dapr**: Enforce HTTPS for all external API endpoints. o Internal traffic: Implement mTLS to authenticate and encrypt traffic between microservices. Dapr can automate mTLS. • Segment networks: Use Azure virtual networks (VNets) to isolate microservices from the public internet. o Network Security Groups (NSGs): Control network traffic by creating NSG rules that allow only necessary traffic 

### Page 36

- **recommendation**: a central location to Log Analytics. • Use Microsoft Defender for Cloud: Manages security and provides cloud workload protection, including recommendations and threat detection for containers. • Monitor container security: Actively scan container images for vulnerabilities in your Azure Container Registry before they are deployed. Code and dependency security Address security risks in the ap
- **risk**: ntainer images for vulnerabilities in your Azure Container Registry before they are deployed. Code and dependency security Address security risks in the application code and its dependencies. • Scan for vulnerable dependencies: Use Sonar Cube to continuously scan your application's source code and third-party libraries for security vulnerabilities. • Harden container images: Use mi
- **Risk**: vulnerabilities. • Harden container images: Use minimal, trusted base images and remove unnecessary components to reduce the attack surface Risks DB Risk: Monolithic Schema Design The current monolithic schema is highly dependent on a common schema. This schema will need to be incrementally denormalized with each new domain. It was suggested that
- **Risk**: lities. • Harden container images: Use minimal, trusted base images and remove unnecessary components to reduce the attack surface Risks DB Risk: Monolithic Schema Design The current monolithic schema is highly dependent on a common schema. This schema will need to be incrementally denormalized with each new domain. It was suggested that

### Page 37

- **Risk**: we can use logical domains. Once a working pattern with logical domains is created, we can in the future move to separate databases. Risks for Microservices o Larger Attack Surface: More services and communication points mean more potential entry points for attackers, increasing the risk of unauthorized access, data breaches, and denial-of- service attacks. Implementing cons
- **risk**: icroservices o Larger Attack Surface: More services and communication points mean more potential entry points for attackers, increasing the risk of unauthorized access, data breaches, and denial-of- service attacks. Implementing consistent security policies across multiple services with varying configurations and data flows can be challenging. o Increased Complexity: Managing and m
- **Risk**: monolithic application. o Data Fragmentation: Data can become fragmented across different services, making it harder to manage and analyze. Risk for Event Driven Systems o Debugging The asynchronous nature of Event Driven Architectures makes debugging difficult. Tracing event flows and identifying the root cause of issues can be challenging. o Idempotency Failing to handle idempote
- **issue**: ging The asynchronous nature of Event Driven Architectures makes debugging difficult. Tracing event flows and identifying the root cause of issues can be challenging. o Idempotency Failing to handle idempotency can lead to duplicate event processing and inconsistent states. o Error Handling Handling errors and exceptions in an Event Driven Architectures can be more complex due to th
- **risk**: hitectures systems can be challenging due to the potential for unforeseen interactions and permutations. Commented [A13]: Is this much of a risk in a shared nothing & zero trust architecture? Commented [A14R13]: I'd say the implementation of private end points factors greatly

### Page 38

- **Dapr**: rvice scaffolding templates and repository layout • Supported runtimes, frameworks, and base container images • Local development workflow (Dapr, emulators, environment config) o TBD ▪ Integrate/replace powershell orchestration(s) with Aspire.net ▪ Generate deployment manifests (artifacts) with Aspire for target environments • Tooling catalog (build, test, quality, security, observ
- **issue**: Metrics Goal Metric / Target Fast Onboarding New engineer productive (PR merged) ≤ 60 min Consistent Quality Sonar "no new critical/blocker issues" enforced Early Security 0 committed secrets (Gitleaks) Reliable Contracts Contract test failures block merge 100% Observability Baseline 100% services emit RED metrics + tracing upon first run

### Page 39

- **Dapr**: ackend APIs &Workers .NET 8 (LTS) Mandatory Evaluate Native AOT (Phase 2 performance) Workflow / Orchestration Durable Functions (.NET 8) + Dapr Workflow (eval) Allowed ADR required before switching primary Front-end Angular (current LTS) Mandatory Node version pinned via .nvmrc Scripting / Infra PowerShell, Bash, Terraform Mandatory Terraform authoritative for infra Container Runt

### Page 40

- **concern**: ries), orchestration logic • Infrastructure: Persistence (EF Core or repository), messaging adapters, external API clients • API: Transport concerns (controllers, validation, mapping) • Contracts: Message definitions, schema JSON used in validation & contract tests 7. Project Conventions Concern Convention Rationale Namespaces Company.{Project}.{BoundedContext}.{Layer} Consistent reso
- **Concern**: (controllers, validation, mapping) • Contracts: Message definitions, schema JSON used in validation & contract tests 7. Project Conventions Concern Convention Rationale Namespaces Company.{Project}.{BoundedContext}.{Layer} Consistent resolution DTO Mapping Mapster or Manual Profiles (no reflection automagic) Performance & explicitness

### Page 41

- **Dapr**: ation Logging Structured (Serilog or built-in + OTel) Queryable Tracing OpenTelemetry (W3C traceparent) Cross-service correlation Messaging Dapr pub/sub abstraction Decouple from direct SDK Integrity integrityHash on envelope Tamper detection 8. Quality Gates (Local & CI) Layer Tool Threshold / Rule CI Enforcement Formatting (.NET) dotnet format No diffs Yes (fail) Lint (Angular) E

### Page 42

- **Dapr**: cies & secrets FS & image scan Every build Trivy + Gitleaks Resiliency (Phase 2) Failure handling Chaos inject tests Quarterly Chaos Studio/Dapr faults Coverage Reporting: • Aggregated via ReportGenerator (lcov + HTML) • Published as pipeline artifact • Trend tracked in Quality dashboard 10. Local Development Workflow Golden path: 1. Clone repository 2. Run ./bootstrap.(ps1|sh) (in
- **Dapr**: ed in Quality dashboard 10. Local Development Workflow Golden path: 1. Clone repository 2. Run ./bootstrap.(ps1|sh) (installs SDK versions, Dapr, commit hooks) 3. Start dependencies: dapr run or docker compose up 4. Launch service: dapr run --app-id awarding-api -- dotnet run --project src/Awarding.Api
- **dapr**: nt Workflow Golden path: 1. Clone repository 2. Run ./bootstrap.(ps1|sh) (installs SDK versions, Dapr, commit hooks) 3. Start dependencies: dapr run or docker compose up 4. Launch service: dapr run --app-id awarding-api -- dotnet run --project src/Awarding.Api
- **dapr**: un ./bootstrap.(ps1|sh) (installs SDK versions, Dapr, commit hooks) 3. Start dependencies: dapr run or docker compose up 4. Launch service: dapr run --app-id awarding-api -- dotnet run --project src/Awarding.Api

### Page 43

- **Concern**: dotnet test 6. View coverage: make coverage 7. Build container: make image 8. Run Trivy scan: make scan 10. Secret & Configuration Handling Concern Dev Approach Production Approach Rule App Secrets dotnet user-secrets or .env (gitignored) Key Vault + Managed Identity Never in repo Connection Strings Env var override Key Vault reference Must support rotation API Keys Rotated dev keys (
- **Issue**: e Must support rotation API Keys Rotated dev keys (low-priv) Managed Identity preferred Expire ≤ 90 days Certificates Self-signed dev trust Issued + rotated No wildcard in prod Feature Flags Env bools (temp) Central config (App Config future) Document toggles 11. Dapr (Local Minimal Set) Capability Component Purpose Pub/Sub Azure Service Bus (dev namespace) or in-memory fallback - S
- **Dapr**: igned dev trust Issued + rotated No wildcard in prod Feature Flags Env bools (temp) Central config (App Config future) Document toggles 11. Dapr (Local Minimal Set) Capability Component Purpose Pub/Sub Azure Service Bus (dev namespace) or in-memory fallback - State Store Redis (container) Ephemeral counters / throttling Secrets Key Vault binding - Tracing OTel exporter - 12. Toolin
- **Service Bus**: nv bools (temp) Central config (App Config future) Document toggles 11. Dapr (Local Minimal Set) Capability Component Purpose Pub/Sub Azure Service Bus (dev namespace) or in-memory fallback - State Store Redis (container) Ephemeral counters / throttling Secrets Key Vault binding - Tracing OTel exporter - 12. Tooling Matrix (Authoritative Extract) Category Tool Mandatory Version Policy Own

### Page 44

- **Dapr**: tration Make / PowerShell scripts Yes Script repo Platform Container Build Docker BuildKit Yes ≤ 2 minors behind DevOps Pub/Sub Abstraction Dapr CLI Yes Latest stable Platform Static Analysis Roslyn + SonarQube Yes Quality profile locked Architecture Contract Testing Pact Yes Broker pinned QA Message Schema Validation Custom schema validator (JSON) Yes Synchronized Architecture Sec
- **dapr**: mand Cheat Sheet (for local & CI/CD cmds) Task Command New Service K12-cli new service --name Awarding Restore & Build dotnet build Run API dapr run --app-id awarding-api -- dotnet run --project src/Awarding.Api All Tests make test Contract Tests dotnet test tests/Awarding.ContractTests Format Code make format

### Page 46

- **Dapr**: logging filters Failing test if pattern matched 18. Onboarding Golden Path (≤ 60 Minutes) Step Time Outcome Bootstrap environment 5m SDKs & Dapr installed Run template service 5m Local API up Execute tests 10m Green tests & coverage Add endpoint + unit test 15m Pattern comprehension Add contract test & publish 10m Pact in broker Build & scan container 10m Security integrated Review

### Page 47

- **Risk**: ted Dockerfile base digest, absent OTel exporter. • Create remediation tickets (SLA: 1 sprint for critical drift, 2 sprints for minor). 20. Risks & Mitigations Risk Impact Mitigation Tool Sprawl Inconsistent builds Central catalog + ADR approval Skipped Contract Tests Runtime incompatibility Pipeline hard gate Over-reliance on Defaults Hidden security gaps Security review checklist
- **Risk**: digest, absent OTel exporter. • Create remediation tickets (SLA: 1 sprint for critical drift, 2 sprints for minor). 20. Risks & Mitigations Risk Impact Mitigation Tool Sprawl Inconsistent builds Central catalog + ADR approval Skipped Contract Tests Runtime incompatibility Pipeline hard gate Over-reliance on Defaults Hidden security gaps Security review checklist Performance Blindne
- **gap**:  Central catalog + ADR approval Skipped Contract Tests Runtime incompatibility Pipeline hard gate Over-reliance on Defaults Hidden security gaps Security review checklist Performance Blindness Latency regressions Mandatory performance smoke stage Template Divergence Increased maintenance Drift audit & auto PR suggestions 21. Backlog (Related Stories) Ref Title Priority DEVTOOL- 00

### Page 48

- **Dapr**: DEVTOOL- 005 Dapr local profile script (multi- service) Medium DEVTOOL- 006 Template drift auditor job Medium DEVTOOL- 007 Coverage trend dashboard Medium DEVTOOL- 008 Security waiver tracking automation Medium 22. Acceptance Criteria (Representative) • Cre

