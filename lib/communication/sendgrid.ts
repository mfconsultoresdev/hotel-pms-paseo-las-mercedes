import { 
  CommunicationConfig, 
  EmailRequest, 
  EmailResponse, 
  EmailAttachment 
} from './types';

export class SendGridService {
  private config: CommunicationConfig;
  private baseUrl: string;
  private apiKey: string;

  constructor(config: CommunicationConfig) {
    this.config = config;
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://api.sendgrid.com/v3';
  }

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      const emailData = this.buildEmailData(request);
      
      const response = await fetch(`${this.baseUrl}/mail/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const responseData = await response.json();
      const messageId = response.headers.get('x-message-id');

      return {
        success: true,
        messageId: messageId || responseData.id,
        message: 'Email sent successfully via SendGrid',
        sentAt: new Date(),
        deliveredTo: Array.isArray(request.to) ? request.to : [request.to],
        failedTo: [],
      };
    } catch (error) {
      console.error('SendGrid email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send email via SendGrid',
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date(),
        deliveredTo: [],
        failedTo: Array.isArray(request.to) ? request.to : [request.to],
      };
    }
  }

  async sendBulkEmails(requests: EmailRequest[]): Promise<EmailResponse[]> {
    const responses: EmailResponse[] = [];
    
    // SendGrid allows up to 1000 recipients per request
    const batchSize = 1000;
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResponses = await Promise.all(
        batch.map(request => this.sendEmail(request))
      );
      responses.push(...batchResponses);
    }

    return responses;
  }

  async sendTemplateEmail(
    to: string | string[],
    templateId: string,
    templateData: Record<string, any>,
    options: Partial<EmailRequest> = {}
  ): Promise<EmailResponse> {
    const request: EmailRequest = {
      to,
      template: templateId,
      templateData,
      subject: options.subject || 'Email from Hotel PMS',
      from: options.from || this.config.defaultFrom,
      ...options,
    };

    return this.sendEmail(request);
  }

  async createTemplate(
    name: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      const templateData = {
        name,
        generation: 'dynamic',
        subject,
        html_content: htmlContent,
        text_content: textContent,
      };

      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid template creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        templateId: data.id,
      };
    } catch (error) {
      console.error('SendGrid template creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<{
      name: string;
      subject: string;
      htmlContent: string;
      textContent: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.subject) updateData.subject = updates.subject;
      if (updates.htmlContent) updateData.html_content = updates.htmlContent;
      if (updates.textContent) updateData.text_content = updates.textContent;

      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid template update failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('SendGrid template update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteTemplate(templateId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid template deletion failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('SendGrid template deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getTemplates(): Promise<Array<{ id: string; name: string; generation: string; updated_at: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid templates retrieval failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('SendGrid templates retrieval failed:', error);
      return [];
    }
  }

  async getTemplate(templateId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid template retrieval failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SendGrid template retrieval failed:', error);
      return null;
    }
  }

  async validateEmail(email: string): Promise<{ valid: boolean; score: number; suggestions: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/validations/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid email validation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        valid: data.valid || false,
        score: data.score || 0,
        suggestions: data.suggestions || [],
      };
    } catch (error) {
      console.error('SendGrid email validation failed:', error);
      return {
        valid: false,
        score: 0,
        suggestions: [],
      };
    }
  }

  async getEmailStats(
    startDate: string,
    endDate: string,
    aggregatedBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        aggregated_by: aggregatedBy,
      });

      const response = await fetch(`${this.baseUrl}/stats?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SendGrid stats retrieval failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SendGrid stats retrieval failed:', error);
      return null;
    }
  }

  private buildEmailData(request: EmailRequest): any {
    const emailData: any = {
      personalizations: [{
        to: this.formatRecipients(request.to),
        cc: request.cc ? this.formatRecipients(request.cc) : undefined,
        bcc: request.bcc ? this.formatRecipients(request.bcc) : undefined,
        subject: request.subject,
        dynamic_template_data: request.templateData,
      }],
      from: {
        email: request.from || this.config.defaultFrom,
        name: 'Hotel Paseo Las Mercedes',
      },
      reply_to: request.replyTo || this.config.defaultReplyTo ? {
        email: request.replyTo || this.config.defaultReplyTo,
        name: 'Hotel PMS Support',
      } : undefined,
    };

    if (request.template) {
      emailData.template_id = request.template;
    } else {
      if (request.html) {
        emailData.content = [{ type: 'text/html', value: request.html }];
      }
      if (request.text) {
        emailData.content = emailData.content || [];
        emailData.content.push({ type: 'text/plain', value: request.text });
      }
    }

    if (request.attachments && request.attachments.length > 0) {
      emailData.attachments = request.attachments.map(attachment => ({
        content: typeof attachment.content === 'string' 
          ? Buffer.from(attachment.content).toString('base64')
          : attachment.content.toString('base64'),
        type: attachment.contentType || 'application/octet-stream',
        filename: attachment.filename,
        disposition: 'attachment',
        content_id: attachment.cid,
      }));
    }

    if (request.metadata) {
      emailData.custom_args = request.metadata;
    }

    // Remove undefined values
    Object.keys(emailData).forEach(key => {
      if (emailData[key] === undefined) {
        delete emailData[key];
      }
    });

    return emailData;
  }

  private formatRecipients(recipients: string | string[]): Array<{ email: string; name?: string }> {
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
    return recipientArray.map(email => ({ email }));
  }

  async testConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      // Test with a simple API call to get account information
      const response = await fetch(`${this.baseUrl}/user/account`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'SendGrid connection test successful',
        };
      } else {
        return {
          success: false,
          message: 'SendGrid connection test failed',
          error: response.statusText,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'SendGrid connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getSupportedFeatures(): string[] {
    return [
      'email_sending',
      'template_management',
      'bulk_email',
      'email_validation',
      'analytics',
      'webhooks',
      'attachments',
      'scheduling',
    ];
  }
}
