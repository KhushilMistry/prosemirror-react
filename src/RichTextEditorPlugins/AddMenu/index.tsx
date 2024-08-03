// ref: https://prosemirror.net/examples/menu/
import {EditorOptions} from "../../components/RichTextEditor/types";
import {toggleMark, setBlockType} from "prosemirror-commands";
import {Command, EditorState, Plugin, Transaction} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import "./style.css";
import {Attrs, NodeType, Schema} from "prosemirror-model";

const insertNewNodeCommand = (nodeType: NodeType, attrs?: Attrs | null) => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    if (dispatch) {
      dispatch(state.tr.insert(state.selection.from, nodeType.create(attrs)));
    }
    return true;
  };
};

class MenuView {
  items: {command: Command; dom: HTMLSpanElement}[];
  dom: HTMLDivElement;
  constructor(
    items: {command: Command; dom: HTMLSpanElement}[],
    editorView: EditorView
  ) {
    this.items = items;

    this.dom = document.createElement("div");
    this.dom.className = "menubar";
    items.forEach(({dom}) => this.dom.appendChild(dom));
    this.update(editorView);

    this.dom.addEventListener("mousedown", (e) => {
      e.preventDefault();
      editorView.focus();
      items.forEach(({command, dom}) => {
        if (dom.contains(e.target as Node)) {
          command(editorView.state, editorView.dispatch, editorView);
        }
      });
    });
  }

  update(editorView: EditorView) {
    this.items.forEach(({command, dom}) => {
      let active = command(editorView.state, undefined, editorView);
      dom.style.display = active ? "" : "none";
    });
  }

  destroy() {
    this.dom.remove();
  }
}

function menuPluginItems(items: {command: Command; dom: HTMLSpanElement}[]) {
  return new Plugin({
    view(editorView) {
      let menuView = new MenuView(items, editorView);
      editorView.dom.parentNode?.insertBefore(menuView.dom, editorView.dom);
      return menuView;
    },
  });
}

function icon(text: string, name: string) {
  let span = document.createElement("span");
  span.className = "menuicon " + name;
  span.title = name;
  span.textContent = text;
  return span;
}

function heading(schema: Schema, level: number) {
  return {
    command: setBlockType(schema.nodes.heading, {level}),
    dom: icon("H" + level, "heading"),
  };
}

let generateMenuPlugin = (schema: Schema) =>
  menuPluginItems([
    {command: toggleMark(schema.marks.strong), dom: icon("B", "strong")},
    {command: toggleMark(schema.marks.em), dom: icon("i", "em")},
    {
      command: setBlockType(schema.nodes.paragraph, {}),
      dom: icon("p", "paragraph"),
    },
    heading(schema, 1),
    heading(schema, 2),
    heading(schema, 3),
    {
      command: insertNewNodeCommand(schema.nodes["iframe"]),
      dom: icon("URL", "iframe"),
    },
  ]);

const AddMenuPlugin = (editorOptions: EditorOptions) => [
  generateMenuPlugin(editorOptions.schema),
];

export default AddMenuPlugin;
