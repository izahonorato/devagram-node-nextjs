import type { NextApiRequest, NextApiResponse } from "next";
import { conectaMongoDB } from "../../middlewares/conectaMongoDB";
import { validaTokenJWT } from "../../middlewares/validaTokenJWT";
import { UserModel } from "../../models/UserModel";
import { SeguidorModel } from "../../models/SeguidorModel"
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";


const endpointSeguir = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req?.query
            //id do usuário vindo do token = usuário logado/autenticado
            const usuarioLogado = await UserModel.findById(userId)
            if(!usuarioLogado){
                return res.status(400).json({error: 'Usuário logado não encontrado.'})
            }

            //id do usuário a ser seguido - vem da query
            const usuarioASerSeguido = await UserModel.findById(id)
            if(!usuarioASerSeguido){
                return res.status(400).json({error: 'Usuário não encontrado.'})
            }

            //verificar se já sigo o usuário
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id})

            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                //eu já sigo o usuário
                euJaSigoEsseUsuario.forEach(async(e: any) => await SeguidorModel.findByIdAndDelete({_id: e.id}))
                usuarioLogado.seguindo--
                await UserModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)

                usuarioASerSeguido.seguidores--
                await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)

                return res.status(200).json({msg: 'Deixou de seguir com sucesso.'})
            }else{
                //eu não sigo o usuário
                const seguidor ={
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id
                }
                await SeguidorModel.create(seguidor)
                //atualizar seguindo do usuário logado
                usuarioLogado.seguindo++
                await UserModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)
                
                //atualizar seguidores do usuário a ser seguido
                usuarioASerSeguido.seguidores++
                await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)

                return res.status(200).json({msg: 'Usuário seguido com sucesso.'})
            }

        }
        return res.status(405).json({error: 'Método inválido.'})

    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Não foi possível dar follow/unfollow.'})
    }
}

export default validaTokenJWT(conectaMongoDB(endpointSeguir))