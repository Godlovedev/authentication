import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Veuillez fournir un e-mail valide.' })
  @IsNotEmpty({ message: "L'e-mail est obligatoire." })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password!: string;
}