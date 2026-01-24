namespace K12.BuildingBlocks.Results;

/// <summary>
/// Represents an error with a code and message.
/// Used in Result pattern for type-safe error handling.
/// </summary>
public sealed record Error
{
    public static readonly Error None = new(string.Empty, string.Empty);

    private Error(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public string Code { get; }
    public string Message { get; }

    public static Error NotFound(string code, string message) =>
        new($"NotFound.{code}", message);

    public static Error Validation(string code, string message) =>
        new($"Validation.{code}", message);

    public static Error Conflict(string code, string message) =>
        new($"Conflict.{code}", message);

    public static Error Failure(string code, string message) =>
        new($"Failure.{code}", message);

    public static Error Unauthorized(string code, string message) =>
        new($"Unauthorized.{code}", message);

    public static Error Forbidden(string code, string message) =>
        new($"Forbidden.{code}", message);

    public override string ToString() => $"{Code}: {Message}";
}
