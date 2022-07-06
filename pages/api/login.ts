import type {NextApiRequest, NextApiResponse} from 'next';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const endpointLogin = (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin' && senha === 'admin'){
            return res.status(200).json({msg : 'Usuário autenticado com sucesso.'});
        }
        return res.status(400).json({error : 'Usuário ou senha incorretos.'});
    }
    return res.status(405).json({error : 'Método informado não é válido.'});
}

export default conectaMongoDB(endpointLogin)