//schema do usuário

import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    senha: {type: String, required: true},
})