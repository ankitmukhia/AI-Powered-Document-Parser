import express, { type Express, type Request, type Response } from 'express'
import { Mistral } from '@mistralai/mistralai'
import multer from 'multer'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import cors from 'cors'
import fs from 'fs'
import z from 'zod'

const app: Express = express()
app.use(cors({
	origin: "http://localhost:3000"
}))

const PORT = process.env.PORT ?? 3000;
const apiKey = process.env.MISTRAL_API_KEY ?? "mistral_api_key";
const client = new Mistral({ apiKey: apiKey })

const storage = multer.diskStorage({
	destination: "./uploads",
	filename: (_, file: Express.Multer.File, cb: (error: Error | null, filePath: string) => void) => {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})

const fileFilter = (_, file: Express.Multer.File, cb: (error: any | null, acceptFile: boolean) => void) => {
	const allowedMimeTypes = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	];

	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error("Only PDF and DOCX files are allowed!"), false)
	}
}

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
})

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
	const file = req.file

	const validateFileMetadata = z.object({
		fieldname: z.string(),
		originalname: z.string(),
		encoding: z.string(),
		mimetype: z.string(),
		destination: z.string(),
		filename: z.string(),
		path: z.string(),
		size: z.number(),
	}).safeParse(file)

	const { data, error, success } = validateFileMetadata;

	if (!success) {
		res.status(404).json({
			message: error.format()
		})
		return
	}

	try {
		// read file now from the disk and fead it into mistral ai and send back response
		const uploadedFile = fs.readFileSync(data.path)

		// either upload within mistral or cloude or cloudinary etc.
		const uploadedPdforDocx = await client.files.upload({
			file: {
				fileName: data.filename,
				content: uploadedFile
			},
			purpose: "ocr"
		})

		// reterive file
		/* const retrivedFile = await client.files.retrieve({
			fileId: uploadedPdforDocx.id
		}) */

		const signedUrl = await client.files.getSignedUrl({
			fileId: uploadedPdforDocx.id
		})
		const osrResponse = await client.ocr.process({
			model: "mistral-ocr-latest",
			document: {
				type: "document_url",
				documentUrl: signedUrl.url
			},
			includeImageBase64: true
		})

		const mergedResponse = osrResponse.pages.map(m => m.markdown).join()

		const processedContent = await remark().use(remarkHtml, { sanitize: false }).process(mergedResponse)

		const htmlContent = processedContent.toString()

		res.status(200).json({
			data: htmlContent
		})

	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message)
		}
		console.log(error)
	}
})

app.listen(PORT, () => {
	console.log(`Server is renning at ${PORT}`)
})
