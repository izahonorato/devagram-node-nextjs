import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UserModel } from '../../models/UserModel'

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'GET'){
            if(!req?.query?.id){
                const usuario = await UserModel.findById(req?.query?.id)

                if(!usuario){
                    return res.status(400).json({error: 'Usuário não existe.'})
                }
            }
        }
        return res.status(405).json({error: 'Método informado não é válido.'})

    }catch(e){
        console.log(e)
        return res.status(400).json({error: 'Não foi possível obter o feed.'})
    }
}

export default validaTokenJWT(conectaMongoDB(feedEndpoint))