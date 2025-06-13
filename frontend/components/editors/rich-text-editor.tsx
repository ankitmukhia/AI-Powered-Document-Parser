'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAligin from '@tiptap/extension-text-align'
import Strike from '@tiptap/extension-strike'
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
	BlockQuoteIcon
} from '../editor-icons'

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

			<Button
				className="rounded-xl"
				variant={editor.isActive("bulletList") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<ListIcon />
			</Button>
			<Button
				className="rounded-xl"
				variant={editor.isActive("orderedList") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrderedIcon />
			</Button>
			<Button
				className="rounded-xl"
				variant={editor.isActive("blockquote") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				<BlockQuoteIcon />
			</Button>

			<Button
				className="rounded-xl"
				variant={editor.isActive("codeBlock") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
			>
				<CodeBlockIcon />
			</Button>


			<Separator orientation="vertical" />

			<Button
				variant={editor.isActive("bold") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleBold().run()}
				className="rounded-xl"
			>
				<BoldIcon />
			</Button>
			<Button
				className="rounded-xl"
				variant={editor.isActive("italic") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<ItalicIcon />
			</Button>
			<Button
				className="rounded-xl"
				variant={editor.isActive("strike") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				<StrikeIcon />
			</Button>
			<Button
				className="rounded-xl"
				variant={editor.isActive("code") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleCode().run()}
			>
				<Code2Icon />
			</Button>
			<Button
				variant={editor.isActive("underline") ? "default" : "ghost"}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className="rounded-xl"
			>
				<UnderlineIcon />
			</Button>

			<Separator orientation="vertical" />

			{/* aligin */}
			<Button
				className="rounded-xl"
				variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
			>
				<AlignLeftIcon />
			</Button>

			<Button
				className="rounded-xl"
				variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
			>
				<AlignCenterIcon />
			</Button>

			<Button
				className="rounded-xl"
				variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
			>
				<AlignRightIcon />
			</Button>
		</div>
	)
}


export const RichTextEditor = ({ content }: { content: any }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Strike,
			TextAligin.configure({
				types: ["heading", "paragraph"]
			})
		],
		// tries to render immediately, even during SSR, so false.
		immediatelyRender: false,
		content: content,
		editorProps: {
			attributes: {
				class: 'prose prose-sm focus:outline-none max-w-none',
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
