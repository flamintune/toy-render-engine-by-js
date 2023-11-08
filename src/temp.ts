import { parse } from "./parse";
import { prettyPrint } from "./printDom";


let node = parse("<body>Hello, world!<div class='myClass'>Nested<br></br> node</div></body>")
prettyPrint(node)