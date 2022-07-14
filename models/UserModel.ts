//schema do usuário

import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
    avatar: {type: String, required: false}, //foto de perfil é opcional
    seguidores: {type: Number, default: 0},
    seguindo: {type: Number, default: 0},
    publicacoes: {type: Number, default: 0},
})

export const UserModel = (mongoose.models.usuarios || mongoose.model('usuarios', UserSchema))