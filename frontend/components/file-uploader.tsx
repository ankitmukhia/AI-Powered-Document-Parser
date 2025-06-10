"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export const FileUploader = () => {
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
	const [fileName, setFileName] = useState<string>("")
	const [errorMessage, setErrorMessage] = useState<string>("")
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setFileName(file.name)
		setUploadStatus("uploading")
		setErrorMessage("")

		try {
			const formData = new FormData()
			formData.append("file", file)

			console.log("file form data: ", formData.get("file"))

			const response = await fetch("http://localhost:8080/upload", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`)
			}

			setUploadStatus("success")
		} catch (error) {
			setUploadStatus("error")
			setErrorMessage(error instanceof Error ? error.message : "Upload failed")
		}

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	const handleClick = () => {
		fileInputRef.current?.click()
	}

	const getStatusIcon = () => {
		switch (uploadStatus) {
			case "uploading":
				return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
			case "success":
				return <CheckCircle className="h-6 w-6 text-green-500" />
			case "error":
				return <AlertCircle className="h-6 w-6 text-red-500" />
			default:
				return <Upload className="h-6 w-6 text-gray-500" />
		}
	}

	const getStatusText = () => {
		switch (uploadStatus) {
			case "uploading":
				return `Uploading ${fileName}...`
			case "success":
				return `Successfully uploaded ${fileName}`
			case "error":
				return errorMessage || "Upload failed"
			default:
				return "Import Document"
		}
	}

	const getStatusColor = () => {
		switch (uploadStatus) {
			case "uploading":
				return "text-blue-600"
			case "success":
				return "text-green-600"
			case "error":
				return "text-red-600"
			default:
				return "text-gray-600"
		}
	}

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
				<CardContent className="p-6">
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						onChange={handleFileSelect}
						className="hidden"
						disabled={uploadStatus === "uploading"}
					/>

					<Button
						variant="ghost"
						className={cn(
							"w-full h-auto p-6 flex flex-col items-center gap-4 hover:bg-gray-50",
							uploadStatus === "uploading" && "cursor-not-allowed opacity-70",
						)}
						onClick={handleClick}
						disabled={uploadStatus === "uploading"}
					>
						<div className="flex items-center gap-3">
							{getStatusIcon()}
							<FileText className="h-6 w-6 text-gray-400" />
						</div>

						<div className="text-center">
							<p className={cn("font-medium", getStatusColor())}>{getStatusText()}</p>
							{uploadStatus === "idle" && <p className="text-sm text-gray-500 mt-1">Supports PDF and DOCX files</p>}
						</div>
					</Button>
				</CardContent>
			</Card>

			{uploadStatus === "success" && (
				<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
					<p className="text-sm text-green-700 flex items-center gap-2">
						<CheckCircle className="h-4 w-4" />
						Document uploaded successfully!
					</p>
				</div>
			)}

			{uploadStatus === "error" && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-700 flex items-center gap-2">
						<AlertCircle className="h-4 w-4" />
						{errorMessage}
					</p>
				</div>
			)}
		</div>
	)
}
