import { Node, TextNode, ElementNode, ElementData, NodeType } from './dom'
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}

export class Parser {
  pos: number
  input:string

  constructor(input: string) {
    this.pos = 0
    this.input = input
  }

  nextChar(): string {
    return this.input[this.pos]
  }

  startsWith(s: string): boolean {
    return this.input.slice(this.pos).startsWith(s)
  }

  eof(): boolean {
    return this.pos >= this.input.length
  }

  // 处理16bit的字符，比如emoji🥵
  consumeChar(): string {
    let curChar = String.fromCodePoint(this.input.codePointAt(this.pos)!)
    this.pos += curChar.length
    return curChar
  }

  // get a sequence char serial
  consumeWhile(test: (c: string) => boolean): string {
    let result = ''
    while (this.pos < this.input.length && test(String.fromCodePoint(this.input.codePointAt(this.pos)!))) {
      let curChar = this.consumeChar()
      result += curChar
    }
    return result
  }

  consumeWhitespace(): string {
    let result = this.consumeWhile(c => c.trim() === '')
    return result
  }

  parseTagName(): string {
    let result = this.consumeWhile(c => /^[a-zA-Z0-9]$/.test(c))
    return result
  }

  parseNode(): Node {
    let curChar = String.fromCodePoint(this.input.codePointAt(this.pos)!)
    if (curChar === '<') {
      return this.parseElement()
    } else {
      return this.parseText()
    }
  }

  parseText(): Node {
    let text = this.consumeWhile(c => c !== '<')
    return new Node([], new TextNode(text))
  }

  parseElement(): Node {
    // Opening tag.
    let curChar = this.consumeChar()
    assert(curChar === '<')
    let tagName = this.parseTagName()
    let attrs = this.parseAttributes()
    let curChar2 = this.consumeChar()
    assert(curChar2 === '>')

    // Contents.
    let children = this.parseNodes()

    // Closing tag.
    let curChar3 = this.consumeChar()
    assert(curChar3 === '<')
    let curChar4 = this.consumeChar()
    assert(curChar4 === '/')
    let closingTagName = this.parseTagName()
    assert(closingTagName === tagName)
    let curChar5 = this.consumeChar()
    assert(curChar5 === '>')

    let elementData = new ElementData(tagName, attrs)
    let elementNode = new ElementNode(elementData)
    let node = new Node(children, elementNode)

    return node
  }

  parseAttr(): { [key: string]: string } {
    let name = this.parseTagName()
    let curChar = this.consumeChar()
    assert(curChar === '=')
    let value = this.parseAttrValue()
    let attr: { [key: string]: string } = {}
    attr[name] = value
    return attr
  }

  parseAttrValue(): string {
    let openQuote = this.consumeChar()
    assert(openQuote === '"' || openQuote === "'")
    let value = this.consumeWhile(c => c !== openQuote)
    let curChar = this.consumeChar()
    assert(curChar === openQuote)
    return value
  }

  parseAttributes(): Map<string, string> {
    let attributes = new Map<string, string>()
    while (true) {
      this.consumeWhitespace()
      if (this.nextChar() === '>') {
        break
      }
      let attr = this.parseAttr()
      for (let [name, value] of Object.entries(attr)) {
        attributes.set(name, value)
      }
    }
    return attributes
  }

  parseNodes(): Node[] {
    let nodes: Node[] = []
    while (true) {
      this.consumeWhitespace()
      if (this.eof() || this.startsWith('</')) {
        break
      }
      nodes.push(this.parseNode())
    }
    return nodes
  }

}
export function parse(source: string): Node {
  let nodes: Node[]
  let parser = new Parser(source)
  nodes = parser.parseNodes()
  if (nodes.length === 1) {
    return nodes[0]
  } else {
    return new Node(nodes, new ElementNode(new ElementData('html', new Map<string, string>())))
  }
}