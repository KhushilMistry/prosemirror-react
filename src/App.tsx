import {useState} from "react";
import "./App.css";
import RichTextEditor from "./components/RichTextEditor";
import {extensions, plugins} from "./RichTextEditorPlugins";
import {JsonView, allExpanded, defaultStyles} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const INITIAL_PM_DOC = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "hello",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "hello",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        level: 3,
      },
      content: [
        {
          type: "text",
          text: "hello",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "hello",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "strong",
            },
          ],
          text: "hello",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "em",
            },
          ],
          text: "hello",
        },
      ],
    },
    {
      type: "iframe",
      attrs: {
        href: "https://prosemirror.net",
      },
    },
    {
      type: "paragraph",
    },
  ],
};

function App() {
  const [value, setValue] = useState(INITIAL_PM_DOC);

  return (
    <div className="m-4">
      <p className="mb-4 text-xl font-medium">
        {"React Toolkit for ProseMirror Example"}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="border">
          <RichTextEditor
            onChangeJSON={(_, jsonValue) => setValue(jsonValue)}
            extensions={extensions}
            jsonValue={value}
            plugins={plugins}
          />
        </div>
        <JsonView
          data={JSON.parse(JSON.stringify(value))}
          shouldExpandNode={allExpanded}
          style={defaultStyles}
        />
      </div>
    </div>
  );
}

export default App;
