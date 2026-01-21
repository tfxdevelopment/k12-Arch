using FluentValidation;

namespace K12.Api.Enrollment.Features.SubmitEnrollment;

/// <summary>
/// Validator for SubmitEnrollmentCommand.
/// Ensures all required data is provided before processing.
/// </summary>
public sealed class SubmitEnrollmentValidator : AbstractValidator<SubmitEnrollmentCommand>
{
    public SubmitEnrollmentValidator()
    {
        RuleFor(x => x.HouseholdId)
            .NotEmpty()
            .WithMessage("Household ID is required");

        RuleFor(x => x.ProgramId)
            .NotEmpty()
            .WithMessage("Program ID is required");

        RuleFor(x => x.StudentId)
            .NotEmpty()
            .WithMessage("Student ID is required");

        RuleFor(x => x.Responses)
            .NotNull()
            .WithMessage("Responses cannot be null")
            .Must(r => r.Count > 0)
            .WithMessage("At least one response is required");
    }
}
