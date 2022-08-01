import mongoose, {Schema} from 'mongoose'

const seguidorSchema = new Schema({
    usuarioId: {type: String, required: true},
    usuarioSeguidoId: {type: String, required: true},
})

export const PublicacaoModel = (mongoose.models.publicacoes ||
    mongoose.model('seguidores', seguidorschema))