export type NodeType = TextNode | ElementNode | CommentNode;

export class Node {
  children: Node[]
  nodeType: NodeType

  constructor(children: Node[], nodeType: NodeType) {
    this.children = children
    this.nodeType = nodeType
  }
}

export class TextNode {
  text: string

  constructor(text: string) {
    this.text = text
  }
}

export class ElementNode {
  elementData: ElementData

  constructor(elementData: ElementData) {
    this.elementData = elementData
  }
}

export class ElementData {
  tagName: string
  attributes: Map<string, string>

  constructor(tagName: string, attributes: Map<string, string>) {
    this.tagName = tagName
    this.attributes = attributes
  }
}

export class CommentNode {
  comment: string

  constructor(comment: string) {
    this.comment = comment
  }
}
