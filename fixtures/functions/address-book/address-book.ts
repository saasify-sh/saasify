/**
 * #TopLevel
 */
export function Nala(address: AddressBook): string {
  return 'TODO'
}

class AddressBook {
  /**
   * A dictionary of Contacts, indexed by unique ID
   */
  contacts: { [id: string]: Contact }
}

class Contact {
  firstName: string
  lastName?: string

  birthday?: Date

  title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Prof.'

  emails: string[]
  phones: PhoneNumber[]

  /** @TJS-type integer */
  highScore: number
}

/**
 * A Contact's phone number.
 */
class PhoneNumber {
  number: string

  /** An optional label (e.g. "mobile") */
  label?: string
}
