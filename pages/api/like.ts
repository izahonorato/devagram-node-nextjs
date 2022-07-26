import type { NextApiRequest, NextApiResponse } from "next";
import { conectaMongoDB } from "../../middlewares/conectaMongoDB";
import { validaTokenJWT } from "../../middlewares/validaTokenJWT";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try{
        

    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Ocorreu um erro ao curtir/descurtir a publicação.'})
    }
}

export default validaTokenJWT(conectaMongoDB(likeEndpoint))