export declare class MailService {
    private transporter;
    constructor();
    sendVerificationEmail(targetEmail: string, token: string): Promise<void>;
}
