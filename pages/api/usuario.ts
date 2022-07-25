import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UserModel } from '../../models/UserModel'
import nc from 'next-connect'
import { uploadImagemCosmic, upload } from '../../services/uploadImagemCosmic'

const handler = nc()
    .use(upload.single('file'))
    .put(async(req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{
            //se eu quero alterar o usuário, preciso pegar o usuário no banco de dados
            const {userId} = req?.query
            const usuario = await UserModel.findById(userId)

            //se o usuário retornou é porque existe
            if(!usuario){
                return res.status(400).json({error: 'Usuário não existe.'})
            }

            const {nome} = req?.body
            if(nome || nome.length > 2){
                usuario.nome = nome
            }

            const {file} = req
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req)
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url
                    console.log(image.media.url)
                }
            }
            //alterar os dados no banco
            await UserModel.findByIdAndUpdate({_id: usuario._id}, usuario)

            return res.status(200).json({error: 'Usuário alterado com sucesso.'})

        }catch(e){
            console.log(e)
            return res.status(400).json({error: 'Não foi possível atualizar o usuário: '+ e})
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {

        try{
            //pegando o ID de usuário a partir do token
            const {userId} = req?.query
            //buscando o usuário pelo ID
            const usuario = await UserModel.findById(userId)
            usuario.senha = null
            return res.status(200).json(usuario)
        }catch(e){
            console.log(e)
        }
        return res.status(400).json({error: 'Não foi possível obter dados do usuário.'})   
    })
    //por conta do envio de imagem, é necessário tirar o formato json e enviar os dados em multi part form data
export const config = {
    api: {
        bodyParser: false
    }
}

export default validaTokenJWT(conectaMongoDB(handler))