import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UserModel } from '../../models/UserModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                //buscando usuário pelo ID
                const usuario = await UserModel.findById(req?.query?.id)

                //validando se o usuário existe
                if(!usuario){
                    return res.status(400).json({error: 'Usuário não existe.'})
                }
                //buscando publicações do usuário
                const publicacoes = await PublicacaoModel
                    .find({idUsuario: usuario._id}) //busca todas as publicacoes desse ID
                    .sort({data: -1}) //ordena por data, mais recente para mais antigo
                    return res.status(200).json(publicacoes)
            }


        }
        return res.status(405).json({error: 'Método informado não é válido.'})

    }catch(e){
        console.log(e)
        
    }
    return res.status(400).json({error: 'Não foi possível obter o feed.'})
}

export default validaTokenJWT(conectaMongoDB(feedEndpoint))