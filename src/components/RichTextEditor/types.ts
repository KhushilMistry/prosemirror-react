import {Command, EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {Schema} from "prosemirror-model";

import type BaseExtension from "./BaseExtension";
import {createReactNodeView} from "./ReactNodeView";
import {IReactNodeViewPortalsContext} from "./ReactNodeView/ReactNodeViewPortals";

export interface EditorOptions {
  schema: Schema;
  createReactNodeView: createReactNodeView;
  portalApi: IReactNodeViewPortalsContext;
}

export enum extensionType {
  mark = "mark",
  node = "node",
}

export interface EditorProps {
  value?: string;
  jsonValue?: any;
  extensions?: {new (): BaseExtension}[];
  autoFocus?: boolean;
  readOnly?: boolean;
  onFocus?: (view: EditorView) => void;
  onBlur?: (view: EditorView) => void;
  /**
   *
   * @param state the lastest state of the editor
   * @param htmlValue the html representation of the editor
   * @returns void
   */
  onChange?: (state: EditorState, htmlValue: string) => void;
  /**
   *
   * @param state the lastest state of the editor
   * @param jsonValue the json representation of the editor doc
   * @returns void
   */
  onChangeJSON?: (state: EditorState, jsonValue: any) => void;
  onCreateEditorView?: (view: EditorView) => void;
  plugins?: BaseExtension["plugins"][];
  keymaps?: {
    [key: string]: Command;
  };
}
