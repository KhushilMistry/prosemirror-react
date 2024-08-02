import {baseKeymap} from "prosemirror-commands";
import {InputRule} from "prosemirror-inputrules";
import {MarkSpec, NodeSpec} from "prosemirror-model";
import {Plugin} from "prosemirror-state";

import {EditorOptions, extensionType} from "../types";

export default abstract class BaseExtension {
  get schema(): NodeSpec | MarkSpec | null {
    return null;
  }

  abstract get name(): string;

  get type(): string {
    return extensionType.node;
  }

  get keys(): typeof baseKeymap | null {
    return null;
  }

  inputRules(_editorOptions: EditorOptions): InputRule[] {
    return [];
  }

  plugins(_editorOptions: EditorOptions): Plugin[] {
    return [];
  }
}
