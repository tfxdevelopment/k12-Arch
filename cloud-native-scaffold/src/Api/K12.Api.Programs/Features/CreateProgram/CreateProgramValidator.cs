using FluentValidation;

namespace K12.Api.Programs.Features.CreateProgram;

/// <summary>
/// Validator for CreateProgramCommand.
/// </summary>
public sealed class CreateProgramValidator : AbstractValidator<CreateProgramCommand>
{
    public CreateProgramValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Program name is required")
            .MaximumLength(200)
            .WithMessage("Program name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Program description is required")
            .MaximumLength(2000)
            .WithMessage("Program description must not exceed 2000 characters");
    }
}
