import type { NextApiRequest, NextApiHandler, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken'

export const validaTokenJWT = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse) => {
        const { MINHA_CHAVE_JWT } = process.env

        if (!MINHA_CHAVE_JWT) {
            return res.status(500).json({ error: 'Env chave JWT não informada.' })
        }

        if (!req || !req.headers) {
            return res.status(401).json({ error: 'Não foi possível validar o token de acesso. (Headers)' })
        }

        if (req.method !== 'OPTIONS') {
            const authorization = req.headers['authorization']
            if (!authorization) {
                return res.status(401).json({ error: 'Não foi possível validar o token de acesso. (Authorization)' })
            }

            const token = authorization.substring(7)
            if (!token) {
                return res.status(401).json({ error: 'Não foi possível validar o token de acesso. (Token)' })
            }

            const decoded = await jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload
            if (!decoded) {
                return res.status(401).json({ error: 'Não foi possível validar o token. (Decoded)' })
            }

            if (!req.query) {
                req.query = {}
            }

            req.query.userId = decoded._id
        }
        return handler(req, res)

    }