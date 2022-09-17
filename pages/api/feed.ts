import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'
import { conectaMongoDB } from '../../middlewares/conectaMongoDB'
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UserModel } from '../../models/UserModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { SeguidorModel } from '../../models/SeguidorModel'
import { politicaCORS } from '../../middlewares/politicaCORS'

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
            }else{
                //se a busca não é por ID de usuário então trazemos o feed principal
                const {userId} = req.query;
                const usuarioLogado = await UserModel.findById(userId)

                if(!usuarioLogado){
                    return res.status(400).json({error: 'Usuário não encontrado.'})
                }
                //agora temos o usuário logado
                //vamos buscar os seguidores

                const seguidores = await SeguidorModel.find({usuarioId: usuarioLogado._id})
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId)
                const publicacoes = await PublicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ]     
                //ordenando as publicacoes por data    
                }).sort({data: -1}) //publicacoes mais novas aparecem primeiro

                const result = []
                for (const publicacao of publicacoes){
                    const usuarioDaPublicacao = await UserModel.findById(publicacao.idUsuario)

                    //aqui estou juntando o json da publicacao com o json de dados do usuario
                    if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario : {
                            nome: usuarioDaPublicacao.nome,
                            avatar: usuarioDaPublicacao.avatar
                        }}
                        result.push(final)
                    }
                }

                return res.status(200).json({result})
            }


        }
        return res.status(405).json({error: 'Método informado não é válido.'})

    }catch(e){
        console.log(e)
        
    }
    return res.status(400).json({error: 'Não foi possível obter o feed.'})
}

export default politicaCORS(validaTokenJWT(conectaMongoDB(feedEndpoint)))