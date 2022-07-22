import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import nc from 'next-connect'
import { uploadImagemCosmic, upload } from '../../services/uploadImagemCosmic'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { validaTokenJWT } from '../../middlewares/validaTokenJWT'

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {

            if(!req || !req.body){
                return res.status(400).json({error: 'Parâmetros de entrada não informados.'})
            }

            const { descricao } = req?.body

            if (!descricao || descricao < 2) {
                return res.status(400).json({ error: 'Descrição inválida.' })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'Imagem obrigatória.' })
            }

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