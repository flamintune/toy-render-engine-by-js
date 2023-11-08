import { Node, TextNode, ElementNode,ElementData } from './dom'

// todo print Dom
// todo lint
export function prettyPrint(node: Node, indent = 0): void {
  let indentStr = ' '.repeat(indent)

  if (node.nodeType instanceof TextNode) {
    console.log(indentStr + node.nodeType.text)
  } else if (node.nodeType instanceof ElementNode) {
    let attrs = [...node.nodeType.elementData.attributes.entries()]
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    console.log(`${indentStr}<${node.nodeType.elementData.tagName}${attrs ? ' ' + attrs : ''}>`)

    for (let child of node.children) {
      prettyPrint(child, indent + 2)
    }

    console.log(`${indentStr}</${node.nodeType.elementData.tagName}>`)
  }
}
