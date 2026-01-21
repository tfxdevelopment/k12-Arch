using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace K12.Infrastructure.Azure;

/// <summary>
/// Azure-specific infrastructure services configuration.
/// Uses Azure SDK with DefaultAzureCredential for authentication.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddAzureInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Azure Default Credential (works locally and in Azure)
        services.AddSingleton(_ => new DefaultAzureCredential());

        // Azure Blob Storage
        // services.AddSingleton<IBlobStorageService, AzureBlobStorageService>();

        // Azure Key Vault (optional, for secrets management)
        // var keyVaultUri = configuration["Azure:KeyVault:Uri"];
        // if (!string.IsNullOrEmpty(keyVaultUri))
        // {
        //     services.AddSingleton<ISecretManager, AzureKeyVaultSecretManager>();
        // }

        return services;
    }
}
