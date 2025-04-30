/**
 * Represents the structure of an email message.
 */
export interface EmailMessage {
  /**
   * The recipient's email address.
   */
  to: string;
  /**
   * The subject line of the email.
   */
  subject: string;
  /**
   * The HTML body of the email.
   */
  html: string;
}

/**
 * Asynchronously sends an email message.
 *
 * @param message The email message to send.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  // TODO: Implement this by calling an SMTP service.
  console.log('Sending email:', message);
}
