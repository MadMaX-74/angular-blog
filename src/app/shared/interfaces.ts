export interface User {
  email: string
  password: string
  returnSecureToken?: boolean
}
export interface FbAuthResp {
  idToken: string
  expiresIn?: string
}
