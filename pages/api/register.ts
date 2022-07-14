import type {NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { RegisterRequest } from '../../types/RegisterRequest';
import {UserModel} from '../../models/UserModel';
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import md5 from 'md5';

const endpointRegister = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

   if (req.method === 'POST'){
        const usuario = req.body as RegisterRequest;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({error: 'Nome inválido!'})
        }

        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') 
            || !usuario.email.includes('.')){
            return res.status(400).json({error: 'Email inválido!'})
        }

        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({error: 'Senha inválida'})
        }

        //salvar no banco de dados
        const userToBeSaved = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha)
        }
        await UserModel.create(userToBeSaved);
        return res.status(200).json({msg: 'Usuário cadastrado com sucesso!'})
   }

   return res.status(405).json({error: 'Método informado não é válido.'})

 
}

export default conectaMongoDB(endpointRegister);