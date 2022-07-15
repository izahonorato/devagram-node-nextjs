import type {NextApiRequest, NextApiResponse} from 'next';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UserModel } from '../../models/UserModel';
import jwt from 'jsonwebtoken';
import type {LoginResposta} from '../../types/LoginResposta';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {

    const {MINHA_CHAVE_JWT} = process.env
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({error: 'ENV Jwt não informada.'})
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;

        //consulta no banco se existem usuários com o email informado
        const usuariosEncontrados = await UserModel.find({email: login, senha: md5(senha)}) 

        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0]

            const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT)
            return res.status(200).json({
                nome: usuarioEncontrado.nome, 
                email: usuarioEncontrado.email, 
                token});
        }
        return res.status(400).json({error : 'Usuário ou senha incorretos.'});
    }
    return res.status(405).json({error : 'Método informado não é válido.'});
}

export default conectaMongoDB(endpointLogin)