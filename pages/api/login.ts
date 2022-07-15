import type {NextApiRequest, NextApiResponse} from 'next';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UserModel } from '../../models/UserModel';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        //consulta no banco se existem usuários com o email informado
        const usuariosEncontrados = await UserModel.find({email: login, senha: md5(senha)}) 

        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0]
            return res.status(200).json({msg : `Usuário ${usuarioEncontrado.nome} autenticado com sucesso.`});
        }
        return res.status(400).json({error : 'Usuário ou senha incorretos.'});
    }
    return res.status(405).json({error : 'Método informado não é válido.'});
}

export default conectaMongoDB(endpointLogin)