## React Toolkit for ProseMirror

[ProseMirror](https://prosemirror.net/) is a powerful library for building rich-text editors on the web. This toolkit allows the integration of React components within ProseMirror blocks.

### Background

At [Lyearn](https://www.lyearn.com/), we aimed to develop a Notion-like editor for our LMS tool in early 2021. We evaluated several libraries, including [QuillJS](https://quilljs.com/), [EditorJS](https://editorjs.io/), [CKEditor](https://ckeditor.com/), and [TinyMCE](https://www.tiny.cloud/). Ultimately, we chose ProseMirror due to its open-source license, active development, community support, and high level of customization.

### Why ProseMirror?

ProseMirror, written in VanillaJS, is highly customizable. Each block type, referred to as Nodes and Marks in ProseMirror, allows you to define its DOM representation. Our primary goal was to integrate React components within these ProseMirror blocks. We leveraged this feature by building a wrapper that passes a simple div element to ProseMirror. Using React Portals, we then render a React component with the div as its root.

### The Toolkit

In early 2021, few libraries offered React integration with ProseMirror. We considered [Remirror](https://remirror.io/) and [Outline](https://www.getoutline.com/), but we needed more customization and found these libraries in their early development stages. Inspired by these libraries and [prosemirror-react-nodeviews](https://github.com/johnkueh/prosemirror-react-nodeviews), we developed our own toolkit.

### Current Status

We recently revisited our decision and explored other libraries. Our toolkit has served its purpose well, requiring minimal changes since its initial development. However, if we were to start anew, we might choose [Tiptap](https://tiptap.dev/) instead of building a toolkit from scratch.

### Recommendations

For those seeking React support with ProseMirror, we recommend using the aforementioned libraries, as they are actively maintained. If you need more customization and control over the blocks, you can take inspiration from our toolkit and adapt it to your use case.
