import type {NextApiRequest, NextApiResponse} from 'next';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import { politicaCORS } from '../../middlewares/politicaCORS';
import { validaTokenJWT } from '../../middlewares/validaTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UserModel } from '../../models/UserModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const comentarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        //qual metodo http utilizaremos?
        if(req.method === 'PUT'){
            //precisamos do id do usuario - vem do query
            const {userId, id} = req.query
            const usuarioLogado = await UserModel.findById(userId)
            if(!usuarioLogado){
                return res.status(400).json({error:'Usuário não encontrado'})
            }
            //id da publicacao - vem da query
            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({error: 'Publicação não encontrada'})
            }

            //comentario - vem do body
            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({error: 'Comentário inválido'})
            }

            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: req.body.comentario
            }

            publicacao.comentarios.push(comentario)
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)
            return res.status(200).json({msg: 'Comentário adicionado com sucesso'})
            
        }
        return res.status(405).json({error: 'Método informado é inválido'})

    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Erro ao adicionar comentário'})
    }
}

export default politicaCORS(validaTokenJWT(conectaMongoDB(comentarioEndpoint)))

