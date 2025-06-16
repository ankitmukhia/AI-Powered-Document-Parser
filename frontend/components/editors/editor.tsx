'use client'

import { useState, useCallback, useEffect } from 'react'
import { UploadStatus } from './file-uploader'
import { FileUploader } from './file-uploader'
import { RichTextEditor } from './rich-text-editor'
import { generateJSON } from '@tiptap/html'
// import { SAMPLE_MARKDOWN } from '@/constants/content'

import { type Content } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

const extensions = [
	StarterKit
]

export const Editor = () => {
	const [editorData, setEditorData] = useState<Content>(null)
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
	const [fileName, setFileName] = useState<string>("")
	const [errorMessage, setErrorMessage] = useState<string>("")

	const handleFileSelect = useCallback(async (file: File) => {
		setFileName(file.name)
		setUploadStatus("uploading")
		setErrorMessage("")

		try {
			const formData = new FormData()
			formData.append("file", file)

			const response = await fetch("http://localhost:8080/upload", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`)
			}

			const { data } = await response.json()

			const json = generateJSON(data, extensions)

			setEditorData(json)
			setUploadStatus("success")
		} catch (error) {
			setUploadStatus("error")
			setErrorMessage(error instanceof Error ? error.message : "Upload failed")
		}
	}, [fileName, uploadStatus, errorMessage, editorData])

	useEffect(() => {
		console.log("parent handlefileselect rerendered")
	}, [handleFileSelect])

	return (
		<div className="max-w-3xl mx-auto p-6">
			{editorData === null ? (
				<FileUploader
					onFileSelect={handleFileSelect}
					uploadStatus={uploadStatus}
					fileName={fileName}
					errorMessage={errorMessage}
				/>
			) : (
				<RichTextEditor content={editorData} />
			)}
		</div>
	)
}

