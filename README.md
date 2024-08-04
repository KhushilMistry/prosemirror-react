## React Toolkit for ProseMirror

[ProseMirror](https://prosemirror.net/) is a powerful library for building rich-text editors on the web. This toolkit enables the integration of React components within ProseMirror blocks. Although I do not plan to publish this as a standalone library, you can benefit from other actively maintained open-source projects (mentioned below). This repository aims to help you better understand ProseMirror and its interaction with modern UI libraries.

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

### Props and Example

The following properties are available for configuring the editor:

| Property               | Type                                                         | Description                                                                                                                              |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **value**              | `string` (optional)                                          | The initial HTML content of the editor.                                                                                                  |
| **jsonValue**          | `object` (optional)                                          | The initial JSON content of the editor.                                                                                                  |
| **extensions**         | `{ new (): BaseExtension }[]` (optional)                     | A list of extensions to enhance the editor's functionality.                                                                              |
| **autoFocus**          | `boolean` (optional)                                         | Whether the editor should focus automatically on mount.                                                                                  |
| **readOnly**           | `boolean` (optional)                                         | If true, the editor will be read-only.                                                                                                   |
| **onFocus**            | `(view: EditorView) => void` (optional)                      | Callback function triggered when the editor gains focus.                                                                                 |
| **onBlur**             | `(view: EditorView) => void` (optional)                      | Callback function triggered when the editor loses focus.                                                                                 |
| **onChange**           | `(state: EditorState, htmlValue: string) => void` (optional) | Callback function triggered when the editor's content changes. Provides the latest state and HTML representation of the editor.          |
| **onChangeJSON**       | `(state: EditorState, jsonValue: any) => void` (optional)    | Callback function triggered when the editor's content changes. Provides the latest state and JSON representation of the editor document. |
| **onCreateEditorView** | `(view: EditorView) => void` (optional)                      | Callback function triggered when the editor view is created.                                                                             |
| **plugins**            | `BaseExtension["plugins"][]` (optional)                      | An array of ProseMirror plugins to be used in the editor.                                                                                |
| **keymaps**            | `{ [key: string]: Command }` (optional)                      | Keymap bindings for custom commands.                                                                                                     |

Checkout [App.tsx](https://github.com/KhushilMistry/prosemirror-react/blob/main/src/App.tsx) for detailed usage. We have also added plugins for reference [here](https://github.com/KhushilMistry/prosemirror-react/tree/main/src/RichTextEditorPlugins)
