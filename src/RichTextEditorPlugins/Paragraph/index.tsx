import {NodeSpec} from "prosemirror-model";
import BaseExtension from "../../components/RichTextEditor/BaseExtension";

const NODE_NAME = "paragraph";

export default class Paragraph extends BaseExtension {
  protected _schema: NodeSpec = {
    content: "inline*",
    group: "block",
    parseDOM: [
      {
        tag: "p",
      },
    ],
    toDOM: () => ["p", {class: "mt-1 text-base"}, 0],
  };

  get schema(): NodeSpec {
    return this._schema;
  }

  get name(): string {
    return NODE_NAME;
  }
}
