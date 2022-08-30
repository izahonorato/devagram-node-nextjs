import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import nc from 'next-connect'
import { uploadImagemCosmic, upload } from '../../services/uploadImagemCosmic'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { validaTokenJWT } from '../../middlewares/validaTokenJWT'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { UserModel } from '../../models/UserModel'

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {

            const {userId} = req.query
            const usuario = await UserModel.findById(userId)

            if(!usuario){
                return res.status(400).json({error: 'Usuário não encontrado.'})
            }

            if(!req || !req.body){
                return res.status(400).json({error: 'Parâmetros de entrada não informados.'})
            }

            const { descricao } = req?.body

            if (!descricao || descricao < 2) {
                return res.status(400).json({ error: 'Descrição inválida.' })
            }

            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ error: 'Imagem obrigatória.' })
            }

            const image = await uploadImagemCosmic(req)
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }

            //somando número de publicações do usuário
            usuario.publicacoes++
            await UserModel.findByIdAndUpdate({_id: usuario._id}, usuario)

            await PublicacaoModel.create(publicacao)

            return res.status(200).json({ error: 'Publicação ok.' })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ error: 'Erro ao cadastrar publicacao.' })

        }

    })

export const config = {
    api: {
        bodyParser: false
    }
}

export default validaTokenJWT(conectaMongoDB(handler))