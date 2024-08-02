import {NodeSpec} from "prosemirror-model";
import BaseExtension from "../../components/RichTextEditor/BaseExtension";

export const NODE_NAME = "heading";

export default class Heading extends BaseExtension {
  get schema(): NodeSpec {
    return {
      attrs: {level: {default: 1}},
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        {tag: "h1", attrs: {level: 1}},
        {tag: "h2", attrs: {level: 2}},
        {tag: "h3", attrs: {level: 3}},
        {tag: "h4", attrs: {level: 3}},
        {tag: "h5", attrs: {level: 3}},
        {tag: "h6", attrs: {level: 3}},
      ],
      toDOM(node) {
        let className;
        switch (node.attrs.level) {
          case 1:
            className = "mt-2 font-bold text-3xl";
            break;
          case 2:
            className = "mt-2 font-bold text-2xl";
            break;
          case 3:
            className = "mt-2 font-bold text-xl";
            break;
        }
        return ["h" + node.attrs.level, {class: className}, 0];
      },
    };
  }

  get name(): string {
    return NODE_NAME;
  }
}
