import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse e-mail valide.' })
  @IsNotEmpty({ message: "L'e-mail est obligatoire." })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  lastName!: string;
}