'use client'

import { useEditor, EditorContent, type Editor, type Content } from '@tiptap/react'
import { IntersectionSwap } from '@/components/intersection-swap'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAligin from '@tiptap/extension-text-align'
import Strike from '@tiptap/extension-strike'
import { MenuButtons } from '@/components/editor-buttons/menu-buttons'
import { ExportFile } from './export-file'

const HeaderMenu = ({ editor }: {
	editor: Editor | null
}) => {
	if (!editor) {
		return null
	}
	return <MenuButtons editor={editor} className="flex border-b pb-2 gap-2" />
}

const NavMenu = ({ editor }: {
	editor: Editor | null
}) => {
	if (!editor) {
		return null
	}
	return <MenuButtons editor={editor} className="flex border rounded-lg py-1 px-2 gap-2 bg-zinc-900" />
}

export const RichTextEditor = ({ content }: { content: Content }) => {
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
		content,
		editorProps: {
			attributes: {
				class: 'prose dark:prose-invert prose-sm focus:outline-none max-w-none',
			}
		}
	})

	return (
		<div className="flex flex-col space-y-6 items-center justify-center">
			<IntersectionSwap nav={
				<NavMenu editor={editor} />
			}>
				<HeaderMenu editor={editor} />
			</IntersectionSwap>

			<EditorContent editor={editor} />
		</div>
	)
}
