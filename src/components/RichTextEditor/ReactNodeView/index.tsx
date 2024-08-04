// ref: https://github.com/johnkueh/prosemirror-react-nodeviews/blob/b12f917/src/components/ReactNodeView.tsx
import React, {useCallback, useContext, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import c from "classnames";
import {nanoid} from "nanoid";
import {Node} from "prosemirror-model";
import {
  Decoration,
  EditorView,
  NodeView,
  NodeViewConstructor,
} from "prosemirror-view";

import {IReactNodeViewPortalsContext} from "./ReactNodeViewPortals";

interface IReactNodeViewContext {
  node: Node;
  view: EditorView;
  getPos: TGetPos;
  decorations: readonly Decoration[];
  editableComponentRef?: React.RefObject<HTMLDivElement>;
  stopDomEvents?: boolean;
  inline?: boolean;
}

const ReactNodeViewContext = React.createContext<
  Partial<IReactNodeViewContext> & {updateAttrs: (attrs: Object) => void}
>({
  node: undefined,
  view: undefined,
  getPos: undefined,
  decorations: undefined,
  updateAttrs: () => {},
  editableComponentRef: undefined,
});

type TGetPos = Parameters<NodeViewConstructor>[2];
type IgnoreMutationProps =
  | MutationRecord
  | {type: "selection"; target: Element};

export const REACT_COMPONENT_CLASSNAME = "ProseMirror__dom";

const Component: React.FC<
  IReactNodeViewContext & {
    component: React.FC<any>;
    contentDOM?: HTMLElement;
    inline?: boolean;
  }
> = (props) => {
  const {
    node,
    view,
    getPos,
    contentDOM,
    inline,
    decorations,
    component: ReactComponent,
    ...restProps
  } = props;

  const componentRef = useRef<HTMLDivElement>(null);
  const editableComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const componentDOM = componentRef.current;
    const editableComponentDOM = editableComponentRef.current;

    if (editableComponentDOM != null && contentDOM != null) {
      if (!node.isLeaf) {
        editableComponentDOM?.appendChild(contentDOM);
      }
    } else if (componentDOM != null && contentDOM != null) {
      if (!node.isLeaf) {
        componentDOM.firstChild?.appendChild(contentDOM);
      }
    }
  }, [componentRef, contentDOM, node.isLeaf, editableComponentRef]);

  const updateAttrs = useCallback(
    (attrs: Object) => {
      if (!view.editable) {
        return;
      }
      const pos = typeof getPos === "function" ? getPos() : undefined;
      if (pos !== undefined && Number.isInteger(pos)) {
        // node is the only deps changing on updateAttrs and can be used from view.
        // ref https://github.com/ProseMirror/prosemirror-transform/blob/4483e02a41aa59603196c6934f8a5249ec716e85/src/structure.js#L142
        const _node = view?.state.tr.doc.nodeAt(pos);
        view?.dispatch(
          view?.state.tr.setNodeMarkup(pos, undefined, {
            ..._node?.attrs,
            ...attrs,
          })
        );
      }
    },
    [view, getPos]
  );

  return (
    <div
      ref={componentRef}
      className={c("ProseMirror__reactComponent", {"inline-flex": inline})}
    >
      <ReactNodeViewContext.Provider
        value={{
          node,
          view,
          getPos,
          decorations,
          updateAttrs,
          editableComponentRef,
        }}
      >
        <ReactComponent {...restProps} />
      </ReactNodeViewContext.Provider>
    </div>
  );
};

class ReactNodeView implements NodeView {
  componentRef: React.RefObject<HTMLDivElement>;
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  component: React.FC<any>;
  node: Node;
  view: EditorView;
  getPos: TGetPos;
  decorations: readonly Decoration[];
  onCreate: IReactNodeViewPortalsContext["createPortal"];
  onDestroy: IReactNodeViewPortalsContext["destroyPortal"];
  stopDomEvents: boolean;
  inline: boolean;

  private readonly portalId: string;

  constructor(
    node: Node,
    view: EditorView,
    getPos: TGetPos,
    decorations: readonly Decoration[],
    component: React.FC<any>,
    onCreate: IReactNodeViewPortalsContext["createPortal"],
    onDestroy: IReactNodeViewPortalsContext["destroyPortal"],
    stopDomEvents: boolean,
    inline: boolean
  ) {
    this.node = node;
    this.portalId = nanoid();
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;
    this.component = component;
    this.componentRef = React.createRef();
    this.onCreate = onCreate;
    this.onDestroy = onDestroy;
    this.stopDomEvents = stopDomEvents;
    this.inline = inline;
  }

  initPortal() {
    this.dom = document.createElement("div");
    this.dom.classList.add(REACT_COMPONENT_CLASSNAME);

    if (this.inline) {
      this.dom.classList.add("inline-flex");
      this.dom.style.verticalAlign = "middle";
    }

    if (!this.node.isLeaf) {
      this.contentDOM = document.createElement("div");
      this.contentDOM.classList.add("ProseMirror__contentDOM");
      this.dom.appendChild(this.contentDOM);
    }

    return this.renderPortal(this.dom);
  }

  renderPortal(container: HTMLElement) {
    this.onCreate(
      ReactDOM.createPortal(
        <Component
          component={this.component}
          contentDOM={this.contentDOM}
          decorations={this.decorations}
          getPos={this.getPos}
          inline={this.inline}
          node={this.node}
          view={this.view}
        />,
        container,
        this.portalId
      )
    );
  }

  setDomAttrs(node: Node, element: HTMLElement) {
    Object.keys(node.attrs || {}).forEach((attr) => {
      element.setAttribute(attr, node.attrs[attr]);
    });
  }

  stopEvent() {
    return this.stopDomEvents;
  }

  update(node: Node) {
    if (node.type.name !== this.node.type.name) {
      return false;
    }
    if (this.dom && !this.node.sameMarkup(node)) {
      this.setDomAttrs(node, this.dom);
    }

    if (node !== this.node) {
      this.node = node;
      this.dom && this.renderPortal(this.dom);
    }

    return true;
  }

  // ref: https://github.com/remirror/remirror/blob/aa475d81535aeae1184fe4c12887735f657a655f/packages/remirror__extension-react-component/src/react-node-view.tsx#L393
  ignoreMutation(mutation: IgnoreMutationProps) {
    if (mutation.type === "selection") {
      // If a node type is unselectable, then ignore all selection mutations.
      return !this.node.type.spec.selectable;
    }

    if (!this.contentDOM) {
      return true;
    }

    return !this.contentDOM.contains(mutation.target);
  }

  destroy() {
    this.onDestroy?.(this.portalId);
    this.contentDOM = undefined;
  }
}

export interface TCreateReactNodeView extends IReactNodeViewContext {
  component: React.FC<any>;
}

export const getCreateReactNodeView =
  (
    onCreatePortal: IReactNodeViewPortalsContext["createPortal"],
    onDestroyPortal: IReactNodeViewPortalsContext["destroyPortal"]
  ) =>
  ({
    node,
    view,
    getPos,
    decorations,
    component,
    stopDomEvents = false,
    inline = false,
  }: TCreateReactNodeView) => {
    const reactNodeView = new ReactNodeView(
      node,
      view,
      getPos,
      decorations,
      component,
      onCreatePortal,
      onDestroyPortal,
      stopDomEvents,
      inline
    );
    reactNodeView.initPortal();

    return reactNodeView;
  };

export type createReactNodeView = ReturnType<typeof getCreateReactNodeView>;

export const useReactNodeView = () => useContext(ReactNodeViewContext);
export default ReactNodeView;
