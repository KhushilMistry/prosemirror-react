import React, {useCallback, useState} from "react";
import {useReactNodeView} from "../../../components/RichTextEditor/ReactNodeView";

const stopPropagation = (
  event: React.KeyboardEvent | React.SyntheticEvent<HTMLInputElement, Event>
) => {
  event.stopPropagation();
};

const onKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
  event.stopPropagation();
};

const FileNodeView: React.FC = () => {
  const {node, updateAttrs} = useReactNodeView();
  const href = node?.attrs?.href;
  const [inputSrc, setInputSrc] = useState(href);

  const updateSrc = useCallback(() => {
    if (!inputSrc) {
      return;
    }

    updateAttrs({
      href: inputSrc,
    });
  }, [inputSrc, updateAttrs]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputSrc(event.target.value);
    },
    []
  );

  if (href) {
    return <iframe src={href} title={href} className="w-full border mt-2" />;
  }

  return (
    <>
      <input
        type="text"
        value={inputSrc}
        onInput={onChange}
        onKeyDown={onKeyDown}
        onKeyPress={stopPropagation}
        onPaste={stopPropagation}
        onSelect={stopPropagation}
        className="border p-1 mt-2"
        placeholder="URL"
      />
      <button onClick={updateSrc} className="p-1 ml-1 border rounded">
        Add
      </button>
    </>
  );
};

export default FileNodeView;
