import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next'
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import NextCors from 'nextjs-cors'

export const politicaCORS = (handler : NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try{
            await NextCors(req, res, {
                origin: '*', //aceita requisições de todas origens, ou seja a API está pública
                methods: ['GET','POST','PUT'], //métodos autorizados
                optionSuccessStatus: 200, //navegadores antigos dão problema quando retorna 204
            })

            return handler(req,res)
        }catch(e){
            console.log('Erro ao tratar política de cors:', e)
            return res.status(500).json({error: 'Erro ao tratar a política de CORS'})
        }
    }