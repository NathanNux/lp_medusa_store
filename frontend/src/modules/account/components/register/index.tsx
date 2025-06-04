"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Become a Medusa Store Member
        Staňte se členem Keramické Zahrady
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Vytvořte si profil člena Keramické Zahrady a získejte přístup k vylepšenému
        zážitku z nakupování.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Křestní jméno"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Příjmení"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Heslo"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Založením učtu souhlasíte s
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Podmínky ochrany osobních údajů
          </LocalizedClientLink>{" "}
          a{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Podmínky užívání
          </LocalizedClientLink>
          obchodu KeramickáZahrada.
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Připojit se
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Jste již členem?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Přihlásit se
        </button>
        .
      </span>
    </div>
  )
}

export default Register
