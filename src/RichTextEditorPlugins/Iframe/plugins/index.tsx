import {Plugin} from "prosemirror-state";
import {EditorOptions} from "../../../components/RichTextEditor/types";
import IframeComponent from "./IframeComponent";

function plugins({createReactNodeView}: EditorOptions) {
  return [
    new Plugin({
      props: {
        nodeViews: {
          iframe(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              component: IframeComponent,
            });
          },
        },
      },
    }),
  ];
}

export default plugins;
