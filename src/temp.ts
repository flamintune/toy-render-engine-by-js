import { parse } from "./parse";
import { prettyPrint } from "./printDom";


let node = parse(`<body>
                    Hello, world!
                    <div class='myClass'>Nested
                        <br></br> 
                        node

                        a
                         b       ss
                        hello<!-- 2321341 -->world 
                    </div>
                    </body>`)
prettyPrint(node)

console.log(node.children)