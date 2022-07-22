import mongoose, {Schema} from 'mongoose'

const PublicacaoSchema = new Schema({
    idUsuario: {type: String, required: true},
    descricao: {type: String, required: true},
    foto: {type: String, required: true},

})