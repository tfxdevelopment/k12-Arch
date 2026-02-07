using FluentValidation;

namespace K12.Api.Admin.Features.UpdateUser;

/// <summary>
/// Validator for UpdateUserCommand.
/// </summary>
public sealed class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.DisplayName)
            .NotEmpty()
            .WithMessage("Display name is required")
            .MaximumLength(200)
            .WithMessage("Display name must not exceed 200 characters");
    }
}
