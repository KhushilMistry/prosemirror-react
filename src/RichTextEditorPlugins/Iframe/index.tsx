import {NodeSpec} from "prosemirror-model";
import BaseExtension from "../../components/RichTextEditor/BaseExtension";
import plugins from "./plugins";

const NODE_NAME = "iframe";

export default class Iframe extends BaseExtension {
  get schema(): NodeSpec {
    return {
      attrs: {
        href: {
          default: "",
        },
      },
      group: "block",
      isAtom: true,
      selectable: false,
      parseDOM: [
        {
          tag: "iframe",
          getAttrs: (dom) => {
            const iframe = (dom as HTMLElement).getElementsByTagName(
              "iframe"
            )[0];
            return {
              href: iframe.getAttribute("href"),
            };
          },
        },
      ],
      toDOM: (node) => ["iframe", {...node.attrs, class: "mt-2"}],
    };
  }

  get name(): string {
    return NODE_NAME;
  }

  plugins = plugins;
}
