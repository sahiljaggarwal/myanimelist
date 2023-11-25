import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  displayName: string;

  @Prop()
  googleId: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
