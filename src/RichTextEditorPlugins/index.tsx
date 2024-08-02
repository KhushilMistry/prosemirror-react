import Paragraph from "./Paragraph";
import AddMenu from "./AddMenu";
import Heading from "./Heading";
import Iframe from "./Iframe";

const extensions = Object.values({
  Paragraph,
  Heading,
  Iframe,
});

const plugins = [AddMenu];

export {extensions, plugins};
