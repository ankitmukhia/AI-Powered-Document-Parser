import express, { type Express, type Request, type Response } from 'express'
import { Mistral } from '@mistralai/mistralai'
import multer from 'multer'
import path from 'path'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import cors from 'cors'
import z from 'zod'
import { v2 as cloudinary } from 'cloudinary';
const app: Express = express()

app.use(cors({
	origin: process.env.NODE_ENV === "production"
		? process.env.PRODUCTION
		: "http://localhost:3000"
}))

const PORT = process.env.PORT ?? 3001;
const apiKey = process.env.MISTRAL_API_KEY ?? "mistral_api_key";
const client = new Mistral({ apiKey: apiKey })

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// can also quick and fast Buffer store.
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
		//TODO: Not working with pdf currently. Error perset.
		const cloudinaryUpload = await cloudinary.uploader.upload(data.path, {
			resource_type: "raw",
			public_id: path.parse(data.originalname).name
		});

		const osrResponse = await client.ocr.process({
			model: "mistral-ocr-latest",
			document: {
				type: "document_url",
				documentUrl: cloudinaryUpload.secure_url
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
		console.error(error);
		if (error instanceof Error) {
			res.status(500).json({ message: 'Internal Server Error', error: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
})

app.listen(PORT, () => {
	console.log(`Server is renning at ${PORT}`)
})
