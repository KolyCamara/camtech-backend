import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { Resend } from "resend";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
  private readonly emailFrom: string;
  private readonly emailTo: string;
  private readonly resend: Resend;

  constructor(
    @Inject("PG_POOL") private readonly pool: Pool,
    private readonly configService: ConfigService,
  ) {
    const resendApiKey = this.configService.get<string>("RESEND_API_KEY");
    this.emailFrom = this.configService.get<string>("EMAIL_FROM") || "";
    this.emailTo = this.configService.get<string>("EMAIL_TO") || "";

    if (!resendApiKey || !this.emailFrom || !this.emailTo) {
      throw new Error(
        "RESEND_API_KEY, EMAIL_FROM and EMAIL_TO must be defined in environment variables",
      );
    }

    this.resend = new Resend(resendApiKey);
  }

  async submit(createContactDto: CreateContactDto) {
    const query = `INSERT INTO contacts(name, email, message, created_at)
      VALUES($1, $2, $3, NOW()) RETURNING id`;
    const values = [
      createContactDto.name,
      createContactDto.email,
      createContactDto.message,
    ];

    try {
      const result = await this.pool.query(query, values);
      await this.resend.emails.send({
        from: this.emailFrom,
        to: [this.emailTo],
        subject: `Nouveau message CamTech de ${createContactDto.name}`,
        html: `<p><strong>Nom :</strong> ${createContactDto.name}</p>
               <p><strong>Email :</strong> ${createContactDto.email}</p>
               <p><strong>Message :</strong><br/>${createContactDto.message.replaceAll("\n", "<br/>")}</p>`,
      });

      return {
        status: "success",
        message: "Message reçu. Nous reviendrons vers vous rapidement.",
        id: result.rows[0]?.id,
      };
    } catch (error) {
      console.error("Contact submit error:", error);
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de l'envoi du message.",
      );
    }
  }
}
