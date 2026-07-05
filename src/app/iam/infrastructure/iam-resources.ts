/** Request body for POST /authentication/sign-up. */
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Request body for POST /authentication/sign-in. */
export interface SignInRequest {
  email: string;
  password: string;
}

export interface UserResource {
  id: number;
  email: string;
  role: string;
}

/** The JWT travels in `token`; the backend does not include the role here. */
export interface AuthenticatedUserResource {
  id: number;
  email: string;
  token: string;
}
