#:package Aspire.Hosting.Docker
#:package Aspire.Hosting.JavaScript
#:package Aspire.Hosting.Seq
#:package CommunityToolkit.Aspire.Hosting.JavaScript.Extensions
#:package CommunityToolkit.Aspire.Hosting.OpenTelemetryCollector
#:sdk Aspire.AppHost.Sdk@13.1.0

var builder = DistributedApplication.CreateBuilder(args);

builder.Build().Run();
