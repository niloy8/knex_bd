'use client';

import './tiptap-editor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    ImageIcon,
    Link2,
    Undo,
    Redo,
    Code
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Enter detailed product description..." }: RichTextEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const addImage = () => {
        const url = prompt('Enter image URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = prompt('Enter URL:');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!mounted || !editor) {
        return (
            <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-300' : ''}`}
                    title="Code"
                >
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                    title="Heading"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={addImage}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Add Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
                    title="Add Link"
                >
                    <Link2 className="w-4 h-4" />
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
            />
        </div>
    );
}
