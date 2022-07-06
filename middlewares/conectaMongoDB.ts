import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectaMongoDB = (handler : NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        //verificar se o banco já está conectado, se estiver seguir para o endpoint
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
        
        //obter a variável de ambiente preenchida do env
        const {DB_CONEXAO_STRING} = process.env;

        //se a env estiver vazia aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({error: `ENV de configuração do banco não informado!! ${DB_CONEXAO_STRING}`});
        }
        //se não está conectado, vamos conectar
        mongoose.connection.on('connected', () => console.log("Banco de dados conectado"));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco, erro: ${error}`))
        await mongoose.connect(DB_CONEXAO_STRING);
        
        //agora posso seguir para o endpoint pois já está conectado
        return handler(req,res);
        
    }