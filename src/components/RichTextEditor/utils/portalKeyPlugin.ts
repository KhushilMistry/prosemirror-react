import {Plugin, PluginKey} from "prosemirror-state";

import {IReactNodeViewPortalsContext} from "../ReactNodeView/ReactNodeViewPortals";

export const portalKey = new PluginKey("portal-key");

export const portalKeyPlugin = (portalAPI: IReactNodeViewPortalsContext) => {
  return new Plugin({
    key: portalKey,
    state: {
      init() {
        return {
          portalAPI: portalAPI,
        };
      },
      apply(tr, old) {
        const props = tr.getMeta(portalKey);
        return props || old;
      },
    },
  });
};
