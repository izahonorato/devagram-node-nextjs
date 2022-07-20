import type {NextApiRequest, NextApiResponse} from 'next'
import {validaTokenJWT} from '../../middlewares/validaTokenJWT'

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse) => {

    return res.status(200).json('Usuário autenticado com sucesso.')
}

export default validaTokenJWT(usuarioEndpoint)