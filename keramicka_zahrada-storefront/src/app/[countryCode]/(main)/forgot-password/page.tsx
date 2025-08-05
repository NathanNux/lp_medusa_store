import { Metadata } from "next"

import RequestResetPassword from "@modules/account/templates/forgot-password-page"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password for your Medusa Store account.",
}

export default function ForgotPassword() {
  return <RequestResetPassword />
}
