import type { NextApiRequest, NextApiResponse } from "next";
import { conectaMongoDB } from "../../middlewares/conectaMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validaTokenJWT } from "../../middlewares/validaTokenJWT";
import { UserModel } from "../../models/UserModel";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";


const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const usuarioEncontrado = await UserModel.findById(req?.query?.id)
                if(!usuarioEncontrado){
                    return res.status(400).json({error: 'Usuário não encontrado.'})
                }
                usuarioEncontrado.senha = null
                return res.status(200).json(usuarioEncontrado)
            } else {
                const { filtro } = req?.query
                if (!filtro || filtro.length < 2) {
                    return res.status(400).json({ error: 'Informe pelo menos dois caracteres para a busca.' })
                }

                const usuariosEncontrados = await UserModel.find({
                    $or: [{ nome: { $regex: filtro, $options: 'i' } },
                    { email: { $regex: filtro, $options: 'i' } }]
                    //opção i de ignore case
                })
                usuariosEncontrados.forEach(e => e.senha = null)
                return res.status(200).json(usuariosEncontrados)
            }

        }
        return res.status(405).json({ error: 'Método inválido.' })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Não foi possível buscar usuário.' })
    }
}

export default politicaCORS(validaTokenJWT(conectaMongoDB(pesquisaEndpoint)))