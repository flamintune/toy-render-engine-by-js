import { Node, TextNode, ElementNode, ElementData, CommentNode } from './dom'
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}

export class DomParser {
  pos: number
  input: string

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
    let lastCharWasWhitespace = false;
    while (this.pos < this.input.length && test(String.fromCodePoint(this.input.codePointAt(this.pos)!))) {
      let curChar = this.consumeChar()
      let isWhitespace = (curChar === ' ' || curChar === '\n' || curChar === '\t');
  
      if (isWhitespace) {
        if (!lastCharWasWhitespace) {
          result += ' ';  // Add a space for the first whitespace character
        }
        lastCharWasWhitespace = true;  // Remember that we saw a whitespace character
      } else {
        result += curChar;
        lastCharWasWhitespace = false;  // Reset the flag when we see a non-whitespace character
      }
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
    if (this.startsWith('<!--')) return this.parseComment()
    if (curChar === '<') {
      return this.parseElement()
    } else {
      return this.parseText()
    }
  }

  parseComment(): Node {
    // Consume the opening '<!--'
    this.consumeChar()
    this.consumeChar()
    this.consumeChar()
    this.consumeChar()

    // Consume comment content
    let commentContent = this.consumeWhile(c => !this.startsWith('-->'))
    commentContent = commentContent.trim();
    // Consume the closing '-->'
    this.consumeChar()
    this.consumeChar()
    this.consumeChar()

    // Here you can decide what to do with the comment.
    // If you want to include it in your DOM, you can return a new Node.
    // If you want to ignore it, you can return null or a placeholder Node.
    // For this example, let's create a new Node for the comment:
    return new Node([], new CommentNode(commentContent))
  }

  parseText(): Node {
    let text = this.consumeWhile(c => c !== '<')
    text = text.trim()
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

export class CSSParser{

}

export function parseDom(source: string): Node | undefined {
  let nodes: Node[]
  let parser = new DomParser(source)
  nodes = parser.parseNodes()
  if (nodes.length === 1) {
    return nodes[0]
  } else {
    return undefined
  }
}

export function parseCSS(source:string){

}