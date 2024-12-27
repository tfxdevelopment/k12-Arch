resource "azurerm_api_management" "api_enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  location            = var.location
  resource_group_name = var.resource_group_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email

  sku_name = "Developer_1"

  tags      = var.tags
}

resource "azurerm_api_management_api_version_set" "api-enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  display_name        = "${var.environment_name}-api-enrollment"
  versioning_scheme   = "Segment"
}

resource "azurerm_api_management_api" "api_enrollment" {
  name                = "${var.environment_name}-api-enrollment"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.api_enrollment.name
  revision            = "1"
  display_name        = "${var.environment_name}-api-enrollment"
  protocols           = ["https"]

  ######################################   TODO: FUTURE WORK  ################################################################################
  # Only way to get all the definitions and operations in. It does not import the policies and backend configuration. 
  # Ideally, we should be managing each operation and defition using terraform not Json...
  import {
    content_format = "openapi+json"
    content_value  = templatefile("${path.module}/apim_oprations_definitions_v1.json", {
      environment = var.environment_name
    })
  }
}

#######################################   TODO: FUTURE WORK  ################################################################################
# * There is currently no way of associating/creating "Definitions" to an operation.
# * Tried this workaround by first creating a schema and then linking it to operation but still didnt create the definition itself.
# * https://stackoverflow.com/questions/69229878/terrform-module-for-azure-apim-definitions
# * Only way is to import the json file from dev environment as seen above.

################################# keep the code below for when Hashi decides to add definition functionality ############################

# Define all endpoints below. 
# GetAllPrograms
# resource "azurerm_api_management_api_operation" "get_all_programs" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "GetAllPrograms"
#   display_name = "GetAllPrograms"
#   method       = "GET"
#   url_template = "/enrollment/programs"

#     # Link the schema to the request and response
#   request {
#     representation {
#       content_type = azurerm_api_management_api_schema.get_all_enrollment_programs_view_model.content_type
#       schema_id    = azurerm_api_management_api_schema.get_all_enrollment_programs_view_model.schema_id
#       type_name    = "getAllEnrollmentProgramsViewMod"
#     }
#   }

#   response {
#     status_code      = 200
#     description = "The OK response message containing a JSON result."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }

# }

# resource "azurerm_api_management_api_schema" "get_all_enrollment_programs_view_model" {
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   schema_id           = "getAllEnrollmentProgramsViewModel"
#   content_type        = "application/vnd.oai.openapi.components+json"

#   value = file("${path.module}/schemas/enrollmentProgramViewModel.json")
# }


# # AddProgram
# resource "azurerm_api_management_api_operation" "add_program" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "AddProgram"
#   display_name = "AddProgram"
#   method       = "POST"
#   url_template = "/enrollment/programs"

#   response {
#     status_code      = 201
#     description = "The Created response message containing Location URL."
#   }

#   response {
#     status_code      = 400
#     description = "Invalid request due to validation errors."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

# # GetProgramByToken
# resource "azurerm_api_management_api_operation" "get_program_by_token" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id        = "GetProgramByToken"
#   display_name        = "GetProgramByToken"
#   method              = "GET"
#   url_template        = "/enrollment/programs/{token}"

#   template_parameter {
#     name        = "token"
#     description = "The unique token identifying the program."
#     required    = true
#     type        = "string"
#   }

#   response {
#     status_code  = 200
#     description  = "The OK response message containing a JSON result."
#   }

#   response {
#     status_code  = 404
#     description  = "Program not found for the given token."
#   }

#   response {
#     status_code  = 500
#     description  = "Internal server error."
#   }
# }

# # DeleteProgram
# resource "azurerm_api_management_api_operation" "delete_program" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "DeleteProgram"
#   display_name = "DeleteProgram"
#   method       = "DELETE"
#   url_template = "/enrollment/programs/{token}"

#   template_parameter {
#     name        = "token"
#     description = "The token identifying the enrollment program."
#     required    = true
#     type        = "string"
#   }

#   response {
#     status_code      = 204
#     description = "Returns No Content result."
#   }

#   response {
#     status_code      = 404
#     description = "Program not found."
#   }

#   response {
#     status_code      = 422
#     description = "Cannot delete Program when there is an active session."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

# # UpdateProgram
# resource "azurerm_api_management_api_operation" "update_program" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "UpdateProgram"
#   display_name = "UpdateProgram"
#   method       = "PUT"
#   url_template = "/enrollment/programs/{token}"

#   template_parameter {
#     name        = "token"
#     description = "The token identifying the enrollment program."
#     required    = true
#     type        = "string"
#   }

#   response {
#     status_code      = 202
#     description = "The Accepted response message containing Location URL."
#   }

#   response {
#     status_code      = 400
#     description = "Invalid request due to validation errors."
#   }

#   response {
#     status_code      = 404
#     description = "Program not found."
#   }

#   response {
#     status_code      = 422
#     description = "Cannot update Program when there is an active session."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

# # NewEnrollment
# resource "azurerm_api_management_api_operation" "new_enrollment" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "NewEnrollment"
#   display_name = "NewEnrollment"
#   method       = "GET"
#   url_template = "/enrollment/{token}/newenrollment"

#   template_parameter {
#     name        = "token"
#     description = "The token identifying the enrollment program."
#     required    = true
#     type        = "string"
#   }


#   response {
#     status_code      = 200
#     description = "The enrollment session details."
#   }

#   response {
#     status_code      = 400
#     description = "Bad request due to invalid token."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

# # GetEnrollmentSession
# resource "azurerm_api_management_api_operation" "get_enrollment_session" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "GetEnrollmentSession"
#   display_name = "GetEnrollmentSession"
#   method       = "GET"
#   url_template = "/enrollment/{sessionId}/enrollmentsession"

#   template_parameter {
#     name        = "sessionId"
#     description = "The unique ID for the enrollment session."
#     required    = true
#     type        = "string"
#   }

#   response {
#     status_code      = 200
#     description = "The details of the enrollment session."
#   }

#   response {
#     status_code      = 400
#     description = "Invalid sessionId provided."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

# # GetEnrollmentSessionPrompt
# resource "azurerm_api_management_api_operation" "get_enrollment_session_prompt" {
#   api_name            = azurerm_api_management_api.api_enrollment.name
#   api_management_name = azurerm_api_management.api_enrollment.name
#   resource_group_name = var.resource_group_name
#   operation_id = "GetEnrollmentSessionPrompt"
#   display_name = "GetEnrollmentSessionPrompt"
#   method       = "GET"
#   url_template = "/enrollment/{sessionId}/prompt/{promptKeyPath}"

#   template_parameter {
#     name        = "sessionId"
#     description = "The unique ID for the enrollment session."
#     required    = true
#     type        = "string"
#   }

#   template_parameter {
#     name        = "promptKeyPath"
#     description = "The unique key path for the enrollment session prompt."
#     required    = true
#     type        = "string"
#   }

#   response {
#     status_code      = 200
#     description = "An enrollment session prompt."
#   }

#   response {
#     status_code      = 400
#     description = "Invalid parameters."
#   }

#   response {
#     status_code      = 500
#     description = "Internal server error."
#   }
# }

