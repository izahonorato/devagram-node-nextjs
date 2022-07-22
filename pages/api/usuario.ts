import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UserModel } from '../../models/UserModel'

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {

    try{
        //pegando o ID de usuário a partir do token
        const {userId} = req?.query
        //buscando o usuário pelo ID
        const usuario = await UserModel.findById(userId)
        usuario.senha = null
        return res.status(200).json(usuario)
    }catch(e){
        console.log(e)
        return res.status(400).json({error: 'Não foi possível obter dados do usuário.'})
    }




    return res.status(200).json({error: 'Usuário autenticado com sucesso.'})
}

export default validaTokenJWT(conectaMongoDB(usuarioEndpoint))