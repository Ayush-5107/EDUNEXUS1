// EduNexus API Layer - Barrel Export
// All backend service functions and types in one place

export { apiClient, ApiError, getApiBaseUrl } from "./client"
export { loginUser, registerUser } from "./auth.service"
export type { RegisterRequest } from "./auth.service"
export {
  getSubjects,
  getMaterials,
  addMaterial,
  uploadMaterial,
} from "./academic.service"
export { aiExplain } from "./ai.service"
export { downloadMaterial, downloadAllMaterials } from "./download"
export type {
  BackendUser,
  BackendSubject,
  BackendMaterial,
  LoginRequest,
  MaterialRequest,
  AIRequest,
  AIExplainResponse,
  FrontendUser,
  FrontendUserRole,
} from "./types"
export { mapBackendRoleToFrontend, mapBackendUserToFrontend } from "./types"
