"use client";
import { CodeHighlight } from "@mantine/code-highlight";
import { Textarea, Button } from "@mantine/core";
import { useState } from "react";
import "@mantine/code-highlight/styles.css";
import js_beautify from "js-beautify";
import classes from "./Home.module.css";
import Image from "next/image";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [json, setJson] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.currentTarget.value);
    try {
      const fixedInput = event.currentTarget.value.replace(
        /(\w+|:)(:)/g,
        (match, key) => `"${key ? key : ""}":`
      );
      const parseValue = JSON.parse(fixedInput);
      const stringifyValue = JSON.stringify(parseValue);
      const prittierCode = js_beautify(stringifyValue, {
        indent_size: 3,
        space_in_empty_paren: true,
      });
      setJson(prittierCode);
      setError(null);
    } catch (error) {
      setError("Invalid object format of JavaScript");
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputValue(clipboardText);
      const fixedInput = clipboardText.replace(
        /(\w+|:)(:)/g,
        (match, key) => `"${key ? key : ""}":`
      );
      const parseValue = JSON.parse(fixedInput);
      const stringifyValue = JSON.stringify(parseValue);
      const prittierCode = js_beautify(stringifyValue, {
        indent_size: 3,
        space_in_empty_paren: true,
      });
      setJson(prittierCode);
      setError(null);
    } catch (error) {
      setError("Invalid object format of JavaScript");
    }
  };

  const handleClear = () => {
    setInputValue("");
    setJson("");
    setError(null);
  };

  const handleInputCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOutputCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = () => {
    const jsonBlob = new Blob([json], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main>
      <div className="convert-container">
        <div className="py-10">
          <h1 className="text-center text-4xl font-semibold">
            JavaScript Object to JSON Converter
          </h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4">
          <div className="relative after:content-[''] after:bg-brand-texture after:w-full after:h-full after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-cover after:bg-no-repeat after:opacity-5 after:pointer-events-none">
            <div className="py-1 text-black bg-[#228be61a]">
              <h2 className="px-4 text-lg font-medium">Input - Object</h2>
            </div>
            <Textarea
              classNames={{ input: classes.input }}
              value={inputValue}
              onChange={handleChange}
              size="md"
              placeholder="Enter Javascript Array/Object"
              error={error}
              autosize
              minRows={20}
              maxRows={20}
            />
            {/* <Image
              className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 z-0"
              src="/71229374.jpg"
              width={1200}
              height={1200}
              alt="water-mark"
            /> */}
            <div className="flex justify-end gap-x-4 p-2 border">
              <Button onClick={handlePaste}>Paste</Button>
              <Button onClick={handleClear} variant="light">
                Clear
              </Button>
              <Button onClick={handleInputCopy} variant="outline">
                Copy to Clipboard
              </Button>
            </div>
          </div>
          <div>
            <div className="py-1 text-black bg-[#228be61a]">
              <h2 className="px-4 text-lg font-medium">Output - JSON</h2>
            </div>
            <div className="overflow-y-auto h-[516px] shadow">
              <CodeHighlight
                classNames={{ code: classes.code }}
                className="min-h-full"
                code={json}
                language="json"
              />
            </div>
            <div className="flex justify-end gap-x-4 p-2 border">
              <Button onClick={handleDownload}>Download</Button>
              <Button onClick={handleOutputCopy} variant="outline">
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
