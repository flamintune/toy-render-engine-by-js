import {
  CommentNode,
  ElementData,
  ElementNode,
  Node,
  NodeType,
  TextNode,
} from "./dom";
import { parseDom } from "./parse";

describe("parseDom function", () => {
  test("parses an empty string to return undefined or a specific node", () => {
    const result = parseDom("");
    expect(result).toEqual(undefined); // 根据你的实际逻辑调整期望值
  });

  test("parses a text only string", () => {
    const text = "Hello, world!";
    const result = parseDom(text);
    expect(result).toEqual(new Node([], new TextNode(text.trim())));
  });

  test("parses a single element", () => {
    const html = "<div></div>";
    const result = parseDom(html);
    if (!result) return;
    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect(result.children).toEqual([]);
  });

  test("parses nested elements correctly", () => {
    const html = `<div class='outer'><div class='inner'>Content</div></div>`;
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect(result.children.length).toEqual(1);
    expect(result.children[0].nodeType).toBeInstanceOf(ElementNode);
    expect((result.children[0].nodeType as ElementNode).elementData.tagName)
      .toEqual("div");
    expect(result.children[0].children[0].nodeType).toBeInstanceOf(TextNode);
    expect((result.children[0].children[0].nodeType as TextNode).text).toEqual(
      "Content",
    );
  });

  test("handles comments and does not include them in the DOM", () => {
    const html = "<!-- This is a comment --><div>Test</div>";
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect(result.children[0].nodeType).toBeInstanceOf(TextNode);
    expect((result.children[0].nodeType as TextNode).text).toEqual("Test");
  });

  test("parses complex HTML structure", () => {
    const html = `<body>
                    Hello, world!
                    <div class='myClass'>Nested
                        <br></br> 
                        node
                    </div>
                    </body>`;
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual(
      "body",
    );
    // 更多的检查可以根据需要添加
  });

  test("parses HTML with class attribute", () => {
    const html = `<div class='exampleClass'>Content with class</div>`;
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect((result.nodeType as ElementNode).elementData.attributes.get("class"))
      .toEqual("exampleClass");
  });

  test("parses HTML with id attribute", () => {
    const html = `<div id='exampleId'>Content with id</div>`;
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect((result.nodeType as ElementNode).elementData.attributes.get("id"))
      .toEqual("exampleId");
  });

  test("parses HTML with both class and id attributes", () => {
    const html =
      `<div class='exampleClass' id='exampleId'>Content with both</div>`;
    const result = parseDom(html);
    if (!result) return;

    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect((result.nodeType as ElementNode).elementData.attributes.get("class"))
      .toEqual("exampleClass");
    expect((result.nodeType as ElementNode).elementData.attributes.get("id"))
      .toEqual("exampleId");
  });

  test("parses complex HTML structure with multiple elements", () => {
    const html = `<div id='container'>
                    <span class='highlight'>Item 1</span>
                    <span class='highlight'>Item 2</span>
                  </div>`;
    const result = parseDom(html);
    if (!result) return;

    // Check the container div
    expect(result.nodeType).toBeInstanceOf(ElementNode);
    expect((result.nodeType as ElementNode).elementData.tagName).toEqual("div");
    expect((result.nodeType as ElementNode).elementData.attributes.get("id")).toEqual("container");

    // Ensure there are two children (both spans)
    expect(result.children.length).toEqual(2);

    // Check the first span element
    expect(result.children[0].nodeType).toBeInstanceOf(ElementNode);
    expect((result.children[0].nodeType as ElementNode).elementData.tagName).toEqual("span");
    expect((result.children[0].nodeType as ElementNode).elementData.attributes.get("class")).toEqual("highlight");
    expect(result.children[0].children.length).toEqual(1);
    expect(result.children[0].children[0].nodeType).toBeInstanceOf(TextNode);
    expect((result.children[0].children[0].nodeType as TextNode).text).toEqual("Item 1");

    // Check the second span element
    expect(result.children[1].nodeType).toBeInstanceOf(ElementNode);
    expect((result.children[1].nodeType as ElementNode).elementData.tagName).toEqual("span");
    expect((result.children[1].nodeType as ElementNode).elementData.attributes.get("class")).toEqual("highlight");
    expect(result.children[1].children.length).toEqual(1);
    expect(result.children[1].children[0].nodeType).toBeInstanceOf(TextNode);
    expect((result.children[1].children[0].nodeType as TextNode).text).toEqual("Item 2");
});
});
