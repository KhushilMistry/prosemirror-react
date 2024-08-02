import {
  Schema,
  DOMParser as PMDOMParser,
  Node,
  DOMSerializer,
} from "prosemirror-model";

export const getPMDocFromHtml = (htmlString: string, schema: Schema) => {
  const htmlDoc = new DOMParser().parseFromString(htmlString, "text/html");

  if (!htmlDoc.body.childNodes.length) {
    return null;
  }

  // need to wrap the contents in a dom node
  if (htmlDoc.body.children.length !== htmlDoc.body.childNodes.length) {
    htmlDoc.body.innerHTML = `<p>${htmlString}</p>`;
  }

  return PMDOMParser.fromSchema(schema).parse(htmlDoc.body);
};

export const getHTMLFromDoc = (doc: Node, schema: Schema) => {
  const htmlValue = DOMSerializer.fromSchema(schema).serializeFragment(
    doc.content
  );

  const temporaryDocument = document.implementation.createHTMLDocument();
  const container = temporaryDocument.createElement("div");

  container.appendChild(htmlValue);

  return container.innerHTML === "<p></p>" ? "" : container.innerHTML;
};
