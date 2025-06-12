'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
	HeadingOneIcon,
	HeadingTwoIcon,
	HeadingThreeIcon,
	ListIcon,
	ListOrderedIcon,
	CodeBlockIcon,
	BoldIcon,
	ItalicIcon,
	StrikeIcon,
	Code2Icon,
	UnderlineIcon,
	AlignRightIcon,
	AlignLeftIcon,
	AlignCenterIcon,
} from './editor-icons'

const MenuBar = ({ editor }: {
	editor: Editor | null
}) => {
	if (!editor) {
		return null
	}
	return (
		<div className="flex border rounded-lg py-1 px-2 gap-2">
			<Button
				variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
				className="rounded-xl"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<HeadingOneIcon />
			</Button>
			<Button
				variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
				className="rounded-xl"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<HeadingTwoIcon />
			</Button>

			<Button
				variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
				className="rounded-xl"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<HeadingThreeIcon />
			</Button>


			<Separator orientation="vertical" />

			<Button variant="ghost" className="rounded-xl">
				<ListIcon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<ListOrderedIcon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<CodeBlockIcon />
			</Button>

			<Separator orientation="vertical" />

			<Button variant="ghost" className="rounded-xl">
				<BoldIcon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<ItalicIcon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<StrikeIcon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<Code2Icon />
			</Button>
			<Button variant="ghost" className="rounded-xl">
				<UnderlineIcon />
			</Button>

			<Separator orientation="vertical" />

			{/* aligin */}
			<Button variant="ghost" className="rounded-xl">
				<AlignLeftIcon />
			</Button>

			<Button variant="ghost" className="rounded-xl">
				<AlignCenterIcon />
			</Button>

			<Button variant="ghost" className="rounded-xl">
				<AlignRightIcon />
			</Button>
		</div>
	)
}


export const RichTextEditor = ({ content }: { content: any }) => {
	const editor = useEditor({
		extensions: [
			StarterKit
		],
		// tries to render immediately, even during SSR, so false.
		immediatelyRender: false,
		content: content,
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
			}
		}
	})

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="sticky top-0">
				<MenuBar editor={editor} />
			</div>

			<EditorContent editor={editor} />
		</div>
	)
}
