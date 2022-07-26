import type { NextApiRequest, NextApiResponse } from "next";
import { conectaMongoDB } from "../../middlewares/conectaMongoDB";
import { validaTokenJWT } from "../../middlewares/validaTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UserModel } from "../../models/UserModel";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            //id da publicação
            const {id} = req?.query
            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({error: 'Publicação não encontrada.'})
            }

            //id do usuário que está curtindo
            const {userId} = req?.query
            const usuario = await UserModel.findById(userId)
            if(!usuario){
                return res.status(400).json({error: 'Usuário não encontrado.'})
            }

            //administrando os likes
            //se o index for -1 ele nao curtiu a foto
            //se o index for > -1 ja curtiu a foto
            const indexDoUsuarioNoLike = publicacao.curtidas.findIndex((e : any) => e.toString() === usuario._id.toString())
            
            if(indexDoUsuarioNoLike != -1){
                //descurtindo publicação
                //splice tira um elemento do array
                publicacao.curtidas.splice(indexDoUsuarioNoLike, 1)
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)

                return res.status(200).json({error: 'Publicação descurtida com sucesso.'})
            }else{
                //curtindo a foto
                //push coloca um elemento no array
                publicacao.curtidas.push(usuario._id)
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)

                return res.status(200).json({error: 'Publicacao curtida com sucesso.'})
            }
        }
        return res.status(405).json({error: 'Método inválido.'})


    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Ocorreu um erro ao curtir/descurtir a publicação.'})
    }
}

export default validaTokenJWT(conectaMongoDB(likeEndpoint))