import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'


export const politicaCORS = async (handler : NextApiHandler) => 
    (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{

        }catch(e){
            console.log('Erro ao tratar política de cors:', e)
            return res.status(500).json({error: 'Erro ao tratar a política de CORS'})
        }
    }