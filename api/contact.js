import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const REQUIRED_FIELDS = ['name', 'email', 'organization', 'message'];
const MAX_LENGTHS = {
  name: 200,
  email: 254,
  organization: 200,
  role: 200,
  program: 200,
  message: 5000,
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Honeypot check — hidden field should always be empty for real users
  const honeypot = req.body?.website;
  if (honeypot && typeof honeypot === 'string' && honeypot.trim()) {
    // Silently accept so bot thinks it succeeded
    return res.status(200).json({ success: true });
  }

  const { name, email, organization, role, program, message } = req.body || {};

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    const value = req.body?.[field];
    if (!value || typeof value !== 'string' || !value.trim()) {
      return res.status(400).json({ error: `${field} is required.` });
    }
  }

  // Validate lengths
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = req.body?.[field];
    if (value && value.length > max) {
      return res.status(400).json({ error: `${field} exceeds maximum length.` });
    }
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Build the email
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeOrg = escapeHtml(organization.trim());
  const safeRole = role?.trim() ? escapeHtml(role.trim()) : null;
  const safeProgram = program?.trim() ? escapeHtml(program.trim()) : null;
  const safeMessage = escapeHtml(message.trim());

  const htmlBody = `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 600px;">
      <h2 style="color: #2c3a44; margin-bottom: 1.5rem;">New Inquiry from paradyne.tech</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0.5rem 1rem 0.5rem 0; color: #5a7186; font-weight: 600; vertical-align: top; white-space: nowrap;">Name</td>
          <td style="padding: 0.5rem 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 1rem 0.5rem 0; color: #5a7186; font-weight: 600; vertical-align: top; white-space: nowrap;">Email</td>
          <td style="padding: 0.5rem 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 1rem 0.5rem 0; color: #5a7186; font-weight: 600; vertical-align: top; white-space: nowrap;">Organization</td>
          <td style="padding: 0.5rem 0;">${safeOrg}</td>
        </tr>
        ${safeRole ? `<tr>
          <td style="padding: 0.5rem 1rem 0.5rem 0; color: #5a7186; font-weight: 600; vertical-align: top; white-space: nowrap;">Role</td>
          <td style="padding: 0.5rem 0;">${safeRole}</td>
        </tr>` : ''}
        ${safeProgram ? `<tr>
          <td style="padding: 0.5rem 1rem 0.5rem 0; color: #5a7186; font-weight: 600; vertical-align: top; white-space: nowrap;">Program</td>
          <td style="padding: 0.5rem 0;">${safeProgram}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 1.5rem; padding: 1.25rem; background: #f7f8f8; border-left: 3px solid #3d4f5f; border-radius: 2px;">
        <div style="color: #5a7186; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">Message</div>
        <div style="color: #1a1f20; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</div>
      </div>
    </div>
  `;

  const textBody = [
    `New Inquiry from paradyne.tech`,
    ``,
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Organization: ${organization.trim()}`,
    safeRole ? `Role: ${role.trim()}` : null,
    safeProgram ? `Program: ${program.trim()}` : null,
    ``,
    `Message:`,
    message.trim(),
  ].filter(Boolean).join('\n');

  try {
    await resend.emails.send({
      from: 'Paradyne Website <noreply@paradyne.tech>',
      to: 'contact@paradyne.tech',
      replyTo: email.trim(),
      subject: `Inquiry from ${name.trim()} at ${organization.trim()}`,
      html: htmlBody,
      text: textBody,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Unable to send message. Please try again later.' });
  }
}
