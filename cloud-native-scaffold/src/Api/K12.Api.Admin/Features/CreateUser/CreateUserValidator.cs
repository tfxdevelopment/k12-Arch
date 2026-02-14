using FluentValidation;

namespace K12.Api.Admin.Features.CreateUser;

/// <summary>
/// Validator for CreateUserCommand.
/// </summary>
public sealed class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("A valid email address is required")
            .MaximumLength(256)
            .WithMessage("Email must not exceed 256 characters");

        RuleFor(x => x.DisplayName)
            .NotEmpty()
            .WithMessage("Display name is required")
            .MaximumLength(200)
            .WithMessage("Display name must not exceed 200 characters");
    }
}
