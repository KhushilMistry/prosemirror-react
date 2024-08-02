import {MarkSpec, NodeSpec} from "prosemirror-model";
import {
  marks as basicMarks,
  nodes as basicNodes,
} from "prosemirror-schema-basic";

import type BaseExtension from "../BaseExtension";
import {keymap} from "prosemirror-keymap";
import {extensionType} from "../types";

function getSchema<T extends BaseExtension>(extensions: {new (): T}[]) {
  const nodes: {[key: string]: NodeSpec} = {...basicNodes};
  const marks: {[key: string]: MarkSpec} = {...basicMarks};
  const plugins: BaseExtension["plugins"][] = [];
  const inputRules: BaseExtension["inputRules"][] = [];

  extensions.forEach((Extension) => {
    const extension = new Extension();

    // if custom schema is defined by extension, add to nodes with type for node.
    if (extension.schema) {
      switch (extension.type) {
        case extensionType.node:
          nodes[extension.name] = {
            ...(extension.schema as NodeSpec),
            attrs: {
              ...extension.schema.attrs,
            },
          };
          break;
        case extensionType.mark:
          marks[extension.name] = extension.schema as MarkSpec;
      }
    }

    if (extension.keys) {
      plugins.push(
        keymap(extension.keys) as unknown as BaseExtension["plugins"]
      );
    }

    if (extension.inputRules) {
      inputRules.push(extension.inputRules);
    }

    plugins.push(extension.plugins);
  }, {});

  return {
    nodes,
    marks,
    inputRules,
    plugins: plugins.filter((v) => v),
  };
}

export default getSchema;
