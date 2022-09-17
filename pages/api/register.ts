import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { RegisterRequest } from '../../types/RegisterRequest';
import { UserModel } from '../../models/UserModel';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import md5 from 'md5';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import nc from 'next-connect'
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const usuario = req.body as RegisterRequest;

            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ error: 'Nome inválido!' })
            }

            if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ error: 'Email inválido!' })
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ error: 'Senha inválida' })
            }

            //verificação se já existe usuário com o mesmo email
            const usuariosMesmoEmail = await UserModel.find({ email: usuario.email })
            if (usuariosMesmoEmail && usuariosMesmoEmail.length > 0) {
                return res.status(400).json({ error: 'Já existe uma conta com este e-mail.' })
            }


            //enviar a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req)

            //salvar no banco de dados
            const userToBeSaved = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                avatar: image?.media?.url
            }
            await UserModel.create(userToBeSaved);
            return res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' })

        } catch (e: any) {
            console.log(e)
            return res.status(400).json({ error: e.toString() })
        }

    })

//não quero que mande a requisição em json
export const config = {
    api: {
        bodyParser: false
    }
}

export default politicaCORS(conectaMongoDB(handler));