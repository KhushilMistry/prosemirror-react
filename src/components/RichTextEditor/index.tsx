import "prosemirror-view/style/prosemirror.css";

import React from "react";
import c from "classnames";
import {baseKeymap} from "prosemirror-commands";
import {dropCursor} from "prosemirror-dropcursor";
import {buildKeymap} from "prosemirror-example-setup";
import {gapCursor} from "prosemirror-gapcursor";
import {history, redo, undo} from "prosemirror-history";
import {inputRules as _inputRules} from "prosemirror-inputrules";
import {MarkSpec, NodeSpec, Schema} from "prosemirror-model";
import {EditorState, Plugin} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {keymap} from "prosemirror-keymap";

import BaseExtension from "./BaseExtension";
import getSchema from "./utils/getSchema";
import {portalKeyPlugin} from "./utils/portalKeyPlugin";
import {getCreateReactNodeView} from "./ReactNodeView";
import ReactNodeViewPortalsProvider, {
  IReactNodeViewPortalsContext,
  ReactNodeViewPortalsContext,
} from "./ReactNodeView/ReactNodeViewPortals";
import {getHTMLFromDoc, getPMDocFromHtml} from "./utils";
import {EditorProps, EditorOptions} from "./types";

class Editor extends React.PureComponent<EditorProps> {
  private view?: EditorView;

  static defaultProps: EditorProps = {
    autoFocus: true,
    readOnly: false,
  };

  extensions: {new (): BaseExtension}[] = [];
  schemaElements: ReturnType<typeof getSchema>;
  editorViewRef: React.RefObject<HTMLDivElement> = React.createRef();
  static contextType = ReactNodeViewPortalsContext;
  editorView: EditorView;
  schema: Schema;
  plugins: Plugin[];
  inputRules: ReturnType<typeof getSchema>["inputRules"];
  nodes: {[key in string]: NodeSpec};
  marks: {[key in string]: MarkSpec};
  portalApi: IReactNodeViewPortalsContext;
  createReactNodeView: ReturnType<typeof getCreateReactNodeView>;
  editorOptions: EditorOptions;

  public constructor(props: EditorProps) {
    super(props);
  }

  public componentDidMount(): void {
    this.loadEditor();
  }

  private loadEditor() {
    this.extensions = this.props.extensions || [];
    this.schemaElements = getSchema(this.extensions);
    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();
    this.inputRules = this.createInputRules();
    this.portalApi = this.createPortalApi();
    this.createReactNodeView = this.createReactNodeViewInitialize();
    this.editorOptions = this.createEditorOptions();
    this.plugins = this.createPlugins();
    this.view = this.createEditorView();
  }

  private createNodes() {
    return this.schemaElements.nodes;
  }

  private createMarks() {
    return this.schemaElements.marks;
  }

  private createInputRules() {
    return this.schemaElements.inputRules;
  }

  private createSchema() {
    return new Schema({
      nodes: this.nodes,
      marks: this.marks,
    });
  }

  private createPortalApi() {
    const portalApi = this.context as IReactNodeViewPortalsContext;
    return portalApi;
  }

  private createReactNodeViewInitialize() {
    const {createPortal, destroyPortal} = this.portalApi;
    return getCreateReactNodeView(createPortal, destroyPortal);
  }

  private createEditorOptions() {
    return {
      schema: this.schema,
      createReactNodeView: this.createReactNodeView,
      portalApi: this.portalApi,
    };
  }

  private createUndoRedoPlugins() {
    return [
      history(),
      keymap({"Mod-z": undo, "Mod-y": redo, "Mod-Shift-z": redo}),
    ];
  }

  private createPlugins() {
    const schemaPlugins = this.schemaElements.plugins;
    const undoRedoPlugins = this.createUndoRedoPlugins();
    const propsPlugins = this.props.plugins || [];

    return [
      ...undoRedoPlugins,
      keymap({...buildKeymap(this.schema), ...this.props.keymaps}),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      _inputRules({
        rules: this.inputRules?.length
          ? this.inputRules?.flatMap((rule) => rule(this.editorOptions))
          : [],
      }),
      ...schemaPlugins?.flatMap((plugin) =>
        typeof plugin === "function" ? plugin?.(this.editorOptions) : plugin
      ),
      ...propsPlugins.flatMap((plugin) =>
        typeof plugin === "function" ? plugin?.(this.editorOptions) : plugin
      ),
      portalKeyPlugin(this.portalApi),
    ];
  }

  private createState(value?: string) {
    const doc = this.props.jsonValue
      ? this.schema.nodeFromJSON(this.props.jsonValue)
      : getPMDocFromHtml(value || "", this.schema);

    return EditorState.create({
      plugins: this.plugins,
      schema: this.schema,
      doc: doc ?? undefined,
    });
  }

  private handleEditorBlur = (view: EditorView, event: FocusEvent) => {
    this.props.onBlur?.(view);
    return false;
  };

  private handleEditorFocus = (view: EditorView, event: FocusEvent) => {
    this.props.onFocus?.(view);
    return false;
  };

  private valueFromState(state: EditorState) {
    return this.props.onChangeJSON
      ? state.doc.toJSON()
      : getHTMLFromDoc(state.doc, this.schema);
  }

  private handleHTMLChange = (state: EditorState) => {
    if (this.props.onChange) {
      const value = this.valueFromState(state);
      if (value !== this.props.value) {
        this.props.onChange(state, value);
      }
    }
  };

  private handleJSONChange = (state: EditorState) => {
    if (this.props.onChangeJSON) {
      const value = this.valueFromState(state);
      const isDocEqual =
        this.props.jsonValue &&
        state.doc.eq(this.schema.nodeFromJSON(this.props.jsonValue));
      if (!isDocEqual) {
        this.props.onChangeJSON(state, value);
      }
    }
  };

  private handleChange = (state: EditorState) => {
    this.handleHTMLChange(state);
    this.handleJSONChange(state);
  };

  private createEditorView() {
    if (!this.editorViewRef.current) {
      throw new Error("createView called before ref available");
    }
    const self = this;
    const view = new EditorView(this.editorViewRef.current, {
      handleDOMEvents: {
        blur: this.handleEditorBlur,
        focus: this.handleEditorFocus,
      },
      state: this.createState(this.props.value),
      editable: () => !this.props.readOnly,
      dispatchTransaction(transaction) {
        const {state} = (this.state as EditorState).applyTransaction(
          transaction
        );

        // @ts-ignore
        if (state && this.docView) {
          // @ts-ignore
          this.updateState(state);
          self.handleChange(state);
        }

        self.forceUpdate();
      },
    });

    this.props.onCreateEditorView?.(view);
    return view;
  }

  componentDidUpdate(prevProps: Readonly<EditorProps>): void {
    if (!this.view) return;

    if (this.props.value !== prevProps.value) {
      const isValueChanged =
        this.props.value !== getHTMLFromDoc(this.view.state.doc, this.schema);

      if (isValueChanged) {
        this.view.updateState(this.createState(this.props.value));
      }
    }

    if (this.props.jsonValue !== prevProps.jsonValue) {
      const isJSONValueChanged = !this.view.state.doc.eq(
        this.schema.nodeFromJSON(this.props.jsonValue)
      );

      if (isJSONValueChanged) {
        this.view.updateState(this.createState(this.props.jsonValue));
      }
    }

    if (this.props.readOnly !== prevProps.readOnly) {
      this.view.update({
        ...this.view?.props,
        editable: () => !this.props.readOnly,
      });
    }
  }

  componentWillUnmount() {
    this.view?.destroy();
    this.view = undefined;
  }

  render() {
    return (
      <div
        ref={this.editorViewRef}
        className={c(
          this.view?.editable ? "Prosemirror-Editable" : "Prosemirror-Readonly",
          "rich-text-editor"
        )}
      />
    );
  }
}

const RichTextEditor: React.FC<EditorProps> = (props) => {
  return (
    <ReactNodeViewPortalsProvider>
      <Editor {...props} />
    </ReactNodeViewPortalsProvider>
  );
};

export default RichTextEditor;
